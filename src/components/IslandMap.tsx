import { useState } from 'react';
import { COUNTIES, type CountyId } from '@/data';

interface IslandMapProps {
  selectedCounty: CountyId | null;
  onSelectCounty: (id: CountyId) => void;
}

interface IslandShape {
  countyId: CountyId;
  ellipses: { cx: number; cy: number; rx: number; ry: number; rotate?: number }[];
  labelX: number;
  labelY: number;
}

// Islands arranged NW (top-left) to SE (bottom-right)
const ISLANDS: IslandShape[] = [
  {
    countyId: 'kauai',
    ellipses: [{ cx: 130, cy: 95, rx: 38, ry: 26 }],
    labelX: 130,
    labelY: 95,
  },
  {
    countyId: 'oahu',
    ellipses: [{ cx: 250, cy: 130, rx: 52, ry: 28 }],
    labelX: 250,
    labelY: 130,
  },
  {
    countyId: 'maui',
    ellipses: [
      { cx: 360, cy: 175, rx: 34, ry: 22 },
      { cx: 395, cy: 158, rx: 18, ry: 13 },
      { cx: 335, cy: 162, rx: 16, ry: 11 },
    ],
    labelX: 372,
    labelY: 178,
  },
  {
    countyId: 'hawaii',
    ellipses: [
      { cx: 465, cy: 225, rx: 48, ry: 32 },
      { cx: 495, cy: 248, rx: 22, ry: 16 },
    ],
    labelX: 470,
    labelY: 228,
  },
];

export default function IslandMap({ selectedCounty, onSelectCounty }: IslandMapProps) {
  const [hoverCounty, setHoverCounty] = useState<CountyId | null>(null);

  return (
    <div>
      <svg viewBox="0 0 580 310" className="w-full h-auto">
        {/* Ocean background */}
        <defs>
          <radialGradient id="oceanGrad" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="var(--ocean-bg)" />
            <stop offset="100%" stopColor="var(--ocean-bg2)" />
          </radialGradient>
          {COUNTIES.map((c) => (
            <radialGradient key={c.id} id={`grad-${c.id}`} cx="40%" cy="35%" r="75%">
              <stop offset="0%" stopColor={c.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0.72" />
            </radialGradient>
          ))}
        </defs>

        <rect width="580" height="310" fill="url(#oceanGrad)" rx="14" />

        {/* Compass / decorative */}
        <g opacity="0.25" stroke="var(--pacific)" fill="none" strokeWidth="0.8">
          <circle cx="540" cy="30" r="14" />
          <path d="M540,18 L540,42 M528,30 L552,30" />
          <text x="540" y="16" textAnchor="middle" fontSize="8" fill="var(--pacific)" fontFamily="IBM Plex Mono">N</text>
        </g>

        {/* Islands */}
        {ISLANDS.map((island) => {
          const county = COUNTIES.find((c) => c.id === island.countyId)!;
          const isSelected = selectedCounty === island.countyId;
          const isHovered = hoverCounty === island.countyId;
          const isOther = selectedCounty !== null && !isSelected;

          return (
            <g
              key={island.countyId}
              onClick={() => onSelectCounty(island.countyId)}
              onMouseEnter={() => setHoverCounty(island.countyId)}
              onMouseLeave={() => setHoverCounty(null)}
              className="cursor-pointer transition-all duration-200"
              style={{
                opacity: isOther ? 0.4 : 1,
                filter: isSelected
                  ? `drop-shadow(0 0 10px ${county.color}66)`
                  : isHovered
                  ? `drop-shadow(0 2px 6px ${county.color}44)`
                  : 'none',
              }}
            >
              {island.ellipses.map((e, i) => (
                <ellipse
                  key={i}
                  cx={e.cx}
                  cy={e.cy}
                  rx={e.rx}
                  ry={e.ry}
                  fill={`url(#grad-${island.countyId})`}
                  stroke={isSelected ? county.color : 'rgba(26,43,60,0.15)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  transform={e.rotate ? `rotate(${e.rotate} ${e.cx} ${e.cy})` : undefined}
                  style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }}
                />
              ))}
              {/* Label */}
              <text
                x={island.labelX}
                y={island.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontFamily="Poppins"
                fontWeight="600"
                fill={isSelected ? '#FFFFFF' : '#FFFFFF'}
                style={{ pointerEvents: 'none' }}
                className="select-none"
              >
                {county.shortName}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-4">
        {COUNTIES.map((c) => {
          const isSelected = selectedCounty === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCounty(c.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 ${
                isSelected ? 'scale-105' : 'hover:scale-[1.03]'
              }`}
              style={{
                background: isSelected ? c.color : 'var(--legend-inactive-bg)',
                color: isSelected ? '#FFFFFF' : 'var(--legend-inactive-text)',
                border: `1px solid ${isSelected ? c.color : 'var(--card-border)'}`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: isSelected ? '#FFFFFF' : c.color }}
              />
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
