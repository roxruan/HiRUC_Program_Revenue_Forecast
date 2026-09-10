import {
  STATEWIDE_FORECAST,
  COUNTY_FORECASTS,
  FY_LABELS,
  FY26_ACTUAL,
  FY26_ACTUAL_BY_COUNTY,
  countyShare,
  type CountyKey,
  type CountyInfo,
  COUNTIES as AFV_COUNTIES,
} from './afvData';

export { FY_LABELS as YEARS };
export type { CountyKey, CountyInfo };

export const FISCAL_YEARS = FY_LABELS;

// Statewide revenue in $M — FY26 actual + FY27–FY40 forecast
export const STATEWIDE_REVENUE: number[] = [
  +(FY26_ACTUAL / 1_000_000).toFixed(2),
  ...STATEWIDE_FORECAST.map((r) => +(r.totalHiruc / 1_000_000).toFixed(2)),
];

export interface CountyDef {
  id: string;
  name: string;
  shortName: string;
  share: number;
  color: string;
  island: CountyKey;
}

export const COUNTIES: CountyDef[] = AFV_COUNTIES.map((c) => ({
  id: c.key,
  name: c.name,
  shortName: c.shortName,
  share: +countyShare(c.key).toFixed(4),
  color: c.color,
  island: c.key,
}));

export function countyRevenue(countyId: string): number[] {
  const c = COUNTIES.find((x) => x.id === countyId)!;
  const key = c.island;
  const actual = +(FY26_ACTUAL_BY_COUNTY[key] / 1_000_000).toFixed(2);
  return [actual, ...COUNTY_FORECASTS[key].map((r) => +(r.totalHiruc / 1_000_000).toFixed(2))];
}

export function confidenceBand(values: number[]): { low: number[]; high: number[] } {
  const low = values.map((v, i) => {
    const pct = 0.05 + (i / (values.length - 1)) * 0.11;
    return Math.round(v * (1 - pct) * 10) / 10;
  });
  const high = values.map((v, i) => {
    const pct = 0.05 + (i / (values.length - 1)) * 0.11;
    return Math.round(v * (1 + pct) * 10) / 10;
  });
  return { low, high };
}

export function formatM(v: number): string {
  if (Math.abs(v) >= 1) return `$${Math.round(v)}M`;
  return `$${Math.round(v * 10) / 10}M`;
}

export function cagr(start: number, end: number, periods: number): number {
  return Math.pow(end / start, 1 / periods) - 1;
}
