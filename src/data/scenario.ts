import { STATEWIDE_FORECAST, FY26_ACTUAL } from './afvData';

// Total registered fleet in Hawai'i
export const FLEET_TOTAL = 1_080_000;

// FY26 actual HIRUC revenue (from monthly data) in $M
export const FY26_ACTUAL_M = +(FY26_ACTUAL / 1_000_000).toFixed(2);

// Funding need baseline (HDOT road maintenance budget, $M)
export const FUNDING_NEED_2026 = 300;
export const FUEL_TAX_2026 = 250;

// Baseline adoption shares derived from forecast enrollment counts
// perMileCount + flatCount + defaultCount = total RUC-enrolled vehicles
// As share of FLEET_TOTAL, growing over the forecast period
const totalEnrolled2027 = STATEWIDE_FORECAST[0].perMileCount + STATEWIDE_FORECAST[0].flatCount + STATEWIDE_FORECAST[0].defaultCount;
const totalEnrolled2040 = STATEWIDE_FORECAST[13].perMileCount + STATEWIDE_FORECAST[13].flatCount + STATEWIDE_FORECAST[13].defaultCount;

// Interpolate baseline adoption share FY26–FY33
const startShare = (totalEnrolled2027 / FLEET_TOTAL) * 0.6;
const endShare = Math.min(totalEnrolled2040 / FLEET_TOTAL, 0.45);

export const BASELINE_SHARE: number[] = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14;
  return +(startShare + (endShare - startShare) * t).toFixed(3);
});

// EV share: perMileCount + flatCount (pure electric vehicles on per-mile or flat rate)
export const BASELINE_EV_SHARE: number[] = [
  +((STATEWIDE_FORECAST[0].perMileCount + STATEWIDE_FORECAST[0].flatCount) / FLEET_TOTAL).toFixed(4),
  ...STATEWIDE_FORECAST.map((r) => +((r.perMileCount + r.flatCount) / FLEET_TOTAL).toFixed(4)),
];

// PHEV/hybrid share: defaultCount (default-rate, hybrid/PHEV vehicles)
export const BASELINE_PHEV_SHARE: number[] = [
  +(STATEWIDE_FORECAST[0].defaultCount / FLEET_TOTAL).toFixed(4),
  ...STATEWIDE_FORECAST.map((r) => +(r.defaultCount / FLEET_TOTAL).toFixed(4)),
];

export const AVG_MILES = 9000;
export const BASE_FEE_RATE = 0.008;
export const BASE_CAP = 50;

export interface SliderValues {
  evMult: number;
  phevMult: number;
  mpgPct: number;
  infPct: number;
  feeRate: number;
}

export const PRESETS: Record<string, SliderValues> = {
  Conservative: { evMult: 0.75, phevMult: 0.80, mpgPct: 1.0, infPct: 2.0, feeRate: 0.008 },
  'Base case': { evMult: 1.0, phevMult: 1.0, mpgPct: 2.0, infPct: 3.0, feeRate: 0.008 },
  Aggressive: { evMult: 1.35, phevMult: 1.25, mpgPct: 3.0, infPct: 4.5, feeRate: 0.012 },
};

export interface YearResult {
  adopt: number;
  rucVehicles: number;
  gasVehicles: number;
  fuelTaxRevenue: number;
  rucRevenue: number;
  totalRevenue: number;
  fundingNeed: number;
  gap: number;
}

export function simulate(s: SliderValues): YearResult[] {
  const gasPerVehicle2026 = (FUEL_TAX_2026 * 1_000_000) / (FLEET_TOTAL * (1 - BASELINE_SHARE[0]));
  const cap = BASE_CAP * (s.feeRate / BASE_FEE_RATE);
  const feePerVehicle = Math.min(AVG_MILES * s.feeRate, cap);

  return BASELINE_SHARE.map((_, i) => {
    const evShare = Math.min(BASELINE_EV_SHARE[i] * s.evMult, 0.50);
    const phevShare = Math.min(BASELINE_PHEV_SHARE[i] * s.phevMult, 0.50);
    const adopt = Math.min(evShare + phevShare, 0.98);
    const rucVehicles = FLEET_TOTAL * adopt;
    const gasVehicles = FLEET_TOTAL * (1 - adopt);
    const gasPerVehicle = gasPerVehicle2026 * Math.pow(1 - s.mpgPct / 100, i);
    const fuelTaxRevenue = (gasVehicles * gasPerVehicle) / 1_000_000;
    const rucRevenue = (rucVehicles * feePerVehicle) / 1_000_000;
    const fundingNeed = FUNDING_NEED_2026 * Math.pow(1 + s.infPct / 100, i);
    const totalRevenue = fuelTaxRevenue + rucRevenue;
    const gap = fundingNeed - totalRevenue;
    return { adopt, rucVehicles, gasVehicles, fuelTaxRevenue, rucRevenue, totalRevenue, fundingNeed, gap };
  });
}

export function sensitivity(s: SliderValues): { label: string; low: number; high: number; improvesWithIncrease: boolean }[] {
  const keys: (keyof SliderValues)[] = ['evMult', 'phevMult', 'mpgPct', 'infPct', 'feeRate'];
  const ranges: Record<keyof SliderValues, [number, number]> = {
    evMult: [0.5, 1.5],
    phevMult: [0.5, 1.5],
    mpgPct: [0, 4],
    infPct: [0, 6],
    feeRate: [0.004, 0.02],
  };
  const labels: Record<keyof SliderValues, string> = {
    evMult: 'EV adoption',
    phevMult: 'PHEV/hybrid adoption',
    mpgPct: 'Fleet fuel-economy improvement',
    infPct: 'Inflation (maintenance cost)',
    feeRate: 'Mileage fee rate',
  };

  const results = keys.map((key) => {
    const [min, max] = ranges[key];
    const atMin = { ...s, [key]: min };
    const atMax = { ...s, [key]: max };
    const gapMin = simulate(atMin)[7].gap;
    const gapMax = simulate(atMax)[7].gap;
    const improvesWithIncrease = gapMax < gapMin;
    return { label: labels[key], low: Math.min(gapMin, gapMax), high: Math.max(gapMin, gapMax), improvesWithIncrease };
  });

  return results.sort((a, b) => Math.abs(b.high - b.low) - Math.abs(a.high - a.low));
}
