import { FE_CIVIL_TOPICS } from '../constants/feCivilTopics';
import type { TopicId } from '../constants/feCivilTopics';
import type { PlanState, Confidence } from '../types';
import { toISO } from './dates';

const STORAGE_KEY = 'civilcadence-v1';

export function defaultState(): PlanState {
  const today = toISO(new Date());
  const confidence = Object.fromEntries(
    FE_CIVIL_TOPICS.map(t => [t.id, 3 as Confidence])
  ) as Record<TopicId, Confidence>;

  return {
    v: 1,
    examDate: null,
    startDate: today,
    minDays: 2,
    exponent: 2,
    confidence,
    blockedWeekdays: [false, false, false, false, false, false, false],
    blockedDates: [],
    activeTab: 'setup',
  };
}

export function loadState(): PlanState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1) return null;
    return parsed as PlanState;
  } catch {
    return null;
  }
}

export function saveState(s: PlanState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // localStorage can throw in private mode
  }
}
