import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  accent?: 'pacific' | 'reef' | 'lava' | 'gold';
}

const accentMap = {
  pacific: { bg: '#2C4A6B', soft: '#E2EAF0' },
  reef: { bg: '#3D6B8E', soft: '#E2EAF0' },
  lava: { bg: '#B5563B', soft: '#F7ECE8' },
  gold: { bg: '#5B8BAE', soft: '#E2EAF0' },
};

export default function KpiCard({
  label,
  value,
  sublabel,
  trend,
  trendLabel,
  accent = 'pacific',
}: KpiCardProps) {
  const colors = accentMap[accent];
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className="relative overflow-hidden rounded-[14px] p-5 transition-all duration-200"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ background: colors.bg }}
      />

      <p className="font-body text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--secondary-text)' }}>
        {label}
      </p>
      <p className="font-display font-bold text-2xl leading-none mb-2" style={{ color: 'var(--primary-text)' }}>
        {value}
      </p>
      {sublabel && (
        <p className="font-body text-[11px]" style={{ color: 'var(--secondary-text)' }}>{sublabel}</p>
      )}
      {trend && trendLabel && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-data font-medium"
            style={{
              background: colors.soft,
              color: colors.bg,
            }}
          >
            <TrendIcon className="w-3 h-3" />
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 h-full">{children}</div>;
}
