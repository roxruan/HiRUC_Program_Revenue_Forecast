import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { FISCAL_YEARS, STATEWIDE_REVENUE, BAND_PCT, countyRevenueSeries, getCounty } from '@/data';
import type { CountyId } from '@/data';
import { useChartTheme } from '@/theme';

interface TrendChartProps {
  selectedCounty: CountyId | null;
}

export default function TrendChart({ selectedCounty }: TrendChartProps) {
  const ct = useChartTheme();
  const county = selectedCounty ? getCounty(selectedCounty) : null;
  const series = selectedCounty ? countyRevenueSeries(selectedCounty) : STATEWIDE_REVENUE;
  const basePct = selectedCounty ? getCounty(selectedCounty).share / 100 : 1;
  const color = county ? county.color : ct.navy;

  const low = series.map((v, i) => +(v * (1 - BAND_PCT[i] * basePct)).toFixed(1));
  const high = series.map((v, i) => +(v * (1 + BAND_PCT[i] * basePct)).toFixed(1));

  const data: ChartData<'line'> = {
    labels: FISCAL_YEARS,
    datasets: [
      {
        label: 'High bound',
        data: high,
        borderColor: 'transparent',
        backgroundColor: `${color}1A`,
        pointRadius: 0,
        fill: '+1',
        tension: 0.35,
      },
      {
        label: 'Low bound',
        data: low,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        pointRadius: 0,
        fill: false,
        tension: 0.35,
      },
      {
        label: county ? `${county.name} revenue` : 'Statewide revenue',
        data: series,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: 'var(--card-bg)',
        pointBorderColor: color,
        pointBorderWidth: 2.5,
        fill: false,
        tension: 0.35,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
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
        displayColors: false,
        filter: (item) => item.datasetIndex === 2,
        callbacks: {
          label: (ctx) => {
            const idx = ctx.dataIndex;
            return [
              `Projected: $${series[idx]}M`,
              `Range: $${low[idx]}M – $${high[idx]}M`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'IBM Plex Mono', size: 11 }, color: ct.tick },
        border: { color: ct.tableBorder },
      },
      y: {
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
    <div className="chart-container" style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
