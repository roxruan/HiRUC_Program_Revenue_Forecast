import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hiruc-theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hiruc-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// ── Chart theme helpers ─────────────────────────────────────────────

interface ChartTheme {
  navy: string;
  gold: string;
  fuelTax: string;
  grid: string;
  tick: string;
  tooltipBg: string;
  tooltipTitle: string;
  tooltipBody: string;
  legendText: string;
  tableHeader: string;
  tableBorder: string;
}

export function useChartTheme(): ChartTheme {
  const { theme } = useTheme();

  if (theme === 'dark') {
    return {
      navy: '#4C7FB0',
      gold: '#E0AA4E',
      fuelTax: '#6B7F94',
      grid: 'rgba(255,255,255,0.06)',
      tick: '#7C8CA0',
      tooltipBg: '#16212F',
      tooltipTitle: '#DCE8F5',
      tooltipBody: '#F1F5F9',
      legendText: '#93A4B8',
      tableHeader: '#7C8CA0',
      tableBorder: '#2A3B4D',
    };
  }

  return {
    navy: '#2C4A6B',
    gold: '#C99A3E',
    fuelTax: '#8A9BA8',
    grid: '#D0DCE540',
    tick: '#1A2B3C99',
    tooltipBg: '#1A2B3C',
    tooltipTitle: '#A8C4D8',
    tooltipBody: '#FFFFFF',
    legendText: '#1A2B3C',
    tableHeader: '#1A2B3C99',
    tableBorder: '#D0DCE5',
  };
}
