import { useState, useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card, SectionHeader, ModelNote, PillToggle } from '@/components/ui';
import { YEARS, STATEWIDE_REVENUE, COUNTIES } from '@/data/forecast';
import { DISTRICTS } from '@/data/allocation';
import { ANNUAL_BY_COUNTY, type CountyKey } from '@/data/afvData';
import { useChartTheme } from '@/theme';

export default function MethodologyTab() {
  const [mode, setMode] = useState('current');
  const [countyShare, setCountyShare] = useState(15);
  const isModeled = mode === 'modeled';
  const ct = useChartTheme();

  const allocationData = useMemo(() => {
    const stateShare = 1 - countyShare / 100;
    return STATEWIDE_REVENUE.map((total, i) => {
      const state = Math.round(total * stateShare * 10) / 10;
      const countyTotal = total * (countyShare / 100);
      const counties = COUNTIES.map((c) => ({
        ...c,
        value: Math.round(countyTotal * c.share * 10) / 10,
      }));
      return { year: i, total, state, counties };
    });
  }, [countyShare]);

  const fy33 = allocationData[7];

  const navyColor = ct.navy;
  const stateColor = ct.fuelTax;
  const goldColor = ct.gold;
  const countyKeys: CountyKey[] = ['hawaii', 'kauai', 'maui', 'oahu'];

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
    labels: { boxWidth: 10, padding: 10, color: ct.legendText, font: { size: 10 } },
  }), [ct]);

  const stackedScaleConfig = useMemo(() => ({
    y: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, callback: (v: string | number) => `$${v}M` }, border: { color: ct.tableBorder } },
    x: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 } }, border: { color: ct.tableBorder } },
  }), [ct]);

  return (
    <div className="space-y-5">
      {/* Intro card */}
      <Card>
        <SectionHeader title="Revenue distribution across jurisdictions" desc="How fuel tax and RUC revenue flows to state, county, and federal funds." />
        <div className="space-y-2.5">
          <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--primary-text)' }}>
            <span className="font-semibold" style={{ color: 'var(--pacific)' }}>State Fuel Tax:</span> Allocated to the State Highway Fund.
          </p>
          <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--primary-text)' }}>
            <span className="font-semibold" style={{ color: 'var(--pacific)' }}>County Fuel Tax:</span> Allocated to the Counties, unsure if these funds are directly allocated to their County Highway Fund.
          </p>
          <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--primary-text)' }}>
            <span className="font-semibold" style={{ color: 'var(--pacific)' }}>Federal Fuel Tax:</span> Allocated to the Federal Highway Trust Fund.
          </p>
          <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--primary-text)' }}>
            <span className="font-semibold" style={{ color: 'var(--pacific)' }}>HiRUC revenue</span> currently flows entirely to the State Highway Fund; no county revenue-sharing formula for RUC exists today.
          </p>
        </div>
        <ModelNote>
          Refer to the supporting document "Fuel Tax Revenue Streams" for additional detail on how each fuel tax type is collected and distributed across jurisdictions.
        </ModelNote>
        <div className="flex items-center gap-4 mt-5 flex-wrap">
          <PillToggle
            options={[
              { label: 'Current policy (100% state)', value: 'current' },
              { label: 'Modeled county revenue-share', value: 'modeled' },
            ]}
            value={mode}
            onChange={setMode}
          />
          {isModeled && (
            <div className="flex items-center gap-3 flex-1" style={{ minWidth: 220 }}>
              <span className="font-body text-[12.5px] font-medium whitespace-nowrap" style={{ color: 'var(--primary-text)' }}>County share of RUC revenue</span>
              <input
                type="range"
                className="ruc-slider"
                min={0}
                max={40}
                step={1}
                value={countyShare}
                onChange={(e) => setCountyShare(parseInt(e.target.value))}
                style={{ maxWidth: 200 }}
              />
              <span className="font-data text-[13px] font-semibold" style={{ color: 'var(--pacific)', minWidth: 36 }}>{countyShare}%</span>
            </div>
          )}
        </div>
      </Card>

      {/* Two side-by-side charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader
            title="Revenue by jurisdiction, FY2026–FY2033"
            desc={isModeled ? `State retains ${100 - countyShare}%; ${countyShare}% split across counties.` : '100% to State Highway Fund.'}
          />
          <div style={{ height: 300 }}>
            <Bar
              data={{
                labels: [...YEARS],
                datasets: isModeled
                  ? [
                      { label: 'State Highway Fund', data: allocationData.map((d) => d.state), backgroundColor: stateColor },
                      ...COUNTIES.map((c) => ({
                        label: c.name + ' County',
                        data: allocationData.map((d) => d.counties.find((x) => x.id === c.id)!.value),
                        backgroundColor: c.color,
                      })),
                    ]
                  : [{ label: 'State Highway Fund', data: STATEWIDE_REVENUE, backgroundColor: stateColor }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: legendConfig,
                  tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: $${(ctx.parsed.y as number).toFixed(1)}M` } },
                },
                scales: stackedScaleConfig,
              }}
            />
          </div>
        </Card>

        <Card>
          <SectionHeader title="FY2033 distribution" desc="Final-year allocation breakdown." />
          <div style={{ height: 300 }}>
            <Doughnut
              data={{
                labels: isModeled
                  ? ['State Highway Fund', ...COUNTIES.map((c) => c.name + ' County')]
                  : ['State Highway Fund'],
                datasets: [
                  {
                    data: isModeled
                      ? [fy33.state, ...COUNTIES.map((c) => fy33.counties.find((x) => x.id === c.id)!.value)]
                      : [fy33.total],
                    backgroundColor: isModeled ? [stateColor, ...COUNTIES.map((c) => c.color)] : [stateColor],
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
                  tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.label}: $${(ctx.parsed as number).toFixed(1)}M` } },
                },
                cutout: '62%',
              }}
            />
          </div>
        </Card>
      </div>

      {/* County-level fee breakdown */}
      <Card>
        <SectionHeader
          title="County-level fee breakdown"
          desc="Actual HIRUC fee collections by county and fee type ($M). Combined FY2025–2026 data from AFV report."
        />
        <div style={{ height: 320 }}>
          <Bar
            data={{
              labels: countyKeys.map((k) => ANNUAL_BY_COUNTY[k].combined.period),
              datasets: [
                { label: 'Per-mile', data: countyKeys.map((k) => +(ANNUAL_BY_COUNTY[k].combined.perMile / 1_000_000).toFixed(2)), backgroundColor: navyColor, borderColor: navyColor, borderWidth: 1 },
                { label: 'Flat', data: countyKeys.map((k) => +(ANNUAL_BY_COUNTY[k].combined.flat / 1_000_000).toFixed(2)), backgroundColor: '#3D6B8E', borderColor: '#3D6B8E', borderWidth: 1 },
                { label: 'Default', data: countyKeys.map((k) => +(ANNUAL_BY_COUNTY[k].combined.defaultFee / 1_000_000).toFixed(2)), backgroundColor: '#5B8BAE', borderColor: '#5B8BAE', borderWidth: 1 },
                { label: 'AFV surcharge', data: countyKeys.map((k) => +(ANNUAL_BY_COUNTY[k].combined.afv / 1_000_000).toFixed(2)), backgroundColor: goldColor, borderColor: goldColor, borderWidth: 1 },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.y as number).toFixed(2)}M` } },
              },
              scales: stackedScaleConfig,
            }}
          />
        </div>
      </Card>

      {/* Jurisdiction table + pie */}
      <Card>
        <SectionHeader title="County detail" desc="Revenue routed to state and counties ($M). Pie chart shows the cumulative share across all years." />
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-5">
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Jurisdiction</th>
                  {YEARS.map((y) => (
                    <th key={y} className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>{y}</th>
                  ))}
                  <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Total</th>
                  <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const grandTotal = STATEWIDE_REVENUE.reduce((a, b) => a + b, 0);
                  const stateTotal = allocationData.reduce((a, d) => a + d.state, 0);
                  const countyTotals = COUNTIES.map((c) => ({
                    c,
                    total: isModeled ? allocationData.reduce((a, d) => a + d.counties.find((x) => x.id === c.id)!.value, 0) : 0,
                  }));
                  return (
                    <>
                      <tr>
                        <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>State Highway Fund</td>
                        {allocationData.map((d, i) => <td key={i} className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{d.state.toFixed(1)}</td>)}
                        <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{stateTotal.toFixed(1)}</td>
                        <td className="text-right py-2.5 px-3 border-b font-semibold" style={{ color: 'var(--pacific)', borderColor: 'var(--card-border)' }}>{((stateTotal / grandTotal) * 100).toFixed(1)}%</td>
                      </tr>
                      {countyTotals.map(({ c, total }) => (
                        <tr key={c.id}>
                          <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)' }}>
                            <span className="inline-flex items-center gap-2" style={{ color: 'var(--primary-text)' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                              {c.name} County
                            </span>
                          </td>
                          {allocationData.map((d, i) => (
                            <td key={i} className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>
                              {isModeled ? d.counties.find((x) => x.id === c.id)!.value.toFixed(1) : '0.0'}
                            </td>
                          ))}
                          <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{total.toFixed(1)}</td>
                          <td className="text-right py-2.5 px-3 border-b font-semibold" style={{ color: c.color, borderColor: 'var(--card-border)' }}>{((total / grandTotal) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                      <tr style={{ borderTop: '2px solid var(--pacific)' }}>
                        <td className="text-left py-2.5 px-3 font-body font-bold" style={{ color: 'var(--pacific)' }}>Total</td>
                        {STATEWIDE_REVENUE.map((v, i) => (
                          <td key={i} className="text-right py-2.5 px-3 font-bold" style={{ color: 'var(--pacific)' }}>{v}</td>
                        ))}
                        <td className="text-right py-2.5 px-3 font-bold" style={{ color: 'var(--pacific)' }}>{grandTotal}</td>
                        <td className="text-right py-2.5 px-3 font-bold" style={{ color: 'var(--pacific)' }}>100%</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
          <div style={{ minHeight: 280 }}>
            <Doughnut
              data={{
                labels: isModeled
                  ? ['State Highway Fund', ...COUNTIES.map((c) => c.name + ' County')]
                  : ['State Highway Fund'],
                datasets: [
                  {
                    data: isModeled
                      ? [
                          +allocationData.reduce((a, d) => a + d.state, 0).toFixed(1),
                          ...COUNTIES.map((c) => +allocationData.reduce((a, d) => a + d.counties.find((x) => x.id === c.id)!.value, 0).toFixed(1)),
                        ]
                      : [+STATEWIDE_REVENUE.reduce((a, b) => a + b, 0).toFixed(1)],
                    backgroundColor: isModeled ? [stateColor, ...COUNTIES.map((c) => c.color)] : [stateColor],
                    borderColor: 'var(--card-bg)',
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 10, padding: 8, color: ct.legendText, font: { size: 10 } } },
                  tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                      label: (ctx) => {
                        const val = ctx.parsed as number;
                        const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const pct = ((val / total) * 100).toFixed(1);
                        return `${ctx.label}: ${val.toFixed(1)}M (${pct}%)`;
                      },
                    },
                  },
                },
                cutout: '58%',
              }}
            />
          </div>
        </div>
        <ModelNote>
          HIRUC revenue figures are actual FY2026 collections and FY2027–FY2033 program enrollment forecasts from the HDOT AFV report. The modeled county revenue-share is a hypothetical policy scenario, loosely patterned on Oregon's OReGO 50%/30%/20% state/county/city split as a reference point. No county revenue-sharing formula for RUC exists in current Hawai'i policy.
        </ModelNote>
      </Card>

      {/* District card */}
      <Card>
        <SectionHeader
          title="Revenue by HDOT Highway District, FY2026–FY2033"
          desc="Revenue generated and distributed across state highway districts: O'ahu, Maui, Hawai'i, and Kaua'i. Pie chart shows the cumulative share across all years."
        />
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-5">
          <div style={{ height: 300 }}>
            <Bar
              data={{
                labels: [...YEARS],
                datasets: DISTRICTS.map((d) => ({
                  label: d.name,
                  data: STATEWIDE_REVENUE.map((total) => Math.round(total * d.share * 10) / 10),
                  backgroundColor: d.color,
                })),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12, color: ct.legendText, font: { size: 11 } } },
                  tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.y as number).toFixed(1)}M` } },
                },
                scales: stackedScaleConfig,
              }}
            />
          </div>
          <div style={{ minHeight: 280 }}>
            <Doughnut
              data={{
                labels: DISTRICTS.map((d) => d.name),
                datasets: [
                  {
                    data: DISTRICTS.map((d) =>
                      +STATEWIDE_REVENUE.map((total) => total * d.share).reduce((a, b) => a + b, 0).toFixed(1)
                    ),
                    backgroundColor: DISTRICTS.map((d) => d.color),
                    borderColor: 'var(--card-bg)',
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 10, padding: 8, color: ct.legendText, font: { size: 10 } } },
                  tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                      label: (ctx) => {
                        const val = ctx.parsed as number;
                        const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const pct = ((val / total) * 100).toFixed(1);
                        return `${ctx.label}: ${val.toFixed(1)}M (${pct}%)`;
                      },
                    },
                  },
                },
                cutout: '58%',
              }}
            />
          </div>
        </div>

        <div className="mt-5" style={{ overflowX: 'auto' }}>
          <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>District</th>
                {YEARS.map((y) => (
                  <th key={y} className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>{y}</th>
                ))}
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Total</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Share</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const grandTotal = STATEWIDE_REVENUE.reduce((a, b) => a + b, 0);
                return DISTRICTS.map((d) => {
                  const vals = STATEWIDE_REVENUE.map((total) => Math.round(total * d.share * 10) / 10);
                  const total = vals.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={d.id}>
                      <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)' }}>
                        <span className="inline-flex items-center gap-2" style={{ color: 'var(--primary-text)' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                          {d.name}
                        </span>
                      </td>
                      {vals.map((v, i) => <td key={i} className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{v.toFixed(1)}</td>)}
                      <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{total.toFixed(1)}</td>
                      <td className="text-right py-2.5 px-3 border-b font-semibold" style={{ color: d.color, borderColor: 'var(--card-border)' }}>{((total / grandTotal) * 100).toFixed(1)}%</td>
                    </tr>
                  );
                });
              })()}
              <tr style={{ borderTop: '2px solid var(--pacific)' }}>
                <td className="text-left py-2.5 px-3 font-body font-bold" style={{ color: 'var(--pacific)' }}>Total</td>
                {STATEWIDE_REVENUE.map((v, i) => (
                  <td key={i} className="text-right py-2.5 px-3 font-bold" style={{ color: 'var(--pacific)' }}>{v}</td>
                ))}
                <td className="text-right py-2.5 px-3 font-bold" style={{ color: 'var(--pacific)' }}>{STATEWIDE_REVENUE.reduce((a, b) => a + b, 0)}</td>
                <td className="text-right py-2.5 px-3 font-bold" style={{ color: 'var(--pacific)' }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ModelNote>
          District shares are derived from actual FY2026–FY2033 HIRUC enrollment forecasts by county from the HDOT AFV report. Pending confirmation from HDOT on whether HDOT highway districts represent a genuinely distinct revenue concept from counties, or whether they share the same underlying allocation.
        </ModelNote>
      </Card>

    </div>
  );
}
