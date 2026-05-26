import { describe, it, expect } from 'vitest';
import { toISO, fromISO, addDays, daysBetween, todayISO } from '../lib/dates';

describe('dates', () => {
  it('toISO formats correctly', () => {
    expect(toISO(new Date(2025, 0, 1))).toBe('2025-01-01');
    expect(toISO(new Date(2025, 11, 31))).toBe('2025-12-31');
  });

  it('fromISO parses local date', () => {
    const d = fromISO('2025-06-15');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(15);
  });

  it('addDays works across month boundary', () => {
    expect(addDays('2025-01-31', 1)).toBe('2025-02-01');
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01');
  });

  it('daysBetween calculates correctly', () => {
    expect(daysBetween('2025-01-01', '2025-01-31')).toBe(30);
    expect(daysBetween('2025-01-01', '2025-01-01')).toBe(0);
  });

  it('todayISO returns valid ISO date', () => {
    const today = todayISO();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
