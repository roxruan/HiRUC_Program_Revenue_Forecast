// Phase-based display model for the Long-Term Revenue Forecast tab.
// All underlying CSV data (STATEWIDE_FORECAST, FY26_ACTUAL, etc.) is used as-is.
// This module only filters/slices that data into display phases and applies
// the cap/threshold display rules requested for the dashboard.

import { STATEWIDE_FORECAST, FY26_ACTUAL, COUNTY_FORECASTS, FY26_ACTUAL_BY_COUNTY, type CountyKey } from './afvData';

// ── Year labels ────────────────────────────────────────────────────────
// FY26 = Jul 2025–Jun 2026 (actual), FY27..FY40 = forecast years 2027..2040
export const PHASE_YEARS: string[] = ['FY26', ...STATEWIDE_FORECAST.map((r) => `FY${String(r.year).slice(2)}`)];
// 15 entries: FY26..FY40

// ── Vehicle segment definitions ───────────────────────────────────────
// EVs = perMile + flat enrollment (pure electric)
// PHEV/Hybrid = defaultCount (default-rate enrollment)
// Gasoline = the remainder of the 1.08M fleet not enrolled in HIRUC

export const FLEET_TOTAL = 1_080_000;

export interface SegmentRevenue {
  year: string;
  evRevenue: number;       // $M — EV per-mile + flat revenue
  phevRevenue: number;     // $M — PHEV/hybrid default-rate revenue
  gasolineRevenue: number; // $M — gasoline fuel-tax revenue (not HIRUC)
  totalRevenue: number;    // $M — sum
}

// Fee parameters (from existing scenario.ts / vehicle.ts constants)
const FEE_RATE = 0.008;       // $/mi
const EV_CAP = 50;            // $50/yr flat cap for EVs
const EV_AVG_MILES = 9000;
const PHEV_CAP = 50;
const PHEV_AVG_MILES = 9000;
const PHEV_CREDIT = 25;       // fuel-tax credit per PHEV
const GAS_FUEL_TAX_PER_VEH = 78; // $/yr (from vehicle.ts gasoline class fuel tax)

// EV revenue per vehicle: capped at $50
const evFeePerVehicle = Math.min(EV_AVG_MILES * FEE_RATE, EV_CAP); // = $50

// PHEV net revenue per vehicle: min(9000*0.008, 50) - 25 = 50 - 25 = $25
const phevNetPerVehicle = Math.min(PHEV_AVG_MILES * FEE_RATE, PHEV_CAP) - PHEV_CREDIT;

// Gasoline revenue per vehicle: $78/yr fuel tax (stays on fuel tax, not in HIRUC)
const gasPerVehicle = GAS_FUEL_TAX_PER_VEH;

// ── Compute per-segment revenue for each year ──────────────────────────
function computeSegments(): SegmentRevenue[] {
  const rows: SegmentRevenue[] = [];

  // FY26 (actual): all revenue is HIRUC actual; treat as EV-only for display
  const fy26Ev = FY26_ACTUAL / 1_000_000;
  rows.push({
    year: 'FY26',
    evRevenue: +fy26Ev.toFixed(2),
    phevRevenue: 0,
    gasolineRevenue: 0,
    totalRevenue: +fy26Ev.toFixed(2),
  });

  for (const f of STATEWIDE_FORECAST) {
    const evCount = f.perMileCount + f.flatCount;
    const phevCount = f.defaultCount;
    const gasCount = Math.max(0, FLEET_TOTAL - evCount - phevCount);

    const evRev = (evCount * evFeePerVehicle) / 1_000_000;
    const phevRev = (phevCount * phevNetPerVehicle) / 1_000_000;
    const gasRev = (gasCount * gasPerVehicle) / 1_000_000;

    rows.push({
      year: `FY${String(f.year).slice(2)}`,
      evRevenue: +evRev.toFixed(2),
      phevRevenue: +phevRev.toFixed(2),
      gasolineRevenue: +gasRev.toFixed(2),
      totalRevenue: +(evRev + phevRev + gasRev).toFixed(2),
    });
  }

  return rows;
}

export const SEGMENT_REVENUE: SegmentRevenue[] = computeSegments();

// ── Phase definitions ──────────────────────────────────────────────────
// Each phase specifies a year range and which segments are visible.
// "Once shown, always shown" — segments accumulate across phases.

export interface PhaseDef {
  id: number;
  label: string;
  dateRange: string;
  startIdx: number;  // index into PHASE_YEARS / SEGMENT_REVENUE
  endIdx: number;    // inclusive end index
  segments: ('ev' | 'phev' | 'gasoline')[];
  capNote: string;
}

export const PHASES: PhaseDef[] = [
  {
    id: 1,
    label: 'Phase 1 — EV launch',
    dateRange: 'FY26 (Jul 2025) – FY27 (Jun 2027)',
    startIdx: 0,
    endIdx: 1,
    segments: ['ev'],
    capNote: '$50/EV flat cap applied',
  },
  {
    id: 2,
    label: 'Phase 2 — EV expansion',
    dateRange: 'FY28 (Jul 2027) – FY40 (Jun 2040)',
    startIdx: 2,
    endIdx: 14,
    segments: ['ev'],
    capNote: '$50 cap removed — $80/EV average max threshold',
  },
  {
    id: 3,
    label: 'Phase 3 — PHEV/hybrid onboarding',
    dateRange: 'FY29 (Jul 2028) – FY40 (Jun 2040)',
    startIdx: 3,
    endIdx: 14,
    segments: ['ev', 'phev'],
    capNote: '$80/hybrid-PHEV average max threshold',
  },
  {
    id: 4,
    label: 'Phase 4 — Gasoline vehicle transition',
    dateRange: 'FY30 (Jul 2029) – FY40 (Jun 2040)',
    startIdx: 4,
    endIdx: 14,
    segments: ['ev', 'phev', 'gasoline'],
    capNote: '$80/gasoline-vehicle average max threshold',
  },
];

// ── Gasoline phase-in by model year ─────────────────────────────────────
// Phase 4 steps: gasoline vehicles phase in by model year cutoff.
// FY31 (idx 5): model year >= 2030
// FY32 (idx 6): model year >= 2025
// FY33 (idx 7): model year >= 2020
// FY34 (idx 8+): all remaining
//
// We model this as a fraction of gasoline revenue that is "in scope" each year.
// The fraction ramps from 10% (newest models only) to 100% (all models).

export function gasolinePhaseInFraction(yearIdx: number): number {
  // yearIdx is the index into PHASE_YEARS (0 = FY26)
  // FY31 = idx 5, FY32 = idx 6, FY33 = idx 7, FY34 = idx 8
  if (yearIdx < 5) return 0;       // not yet in phase 4
  if (yearIdx === 5) return 0.25;  // FY31: model year >= 2030 (newest ~25%)
  if (yearIdx === 6) return 0.50; // FY32: model year >= 2025
  if (yearIdx === 7) return 0.75; // FY33: model year >= 2020
  return 1.0;                      // FY34+: all remaining
}

// ── Phase revenue getter ───────────────────────────────────────────────
export interface PhaseRevenueRow {
  year: string;
  ev: number;
  phev: number;
  gasoline: number;
  total: number;
}

export function getPhaseRevenue(phase: PhaseDef): PhaseRevenueRow[] {
  const rows: PhaseRevenueRow[] = [];
  for (let i = phase.startIdx; i <= phase.endIdx; i++) {
    const seg = SEGMENT_REVENUE[i];
    const ev = phase.segments.includes('ev') ? seg.evRevenue : 0;
    const phev = phase.segments.includes('phev') ? seg.phevRevenue : 0;
    const gasFrac = gasolinePhaseInFraction(i);
    const gasoline = phase.segments.includes('gasoline') ? +(seg.gasolineRevenue * gasFrac).toFixed(2) : 0;
    rows.push({
      year: seg.year,
      ev: +ev.toFixed(2),
      phev: +phev.toFixed(2),
      gasoline,
      total: +(ev + phev + gasoline).toFixed(2),
    });
  }
  return rows;
}

// ── County-level phase revenue ──────────────────────────────────────────
export function getPhaseRevenueByCounty(phase: PhaseDef, countyKey: CountyKey): PhaseRevenueRow[] {
  const countyForecast = COUNTY_FORECASTS[countyKey];
  const fy26Actual = FY26_ACTUAL_BY_COUNTY[countyKey];

  const rows: PhaseRevenueRow[] = [];
  for (let i = phase.startIdx; i <= phase.endIdx; i++) {
    let ev = 0;
    let phev = 0;
    let gasoline = 0;

    if (i === 0) {
      // FY26 actual
      ev = phase.segments.includes('ev') ? +(fy26Actual / 1_000_000).toFixed(2) : 0;
    } else {
      const f = countyForecast[i - 1]; // forecast array is 0-indexed for FY27
      if (f) {
        const evCount = f.perMileCount + f.flatCount;
        const phevCount = f.defaultCount;
        const gasCount = Math.max(0, FLEET_TOTAL - evCount - phevCount);

        if (phase.segments.includes('ev')) ev = +((evCount * evFeePerVehicle) / 1_000_000).toFixed(2);
        if (phase.segments.includes('phev')) phev = +((phevCount * phevNetPerVehicle) / 1_000_000).toFixed(2);
        const gasFrac = gasolinePhaseInFraction(i);
        if (phase.segments.includes('gasoline')) gasoline = +((gasCount * gasPerVehicle * gasFrac) / 1_000_000).toFixed(2);
      }
    }

    rows.push({
      year: PHASE_YEARS[i],
      ev,
      phev,
      gasoline,
      total: +(ev + phev + gasoline).toFixed(2),
    });
  }
  return rows;
}

// ── Tab 1 helper: EV-only revenue FY26–FY31 ─────────────────────────────
// Returns EV revenue only (per-mile + flat enrollment), capped at $50/EV,
// for FY26 through FY31 (indices 0..5).

export const TAB1_YEARS: string[] = PHASE_YEARS.slice(0, 6); // FY26..FY31

export function getTab1StatewideEvRevenue(): number[] {
  return SEGMENT_REVENUE.slice(0, 6).map((r) => r.evRevenue);
}

export function getTab1CountyEvRevenue(countyKey: CountyKey): number[] {
  const fy26 = +(FY26_ACTUAL_BY_COUNTY[countyKey] / 1_000_000).toFixed(2);
  const countyForecast = COUNTY_FORECASTS[countyKey];
  const result: number[] = [fy26];
  for (let i = 0; i < 5; i++) {
    const f = countyForecast[i];
    if (!f) break;
    const evCount = f.perMileCount + f.flatCount;
    result.push(+((evCount * evFeePerVehicle) / 1_000_000).toFixed(2));
  }
  return result;
}
