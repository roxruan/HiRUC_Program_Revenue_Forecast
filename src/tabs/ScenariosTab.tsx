import { useMemo } from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import { Card, SectionHeader, ModelNote } from '@/components/ui';
import { YEARS } from '@/data/forecast';
import { FEE_TYPES, VEHICLE_CLASSES, WEAR_ROWS, phevFigures, feeTypeDetail } from '@/data/vehicle';
import { useChartTheme } from '@/theme';

export default function ScenariosTab() {
  const { gross, credit, net } = phevFigures();
  const feeDetails = feeTypeDetail();
  const ct = useChartTheme();

  const totalRev = WEAR_ROWS.reduce((a, r) => a + r.revenue, 0);
  const totalWear = WEAR_ROWS.reduce((a, r) => a + r.wearShare, 0);
  const revShares = WEAR_ROWS.map((r) => (r.revenue / totalRev) * 100);
  const wearShares = WEAR_ROWS.map((r) => (r.wearShare / totalWear) * 100);

  const navyColor = ct.navy;

  // Adjust fee type colors for dark mode
  const feeTypeColors = useMemo(() => {
    if (ct.navy === '#4C7FB0') {
      return {
        hruc: '#4C7FB0',
        fuelTax: '#B5563B',
        dieselTax: '#A0623D',
        altFuelSurcharge: '#E0AA4E',
        registration: '#3D6B8E',
        weightTax: '#5B8BAE',
      };
    }
    return {
      hruc: '#2C4A6B',
      fuelTax: '#B5563B',
      dieselTax: '#8B4513',
      altFuelSurcharge: '#C99A3E',
      registration: '#3D6B8E',
      weightTax: '#5B8BAE',
    };
  }, [ct.navy]);

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

  const stackedScaleConfig = useMemo(() => ({
    x: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, font: { size: 11 } }, border: { color: ct.tableBorder } },
    y: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, callback: (v: string | number) => `$${v}` }, border: { color: ct.tableBorder } },
  }), [ct]);

  const hBarScaleConfig = useMemo(() => ({
    x: { grid: { color: ct.grid }, ticks: { color: ct.tick, callback: (v: string | number) => `${v}%` }, border: { color: ct.tableBorder } },
    y: { grid: { display: false }, ticks: { color: ct.tick, font: { size: 11 } }, border: { color: ct.tableBorder } },
  }), [ct]);

  return (
    <div className="space-y-5">
      {/* Card 1: Fee stack table */}
      <Card>
        <SectionHeader title="State fee stack by vehicle class" desc="Annual state-level fees paid per vehicle, by class." />
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Vehicle class</th>
                {FEE_TYPES.map((ft) => (
                  <th key={ft.key} className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>{ft.label}</th>
                ))}
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Total/yr</th>
              </tr>
            </thead>
            <tbody>
              {VEHICLE_CLASSES.map((vc) => (
                <tr key={vc.name}>
                  <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)' }}>
                    <div className="font-semibold" style={{ color: 'var(--primary-text)' }}>{vc.name}</div>
                    <div className="font-body text-[11px] mt-1" style={{ maxWidth: 340, color: 'var(--secondary-text)' }}>{vc.note}</div>
                  </td>
                  {FEE_TYPES.map((ft) => (
                    <td key={ft.key} className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>
                      {vc.fees[ft.key] != null ? `$${vc.fees[ft.key]}` : '—'}
                    </td>
                  ))}
                  <td className="text-right py-2.5 px-3 border-b font-bold" style={{ color: 'var(--pacific)', borderColor: 'var(--card-border)' }}>${vc.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModelNote>
          Fees reflect current Hawai'i state fee structures. Open items to confirm with HDOT: (1) the diesel tax rate (differs from gasoline), (2) weight-tax and registration tier boundaries for commercial vehicles. County fees are not included — this dashboard focuses strictly on state revenues.
        </ModelNote>
      </Card>

      {/* Card 1b: Fee stack visualization */}
      <Card>
        <SectionHeader
          title="Revenue type breakdown by vehicle class"
          desc="Stacked bar chart showing how each fee type contributes to the total annual cost per vehicle class. Hover over any segment to see the exact dollar amount."
        />
        <div style={{ height: 380 }}>
          <Bar
            data={{
              labels: VEHICLE_CLASSES.map((vc) => vc.name),
              datasets: FEE_TYPES.map((ft) => ({
                label: ft.label,
                data: VEHICLE_CLASSES.map((vc) => vc.fees[ft.key] ?? 0),
                backgroundColor: feeTypeColors[ft.key as keyof typeof feeTypeColors] || ft.color,
                borderColor: feeTypeColors[ft.key as keyof typeof feeTypeColors] || ft.color,
                borderWidth: 1,
              })),
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: {
                  ...tooltipConfig,
                  callbacks: {
                    label: (ctx) => {
                      const val = ctx.parsed.y as number;
                      if (val === 0) return `${ctx.dataset.label}: Not applicable`;
                      return `${ctx.dataset.label}: $${val}/yr`;
                    },
                  },
                },
              },
              scales: stackedScaleConfig,
            }}
          />
        </div>
      </Card>

      {/* Card 2: Revenue vs wear */}
      <Card>
        <SectionHeader
          title="Revenue contribution vs. estimated road wear share, by vehicle class"
          desc="Compares the share of total revenue each class contributes against its estimated share of road wear."
        />
        <p className="font-body text-[12.5px] mb-4" style={{ color: 'var(--secondary-text)', maxWidth: 800 }}>
          Road wear share is estimated using the Highway Cost Allocation Study's 4th-power-law concept, where pavement damage scales roughly with axle weight raised to the fourth power — meaning heavy trucks cause disproportionately more wear per mile than passenger vehicles.
        </p>
        <div style={{ height: 340 }}>
          <Bar
            data={{
              labels: WEAR_ROWS.map((r) => r.name),
              datasets: [
                { label: 'Revenue share %', data: revShares, backgroundColor: navyColor, borderColor: navyColor, borderWidth: 1 },
                { label: 'Wear share %', data: wearShares, backgroundColor: '#B5563B', borderColor: '#B5563B', borderWidth: 1 },
              ],
            }}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.x as number).toFixed(1)}%` } },
              },
              scales: hBarScaleConfig,
            }}
          />
        </div>

        <div className="mt-5" style={{ overflowX: 'auto' }}>
          <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Vehicle class</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Registered</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Avg mi/yr</th>
                <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Revenue mechanism</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Revenue ($M)</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Revenue share</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Wear share</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Equity ratio</th>
              </tr>
            </thead>
            <tbody>
              {WEAR_ROWS.map((r, i) => {
                const ratio = revShares[i] / wearShares[i];
                return (
                  <tr key={r.name}>
                    <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{r.name}</td>
                    <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{r.registered.toLocaleString()}</td>
                    <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{r.avgMiles.toLocaleString()}</td>
                    <td className="text-left py-2.5 px-3 border-b font-body" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{r.mechanism}</td>
                    <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{r.revenue.toFixed(1)}</td>
                    <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{revShares[i].toFixed(1)}%</td>
                    <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{wearShares[i].toFixed(1)}%</td>
                    <td className="text-right py-2.5 px-3 border-b font-bold" style={{ color: ratio >= 1 ? 'var(--pacific)' : 'var(--lava)', borderColor: 'var(--card-border)' }}>
                      {ratio.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ModelNote>
          Wear shares are illustrative estimates derived from the 4th-power-law approximation, not from a formal Highway Cost Allocation Study. Equity ratios compare revenue contribution to wear responsibility; values below 1.0 indicate a class contributes less revenue than its share of road wear.
        </ModelNote>
      </Card>

      {/* Card 3: PHEV combo */}
      <Card>
        <SectionHeader
          title="PHEV revenue: gross RUC billed vs. fuel-tax credit vs. net new revenue"
          desc="Gross RUC billed (positive), fuel-tax credit offset (negative), and net new revenue (line), per fiscal year. Based on actual enrollment projections from AFV report data."
        />
        <div style={{ height: 320 }}>
          <Chart
            type="bar"
            data={{
              labels: [...YEARS],
              datasets: [
                { label: 'Gross RUC billed', data: gross, backgroundColor: navyColor, stack: 'combo' },
                { label: 'Fuel-tax credit', data: credit.map((c) => -c), backgroundColor: ct.fuelTax, stack: 'combo' },
                {
                  label: 'Net new revenue',
                  data: net,
                  type: 'line',
                  borderColor: '#B5563B',
                  backgroundColor: '#B5563B',
                  borderWidth: 2.5,
                  pointRadius: 4,
                  pointBackgroundColor: 'var(--card-bg)',
                  pointBorderColor: '#B5563B',
                  pointBorderWidth: 2,
                  order: 0,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: $${Math.abs(ctx.parsed.y as number).toFixed(2)}M` } },
              },
              scales: {
                y: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, callback: (v: string | number) => `$${v}M` }, border: { color: ct.tableBorder } },
                x: { grid: { display: false }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 } }, border: { color: ct.tableBorder } },
              },
            }}
          />
        </div>
        <ModelNote>
          PHEV enrollment counts are derived from the AFV report's default-rate enrollment projections. Fee rate is $0.008/mi (capped at $50) with a $25/yr fuel-tax credit per vehicle, matching the Scenario tab's base rate.
        </ModelNote>
      </Card>

      {/* Card 4b: Fee type detail with efficiency ratio */}
      <Card>
        <SectionHeader
          title="Fee type detail"
          desc="Revenue share, enrollment share, and efficiency ratio by fee type. Efficiency ratio = revenue share ÷ enrollment share — above 1.0 means the fee type generates more revenue per account than the fleet average."
        />
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Fee type</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Revenue ($M)</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Revenue share</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Enrollment share</th>
                <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Efficiency ratio</th>
              </tr>
            </thead>
            <tbody>
              {feeDetails.map((fd) => (
                <tr key={fd.key}>
                  <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>
                    <span className="inline-flex items-center gap-2">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: feeTypeColors[fd.key as keyof typeof feeTypeColors] || '#999' }} />
                      {fd.label}
                    </span>
                  </td>
                  <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{fd.revenue.toFixed(1)}</td>
                  <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{fd.revenueShare.toFixed(1)}%</td>
                  <td className="text-right py-2.5 px-3 border-b" style={{ color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}>{fd.enrollmentShare.toFixed(1)}%</td>
                  <td className="text-right py-2.5 px-3 border-b font-bold" style={{ color: fd.efficiencyRatio >= 1 ? 'var(--pacific)' : 'var(--lava)', borderColor: 'var(--card-border)' }}>
                    {fd.efficiencyRatio.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5" style={{ height: 300 }}>
          <Bar
            data={{
              labels: feeDetails.map((fd) => fd.label),
              datasets: [
                { label: 'Revenue share %', data: feeDetails.map((fd) => fd.revenueShare), backgroundColor: navyColor, borderColor: navyColor, borderWidth: 1 },
                { label: 'Enrollment share %', data: feeDetails.map((fd) => fd.enrollmentShare), backgroundColor: '#B5563B', borderColor: '#B5563B', borderWidth: 1 },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed.y as number).toFixed(1)}%` } },
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: ct.tick, font: { size: 11 } }, border: { color: ct.tableBorder } },
                y: { grid: { color: ct.grid }, ticks: { color: ct.tick, callback: (v: string | number) => `${v}%` }, border: { color: ct.tableBorder } },
              },
            }}
          />
        </div>
        <ModelNote>
          Efficiency ratio compares each fee type's share of total revenue to its share of total enrolled vehicles. A ratio above 1.0 indicates the fee type generates more revenue per account than the fleet average; below 1.0 means it generates less.
        </ModelNote>
      </Card>
    </div>
  );
}
