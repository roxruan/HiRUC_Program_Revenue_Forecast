import { useState, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card, SectionHeader, KPICard, ModelNote, PillToggle } from '@/components/ui';
import {
  COUNTIES, confidenceBand, formatM, cagr,
} from '@/data/forecast';
import { monthlyTotals, monthlyByCounty, MONTHLY_LABELS, FY26_AFV, type CountyKey } from '@/data/afvData';
import { annualFeeBreakdown } from '@/data/vehicle';
import { TAB1_YEARS, getTab1StatewideEvRevenue, getTab1CountyEvRevenue } from '@/data/phases';
import { useChartTheme } from '@/theme';
import { IslandMap } from '@/components/IslandMapInline';

function formatNominal(millions: number): string {
  return '$' + Math.round(millions * 1_000_000).toLocaleString();
}

export default function RevenueForecastTab() {
  const [scope, setScope] = useState('statewide');
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const ct = useChartTheme();
  const feeBreakdown = annualFeeBreakdown();

  const isCounty = scope === 'county';
  const activeCounty = selectedCounty ? COUNTIES.find((c) => c.id === selectedCounty)! : COUNTIES[0];
  const displayValues = isCounty ? getTab1CountyEvRevenue(activeCounty.island as CountyKey) : getTab1StatewideEvRevenue();
  const band = confidenceBand(displayValues);

  const selectCounty = (id: string) => {
    setSelectedCounty(id);
    setScope('county');
  };

  const fy31 = displayValues[displayValues.length - 1];
  const cumulative = displayValues.reduce((a, b) => a + b, 0);
  const growth = cagr(displayValues[0], fy31, displayValues.length - 1);
  const fy26 = displayValues[0];

  const monthlyData = isCounty
    ? monthlyByCounty(activeCounty.island as CountyKey)
    : monthlyTotals();

  const navyColor = ct.navy;
  const goldColor = ct.gold;
  const countyColor = isCounty ? activeCounty.color : navyColor;

  const tooltipConfig = useMemo(() => ({
    backgroundColor: ct.tooltipBg,
    titleColor: ct.tooltipTitle,
    bodyColor: ct.tooltipBody,
    borderColor: ct.tableBorder,
    borderWidth: 1,
    titleFont: { family: 'IBM Plex Mono', size: 11, weight: 600 },
    bodyFont: { family: 'Inter', size: 12 },
    padding: 12,
    cornerRadius: 8,
  }), [ct]);

  const legendConfig = useMemo(() => ({
    position: 'bottom' as const,
    labels: { boxWidth: 12, padding: 14, color: ct.legendText, font: { size: 11 } },
  }), [ct]);

  const scaleConfig = useMemo(() => ({
    x: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 } }, border: { color: ct.tableBorder } },
    y: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 }, callback: (v: string | number) => `$${v}M` }, border: { color: ct.tableBorder } },
  }), [ct]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PillToggle
          options={[
            { label: 'Statewide', value: 'statewide' },
            { label: 'County', value: 'county' },
          ]}
          value={scope}
          onChange={(v) => {
            setScope(v);
            if (v === 'statewide') setSelectedCounty(null);
          }}
        />
        {isCounty && (
          <div className="font-body text-[12.5px]" style={{ color: 'var(--secondary-text)' }}>
            Selected: <span style={{ color: activeCounty.color, fontWeight: 600 }}>{activeCounty.name} County</span>
          </div>
        )}
      </div>

      {/* Hero + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-5">
        <Card
          className="flex flex-col justify-between"
          style={{ background: 'var(--hero-bg)', borderColor: 'var(--hero-border)' }}
        >
          <div>
            <div className="font-data uppercase" style={{ fontSize: 11, color: 'var(--header-eyebrow)', letterSpacing: '0.1em', fontWeight: 500 }}>
              {isCounty ? `${activeCounty.name} County — FY2031 EV Projected` : 'Statewide — FY2031 EV Projected'}
            </div>
            <div className="font-display font-extrabold mt-2" style={{ fontSize: 64, lineHeight: 1, color: '#C8D4E0' }}>
              {formatM(fy31)}
            </div>
          </div>
          <p className="font-body mt-4" style={{ fontSize: 13, color: 'var(--header-subtitle)', lineHeight: 1.5, maxWidth: 420 }}>
            {isCounty
              ? `${activeCounty.name} County's projected EV HIRUC revenue in FY2031. EVs only, $50/EV flat cap across the full range.`
              : 'Projected statewide EV HIRUC revenue in FY2031. EVs only, $50/EV flat cap across the full range. Based on actual FY2026 enrollment data and program enrollment forecasts.'}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <KPICard label="FY26 Actual" value={formatM(fy26)} sub="Jul 2025–Jun 2026" />
          <KPICard label="6-Year Cumulative" value={formatM(cumulative)} sub="FY26–FY31 EV total" />
          <KPICard label="CAGR" value={`${(growth * 100).toFixed(0)}%`} sub="Compound annual growth" />
          {isCounty ? (
            <KPICard label="Statewide Share" value={`${(activeCounty.share * 100).toFixed(0)}%`} sub="of statewide total" />
          ) : (
            <KPICard label="FY26 AFV Fees" value={`$${(FY26_AFV / 1_000_000).toFixed(1)}M`} sub="Alt-fuel vehicle surcharge" />
          )}
        </div>
      </div>

      {/* Map + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-5">
        <Card>
          <SectionHeader title="Island map" desc="Click an island to drill into that county." />
          <IslandMap selectedCounty={selectedCounty} onSelect={selectCounty} />
          <div className="flex flex-wrap gap-2 mt-4">
            {COUNTIES.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCounty(c.id)}
                className="flex items-center gap-2 transition-all rounded-full"
                style={{
                  padding: '5px 12px 5px 8px',
                  border: `1px solid ${selectedCounty === c.id ? c.color : 'var(--card-border)'}`,
                  background: selectedCounty === c.id ? `${c.color}15` : 'var(--card-bg)',
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span className="font-body text-[12px] font-medium" style={{ color: selectedCounty === c.id ? c.color : 'var(--primary-text)' }}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="EV revenue trend, FY2026–FY2031" desc="EVs only, $50/EV flat cap. FY26 actual + FY27–31 forecast. Shaded band shows the confidence interval." />
          <div style={{ height: 300 }}>
            <Line
              data={{
                labels: [...TAB1_YEARS],
                datasets: [
                  {
                    label: 'High bound',
                    data: band.high,
                    borderColor: 'transparent',
                    backgroundColor: `${countyColor}1F`,
                    fill: '+1',
                    pointRadius: 0,
                  },
                  {
                    label: 'Low bound',
                    data: band.low,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    fill: false,
                    pointRadius: 0,
                  },
                  {
                    label: isCounty ? `${activeCounty.name} County` : 'Statewide EV',
                    data: displayValues,
                    borderColor: countyColor,
                    backgroundColor: countyColor,
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: 'var(--card-bg)',
                    pointBorderColor: countyColor,
                    pointBorderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y}M` } },
                },
                scales: {
                  x: { grid: { display: false }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 } }, border: { color: ct.tableBorder } },
                  y: { grid: { color: ct.grid }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 }, callback: (v: string | number) => `$${v}M` }, border: { color: ct.tableBorder } },
                },
              }}
            />
          </div>
        </Card>
      </div>

      {/* Fee-type breakdown */}
      <Card>
        <SectionHeader
          title="Actual HIRUC fee-type breakdown"
          desc="Real collection data from HDOT AFV report: per-mile, flat, default-rate, and AFV surcharge fees ($M)."
        />
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Period</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Per-mile</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Flat</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Default</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>AFV surcharge</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>HIRUC total</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Combined</th>
              </tr>
            </thead>
            <tbody>
              {feeBreakdown.map((row) => (
                <tr key={row.period}>
                  <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{row.period}</td>
                  <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>${row.perMile.toFixed(2)}M</td>
                  <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>${row.flat.toFixed(2)}M</td>
                  <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>${row.defaultFee.toFixed(2)}M</td>
                  <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>${row.afv.toFixed(2)}M</td>
                  <td className="text-right py-2.5 px-3 border-b font-bold" style={{ color: 'var(--pacific)', borderColor: 'var(--card-border)' }}>${row.hiruc.toFixed(2)}M</td>
                  <td className="text-right py-2.5 px-3 border-b font-bold" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>${row.combined.toFixed(2)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5" style={{ height: 300 }}>
          <Bar
            data={{
              labels: feeBreakdown.map((r) => r.period),
              datasets: [
                { label: 'Per-mile', data: feeBreakdown.map((r) => r.perMile), backgroundColor: navyColor, borderColor: navyColor, borderWidth: 1 },
                { label: 'Flat', data: feeBreakdown.map((r) => r.flat), backgroundColor: '#3D6B8E', borderColor: '#3D6B8E', borderWidth: 1 },
                { label: 'Default', data: feeBreakdown.map((r) => r.defaultFee), backgroundColor: '#5B8BAE', borderColor: '#5B8BAE', borderWidth: 1 },
                { label: 'AFV surcharge', data: feeBreakdown.map((r) => r.afv), backgroundColor: goldColor, borderColor: goldColor, borderWidth: 1 },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.y as number).toFixed(2)}M` } },
              },
              scales: scaleConfig,
            }}
          />
        </div>
      </Card>

      {/* Monthly actuals chart */}
      <Card>
        <SectionHeader
          title="Monthly HIRUC revenue, Jul 2025–Jun 2026"
          desc="Actual monthly collections — HIRUC fees and AFV surcharges combined. Click a county to filter."
        />
        <div style={{ height: 300 }}>
          <Bar
            data={{
              labels: MONTHLY_LABELS,
              datasets: [
                {
                  label: 'HIRUC fees',
                  data: monthlyData.map((d) => +(d.hiruc / 1_000_000).toFixed(3)),
                  backgroundColor: navyColor,
                  borderColor: navyColor,
                  borderWidth: 1,
                },
                {
                  label: 'AFV surcharges',
                  data: monthlyData.map((d) => +(d.afv / 1_000_000).toFixed(3)),
                  backgroundColor: goldColor,
                  borderColor: goldColor,
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: $${(ctx.parsed.y as number).toFixed(2)}M` } },
              },
              scales: scaleConfig,
            }}
          />
        </div>
      </Card>

      {/* County comparison */}
      <Card>
        <SectionHeader
          title="County EV revenue comparison"
          desc="Stacked EV HIRUC revenue contribution by county, FY2026–FY2031 ($M). EVs only, $50/EV flat cap."
          right={isCounty ? <span className="font-body text-[12.5px]" style={{ color: 'var(--secondary-text)' }}>Highlighting {activeCounty.name}</span> : undefined}
        />
        <div style={{ height: 320 }}>
          <Bar
            data={{
              labels: [...TAB1_YEARS],
              datasets: COUNTIES.map((c) => {
                const vals = getTab1CountyEvRevenue(c.island as CountyKey);
                const dimmed = isCounty && c.id !== activeCounty.id;
                return {
                  label: c.name,
                  data: vals,
                  backgroundColor: dimmed ? `${c.color}40` : c.color,
                  borderColor: dimmed ? `${c.color}60` : c.color,
                  borderWidth: 1,
                };
              }),
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y}M` } },
              },
              scales: scaleConfig,
            }}
          />
        </div>
      </Card>

      {/* Revenue allocation — cumulative share by county */}
      <Card>
        <SectionHeader
          title="Revenue allocation by county"
          desc={`Cumulative EV HIRUC revenue share, FY2026–FY2031. ${isCounty ? 'Selected county highlighted.' : "Each county's share of the statewide total."}`}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-5">
          <div style={{ height: 300 }}>
            <Doughnut
              data={{
                labels: COUNTIES.map((c) => c.name + ' County'),
                datasets: [
                  {
                    data: COUNTIES.map((c) => {
                      const vals = getTab1CountyEvRevenue(c.island as CountyKey);
                      const total = vals.reduce((a, b) => a + b, 0);
                      return +total.toFixed(2);
                    }),
                    backgroundColor: COUNTIES.map((c) => (isCounty && c.id !== activeCounty.id ? `${c.color}40` : c.color)),
                    borderColor: 'var(--card-bg)',
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { boxWidth: 12, padding: 12, color: ct.legendText, font: { size: 11 } } },
                  tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                      label: (ctx) => {
                        const val = ctx.parsed as number;
                        const sum = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                        const pct = ((val / sum) * 100).toFixed(1);
                        return `${ctx.label}: ${val.toFixed(2)}M (${pct}%)`;
                      },
                    },
                  },
                },
                cutout: '60%',
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>County</th>
                  <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Cumulative</th>
                  <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const totals = COUNTIES.map((c) => {
                    const vals = getTab1CountyEvRevenue(c.island as CountyKey);
                    return { c, total: vals.reduce((a, b) => a + b, 0) };
                  });
                  const grand = totals.reduce((a, t) => a + t.total, 0);
                  return totals.map(({ c, total }) => {
                    const pct = (total / grand) * 100;
                    const dimmed = isCounty && c.id !== activeCounty.id;
                    return (
                      <tr key={c.id}>
                        <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)' }}>
                          <span className="inline-flex items-center gap-2" style={{ color: dimmed ? 'var(--secondary-text)' : 'var(--primary-text)' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, opacity: dimmed ? 0.5 : 1 }} />
                            {c.name} County
                          </span>
                        </td>
                        <td className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ color: dimmed ? 'var(--secondary-text)' : 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{formatNominal(total)}</td>
                        <td className="text-right py-2.5 px-3 border-b font-semibold" style={{ color: dimmed ? 'var(--secondary-text)' : c.color, borderColor: 'var(--card-border)' }}>{pct.toFixed(1)}%</td>
                      </tr>
                    );
                  });
                })()}
                <tr style={{ borderTop: '2px solid var(--pacific)' }}>
                  <td className="text-left py-2.5 px-3 font-body font-bold" style={{ color: 'var(--pacific)' }}>Statewide Total</td>
                  <td className="text-right py-2.5 px-3 font-bold whitespace-nowrap" style={{ color: 'var(--pacific)' }}>{formatNominal(getTab1StatewideEvRevenue().reduce((a, b) => a + b, 0))}</td>
                  <td className="text-right py-2.5 px-3 font-bold" style={{ color: 'var(--pacific)' }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Data table — nominal dollars */}
      <Card>
        <SectionHeader title="Year-by-year EV detail" desc="EV HIRUC revenue by county, FY2026–FY2031, in nominal dollars. EVs only, $50/EV flat cap. FY26 is actual; FY27–31 are forecast." />
        <div style={{ overflowX: 'auto' }}>
          {isCounty ? <CountyTable countyId={activeCounty.id} /> : <StatewideTable />}
        </div>
      </Card>

      {/* Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MILESTONES.map((m, i) => (
          <Card key={i}>
            <div className="flex items-start gap-3">
              <span
                className="flex items-center justify-center flex-shrink-0 font-display font-bold"
                style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--pacific)', color: 'white', fontSize: 14 }}
              >
                {i + 1}
              </span>
              <div>
                <div className="font-data font-semibold" style={{ fontSize: 12.5, color: 'var(--pacific)' }}>{m.year}</div>
                <p className="font-body mt-1" style={{ fontSize: 12.5, color: 'var(--primary-text)', lineHeight: 1.5 }}>{m.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ModelNote>
        Display range: FY2026 (Jul 2025) – FY2031 (Jun 2031). Vehicles shown: EVs only. Revenue cap: $50/EV flat cap across the full range. FY2026 figures are actual HIRUC collections from HDOT AFV report data. FY2027–FY2031 are program enrollment forecasts from the same report. County shares derived from forecast enrollment counts.
      </ModelNote>
    </div>
  );
}

const MILESTONES = [
  { year: 'FY26', text: 'HIRUC program operational with per-mile, flat, and default-rate enrollment across all four counties' },
  { year: 'FY29', text: 'EV per-mile + flat enrollment reaches ~21,000 vehicles statewide' },
  { year: 'FY31', text: 'EV HIRUC revenue projected to exceed $1.5M statewide with ~25,000 enrolled EVs' },
];

function StatewideTable() {
  return (
    <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>County</th>
          {TAB1_YEARS.map((y) => (
            <th key={y} className="text-right font-semibold py-2.5 px-3 border-b whitespace-nowrap" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>{y}</th>
          ))}
          <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {COUNTIES.map((c) => {
          const vals = getTab1CountyEvRevenue(c.island as CountyKey);
          const total = vals.reduce((a, b) => a + b, 0);
          return (
            <tr key={c.id}>
              <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>
                <span className="inline-flex items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                  {c.name}
                </span>
              </td>
              {vals.map((v, i) => (
                <td key={i} className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{formatNominal(v)}</td>
              ))}
              <td className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{formatNominal(total)}</td>
            </tr>
          );
        })}
        <tr style={{ borderTop: '2px solid var(--pacific)' }}>
          <td className="text-left py-2.5 px-3 font-body font-bold" style={{ color: 'var(--pacific)' }}>Statewide Total</td>
          {getTab1StatewideEvRevenue().map((v, i) => (
            <td key={i} className="text-right py-2.5 px-3 font-bold whitespace-nowrap" style={{ color: 'var(--pacific)' }}>{formatNominal(v)}</td>
          ))}
          <td className="text-right py-2.5 px-3 font-bold whitespace-nowrap" style={{ color: 'var(--pacific)' }}>
            {formatNominal(getTab1StatewideEvRevenue().reduce((a, b) => a + b, 0))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function CountyTable({ countyId }: { countyId: string }) {
  const c = COUNTIES.find((x) => x.id === countyId)!;
  const vals = getTab1CountyEvRevenue(c.island as CountyKey);
  const total = vals.reduce((a, b) => a + b, 0);
  const statewideVals = getTab1StatewideEvRevenue();
  const statewideTotal = statewideVals.reduce((a, b) => a + b, 0);
  const shares = vals.map((v, i) => (v / statewideVals[i]) * 100);

  return (
    <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Metric</th>
          {TAB1_YEARS.map((y) => (
            <th key={y} className="text-right font-semibold py-2.5 px-3 border-b whitespace-nowrap" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>{y}</th>
          ))}
          <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>EV revenue</td>
          {vals.map((v, i) => (
            <td key={i} className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{formatNominal(v)}</td>
          ))}
          <td className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{formatNominal(total)}</td>
        </tr>
        <tr className="font-bold">
          <td className="text-left py-2.5 px-3 border-b font-body" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>Share of statewide total</td>
          {shares.map((v, i) => (
            <td key={i} className="text-right py-2.5 px-3 border-b" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{v.toFixed(1)}%</td>
          ))}
          <td className="text-right py-2.5 px-3 border-b" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{((total / statewideTotal) * 100).toFixed(1)}%</td>
        </tr>
      </tbody>
    </table>
  );
}
