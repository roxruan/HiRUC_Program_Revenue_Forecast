import { STATEWIDE_REVENUE } from './forecast';
import { COUNTIES } from './afvData';
import { countyShare, type CountyKey } from './afvData';

export const DISTRICTS = COUNTIES.map((c) => ({
  id: c.key,
  name: `${c.name} District`,
  color: c.color,
  share: +countyShare(c.key).toFixed(4),
}));

export function allocationByYear(countySharePct: number) {
  const stateShare = 1 - countySharePct / 100;
  return STATEWIDE_REVENUE.map((total, i) => {
    const state = Math.round(total * stateShare * 10) / 10;
    const countyTotal = total * (countySharePct / 100);
    const counties = COUNTIES.map((c) => ({
      id: c.key,
      name: c.name + ' County',
      color: c.color,
      value: Math.round(countyTotal * countyShare(c.key) * 10) / 10,
    }));
    return { year: i, state, counties, total };
  });
}
