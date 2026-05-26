import { qMid } from '../constants/feCivilTopics';
import type { Schedule } from '../types';

export type TopicInput = {
  confidence: 1 | 2 | 3 | 4 | 5;
  qMin?: number;
  qMax?: number;
};

export function calculateAvailableDates(
  startISO: string,
  examISO: string,
  blockedWeekdays: boolean[],
  blockedDates: string[],
): string[] {
  if (!startISO || !examISO) return [];
  if (examISO < startISO) return [];
  const blockedSet = new Set(blockedDates);
  const dates: string[] = [];
  let cur = startISO;
  let safety = 0;
  while (cur <= examISO && safety < 10000) {
    const [y, m, d] = cur.split('-').map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    if (!blockedWeekdays[dow] && !blockedSet.has(cur)) {
      dates.push(cur);
    }
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + 1);
    const ny = dt.getFullYear();
    const nm = String(dt.getMonth() + 1).padStart(2, '0');
    const nd = String(dt.getDate()).padStart(2, '0');
    cur = `${ny}-${nm}-${nd}`;
    safety++;
  }
  return dates;
}

export function calculateAllocation(
  topics: TopicInput[],
  availableCount: number,
  minDays: number,
  exponent = 2,
  useQuestionCount = false,
): number[] {
  const n = topics.length;
  if (n === 0 || availableCount === 0) return topics.map(() => 0);

  const totalMin = n * minDays;

  if (availableCount <= totalMin) {
    const each = Math.floor(availableCount / n);
    const remainder = availableCount - each * n;
    const indices = topics.map((_, i) => i).sort((a, b) => topics[a].confidence - topics[b].confidence);
    const out = topics.map(() => each);
    for (let k = 0; k < remainder; k++) out[indices[k]] += 1;
    return out;
  }

  const distributable = availableCount - totalMin;

  const weights = topics.map(t => {
    const gap = Math.pow(6 - t.confidence, exponent);
    if (useQuestionCount && t.qMin !== undefined && t.qMax !== undefined) {
      return qMid({ qMin: t.qMin, qMax: t.qMax }) * gap;
    }
    return gap;
  });

  const sumW = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map(w => (w / sumW) * distributable);
  const floors = raw.map(r => Math.floor(r));
  const used = floors.reduce((a, b) => a + b, 0);
  const leftover = distributable - used;

  const fracs = raw.map((r, i) => ({ frac: r - floors[i], i }));
  fracs.sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < leftover; k++) {
    floors[fracs[k % fracs.length].i] += 1;
  }

  return floors.map((f) => f + minDays);
}

export function buildSchedule(
  topics: TopicInput[],
  allocations: number[],
  availableDates: string[],
): Schedule {
  const sessions: { topicIndex: number; position: number; dayInTopic: number; total: number }[] = [];
  topics.forEach((_topic, ti) => {
    const days = allocations[ti];
    for (let i = 0; i < days; i++) {
      const position = (i + 0.5) / days;
      sessions.push({ topicIndex: ti, position, dayInTopic: i + 1, total: days });
    }
  });
  sessions.sort((a, b) => a.position - b.position);

  const schedule: Schedule = {};
  const D = availableDates.length;
  const S = sessions.length;
  if (D === 0 || S === 0) return schedule;

  // Spread sessions evenly across the entire available-date window.
  // Each session's position (0..1) maps to a target date index.
  const used = new Set<number>();
  for (let i = 0; i < S; i++) {
    const session = sessions[i];
    // Distribute proportionally; use session's own fractional position to avoid clumping
    let idx = Math.floor(session.position * D);
    if (idx >= D) idx = D - 1;
    // If slot occupied (collision), step forward then backward to find nearest empty
    if (used.has(idx)) {
      let offset = 1;
      while (offset < D) {
        if (idx + offset < D && !used.has(idx + offset)) { idx = idx + offset; break; }
        if (idx - offset >= 0 && !used.has(idx - offset)) { idx = idx - offset; break; }
        offset++;
      }
    }
    used.add(idx);
    schedule[availableDates[idx]] = {
      topicIndex: session.topicIndex,
      sessionNumber: session.dayInTopic,
      totalSessions: session.total,
    };
  }
  return schedule;
}
