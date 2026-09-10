import { COUNTIES } from '@/data/forecast';

interface IslandMapProps {
  selectedCounty: string | null;
  onSelect: (id: string) => void;
}

const ISLANDS = [
  { id: 'kauai', cx: 90, cy: 70, rx: 28, ry: 18, label: "Kaua'i", countyId: 'kauai' },
  { id: 'oahu', cx: 175, cy: 105, rx: 34, ry: 20, label: "O'ahu", countyId: 'oahu' },
  { id: 'maui', cx: 265, cy: 150, rx: 30, ry: 17, label: 'Maui', countyId: 'maui' },
  { id: 'molokai', cx: 235, cy: 125, rx: 24, ry: 10, label: "Moloka'i", countyId: 'maui' },
  { id: 'lanai', cx: 250, cy: 165, rx: 14, ry: 10, label: "Lana'i", countyId: 'maui' },
  { id: 'hawaii', cx: 340, cy: 210, rx: 45, ry: 28, label: "Hawai'i", countyId: 'hawaii' },
];

export function IslandMap({ selectedCounty, onSelect }: IslandMapProps) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 420 270" style={{ width: '100%', maxWidth: 420, height: 'auto' }}>
        <rect x="0" y="0" width="420" height="270" fill="var(--ocean-bg)" rx="12" />
        <path d="M0,40 Q210,30 420,50" stroke="var(--card-border)" strokeWidth="1" fill="none" />
        <path d="M0,230 Q210,240 420,220" stroke="var(--card-border)" strokeWidth="1" fill="none" />
        {ISLANDS.map((isl) => {
          const county = COUNTIES.find((c) => c.id === isl.countyId)!;
          const active = selectedCounty === isl.countyId;
          return (
            <g key={isl.id} onClick={() => onSelect(isl.countyId)} style={{ cursor: 'pointer' }}>
              <ellipse
                cx={isl.cx}
                cy={isl.cy}
                rx={isl.rx}
                ry={isl.ry}
                fill={active ? county.color : `${county.color}b0`}
                stroke={active ? 'var(--pacific)' : 'transparent'}
                strokeWidth={active ? 2 : 0}
                style={{ transition: 'all 0.2s ease' }}
              />
            </g>
          );
        })}
        {ISLANDS
          .filter((isl) => isl.id !== 'molokai' && isl.id !== 'lanai')
          .map((isl) => {
            const active = selectedCounty === isl.countyId;
            return (
              <text
                key={isl.id}
                x={isl.cx}
                y={isl.cy + 4}
                textAnchor="middle"
                style={{
                  fontFamily: 'Inter',
                  fontSize: 11,
                  fontWeight: 600,
                  fill: 'white',
                  pointerEvents: 'none',
                  opacity: active ? 1 : 0.9,
                }}
              >
                {isl.label}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
