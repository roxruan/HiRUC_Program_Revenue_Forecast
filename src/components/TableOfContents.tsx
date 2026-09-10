import { useEffect, useMemo, useRef, useState } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLElement>;
  tabId: string;
}

const ROW_THRESHOLD = 12; // px — headings within this vertical distance are "same row"

export default function TableOfContents({ contentRef, tabId }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const tickingRef = useRef(false);

  // Scan the content container for h3 headings (rendered by SectionHeader)
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const scan = () => {
      const headings = Array.from(
        root.querySelectorAll<HTMLElement>('h3')
      ).filter((h) => h.offsetParent !== null); // skip hidden headings

      const found: TocItem[] = headings.map((h) => {
        if (!h.id) h.id = `toc-${Math.random().toString(36).slice(2, 9)}`;
        return { id: h.id, label: h.textContent?.trim() || '' };
      });

      setItems(found);
    };

    scan();
    // Re-scan on resize in case layout changes reveal/hide headings
    const ro = new ResizeObserver(scan);
    ro.observe(root);
    return () => ro.disconnect();
  }, [contentRef, tabId]);

  // Scrollspy — highlights all headings in the same visual row.
  // Each heading owns the region from its top to the next heading's top.
  // The active section is whichever region the viewport center falls in,
  // which correctly handles tall bottom sections (e.g. large data tables).
  useEffect(() => {
    const root = contentRef.current;
    if (!root || items.length === 0) return;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        const scrollY = window.scrollY;
        const viewport = window.innerHeight;
        const probe = scrollY + viewport * 0.4; // viewport center-ish

        // Gather (id, top) pairs for all items
        const positioned = items
          .map((item) => {
            const el = document.getElementById(item.id);
            if (!el) return null;
            return { id: item.id, top: el.getBoundingClientRect().top + scrollY };
          })
          .filter((p): p is { id: string; top: number } => p !== null);

        if (positioned.length === 0) return;

        // Find the last heading whose region contains the probe.
        // Region i spans [top[i], top[i+1]); the last spans [top[last], +inf).
        let activeTop = positioned[0].top;
        for (let i = 0; i < positioned.length; i++) {
          const top = positioned[i].top;
          const bottom = i < positioned.length - 1 ? positioned[i + 1].top : Infinity;
          if (probe >= top && probe < bottom) {
            activeTop = top;
            break;
          }
          // If probe is above the first heading, clamp to first
          if (i === 0 && probe < top) {
            activeTop = top;
            break;
          }
        }

        // Highlight every heading in the same visual row (within threshold)
        const next = new Set<string>();
        for (const p of positioned) {
          if (Math.abs(p.top - activeTop) <= ROW_THRESHOLD) next.add(p.id);
        }

        setActiveIds(next);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items, contentRef]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const scrollY = window.scrollY;
    const top = el.getBoundingClientRect().top + scrollY - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const memoItems = useMemo(() => items, [items]);

  // Only show if 2+ sections
  if (memoItems.length < 2) return null;

  return (
    <>
      {/* Desktop: sticky sidebar (right of content) */}
      <nav
        aria-label="On this page"
        className="hidden xl:flex flex-col gap-1 sticky self-start order-2"
        style={{
          top: 24,
          width: 200,
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center gap-1.5 font-body font-semibold uppercase tracking-wide mb-2"
          style={{ fontSize: 10.5, color: 'var(--secondary-text)', letterSpacing: '0.08em' }}
        >
          <List className="w-3 h-3" style={{ color: 'var(--pacific)' }} />
          On this page
        </div>
        <div className="flex flex-col gap-0.5">
          {memoItems.map((item) => {
            const active = activeIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="text-left font-body transition-all duration-150"
                style={{
                  fontSize: 12,
                  lineHeight: 1.4,
                  padding: '3px 0 3px 10px',
                  marginLeft: 0,
                  borderLeft: `2px solid ${active ? 'var(--pacific)' : 'var(--card-border)'}`,
                  color: active ? 'var(--primary-text)' : 'var(--secondary-text)',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile: horizontal scrollable pills (above content) */}
      <nav
        aria-label="On this page"
        className="xl:hidden order-1 -mx-6 sm:-mx-10 px-6 sm:px-10"
      >
        <div
          className="flex items-center gap-1.5 font-body font-semibold uppercase tracking-wide mb-2"
          style={{ fontSize: 10.5, color: 'var(--secondary-text)', letterSpacing: '0.08em' }}
        >
          <List className="w-3 h-3" style={{ color: 'var(--pacific)' }} />
          On this page
        </div>
        <div className="flex gap-2 overflow-x-auto toc-no-scrollbar pb-1">
          {memoItems.map((item) => {
            const active = activeIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="font-body whitespace-nowrap transition-all duration-150 flex-shrink-0"
                style={{
                  fontSize: 12,
                  padding: '4px 12px',
                  borderRadius: 999,
                  border: `1px solid ${active ? 'var(--pacific)' : 'var(--card-border)'}`,
                  background: active ? 'var(--pacific)' : 'var(--card-bg)',
                  color: active ? '#fff' : 'var(--secondary-text)',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
