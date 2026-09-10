import { useState, useMemo } from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import { Card, SectionHeader, KPICard, ModelNote } from '@/components/ui';
import { YEARS } from '@/data/forecast';
import { PRESETS, simulate, type SliderValues } from '@/data/scenario';
import { useChartTheme } from '@/theme';

const LONG_YEARS = YEARS;

function formatNominal(millions: number): string {
  return '$' + Math.round(millions * 1_000_000).toLocaleString();
}

export default function RevenueDriversTab() {
  const [sliders, setSliders] = useState<SliderValues>(PRESETS['Base case']);
  const [activePreset, setActivePreset] = useState<string | null>('Base case');
  const ct = useChartTheme();

  const results = useMemo(() => simulate(sliders), [sliders]);
  const fy33 = results[7];
  const fy40 = results[14];
  const cumulativeGap = results.reduce((a, r) => a + r.gap, 0);
  const gapPct = (fy40.gap / fy40.fundingNeed) * 100;
  const rucShareFY40 = (fy40.rucRevenue / fy40.totalRevenue) * 100;

  const applyPreset = (name: string) => {
    setSliders(PRESETS[name]);
    setActivePreset(name);
  };

  const updateSlider = (key: keyof SliderValues, value: number) => {
    setSliders((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null);
  };

  const navyColor = ct.navy;
  const fuelTaxColor = ct.fuelTax;

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
      {/* Assumption sliders */}
      <Card>
        <SectionHeader title="Assumption sliders" desc="Simulate how adoption, efficiency, inflation, and fee-rate choices shift the future road-funding gap. *Baseline assumptions as of FY27" />
        <div className="flex gap-2 mb-5 flex-wrap">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className="rounded-full font-body font-semibold text-[12.5px] px-[18px] py-2 border transition-all whitespace-nowrap"
              style={{
                background: activePreset === name ? 'var(--toggle-active-bg)' : 'var(--toggle-inactive-bg)',
                color: activePreset === name ? 'var(--toggle-active-text)' : 'var(--toggle-inactive-text)',
                borderColor: activePreset === name ? 'var(--toggle-active-border)' : 'var(--toggle-inactive-border)',
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <Slider label="EV adoption rate" value={sliders.evMult} min={0.5} max={1.5} step={0.05} format={(v) => `×${v.toFixed(2)}`} onChange={(v) => updateSlider('evMult', v)} />
          <Slider label="PHEV/hybrid adoption rate" value={sliders.phevMult} min={0.5} max={1.5} step={0.05} format={(v) => `×${v.toFixed(2)}`} onChange={(v) => updateSlider('phevMult', v)} />
          <Slider label="Fleet fuel-economy improvement" value={sliders.mpgPct} min={0} max={4} step={0.25} format={(v) => `${v.toFixed(2)}%/yr`} onChange={(v) => updateSlider('mpgPct', v)} />
          <Slider label="Inflation (cost of road maintenance)" value={sliders.infPct} min={0} max={6} step={0.25} format={(v) => `${v.toFixed(2)}%/yr`} onChange={(v) => updateSlider('infPct', v)} />
          <Slider label="Mileage fee rate" value={sliders.feeRate} min={0.004} max={0.02} step={0.0005} format={(v) => `$${v.toFixed(4)}/mi`} onChange={(v) => updateSlider('feeRate', v)} />
        </div>

        <button
          onClick={() => applyPreset('Base case')}
          className="rounded-full font-body font-semibold text-[12.5px] px-[18px] py-2 border mt-5 transition-all"
          style={{ background: 'var(--note-bg)', color: 'var(--primary-text)', borderColor: 'var(--card-border)' }}
        >
          Reset to baseline assumptions
        </button>
      </Card>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="FY40 Funding Gap" value={`$${fy40.gap.toFixed(0)}M`} sub={fy40.gap > 0 ? 'Shortfall' : 'Surplus'} valueColor={fy40.gap > 0 ? 'var(--lava)' : 'var(--pacific)'} />
        <KPICard label="FY40 Gap as % of Need" value={`${gapPct.toFixed(1)}%`} sub="of projected funding need" />
        <KPICard label="15-Year Cumulative Gap" value={`$${cumulativeGap.toFixed(0)}M`} sub="FY26–FY40 total" valueColor={cumulativeGap > 0 ? 'var(--lava)' : 'var(--pacific)'} />
        <KPICard label="RUC Share of Revenue, FY40" value={`${rucShareFY40.toFixed(1)}%`} sub="of total revenue" />
      </div>

      {/* Funding need vs revenue combo */}
      <Card>
        <SectionHeader title="Funding need vs. total revenue" desc="Stacked fuel tax + RUC revenue, with projected funding need overlaid through FY2040." />
        <div style={{ height: 340 }}>
          <Chart
            type="bar"
            data={{
              labels: [...LONG_YEARS],
              datasets: [
                { label: 'Fuel tax revenue', data: results.map((r) => r.fuelTaxRevenue), backgroundColor: fuelTaxColor, stack: 'rev' },
                { label: 'RUC revenue', data: results.map((r) => r.rucRevenue), backgroundColor: navyColor, stack: 'rev' },
                {
                  label: 'Projected funding need',
                  data: results.map((r) => r.fundingNeed),
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
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: $${(ctx.parsed.y as number).toFixed(1)}M` } },
              },
              scales: scaleConfig,
            }}
          />
        </div>
      </Card>

      {/* Data table — nominal dollars */}
      <Card>
        <SectionHeader title="Scenario detail, FY2026–FY2040" desc="All figures recalculated live from slider values, in nominal dollars." />
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Metric</th>
                {LONG_YEARS.map((y) => (
                  <th key={y} className="text-right font-semibold py-2.5 px-3 border-b whitespace-nowrap" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>{y}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>RUC-eligible fleet share</td>
                {results.map((r, i) => <td key={i} className="text-right py-2.5 px-3 border-b" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{(r.adopt * 100).toFixed(1)}%</td>)}
              </tr>
              <tr>
                <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>Fuel tax revenue</td>
                {results.map((r, i) => <td key={i} className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{formatNominal(r.fuelTaxRevenue)}</td>)}
              </tr>
              <tr>
                <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>RUC revenue</td>
                {results.map((r, i) => <td key={i} className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{formatNominal(r.rucRevenue)}</td>)}
              </tr>
              <tr>
                <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>Total revenue</td>
                {results.map((r, i) => <td key={i} className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{formatNominal(r.totalRevenue)}</td>)}
              </tr>
              <tr>
                <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>Funding need</td>
                {results.map((r, i) => <td key={i} className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>{formatNominal(r.fundingNeed)}</td>)}
              </tr>
              <tr className="font-bold" style={{ background: 'var(--note-bg)' }}>
                <td className="text-left py-2.5 px-3 border-b font-body" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>Gap</td>
                {results.map((r, i) => (
                  <td key={i} className="text-right py-2.5 px-3 border-b whitespace-nowrap" style={{ borderColor: 'var(--card-border)', color: r.gap > 0 ? 'var(--lava)' : 'var(--pacific)' }}>
                    {formatNominal(r.gap)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <ModelNote>
        Simulation uses a simplified fleet-transition model: fixed fleet of 1.08M vehicles, baseline EV and PHEV/hybrid adoption shares each scaled by their own multiplier, declining per-vehicle fuel tax as fleet MPG improves, and a capped per-mile RUC fee. Funding need grows with inflation. This is a planning prototype — not a fiscal forecast.
      </ModelNote>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, format, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-[13px] font-medium" style={{ color: 'var(--primary-text)' }}>{label}</span>
        <span className="font-data text-[13px] font-semibold" style={{ color: 'var(--pacific)' }}>{format(value)}</span>
      </div>
      <input
        type="range"
        className="ruc-slider w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="flex justify-between mt-1.5">
        <span className="font-data text-[10.5px]" style={{ color: 'var(--secondary-text)' }}>{format(min)}</span>
        <span className="font-data text-[10.5px]" style={{ color: 'var(--secondary-text)' }}>{format((min + max) / 2)}</span>
        <span className="font-data text-[10.5px]" style={{ color: 'var(--secondary-text)' }}>{format(max)}</span>
      </div>
    </div>
  );
}
