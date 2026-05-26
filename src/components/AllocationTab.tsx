import { FE_CIVIL_TOPICS } from '../constants/feCivilTopics';
import type { TopicId } from '../constants/feCivilTopics';
import { TOPIC_COLORS } from '../constants/topicColors';
import type { Confidence } from '../types';

interface Props {
  confidence: Record<TopicId, Confidence>;
  allocations: number[];
  availableDays: number;
  blockedDates: string[];
  blockedWeekdays: boolean[];
  totalCalendarDays: number;
  minDays: number;
  exponent: number;
  hasExamDate: boolean;
  onSwitchToSetup: () => void;
}

function ComputeStep({ label, value, unit, note, accent }: { label: string; value: number; unit: string; note: string; accent?: boolean }) {
  return (
    <div className={`card-flat p-5 ${accent ? 'border-[var(--accent)]' : ''}`}>
      <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)] mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className={`font-display text-4xl font-medium tabular-nums ${accent ? 'text-[var(--accent)]' : ''}`}>{value}</div>
        <div className="font-mono text-xs text-[var(--ink-3)]">{unit}</div>
      </div>
      <div className="font-mono text-[10px] text-[var(--ink-3)] mt-2 leading-relaxed">{note}</div>
    </div>
  );
}

export function AllocationTab({ confidence, allocations, availableDays, blockedDates, blockedWeekdays, totalCalendarDays, minDays, exponent, hasExamDate, onSwitchToSetup }: Props) {
  if (!hasExamDate) {
    return (
      <div className="pt-20 pb-24 flex flex-col items-center text-center anim-in">
        <div className="font-display text-3xl font-medium mb-4 text-[var(--ink)]">No plan yet</div>
        <p className="text-[var(--ink-2)] text-sm mb-8 max-w-sm">
          Pick your exam date on the Configure tab to generate your study schedule.
        </p>
        <button className="btn btn-accent" onClick={onSwitchToSetup}>
          Go to Configure →
        </button>
      </div>
    );
  }

  const totalAllocated = allocations.reduce((a, b) => a + b, 0);
  const maxAllocation = Math.max(...allocations, 1);

  const sorted = FE_CIVIL_TOPICS.map((t, i) => ({
    topic: t,
    index: i,
    days: allocations[i],
    conf: confidence[t.id as TopicId] ?? 3,
    color: TOPIC_COLORS[i % TOPIC_COLORS.length],
  })).sort((a, b) => b.days - a.days);

  const blockedWeekdayCount = blockedWeekdays.filter(Boolean).length;

  return (
    <div className="space-y-12 pt-10 anim-in">
      <section>
        <div className="h-px bg-[var(--rule)] mb-4" />
        <h2 className="font-display text-3xl font-medium mb-6">Time per topic</h2>
        <div className="card p-6">
          {sorted.map(({ topic, index, days, conf, color }) => (
            <div key={index} className="py-2">
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-2 h-6 rounded-sm flex-shrink-0" style={{ background: color }} />
                  <div className="text-sm font-medium truncate">{topic.name}</div>
                  <span className="q-chip flex-shrink-0">{topic.qMin}–{topic.qMax}q</span>
                  <span className={`conf-pill active-${conf} flex-shrink-0`} style={{ width: 26, height: 26, minWidth: 26, fontSize: 11 }}>
                    {conf}
                  </span>
                </div>
                <div className="font-mono text-xs tabular-nums flex-shrink-0">
                  <span className="font-display text-2xl font-medium">{days}</span>
                  <span className="text-[var(--ink-3)] ml-1">days</span>
                  <span className="text-[var(--ink-3)] ml-2">· {((days / totalAllocated) * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(days / maxAllocation) * 100}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="h-px bg-[var(--rule)] mb-4" />
        <h2 className="font-display text-3xl font-medium mb-6">Days · weeks · months</h2>

        <div className="card overflow-hidden allocation-table-desktop overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--paper-2)]/50 border-b border-[var(--rule)]">
                <th className="text-left px-5 py-3 font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)]">Topic</th>
                <th className="text-center px-3 py-3 font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)]">Q range</th>
                <th className="text-center px-3 py-3 font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)]">Conf</th>
                <th className="text-right px-3 py-3 font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)]">Days</th>
                <th className="text-right px-3 py-3 font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)]">Weeks</th>
                <th className="text-right px-5 py-3 font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)]">Share</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(({ topic, index, days, conf, color }) => (
                <tr key={index} className="border-b border-[var(--rule-soft)] last:border-b-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-5 rounded-sm" style={{ background: color }} />
                      <span>{topic.name}</span>
                    </div>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span className="q-chip">{topic.qMin}–{topic.qMax}q</span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span className={`conf-pill active-${conf}`} style={{ width: 26, height: 26, minWidth: 26, fontSize: 11 }}>
                      {conf}
                    </span>
                  </td>
                  <td className="text-right px-3 py-3 font-mono tabular-nums">{days}</td>
                  <td className="text-right px-3 py-3 font-mono tabular-nums text-[var(--ink-3)]">{(days / 7).toFixed(1)}</td>
                  <td className="text-right px-5 py-3 font-mono tabular-nums text-[var(--ink-3)]">
                    {((days / totalAllocated) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="bg-[var(--paper-2)]/40 font-medium">
                <td className="px-5 py-3 font-display" colSpan={3}>Total</td>
                <td className="text-right px-3 py-3 font-mono tabular-nums">{totalAllocated}</td>
                <td className="text-right px-3 py-3 font-mono tabular-nums">{(totalAllocated / 7).toFixed(1)}</td>
                <td className="text-right px-5 py-3 font-mono tabular-nums">100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="allocation-table-mobile space-y-2">
          {sorted.map(({ topic, index, days, conf, color }) => (
            <div key={index} className="card-flat p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 rounded-sm" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{topic.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="q-chip">{topic.qMin}–{topic.qMax}q</span>
                    <span className={`conf-pill active-${conf}`} style={{ width: 22, height: 22, minWidth: 22, fontSize: 10 }}>{conf}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl tabular-nums">{days}</div>
                  <div className="font-mono text-[10px] text-[var(--ink-3)]">days · {((days / totalAllocated) * 100).toFixed(0)}%</div>
                </div>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(days / maxAllocation) * 100}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="h-px bg-[var(--rule)] mb-4" />
        <h2 className="font-display text-3xl font-medium mb-4">How the schedule was computed</h2>
        <div className="card-flat p-4 mb-6 font-mono text-[11px] text-[var(--ink-2)] leading-relaxed">
          <strong>Weight formula:</strong> weight = qMid × (6 − confidence)^{exponent}<br/>
          where qMid is the midpoint of each topic's NCEES question range, and confidence is your 1–5 rating.<br/>
          Weaker topics (lower confidence) <em>and</em> higher-question-count topics get proportionally more study days.<br/>
          Minimum {minDays} day{minDays !== 1 ? 's' : ''} guaranteed per topic.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ComputeStep label="Calendar window" value={totalCalendarDays} unit="days" note="From start date to exam date" />
          <ComputeStep
            label="Subtracted"
            value={Math.max(0, totalCalendarDays - availableDays)}
            unit="days"
            note={`${blockedWeekdayCount} recurring day${blockedWeekdayCount !== 1 ? 's' : ''}/week + ${blockedDates.length} specific date${blockedDates.length !== 1 ? 's' : ''}`}
          />
          <ComputeStep label="Available" value={availableDays} unit="days" note="Distributed by qMid × gap² weighting" accent />
        </div>
      </section>

      <section className="no-print">
        <button className="btn" onClick={() => window.print()}>Print plan</button>
      </section>
    </div>
  );
}
