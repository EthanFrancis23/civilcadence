import { useState } from 'react';
import { fromISO } from '../lib/dates';

interface Props {
  blockedDates: string[];
  onChange: (dates: string[]) => void;
  minDate: string;
  maxDate?: string;
}

export function BlockedDatesEditor({ blockedDates, onChange, minDate, maxDate }: Props) {
  const [newDate, setNewDate] = useState('');
  const sorted = [...blockedDates].sort();

  const addDate = () => {
    if (!newDate || blockedDates.includes(newDate)) return;
    onChange([...blockedDates, newDate]);
    setNewDate('');
  };

  const removeDate = (d: string) => onChange(blockedDates.filter(x => x !== d));

  return (
    <div>
      <div className="font-mono text-[11px] tracked-wide uppercase text-[var(--ink-3)] mb-3">
        Specific blocked dates
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="date"
          value={newDate}
          min={minDate}
          max={maxDate}
          onChange={e => setNewDate(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addDate(); }}
        />
        <button className="btn" onClick={addDate} disabled={!newDate}>
          + Add date
        </button>
      </div>
      {sorted.length === 0 ? (
        <div className="font-mono text-[11px] text-[var(--ink-3)] italic">No blocked dates yet.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sorted.map(d => (
            <div key={d} className="card-flat px-3 py-2 flex items-center gap-2 font-mono text-xs">
              <span>
                {fromISO(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <button
                onClick={() => removeDate(d)}
                className="text-[var(--ink-3)] hover:text-[var(--accent)] text-base leading-none"
                aria-label={`Remove ${d}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
