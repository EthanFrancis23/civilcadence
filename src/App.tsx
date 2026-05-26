import { useState, useEffect, useMemo } from 'react';
import { FE_CIVIL_TOPICS } from './constants/feCivilTopics';
import type { TopicId } from './constants/feCivilTopics';
import { loadState, saveState, defaultState } from './lib/persistence';
import { calculateAvailableDates, calculateAllocation, buildSchedule } from './lib/allocator';
import { daysBetween, todayISO } from './lib/dates';
import { decodePlan } from './lib/share';
import { Header } from './components/Header';
import { Nav } from './components/Nav';
import { SetupTab } from './components/SetupTab';
import { ScheduleTab } from './components/ScheduleTab';
import { AllocationTab } from './components/AllocationTab';
import type { PlanState } from './types';

export default function App() {
  const [state, setState] = useState<PlanState>(() => loadState() ?? defaultState());

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#p=')) {
      const encoded = hash.slice(3);
      const decoded = decodePlan(encoded);
      if (decoded) {
        const confirmed = window.confirm('Load shared plan? This will replace your current plan.');
        if (confirmed) {
          setState(decoded);
        }
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  useEffect(() => { saveState(state); }, [state]);

  const update = (patch: Partial<PlanState>) => setState(s => ({ ...s, ...patch }));

  const topicInputs = FE_CIVIL_TOPICS.map(t => ({
    confidence: (state.confidence[t.id as TopicId] ?? 3) as 1|2|3|4|5,
    qMin: t.qMin,
    qMax: t.qMax,
  }));

  const availableDates = useMemo(
    () => state.examDate
      ? calculateAvailableDates(state.startDate, state.examDate, Array.from(state.blockedWeekdays), state.blockedDates)
      : [],
    [state.startDate, state.examDate, state.blockedWeekdays, state.blockedDates]
  );

  const allocations = useMemo(
    () => calculateAllocation(topicInputs, availableDates.length, state.minDays, state.exponent, true),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.confidence, availableDates.length, state.minDays, state.exponent]
  );

  const schedule = useMemo(
    () => buildSchedule(topicInputs, allocations, availableDates),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allocations, availableDates]
  );

  const totalCalendarDays = state.examDate ? daysBetween(state.startDate, state.examDate) : 0;
  const examInDays = state.examDate ? daysBetween(todayISO(), state.examDate) : null;

  return (
    <div className="min-h-screen">
      <Header
        examDate={state.examDate}
        examInDays={examInDays}
        availableDays={availableDates.length}
        totalCalendarDays={totalCalendarDays}
        hasExamDate={state.examDate !== null}
      />
      <Nav active={state.activeTab} onChange={t => update({ activeTab: t })} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {state.activeTab === 'setup' && (
          <SetupTab state={state} update={update} availableCount={availableDates.length} />
        )}
        {state.activeTab === 'schedule' && (
          <ScheduleTab
            state={state}
            schedule={schedule}
            availableDates={availableDates}
            allocations={allocations}
            onSwitchToSetup={() => update({ activeTab: 'setup' })}
          />
        )}
        {state.activeTab === 'allocation' && (
          <AllocationTab
            confidence={state.confidence}
            allocations={allocations}
            availableDays={availableDates.length}
            blockedDates={state.blockedDates}
            blockedWeekdays={Array.from(state.blockedWeekdays)}
            totalCalendarDays={totalCalendarDays}
            minDays={state.minDays}
            exponent={state.exponent}
            hasExamDate={state.examDate !== null}
            onSwitchToSetup={() => update({ activeTab: 'setup' })}
          />
        )}
      </main>
      <footer className="border-t border-stone-300/60 bg-[var(--paper-2)]/40 py-6 mt-12 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)]">
            Auto-saved to this browser · Data never leaves your device
          </div>
          <button
            className="btn-ghost font-mono text-[11px] tracked-wide uppercase"
            onClick={() => { if (confirm('Reset all settings and start over?')) setState(defaultState()); }}
          >
            ↺ Reset
          </button>
        </div>
      </footer>
    </div>
  );
}
