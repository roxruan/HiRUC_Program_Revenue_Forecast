import { COUNTIES as AFV_COUNTIES, countyShare, FY26_ACTUAL_BY_COUNTY, type CountyKey } from '@/data/afvData';
import { STATEWIDE_REVENUE as STATEWIDE_FORECAST_M } from '@/data/forecast';
import { FY26_ACTUAL } from '@/data/afvData';

export type CountyId = CountyKey;

export interface County {
  id: CountyId;
  name: string;
  shortName: string;
  color: string;
  share: number;
}

export const COUNTIES: County[] = AFV_COUNTIES.map((c) => ({
  id: c.key,
  name: c.name,
  shortName: c.shortName,
  color: c.color,
  share: Math.round(countyShare(c.key) * 100),
}));

export const FISCAL_YEARS = ['FY26', 'FY27', 'FY28', 'FY29', 'FY30', 'FY31', 'FY32', 'FY33'];

export const MONTHLY_ACTUAL: number[] = [];
export const MONTHLY_LABELS_EXPORT: string[] = [];

export const STATEWIDE_REVENUE = STATEWIDE_FORECAST_M.slice(0, 8);

export const BAND_PCT = [0.05, 0.08, 0.12, 0.16, 0.21, 0.27, 0.33, 0.40];

export function getCounty(id: CountyId): County {
  return COUNTIES.find((c) => c.id === id)!;
}

export function countyRevenue(countyId: CountyId, yearIndex: number): number {
  const county = getCounty(countyId);
  if (yearIndex === 0) {
    return +(FY26_ACTUAL_BY_COUNTY[countyId] / 1_000_000).toFixed(2);
  }
  return +(STATEWIDE_REVENUE[yearIndex] * (county.share / 100)).toFixed(1);
}

export function countyRevenueSeries(countyId: CountyId): number[] {
  return FISCAL_YEARS.map((_, i) => countyRevenue(countyId, i));
}

export function countyCumulative(countyId: CountyId): number {
  return +countyRevenueSeries(countyId).reduce((a, b) => a + b, 0).toFixed(1);
}

export function countyCAGR(countyId: CountyId): number {
  const series = countyRevenueSeries(countyId);
  const start = series[0];
  const end = series[series.length - 1];
  return (Math.pow(end / start, 1 / (series.length - 1)) - 1) * 100;
}

export function statewideCumulative(): number {
  return STATEWIDE_REVENUE.reduce((a, b) => a + b, 0);
}

export function statewideCAGR(): number {
  const start = STATEWIDE_REVENUE[0];
  const end = STATEWIDE_REVENUE[STATEWIDE_REVENUE.length - 1];
  return (Math.pow(end / start, 1 / (STATEWIDE_REVENUE.length - 1)) - 1) * 100;
}

export function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}B`;
  return `$${value.toFixed(0)}M`;
}

export function formatCurrencyDetailed(value: number): string {
  return `$${value.toFixed(1)}M`;
}
