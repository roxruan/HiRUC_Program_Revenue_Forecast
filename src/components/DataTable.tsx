import { FISCAL_YEARS, COUNTIES, countyRevenue, countyCumulative, STATEWIDE_REVENUE, statewideCumulative, formatCurrencyDetailed } from '@/data';
import type { CountyId } from '@/data';

interface DataTableProps {
  selectedCounty: CountyId | null;
}

export default function DataTable({ selectedCounty }: DataTableProps) {
  const statewideTotal = statewideCumulative();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-data">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--card-border)' }}>
            <th className="text-left py-3 px-3 font-body font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--secondary-text)' }}>
              County
            </th>
            {FISCAL_YEARS.map((fy) => (
              <th
                key={fy}
                className="text-right py-3 px-3 font-body font-semibold text-xs uppercase tracking-wider"
                style={{ color: 'var(--secondary-text)' }}
              >
                {fy}
              </th>
            ))}
            <th className="text-right py-3 px-3 font-body font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--pacific)' }}>
              8-Yr Total
            </th>
            <th className="text-right py-3 px-3 font-body font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--secondary-text)' }}>
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {COUNTIES.map((c) => {
            const isDimmed = selectedCounty !== null && selectedCounty !== c.id;
            const cum = countyCumulative(c.id);
            return (
              <tr
                key={c.id}
                className="border-b transition-colors"
                style={{
                  borderColor: 'var(--card-border)',
                  opacity: isDimmed ? 0.45 : 1,
                }}
              >
                <td className="py-3 px-3 font-body font-medium" style={{ color: 'var(--primary-text)' }}>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c.color }}
                    />
                    {c.name}
                  </span>
                </td>
                {FISCAL_YEARS.map((_, i) => (
                  <td key={i} className="text-right py-3 px-3" style={{ color: 'var(--primary-text)' }}>
                    {formatCurrencyDetailed(countyRevenue(c.id, i))}
                  </td>
                ))}
                <td className="text-right py-3 px-3 font-semibold" style={{ color: 'var(--primary-text)' }}>
                  {formatCurrencyDetailed(cum)}
                </td>
                <td className="text-right py-3 px-3" style={{ color: 'var(--secondary-text)' }}>
                  {c.share}%
                </td>
              </tr>
            );
          })}
          {/* Statewide row */}
          <tr style={{ background: 'var(--note-bg)' }}>
            <td className="py-3 px-3 font-body font-semibold" style={{ color: 'var(--pacific)' }}>
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--pacific)' }} />
                Statewide
              </span>
            </td>
            {STATEWIDE_REVENUE.map((v, i) => (
              <td key={i} className="text-right py-3 px-3" style={{ color: 'var(--pacific)' }}>
                {formatCurrencyDetailed(v)}
              </td>
            ))}
            <td className="text-right py-3 px-3" style={{ color: 'var(--pacific)' }}>
              {formatCurrencyDetailed(statewideTotal)}
            </td>
            <td className="text-right py-3 px-3" style={{ color: 'var(--pacific)' }}>100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
