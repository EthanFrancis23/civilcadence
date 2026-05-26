import { TOPIC_COLORS } from '../constants/topicColors';
import { FE_CIVIL_TOPICS } from '../constants/feCivilTopics';
import type { Schedule } from '../types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

interface Props {
  year: number;
  month: number;
  schedule: Schedule;
  blockedWeekdays: boolean[];
  blockedDates: string[];
  startDate: string;
  examDate: string;
  today: string;
}

export function MonthGrid({ year, month, schedule, blockedWeekdays, blockedDates, startDate, examDate, today }: Props) {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blockedSet = new Set(blockedDates);

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  const monthStudyDays = cells.reduce((acc: number, d) => {
    if (!d) return acc;
    const iso = toISO(year, month, d);
    return schedule[iso] ? acc + 1 : acc;
  }, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-xl font-medium">
          {MONTH_NAMES[month]} <span className="font-mono text-sm text-[var(--ink-3)]">{year}</span>
        </h3>
        <div className="font-mono text-[10px] text-[var(--ink-3)] tracked-wide uppercase">
          {monthStudyDays} study days
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="font-mono text-[9px] tracked-wide uppercase text-[var(--ink-3)] text-center pb-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="cal-day empty" />;
          const iso = toISO(year, month, d);
          const inRange = iso >= startDate && iso <= examDate;
          const dow = new Date(year, month, d).getDay();
          const blocked = blockedWeekdays[dow] || blockedSet.has(iso);
          const session = schedule[iso];
          const past = iso < today;
          const isToday = iso === today;
          const isExam = iso === examDate;

          if (!inRange) {
            return (
              <div key={i} className="cal-day" style={{ opacity: 0.25 }}>
                <span className="day-num">{d}</span>
              </div>
            );
          }

          if (isExam) {
            return (
              <div key={i} className="cal-day"
                style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)', boxShadow: isToday ? 'inset 0 0 0 2px var(--accent)' : undefined }}
                title="Exam day">
                <span className="day-num">{d}</span>
                <span className="topic-tag">EXAM</span>
              </div>
            );
          }

          if (blocked) {
            return (
              <div key={i} className={`cal-day blocked${past ? ' past' : ''}${isToday ? ' today' : ''}`}>
                <span className="day-num">{d}</span>
                <span className="topic-tag">off</span>
              </div>
            );
          }

          if (session != null) {
            const color = TOPIC_COLORS[session.topicIndex % TOPIC_COLORS.length];
            const topic = FE_CIVIL_TOPICS[session.topicIndex];
            return (
              <div key={i}
                className={`cal-day studied${past ? ' past' : ''}${isToday ? ' today' : ''}`}
                style={{ background: color, borderColor: color }}
                title={`${topic.name} · session ${session.sessionNumber}/${session.totalSessions}`}>
                <span className="day-num">{d}</span>
                <span className="topic-tag">{topic.name.slice(0, 12)}{topic.name.length > 12 ? '…' : ''}</span>
              </div>
            );
          }

          return (
            <div key={i} className={`cal-day${past ? ' past' : ''}${isToday ? ' today' : ''}`}>
              <span className="day-num">{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
