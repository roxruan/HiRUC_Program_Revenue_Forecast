import { useRef, useState } from 'react';
import '@/chartSetup';
import Header, { type TabId } from '@/components/Header';
import TableOfContents from '@/components/TableOfContents';
import RevenueForecastTab from '@/tabs/RevenueForecastTab';
import LongTermForecastTab from '@/tabs/LongTermForecastTab';
import RevenueDriversTab from '@/tabs/RevenueDriversTab';
import ScenariosTab from '@/tabs/ScenariosTab';
import MethodologyTab from '@/tabs/MethodologyTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('forecast');
  const contentRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen" style={{ background: 'var(--page-bg)' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-[1400px] mx-auto px-6 sm:px-10 py-8">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          <TableOfContents contentRef={contentRef} tabId={activeTab} />
          <section ref={contentRef} className="flex-1 min-w-0">
            {activeTab === 'forecast' && <RevenueForecastTab />}
            {activeTab === 'longterm' && <LongTermForecastTab />}
            {activeTab === 'drivers' && <RevenueDriversTab />}
            {activeTab === 'scenarios' && <ScenariosTab />}
            {activeTab === 'methodology' && <MethodologyTab />}
          </section>
        </div>
      </main>

      <footer className="max-w-[1400px] mx-auto px-6 sm:px-10 py-6 pb-10">
        <a href="https://hiruc.org/" target="_blank" rel="noopener noreferrer" className="font-body text-[11.5px] font-semibold inline-block mb-3 transition-opacity hover:opacity-70" style={{ color: 'var(--pacific)' }}>
          HiRUC website
        </a>
        <p className="font-body text-[11.5px] leading-relaxed" style={{ color: 'var(--secondary-text)', maxWidth: 900 }}>
          <span className="font-semibold" style={{ color: 'var(--pacific)' }}>Data source:</span> Revenue figures are derived from the HDOT AFV Report, covering actual HIRUC collections (FY2026, Jul 2025–Jun 2026) and program enrollment forecasts (FY2027–FY2040). Fee-type breakdowns, county distributions, and vehicle class data are sourced from the same report. Forecast projections assume current fee rates remain constant.
        </p>
        <div className="font-body text-[11.5px] leading-relaxed mt-3" style={{ color: 'var(--secondary-text)', maxWidth: 900 }}>
          <span className="font-semibold" style={{ color: 'var(--pacific)' }}>Project developed by:</span> Caleb Lau, Roxane Ruan<br />
          Planning, Programming, &amp; Budgeting Department<br />
          Hawai'i Department of Transportation
        </div>
      </footer>
    </div>
  );
}
