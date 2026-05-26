import type { ReactNode } from 'react';
import { FE_CIVIL_TOPICS } from '../constants/feCivilTopics';
import type { TopicId } from '../constants/feCivilTopics';
import type { PlanState, Confidence } from '../types';
import { TopicRow } from './TopicRow';
import { BlockedDatesEditor } from './BlockedDatesEditor';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CONF_LABELS: Record<number, string> = {
  1: 'No clue', 2: 'Seen it before', 3: 'Mostly remember', 4: 'Can solve most', 5: 'No studying needed',
};

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section>
      <div className="h-px bg-[var(--rule)] mb-4" />
      <h2 className="font-display text-3xl font-medium mb-2">{title}</h2>
      <p className="text-[var(--ink-2)] text-sm mb-8 max-w-2xl">{description}</p>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)] mb-2">{label}</div>
      {children}
      {hint && <div className="font-mono text-[10px] text-[var(--ink-3)] mt-2 leading-relaxed">{hint}</div>}
    </label>
  );
}

function ConfidenceLegend() {
  return (
    <div className="card-flat p-4">
      <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)] mb-3">Confidence scale</div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
        {([1, 2, 3, 4, 5] as Confidence[]).map(n => (
          <div key={n} className="flex items-center gap-2">
            <span className={`conf-pill active-${n}`} style={{ width: 28, height: 28, minWidth: 28, fontSize: 11 }}>{n}</span>
            <span className="text-[var(--ink-2)] font-mono text-[11px]">{CONF_LABELS[n]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  state: PlanState;
  update: (patch: Partial<PlanState>) => void;
  availableCount: number;
}

export function SetupTab({ state, update, availableCount }: Props) {
  const updateConfidence = (id: TopicId, c: Confidence) => {
    update({ confidence: { ...state.confidence, [id]: c } });
  };

  return (
    <div className="space-y-12 pt-10 anim-in">
      <Section title="Exam configuration" description="Set when you'll take the exam and when your prep window begins.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Exam date">
            <input type="date" value={state.examDate ?? ''} min={state.startDate}
              onChange={e => update({ examDate: e.target.value || null })} className="w-full" />
          </Field>
          <Field label="Start studying">
            <input type="date" value={state.startDate} max={state.examDate ?? undefined}
              onChange={e => update({ startDate: e.target.value })} className="w-full" />
          </Field>
        </div>
        <details className="mt-6">
          <summary className="font-mono text-[11px] tracked-wide uppercase text-[var(--ink-3)] hover:text-[var(--accent)] inline-flex items-center gap-2">
            <span>▸</span> Advanced allocation settings
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pl-4 border-l border-[var(--rule-soft)]">
            <Field label="Minimum days per topic" hint="Floor — even mastered topics get this many review days">
              <input type="number" value={state.minDays} min={0} max={30}
                onChange={e => update({ minDays: Math.max(0, parseInt(e.target.value) || 0) })} className="w-full" />
            </Field>
            <Field label="Weighting exponent" hint="Higher = more aggressive bias toward weak topics (1=linear, 2=squared, 3=cubic)">
              <input type="number" value={state.exponent} min={1} max={4} step={0.5}
                onChange={e => update({ exponent: Math.max(1, parseFloat(e.target.value) || 1) })} className="w-full" />
            </Field>
          </div>
        </details>
      </Section>

      <Section title="Knowledge areas" description="Rate your confidence in each topic. Weaker topics — and those with more exam questions — receive proportionally more study time.">
        <ConfidenceLegend />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-6">
          {FE_CIVIL_TOPICS.map((topic, i) => (
            <TopicRow
              key={topic.id}
              index={i}
              topic={topic}
              confidence={state.confidence[topic.id as TopicId] ?? 3}
              onConfidenceChange={c => updateConfidence(topic.id as TopicId, c)}
            />
          ))}
        </div>
      </Section>

      <Section title="Availability" description="Mark recurring days off and specific dates you can't study. The schedule recomputes automatically.">
        <div className="font-mono text-[11px] tracked-wide uppercase text-[var(--ink-3)] mb-3">
          Recurring days off
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {DAY_SHORT.map((_d, i) => (
            <button key={i}
              onClick={() => {
                const bw = [...state.blockedWeekdays] as PlanState['blockedWeekdays'];
                bw[i] = !bw[i];
                update({ blockedWeekdays: bw });
              }}
              className={`px-4 py-3 rounded font-mono text-xs tracked transition-all border min-h-[44px] ${
                state.blockedWeekdays[i]
                  ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                  : 'bg-white/40 text-[var(--ink-2)] border-[var(--rule)] hover:border-[var(--ink-3)]'
              }`}
            >
              {DAY_NAMES[i]}
              {state.blockedWeekdays[i] && <span className="ml-2 opacity-60">✕</span>}
            </button>
          ))}
        </div>
        <BlockedDatesEditor
          blockedDates={state.blockedDates}
          onChange={dates => update({ blockedDates: dates })}
          minDate={state.startDate}
          maxDate={state.examDate ?? undefined}
        />
      </Section>

      <div className="card p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-[10px] tracked-wide uppercase text-[var(--ink-3)] mb-1">Ready</div>
          <div className="font-display text-2xl">
            {state.examDate
              ? `${availableCount} days allocated across 14 topics`
              : 'Set an exam date to generate your schedule'}
          </div>
        </div>
        <button
          className="btn btn-accent"
          disabled={!state.examDate}
          onClick={() => update({ activeTab: 'schedule' })}
          style={!state.examDate ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          View schedule →
        </button>
      </div>
    </div>
  );
}
