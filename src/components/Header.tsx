import { fromISO } from '../lib/dates';

interface Props {
  examDate: string;
  examInDays: number;
  availableDays: number;
  totalCalendarDays: number;
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--paper)] px-5 py-4 relative">
      <div className="corner-mark" />
      <div className="font-mono text-[9px] tracked-wide uppercase text-[var(--ink-3)] mb-1">{label}</div>
      <div className="font-mono text-2xl font-medium tabular-nums">{value}</div>
    </div>
  );
}

export function Header({ examDate, examInDays, availableDays, totalCalendarDays }: Props) {
  const examDateObj = fromISO(examDate);
  const examFmt = examDateObj.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <header className="border-b border-stone-300/60 bg-[var(--paper-2)]/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-baseline justify-between flex-wrap gap-6">
          <div>
            <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)] mb-2">
              Fundamentals of Engineering · Examination Preparation
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-medium leading-none tracking-tight">
              Civil<span className="text-[var(--accent)]">Cadence</span>
            </h1>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)] mb-2">
              Days until exam
            </div>
            <div className="font-display text-6xl md:text-7xl font-medium leading-none tabular-nums">
              {examInDays >= 0 ? examInDays : '—'}
            </div>
            <div className="font-mono text-[11px] text-[var(--ink-2)] mt-2">{examFmt}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-10 bg-[var(--rule)] border border-[var(--rule)]">
          <StatBlock label="Available study days" value={availableDays} />
          <StatBlock label="Calendar days remaining" value={Math.max(0, totalCalendarDays)} />
          <StatBlock label="Weeks" value={(availableDays / 7).toFixed(1)} />
          <StatBlock label="Knowledge areas" value={14} />
        </div>
      </div>
    </header>
  );
}
