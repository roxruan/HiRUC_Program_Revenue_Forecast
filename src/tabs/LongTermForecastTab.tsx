import { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Card, SectionHeader, KPICard, ModelNote } from '@/components/ui';
import { COUNTIES, confidenceBand, formatM, cagr } from '@/data/forecast';
import { FY26_ACTUAL_BY_COUNTY, type CountyKey } from '@/data/afvData';
import {
  PHASES,
  PHASE_YEARS,
  getPhaseRevenue,
  getPhaseRevenueByCounty,
  type PhaseDef,
} from '@/data/phases';
import { useChartTheme } from '@/theme';
import { IslandMap } from '@/components/IslandMapInline';

function formatNominal(millions: number): string {
  return '$' + Math.round(millions * 1_000_000).toLocaleString();
}

const SEGMENT_COLORS = {
  ev: '#2C4A6B',
  phev: '#5B8BAE',
  gasoline: '#B5563B',
};

const SEGMENT_LABELS = {
  ev: 'EVs (per-mile + flat)',
  phev: 'PHEV / Hybrid',
  gasoline: 'Gasoline',
};

export default function LongTermForecastTab() {
  const [scope, setScope] = useState('statewide');
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [activePhaseId, setActivePhaseId] = useState(1);
  const [activeSubTab, setActiveSubTab] = useState<'forecast' | 'timeline'>('forecast');
  const ct = useChartTheme();

  const isCounty = scope === 'county';
  const activeCounty = selectedCounty ? COUNTIES.find((c) => c.id === selectedCounty)! : COUNTIES[0];
  const activePhase = PHASES.find((p) => p.id === activePhaseId)!;

  const phaseRows = useMemo(() => {
    if (isCounty) {
      return getPhaseRevenueByCounty(activePhase, activeCounty.island as CountyKey);
    }
    return getPhaseRevenue(activePhase);
  }, [activePhase, isCounty, activeCounty]);

  const phaseYears = phaseRows.map((r) => r.year);
  const phaseTotals = phaseRows.map((r) => r.total);

  const band = confidenceBand(phaseTotals);

  const selectCounty = (id: string) => {
    setSelectedCounty(id);
    setScope('county');
  };

  const cumulative = phaseTotals.reduce((a, b) => a + b, 0);
  const lastVal = phaseTotals[phaseTotals.length - 1] || 0;
  const firstVal = phaseTotals[0] || 0;
  const growth = phaseTotals.length > 1 ? cagr(firstVal, lastVal, phaseTotals.length - 1) : 0;

  const navyColor = ct.navy;
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

  if (activeSubTab === 'timeline') {
    return (
      <div className="space-y-5">
        <LongTermSubTabs activeSubTab={activeSubTab} onChange={setActiveSubTab} />
        <TransitionPlan />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <LongTermSubTabs activeSubTab={activeSubTab} onChange={setActiveSubTab} />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--card-border)' }}>
          {[
            { label: 'Statewide', value: 'statewide' },
            { label: 'County', value: 'county' },
          ].map((opt, i) => {
            const active = scope === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setScope(opt.value);
                  if (opt.value === 'statewide') setSelectedCounty(null);
                }}
                className="font-body font-semibold text-[12.5px] px-4 py-2 transition-all whitespace-nowrap"
                style={{
                  background: active ? 'var(--pacific)' : 'var(--card-bg)',
                  color: active ? '#FFFFFF' : 'var(--secondary-text)',
                  borderLeft: i > 0 ? '1px solid var(--card-border)' : 'none',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {isCounty && (
          <div className="font-body text-[12.5px]" style={{ color: 'var(--secondary-text)' }}>
            Selected: <span style={{ color: activeCounty.color, fontWeight: 600 }}>{activeCounty.name} County</span>
          </div>
        )}
      </div>

      {/* Phase selector */}
      <Card>
        <SectionHeader title="Forecast phases" desc="Each phase adds a vehicle segment. Once shown, a segment continues to appear in all later phases." />
        <div className="flex gap-2 flex-wrap">
          {PHASES.map((p) => {
            const active = p.id === activePhaseId;
            return (
              <button
                key={p.id}
                onClick={() => setActivePhaseId(p.id)}
                className="rounded-full font-body font-semibold text-[12.5px] px-[18px] py-2 border transition-all whitespace-nowrap"
                style={{
                  background: active ? 'var(--toggle-active-bg)' : 'var(--toggle-inactive-bg)',
                  color: active ? 'var(--toggle-active-text)' : 'var(--toggle-inactive-text)',
                  borderColor: active ? 'var(--toggle-active-border)' : 'var(--toggle-inactive-border)',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="font-body text-[12.5px]" style={{ color: 'var(--secondary-text)' }}>
            <span className="font-semibold" style={{ color: 'var(--primary-text)' }}>Date range:</span> {activePhase.dateRange}
          </div>
          <div className="font-body text-[12.5px]" style={{ color: 'var(--secondary-text)' }}>
            <span className="font-semibold" style={{ color: 'var(--primary-text)' }}>Cap:</span> {activePhase.capNote}
          </div>
          <div className="font-body text-[12.5px]" style={{ color: 'var(--secondary-text)' }}>
            <span className="font-semibold" style={{ color: 'var(--primary-text)' }}>Segments:</span> {activePhase.segments.map((s) => SEGMENT_LABELS[s]).join(', ')}
          </div>
        </div>
      </Card>

      {/* Hero + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-5">
        <Card
          className="flex flex-col justify-between"
          style={{ background: 'var(--hero-bg)', borderColor: 'var(--hero-border)' }}
        >
          <div>
            <div className="font-data uppercase" style={{ fontSize: 11, color: 'var(--header-eyebrow)', letterSpacing: '0.1em', fontWeight: 500 }}>
              {isCounty ? `${activeCounty.name} County — ${activePhase.label}` : `Statewide — ${activePhase.label}`}
            </div>
            <div className="font-display font-extrabold mt-2" style={{ fontSize: 64, lineHeight: 1, color: '#C8D4E0' }}>
              {formatM(lastVal)}
            </div>
          </div>
          <p className="font-body mt-4" style={{ fontSize: 13, color: 'var(--header-subtitle)', lineHeight: 1.5, maxWidth: 420 }}>
            {isCounty
              ? `${activeCounty.name} County's projected revenue at the end of ${activePhase.label}. ${activePhase.capNote}.`
              : `Projected statewide revenue at the end of ${activePhase.label}. ${activePhase.capNote}.`}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <KPICard label="Phase Cumulative" value={formatM(cumulative)} sub={`${activePhase.dateRange.split('–')[0].trim()} total`} />
          <KPICard label="CAGR" value={`${(growth * 100).toFixed(0)}%`} sub="Compound annual growth" />
          {isCounty ? (
            <>
              <KPICard label="Statewide Share" value={`${(activeCounty.share * 100).toFixed(0)}%`} sub="of statewide total" />
              <KPICard label="End-of-phase" value={formatM(lastVal)} sub="Projected" />
            </>
          ) : (
            <>
              <KPICard label="Years Shown" value={`${phaseTotals.length}`} sub="fiscal years" />
              <KPICard label="FY26 Actual" value={formatM(firstVal)} sub="Jul 2025–Jun 2026" />
            </>
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
          <SectionHeader
            title={`Revenue trend — ${activePhase.label}`}
            desc={`${activePhase.dateRange}. ${activePhase.capNote}. Shaded band shows widening uncertainty.`}
          />
          <div style={{ height: 320 }}>
            <Line
              data={{
                labels: [...phaseYears],
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
                    label: isCounty ? `${activeCounty.name} County` : 'Statewide',
                    data: phaseTotals,
                    borderColor: countyColor,
                    backgroundColor: countyColor,
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 3,
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

      {/* Stacked segment chart */}
      <Card>
        <SectionHeader
          title={`Revenue by segment — ${activePhase.label}`}
          desc={`${activePhase.dateRange}. Stacked bars show each vehicle segment's contribution. ${activePhase.capNote}.`}
        />
        <div style={{ height: 340 }}>
          <Bar
            data={{
              labels: [...phaseYears],
              datasets: activePhase.segments.map((seg) => ({
                label: SEGMENT_LABELS[seg],
                data: phaseRows.map((r) => r[seg]),
                backgroundColor: SEGMENT_COLORS[seg],
                borderColor: SEGMENT_COLORS[seg],
                borderWidth: 1,
              })),
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: legendConfig,
                tooltip: { ...tooltipConfig, callbacks: { label: (ctx) => `${ctx.dataset.label}: $${(ctx.parsed.y as number).toFixed(2)}M` } },
              },
              scales: {
                x: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 } }, border: { color: ct.tableBorder } },
                y: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 }, callback: (v: string | number) => `$${v}M` }, border: { color: ct.tableBorder } },
              },
            }}
          />
        </div>
      </Card>

      {/* County comparison — stacked by county */}
      <Card>
        <SectionHeader
          title={`County comparison — ${activePhase.label}`}
          desc={`Stacked revenue contribution by county, ${activePhase.dateRange}.`}
          right={isCounty ? <span className="font-body text-[12.5px]" style={{ color: 'var(--secondary-text)' }}>Highlighting {activeCounty.name}</span> : undefined}
        />
        <div style={{ height: 320 }}>
          <Bar
            data={{
              labels: [...phaseYears],
              datasets: COUNTIES.map((c) => {
                const vals = getPhaseRevenueByCounty(activePhase, c.island as CountyKey).map((r) => r.total);
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
              scales: {
                x: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 } }, border: { color: ct.tableBorder } },
                y: { stacked: true, grid: { color: ct.grid }, ticks: { color: ct.tick, font: { family: 'IBM Plex Mono', size: 11 }, callback: (v: string | number) => `$${v}M` }, border: { color: ct.tableBorder } },
              },
            }}
          />
        </div>
      </Card>

      {/* Detail table */}
      <Card>
        <SectionHeader
          title={`Phase detail — ${activePhase.label}`}
          desc={`${activePhase.dateRange}. ${activePhase.capNote}. All figures in nominal dollars.`}
        />
        <div style={{ overflowX: 'auto' }}>
          <PhaseTable phase={activePhase} isCounty={isCounty} countyKey={isCounty ? (activeCounty.island as CountyKey) : null} />
        </div>
      </Card>

      {/* Gasoline phase-in note (only in phase 4) */}
      {activePhaseId === 4 && (
        <Card>
          <SectionHeader title="Gasoline vehicle phase-in by model year" desc="Light-duty gasoline vehicles enter the display in four steps based on model year." />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { fy: 'FY31', from: 'Jul 1, 2030', rule: 'Model year ≥ 2030', frac: '25%' },
              { fy: 'FY32', from: 'Jul 1, 2031', rule: 'Model year ≥ 2025', frac: '50%' },
              { fy: 'FY33', from: 'Jul 1, 2032', rule: 'Model year ≥ 2020', frac: '75%' },
              { fy: 'FY34+', from: 'Jul 1, 2033', rule: 'All remaining model years', frac: '100%' },
            ].map((step, i) => (
              <div key={i} className="rounded-[10px] border p-3" style={{ borderColor: 'var(--card-border)', background: 'var(--note-bg)' }}>
                <div className="font-data font-semibold" style={{ fontSize: 12.5, color: 'var(--pacific)' }}>{step.fy}</div>
                <div className="font-body mt-1" style={{ fontSize: 12, color: 'var(--primary-text)' }}>{step.from}</div>
                <div className="font-body mt-0.5" style={{ fontSize: 12, color: 'var(--secondary-text)' }}>{step.rule}</div>
                <div className="font-data font-bold mt-1" style={{ fontSize: 14, color: 'var(--pacific)' }}>{step.frac} in scope</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LONG_MILESTONES.map((m, i) => (
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
        FY2026 figures are actual HIRUC collections from HDOT AFV report data. FY2027–FY2040 are program enrollment forecasts from the same report. Phase 1–2 show EVs only ($50 cap in Phase 1, $80/EV threshold in Phase 2). Phase 3 adds PHEV/hybrid vehicles ($80 threshold). Phase 4 adds gasoline vehicles ($80 threshold), phasing in by model year from FY31 through FY34. All underlying CSV data is unchanged — this is a display/filter view only.
      </ModelNote>
    </div>
  );
}

function LongTermSubTabs({ activeSubTab, onChange }: { activeSubTab: 'forecast' | 'timeline'; onChange: (value: 'forecast' | 'timeline') => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {[
        { value: 'forecast' as const, label: 'Forecast' },
        { value: 'timeline' as const, label: 'Transition plan' },
      ].map((tab) => {
        const active = activeSubTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className="rounded-full font-body font-semibold text-[12.5px] px-[18px] py-2 border transition-all whitespace-nowrap"
            style={{
              background: active ? 'var(--toggle-active-bg)' : 'var(--toggle-inactive-bg)',
              color: active ? 'var(--toggle-active-text)' : 'var(--toggle-inactive-text)',
              borderColor: active ? 'var(--toggle-active-border)' : 'var(--toggle-inactive-border)',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function TransitionPlan() {
  const years = ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033'];
  const topEvents = [
    { index: 0, lines: ['HiRUC launches', 'for EVs (Act 222)'], strong: [0] },
    { index: 3, lines: ['Per-mile RUC', 'mandatory for EVs', '(flat fee option ends)', '+$50 cap removal'], strong: [0, 1, 3] },
    { index: 5, lines: ['RUC begins for gas', 'vehicles (Model', 'Year ≥ 2030)'], strong: [0] },
    { index: 7, lines: ['Expand to', 'Model Year ≥', '2020'], strong: [] },
  ];
  const bottomEvents = [
    { index: 4, lines: ['Hybrids +', 'PHEVs phase in'], strong: [0, 1] },
    { index: 6, lines: ['Expand to Model', 'Year ≥ 2025'], strong: [] },
    { index: 8, lines: ['All light-duty vehicles', 'on RUC; Fuel tax', 'sunset decision'], strong: [0, 1] },
  ];

  const topByIndex = new Map(topEvents.map((e) => [e.index, e]));
  const bottomByIndex = new Map(bottomEvents.map((e) => [e.index, e]));

  return (
    <Card className="overflow-hidden" style={{ padding: 0 }}>
      <div style={{ background: 'var(--header-bg)', padding: '28px 30px 26px' }}>
        <div className="font-display font-bold" style={{ color: 'var(--active-tab-text)', fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.05 }}>
          Long-Term Transition Plan
        </div>
        <div className="font-display font-semibold" style={{ color: 'var(--header-subtitle)', fontSize: 'clamp(22px, 3.2vw, 42px)', lineHeight: 1.12 }}>
          Recommended Implementation Timeline
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="relative min-w-[860px] px-6 pt-8 pb-8" style={{ background: 'var(--card-bg)' }}>
          <div className="grid grid-cols-9 gap-0">
            {years.map((year, index) => {
              const inactive = index === 1 || index === 2;
              const topEvent = topByIndex.get(index);
              const bottomEvent = bottomByIndex.get(index);
              const yearColor = inactive ? 'var(--secondary-text)' : 'var(--pacific)';
              const isFirst = index === 0;
              const isLast = index === years.length - 1;
              return (
                <div key={year} className="flex flex-col items-center">
                  {/* Top milestone text + connector (fixed height so rail aligns) */}
                  <div className="flex flex-col items-center justify-end" style={{ height: 160, width: '100%' }}>
                    {topEvent ? (
                      <>
                        <div className="font-body text-[16px] leading-tight text-center" style={{ color: 'var(--primary-text)', width: 170 }}>
                          {topEvent.lines.map((line, lineIndex) => (
                            <div key={line} style={{ fontWeight: topEvent.strong.includes(lineIndex) ? 700 : 400, color: line.startsWith('+$50') ? 'var(--pacific)' : 'var(--primary-text)' }}>{line}</div>
                          ))}
                        </div>
                        <div style={{ width: 4, height: 40, background: topEvent.index === 3 ? 'var(--reef)' : 'var(--pacific)' }} />
                      </>
                    ) : null}
                  </div>
                  {/* Rail segment with year label inside */}
                  <div className="flex items-center justify-center" style={{
                    height: 38,
                    background: 'var(--line)',
                    width: '100%',
                    borderRadius: isFirst ? '24px 0 0 24px' : isLast ? '0 24px 24px 0' : '0',
                  }}>
                    <span className="font-data font-semibold" style={{ color: yearColor, fontSize: 20 }}>{year}</span>
                  </div>
                  {/* Bottom connector + milestone text (fixed height) */}
                  <div className="flex flex-col items-center" style={{ height: 170, width: '100%' }}>
                    {bottomEvent ? (
                      <>
                        <div style={{ width: 4, height: 40, background: 'var(--pacific)' }} />
                        <div className="font-body text-[16px] leading-tight text-center" style={{ color: 'var(--primary-text)', width: 190 }}>
                          {bottomEvent.lines.map((line, lineIndex) => (
                            <div key={line} style={{ fontWeight: bottomEvent.strong.includes(lineIndex) ? 700 : 400 }}>{line}</div>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 font-body text-[13px] font-semibold mt-6" style={{ color: 'var(--primary-text)' }}>
            <div className="flex items-center gap-2"><span style={{ width: 19, height: 19, borderRadius: 3, background: 'var(--ink)' }} />Act 222</div>
            <div className="flex items-center gap-2"><span style={{ width: 19, height: 19, borderRadius: 3, background: 'var(--pacific)' }} />LTTP Recommendations</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const LONG_MILESTONES = [
  { year: 'FY26', text: 'HIRUC program operational with actual collections across all four counties' },
  { year: 'FY29', text: 'PHEV/hybrid vehicles begin onboarding as default-rate enrollment ramps up' },
  { year: 'FY31', text: 'Gasoline vehicles begin phasing in by model year (≥2030 first), expanding road-funding base' },
];

function PhaseTable({ phase, isCounty, countyKey }: { phase: PhaseDef; isCounty: boolean; countyKey: CountyKey | null }) {
  const rows = isCounty && countyKey
    ? getPhaseRevenueByCounty(phase, countyKey)
    : getPhaseRevenue(phase);

  const years = rows.map((r) => r.year);

  return (
    <table className="w-full font-data text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th className="text-left font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Segment</th>
          {years.map((y) => (
            <th key={y} className="text-right font-semibold py-2.5 px-3 border-b whitespace-nowrap" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>{y}</th>
          ))}
          <th className="text-right font-semibold py-2.5 px-3 border-b" style={{ color: 'var(--secondary-text)', borderColor: 'var(--card-border)' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {phase.segments.map((seg) => {
          const vals = rows.map((r) => r[seg]);
          const total = vals.reduce((a, b) => a + b, 0);
          return (
            <tr key={seg}>
              <td className="text-left py-2.5 px-3 border-b font-body font-medium" style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}>
                <span className="inline-flex items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: SEGMENT_COLORS[seg] }} />
                  {SEGMENT_LABELS[seg]}
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
          <td className="text-left py-2.5 px-3 font-body font-bold" style={{ color: 'var(--pacific)' }}>Total</td>
          {rows.map((r, i) => (
            <td key={i} className="text-right py-2.5 px-3 font-bold whitespace-nowrap" style={{ color: 'var(--pacific)' }}>{formatNominal(r.total)}</td>
          ))}
          <td className="text-right py-2.5 px-3 font-bold whitespace-nowrap" style={{ color: 'var(--pacific)' }}>
            {formatNominal(rows.reduce((a, r) => a + r.total, 0))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
