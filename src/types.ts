import type { TopicId } from './constants/feCivilTopics';

export type Confidence = 1 | 2 | 3 | 4 | 5;

export type PlanState = {
  v: 1;
  examDate: string | null;
  startDate: string;
  minDays: number;
  exponent: number;
  confidence: Record<TopicId, Confidence>;
  blockedWeekdays: [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  blockedDates: string[];
  activeTab: 'setup' | 'schedule' | 'allocation';
};

export type ScheduleEntry = {
  topicIndex: number;
  sessionNumber: number;
  totalSessions: number;
};

export type Schedule = Record<string, ScheduleEntry>;
