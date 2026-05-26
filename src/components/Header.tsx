import { fromISO } from '../lib/dates';

interface Props {
  examDate: string | null;
  examInDays: number | null;
  availableDays: number;
  totalCalendarDays: number;
  hasExamDate: boolean;
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

export function Header({ examDate, examInDays, availableDays, totalCalendarDays, hasExamDate }: Props) {
  const examFmt = examDate
    ? fromISO(examDate).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
    : null;

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
            {hasExamDate ? (
              <>
                <div className="font-display text-6xl md:text-7xl font-medium leading-none tabular-nums">
                  {examInDays !== null && examInDays >= 0 ? examInDays : '—'}
                </div>
                <div className="font-mono text-[11px] text-[var(--ink-2)] mt-2">{examFmt}</div>
              </>
            ) : (
              <div className="font-display text-2xl font-medium text-[var(--ink-3)] mt-1">
                Set your exam date below ↓
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-10 bg-[var(--rule)] border border-[var(--rule)]">
          <StatBlock label="Available study days" value={hasExamDate ? availableDays : '—'} />
          <StatBlock label="Calendar days remaining" value={hasExamDate ? Math.max(0, totalCalendarDays) : '—'} />
          <StatBlock label="Weeks" value={hasExamDate ? (availableDays / 7).toFixed(1) : '—'} />
          <StatBlock label="Knowledge areas" value={hasExamDate ? 14 : '—'} />
        </div>
      </div>
    </header>
  );
}
