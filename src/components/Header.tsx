import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/theme';
export type TabId = 'forecast' | 'longterm' | 'drivers' | 'scenarios' | 'methodology';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; num: string; label: string }[] = [
  { id: 'forecast', num: '01', label: 'Current Revenue Forecast' },
  { id: 'longterm', num: '02', label: 'Long-Term Revenue Forecast' },
  { id: 'drivers', num: '03', label: 'Scenario Modeling' },
  { id: 'scenarios', num: '04', label: 'Vehicle Class Attribution' },
  { id: 'methodology', num: '05', label: 'Revenue Allocations' },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="w-full"
      style={{
        background: 'var(--header-bg)',
        color: 'white',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-7 pb-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div
              className="font-data"
              style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--header-eyebrow)', fontWeight: 500 }}
            >
              HAWAI'I DEPARTMENT OF TRANSPORTATION — PROTOTYPE
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <h1 className="font-display font-extrabold" style={{ fontSize: 32, lineHeight: 1.1 }}>
                HiRUC Program Revenue Forecast
              </h1>
              <span
                className="font-data"
                style={{
                  background: 'var(--header-badge-bg)',
                  color: 'var(--header-badge-text)',
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                }}
              >
                AFV REPORT DATA
              </span>
            </div>
            <p
              className="font-body mt-2"
              style={{ fontSize: 13.5, color: 'var(--header-subtitle)', maxWidth: 720, lineHeight: 1.5 }}
            >
              An internal planning dashboard projecting Road Usage Charge revenue across Hawai'i's counties, vehicle classes, and HDOT highway districts through FY2033.
            </p>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0"
            style={{
              width: 40,
              height: 40,
              border: '1px solid rgba(168,196,216,0.3)',
              background: theme === 'dark' ? 'rgba(168,196,216,0.08)' : 'rgba(255,255,255,0.08)',
            }}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" style={{ color: '#A8C4D8' }} />
            ) : (
              <Sun className="w-5 h-5" style={{ color: '#E0AA4E' }} />
            )}
          </button>
        </div>
      </div>
      <nav className="max-w-[1400px] mx-auto px-6 sm:px-10 pb-5 pt-3">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center gap-2.5 transition-all rounded-full"
                style={{
                  padding: '8px 16px 8px 8px',
                  border: `1px solid ${active ? 'var(--active-tab-border)' : 'rgba(255,255,255,0.18)'}`,
                  background: active ? 'var(--active-tab-bg)' : 'transparent',
                }}
              >
                <span
                  className="flex items-center justify-center flex-shrink-0 rounded-full font-data"
                  style={{
                    width: 26,
                    height: 26,
                    fontSize: 11,
                    fontWeight: 600,
                    border: `1.5px solid ${active ? 'var(--active-tab-num-bg)' : 'var(--inactive-tab-num-border)'}`,
                    background: active ? 'var(--active-tab-num-bg)' : 'transparent',
                    color: active ? 'var(--active-tab-num-text)' : 'var(--inactive-tab-num-text)',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {tab.num}
                </span>
                <span
                  className="font-body"
                  style={{
                    fontWeight: active ? 600 : 500,
                    fontSize: 13,
                    color: active ? 'var(--active-tab-text)' : 'var(--inactive-tab-text)',
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
