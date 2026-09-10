import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { FISCAL_YEARS, COUNTIES, countyRevenue, STATEWIDE_REVENUE } from '@/data';
import type { CountyId } from '@/data';
import { useChartTheme } from '@/theme';

interface ComparisonChartProps {
  selectedCounty: CountyId | null;
}

export default function ComparisonChart({ selectedCounty }: ComparisonChartProps) {
  const ct = useChartTheme();
  const datasets = COUNTIES.map((c) => {
    const isDimmed = selectedCounty !== null && selectedCounty !== c.id;
    return {
      label: c.name,
      data: FISCAL_YEARS.map((_, i) => countyRevenue(c.id, i)),
      backgroundColor: isDimmed ? `${c.color}33` : c.color,
      borderColor: isDimmed ? `${c.color}55` : c.color,
      borderWidth: 1,
      borderRadius: 4,
      stack: 'counties',
    };
  });

  const data: ChartData<'bar'> = {
    labels: FISCAL_YEARS,
    datasets,
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Inter', size: 11 },
          color: ct.legendText,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14,
        },
      },
      tooltip: {
        backgroundColor: ct.tooltipBg,
        titleColor: ct.tooltipTitle,
        bodyColor: ct.tooltipBody,
        borderColor: ct.tableBorder,
        borderWidth: 1,
        titleFont: { family: 'IBM Plex Mono', size: 11, weight: 600 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y}M`,
          footer: (items) => {
            const total = items.reduce((a, item) => a + (item.parsed.y ?? 0), 0);
            return `Total: $${total.toFixed(1)}M`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { family: 'IBM Plex Mono', size: 11 }, color: ct.tick },
        border: { color: ct.tableBorder },
      },
      y: {
        stacked: true,
        grid: { color: ct.grid },
        ticks: {
          font: { family: 'IBM Plex Mono', size: 11 },
          color: ct.tick,
          callback: (v) => `$${v}M`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: '340px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
