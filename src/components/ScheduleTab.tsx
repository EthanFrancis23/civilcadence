import { useMemo, useState } from 'react';
import { fromISO, todayISO, daysBetween } from '../lib/dates';
import { FE_CIVIL_TOPICS } from '../constants/feCivilTopics';
import { TOPIC_COLORS } from '../constants/topicColors';
import { MonthGrid } from './MonthGrid';
import { ShareDialog } from './ShareDialog';
import { downloadICS } from '../lib/ics';
import { encodePlan } from '../lib/share';
import type { PlanState, Schedule } from '../types';

function TopicLegend({ allocations }: { allocations: number[] }) {
  return (
    <div className="card-flat p-4">
      <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)] mb-3">Topic legend</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-xs">
        {FE_CIVIL_TOPICS.map((t, i) => (
          <div key={t.id} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: TOPIC_COLORS[i % TOPIC_COLORS.length] }} />
            <span className="truncate flex-1 text-xs">{t.name}</span>
            <span className="q-chip">{t.qMin}–{t.qMax}q</span>
            <span className="font-mono text-[10px] text-[var(--ink-3)] tabular-nums">{allocations[i]}d</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  state: PlanState;
  schedule: Schedule;
  availableDates: string[];
  allocations: number[];
}

export function ScheduleTab({ state, schedule, availableDates, allocations }: Props) {
  const today = todayISO();
  const [showShare, setShowShare] = useState(false);

  const upcoming = availableDates.filter(d => d >= today).slice(0, 7);

  const months = useMemo(() => {
    if (!state.startDate || !state.examDate) return [];
    const startD = fromISO(state.startDate);
    const endD = fromISO(state.examDate);
    const ms: { year: number; month: number }[] = [];
    let y = startD.getFullYear();
    let m = startD.getMonth();
    while (y < endD.getFullYear() || (y === endD.getFullYear() && m <= endD.getMonth())) {
      ms.push({ year: y, month: m });
      m++;
      if (m > 11) { m = 0; y++; }
    }
    return ms;
  }, [state.startDate, state.examDate]);

  const shareUrl = `${window.location.origin}${window.location.pathname}#p=${encodePlan(state)}`;

  return (
    <div className="space-y-12 pt-10 anim-in">
      <section>
        <div className="flex items-baseline gap-6 mb-2">
          <span className="font-mono text-[11px] tracked-wide uppercase text-[var(--accent)]">Up next</span>
          <div className="flex-1 h-px bg-[var(--rule)]" />
        </div>
        <h2 className="font-display text-3xl font-medium mb-6">The next seven study sessions</h2>

        <div className="flex gap-3 mb-6 flex-wrap no-print">
          <button className="btn" onClick={() => downloadICS(schedule)}>
            ↓ Download .ics
          </button>
          <button className="btn" onClick={() => setShowShare(true)}>
            ↗ Share plan
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="card p-6 font-mono text-sm text-[var(--ink-3)]">
            No upcoming study sessions. Either the exam has passed or no available dates were found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {upcoming.map((date) => {
              const session = schedule[date];
              const topic = session ? FE_CIVIL_TOPICS[session.topicIndex] : null;
              const color = session ? TOPIC_COLORS[session.topicIndex % TOPIC_COLORS.length] : '#999';
              const dObj = fromISO(date);
              const isToday = date === today;
              return (
                <div key={date} className="card-flat p-4 relative overflow-hidden"
                  style={isToday ? { boxShadow: 'inset 0 0 0 2px var(--accent)' } : undefined}>
                  <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)] mb-1">
                    {dObj.toLocaleDateString('en-US', { weekday: 'short' })} · {dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="font-display text-3xl font-medium mb-3 tabular-nums">
                    {isToday ? 'Today' : `+${daysBetween(today, date)}d`}
                  </div>
                  {topic && (
                    <>
                      <div className="h-1 w-full rounded-full mb-2" style={{ background: color }} />
                      <div className="text-xs font-medium leading-tight">{topic.name}</div>
                      <div className="font-mono text-[10px] text-[var(--ink-3)] mt-2">
                        Session {session!.sessionNumber}/{session!.totalSessions}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline gap-6 mb-2">
          <span className="font-mono text-[11px] tracked-wide uppercase text-[var(--accent)]">Calendar</span>
          <div className="flex-1 h-px bg-[var(--rule)]" />
        </div>
        <h2 className="font-display text-3xl font-medium mb-6">Full study plan</h2>
        <TopicLegend allocations={allocations} />
        <div className="space-y-10 mt-8">
          {months.map(({ year, month }) => (
            <MonthGrid
              key={`${year}-${month}`}
              year={year}
              month={month}
              schedule={schedule}
              blockedWeekdays={Array.from(state.blockedWeekdays)}
              blockedDates={state.blockedDates}
              startDate={state.startDate}
              examDate={state.examDate}
              today={today}
            />
          ))}
        </div>
      </section>

      {showShare && <ShareDialog url={shareUrl} onClose={() => setShowShare(false)} />}
    </div>
  );
}
