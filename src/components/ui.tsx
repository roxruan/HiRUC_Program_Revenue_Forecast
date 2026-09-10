import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      className={`rounded-[14px] border ${className}`}
      style={{
        padding: 22,
        background: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  desc?: string;
  right?: ReactNode;
}

export function SectionHeader({ title, desc, right }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 className="font-display font-semibold text-[17px] leading-tight" style={{ color: 'var(--primary-text)' }}>{title}</h3>
        {desc && <p className="font-body text-[12.5px] mt-1 leading-relaxed" style={{ color: 'var(--secondary-text)' }}>{desc}</p>}
      </div>
      {right}
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}

export function KPICard({ label, value, sub, valueColor }: KPICardProps) {
  return (
    <div className="rounded-[14px] border" style={{ padding: '18px 20px', background: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
      <div className="font-body text-[11.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--secondary-text)' }}>
        {label}
      </div>
      <div
        className="font-display font-bold mt-1.5 leading-none"
        style={{ fontSize: 30, color: valueColor || 'var(--primary-text)' }}
      >
        {value}
      </div>
      {sub && <div className="font-body text-[12px] mt-1.5" style={{ color: 'var(--secondary-text)' }}>{sub}</div>}
    </div>
  );
}

interface ModelNoteProps {
  children: ReactNode;
}

export function ModelNote({ children }: ModelNoteProps) {
  return (
    <div className="mt-4 rounded-[10px] border px-3.5 py-3 font-body text-[12px] leading-relaxed" style={{ background: 'var(--note-bg)', borderColor: 'var(--note-border)', color: 'var(--note-text)' }}>
      <span className="font-semibold" style={{ color: 'var(--pacific)' }}>Model note. </span>
      {children}
    </div>
  );
}

interface PillToggleProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}

export function PillToggle({ options, value, onChange }: PillToggleProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="rounded-full font-body font-semibold text-[12.5px] px-[18px] py-2 border transition-all whitespace-nowrap"
            style={{
              background: active ? 'var(--toggle-active-bg)' : 'var(--toggle-inactive-bg)',
              color: active ? 'var(--toggle-active-text)' : 'var(--toggle-inactive-text)',
              borderColor: active ? 'var(--toggle-active-border)' : 'var(--toggle-inactive-border)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
