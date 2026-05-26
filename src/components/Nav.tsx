interface Props {
  active: 'setup' | 'schedule' | 'allocation';
  onChange: (tab: 'setup' | 'schedule' | 'allocation') => void;
}

const TABS = [
  { id: 'setup' as const, label: '01 · Configure' },
  { id: 'schedule' as const, label: '02 · Schedule' },
  { id: 'allocation' as const, label: '03 · Allocation' },
];

export function Nav({ active, onChange }: Props) {
  return (
    <nav className="border-b border-stone-300/60 sticky top-0 z-10 bg-[var(--paper)]/95 backdrop-blur-md no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-6 sm:gap-10">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${active === t.id ? 'active' : ''}`}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
