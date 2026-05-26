import type { FeCivilTopic } from '../constants/feCivilTopics';
import { TOPIC_COLORS } from '../constants/topicColors';
import type { Confidence } from '../types';

const CONF_LABELS: Record<number, string> = {
  1: 'No clue',
  2: 'Seen it before',
  3: 'Mostly remember',
  4: 'Can solve most',
  5: 'No studying needed',
};

interface Props {
  index: number;
  topic: FeCivilTopic;
  confidence: Confidence;
  onConfidenceChange: (c: Confidence) => void;
}

export function TopicRow({ index, topic, confidence, onConfidenceChange }: Props) {
  const color = TOPIC_COLORS[index % TOPIC_COLORS.length];

  return (
    <div className="py-3 border-b border-[var(--rule-soft)]">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 rounded-sm flex-shrink-0" style={{ background: color }} />
        <div className="font-mono text-[10px] text-[var(--ink-3)] w-6 tabular-nums flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium truncate block">{topic.name}</span>
          <span
            className="q-chip mt-1 inline-block"
            title={`NCEES exam allocates ${topic.qMin}–${topic.qMax} questions to this area`}
          >
            {topic.qMin}–{topic.qMax} q
          </span>
        </div>
        <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
          {([1, 2, 3, 4, 5] as Confidence[]).map(n => (
            <button
              key={n}
              onClick={() => onConfidenceChange(n)}
              className={`conf-pill ${confidence === n ? `active-${n}` : ''}`}
              title={CONF_LABELS[n]}
              aria-label={`Confidence ${n}: ${CONF_LABELS[n]}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
