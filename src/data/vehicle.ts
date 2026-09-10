import { STATEWIDE_FORECAST, ANNUAL_TOTALS, FY26_ACTUAL, FY26_AFV } from './afvData';

export interface FeeType {
  key: string;
  label: string;
  color: string;
}

export interface VehicleClassFees {
  name: string;
  note: string;
  fees: Record<string, number | null>;
  total: number;
}

export const FEE_TYPES: FeeType[] = [
  { key: 'hruc', label: 'HiRUC (RUC)', color: '#2C4A6B' },
  { key: 'fuelTax', label: 'State fuel tax', color: '#B5563B' },
  { key: 'dieselTax', label: 'State diesel tax', color: '#8B4513' },
  { key: 'altFuelSurcharge', label: 'Alt-fuel surcharge', color: '#C99A3E' },
  { key: 'registration', label: 'State registration', color: '#3D6B8E' },
  { key: 'weightTax', label: 'State weight tax', color: '#5B8BAE' },
];

export const VEHICLE_CLASSES: VehicleClassFees[] = [
  {
    name: 'Light-duty BEV',
    note: 'RUC replaces the state EV surcharge; weight tax does not apply. Per-mile rate capped at $50/yr.',
    fees: { hruc: 45, fuelTax: null, dieselTax: null, altFuelSurcharge: null, registration: 45, weightTax: null },
    total: 90,
  },
  {
    name: 'PHEV / Hybrid',
    note: "Pays fuel tax on gas portion plus alt-fuel surcharge. Default-rate RUC enrollment projected in forecast data.",
    fees: { hruc: null, fuelTax: 28, dieselTax: null, altFuelSurcharge: 15, registration: 45, weightTax: 12 },
    total: 100,
  },
  {
    name: 'Gasoline vehicles',
    note: 'State fuel tax is 16¢/gal. Not yet enrolled in HiRUC; remains on fuel tax through transition.',
    fees: { hruc: null, fuelTax: 78, dieselTax: null, altFuelSurcharge: null, registration: 45, weightTax: 20 },
    total: 143,
  },
  {
    name: 'Commercial / heavy',
    note: 'Diesel tax, higher registration tiers, and weight tax apply. Additional IRP/IFTA fees not modeled here.',
    fees: { hruc: null, fuelTax: null, dieselTax: 310, altFuelSurcharge: null, registration: 220, weightTax: 180 },
    total: 710,
  },
];

export interface WearRow {
  name: string;
  registered: number;
  avgMiles: number;
  mechanism: string;
  revenue: number;
  wearShare: number;
}

export const WEAR_ROWS: WearRow[] = [
  { name: 'Passenger cars (gas)', registered: 550000, avgMiles: 9500, mechanism: 'Fuel tax', revenue: 42.9, wearShare: 18.0 },
  { name: 'Light trucks/SUVs (gas)', registered: 380000, avgMiles: 10200, mechanism: 'Fuel tax', revenue: 36.1, wearShare: 30.0 },
  { name: 'Hybrid (non-plug-in)', registered: 68000, avgMiles: 9800, mechanism: 'Fuel tax + state fee', revenue: 3.1, wearShare: 2.5 },
  { name: 'Plug-in hybrid (PHEV)', registered: 12000, avgMiles: 9000, mechanism: 'Fuel tax + default-rate RUC', revenue: 0.3, wearShare: 0.5 },
  { name: 'Battery electric (in HiRUC)', registered: 42348, avgMiles: 9000, mechanism: 'Per-mile / flat RUC', revenue: 1.9, wearShare: 1.8 },
  { name: 'Commercial/heavy trucks', registered: 28000, avgMiles: 22000, mechanism: 'Fuel tax + weight-mile tax', revenue: 17.4, wearShare: 47.2 },
];

// PHEV enrollment from forecast data (defaultCount from statewide forecast)
export const PHEV_ENROLLMENT = STATEWIDE_FORECAST.slice(0, 8).map((r) => r.defaultCount);
export const PHEV_FEE_RATE = 0.008;
export const PHEV_CAP = 50;
export const PHEV_AVG_MILES = 9000;
export const PHEV_CREDIT_PER_VEHICLE = 25;

export function phevFigures() {
  const feePerVehicle = Math.min(PHEV_AVG_MILES * PHEV_FEE_RATE, PHEV_CAP);
  const gross = PHEV_ENROLLMENT.map((n) => +((feePerVehicle * n) / 1_000_000).toFixed(2));
  const credit = PHEV_ENROLLMENT.map((n) => +((PHEV_CREDIT_PER_VEHICLE * n) / 1_000_000).toFixed(2));
  const net = gross.map((g, i) => +(g - credit[i]).toFixed(2));
  return { gross, credit, net };
}

// Annual fee-type breakdown from real data ($M)
export function annualFeeBreakdown() {
  return [
    {
      period: 'FY25 (Jul–Dec 2025)',
      perMile: +(ANNUAL_TOTALS.y2025.perMile / 1_000_000).toFixed(2),
      flat: +(ANNUAL_TOTALS.y2025.flat / 1_000_000).toFixed(2),
      defaultFee: +(ANNUAL_TOTALS.y2025.defaultFee / 1_000_000).toFixed(2),
      afv: +(ANNUAL_TOTALS.y2025.afv / 1_000_000).toFixed(2),
      hiruc: +(ANNUAL_TOTALS.y2025.hiruc / 1_000_000).toFixed(2),
      combined: +(ANNUAL_TOTALS.y2025.combined / 1_000_000).toFixed(2),
    },
    {
      period: 'FY26 (Jan–Jun 2026)',
      perMile: +(ANNUAL_TOTALS.y2026.perMile / 1_000_000).toFixed(2),
      flat: +(ANNUAL_TOTALS.y2026.flat / 1_000_000).toFixed(2),
      defaultFee: +(ANNUAL_TOTALS.y2026.defaultFee / 1_000_000).toFixed(2),
      afv: +(ANNUAL_TOTALS.y2026.afv / 1_000_000).toFixed(2),
      hiruc: +(ANNUAL_TOTALS.y2026.hiruc / 1_000_000).toFixed(2),
      combined: +(ANNUAL_TOTALS.y2026.combined / 1_000_000).toFixed(2),
    },
    {
      period: 'FY25–26 Combined',
      perMile: +(ANNUAL_TOTALS.combined.perMile / 1_000_000).toFixed(2),
      flat: +(ANNUAL_TOTALS.combined.flat / 1_000_000).toFixed(2),
      defaultFee: +(ANNUAL_TOTALS.combined.defaultFee / 1_000_000).toFixed(2),
      afv: +(ANNUAL_TOTALS.combined.afv / 1_000_000).toFixed(2),
      hiruc: +(ANNUAL_TOTALS.combined.hiruc / 1_000_000).toFixed(2),
      combined: +(ANNUAL_TOTALS.combined.combined / 1_000_000).toFixed(2),
    },
  ];
}

export interface FeeTypeDetail {
  key: string;
  label: string;
  revenue: number;
  revenueShare: number;
  enrollmentShare: number;
  efficiencyRatio: number;
}

const VEHICLE_REGISTRATIONS: Record<string, number> = {
  'Light-duty BEV': 42348,
  'PHEV / Hybrid': 80000,
  'Gasoline vehicles': 930000,
  'Commercial / heavy': 28000,
};

export function feeTypeDetail(): FeeTypeDetail[] {
  const feeTypeRevenue: Record<string, number> = {};
  const feeTypeEnrollment: Record<string, number> = {};
  let totalRevenue = 0;

  for (const vc of VEHICLE_CLASSES) {
    const registered = VEHICLE_REGISTRATIONS[vc.name] || 0;
    for (const ft of FEE_TYPES) {
      const fee = vc.fees[ft.key];
      if (fee != null) {
        const rev = (fee * registered) / 1_000_000;
        feeTypeRevenue[ft.key] = (feeTypeRevenue[ft.key] || 0) + rev;
        totalRevenue += rev;
        feeTypeEnrollment[ft.key] = (feeTypeEnrollment[ft.key] || 0) + registered;
      }
    }
  }

  const totalEnrollment = Object.values(feeTypeEnrollment).reduce((a, b) => a + b, 0);

  return FEE_TYPES.map((ft) => {
    const revenue = feeTypeRevenue[ft.key] || 0;
    const revenueShare = (revenue / totalRevenue) * 100;
    const enrollment = feeTypeEnrollment[ft.key] || 0;
    const enrollmentShare = (enrollment / totalEnrollment) * 100;
    const efficiencyRatio = revenueShare / enrollmentShare;
    return { key: ft.key, label: ft.label, revenue, revenueShare, enrollmentShare, efficiencyRatio };
  });
}

export { FY26_ACTUAL, FY26_AFV };
