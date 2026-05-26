import { describe, it, expect } from 'vitest';
import { encodePlan, decodePlan } from '../lib/share';
import { defaultState } from '../lib/persistence';

Object.defineProperty(globalThis, 'localStorage', {
  value: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  writable: true,
});

describe('share codec', () => {
  it('round-trips default state', () => {
    const state = defaultState();
    const decoded = decodePlan(encodePlan(state));
    expect(decoded).toEqual(state);
  });

  it('returns null on corrupted input', () => {
    expect(decodePlan('!!!notvalid!!!')).toBeNull();
  });

  it('returns null on schema mismatch — wrong version', () => {
    const state = defaultState();
    const broken = { ...state, v: 2 } as unknown as Record<string, unknown>;
    const encoded = btoa(JSON.stringify(broken)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    expect(decodePlan(encoded)).toBeNull();
  });

  it('handles empty blockedDates', () => {
    const state = { ...defaultState(), blockedDates: [] };
    const decoded = decodePlan(encodePlan(state));
    expect(decoded?.blockedDates).toEqual([]);
  });

  it('round-trips state with exam before start (no validation at codec level)', () => {
    const state = { ...defaultState(), examDate: '2020-01-01', startDate: '2025-01-01' };
    const decoded = decodePlan(encodePlan(state));
    expect(decoded).not.toBeNull();
    expect(decoded?.examDate).toBe('2020-01-01');
  });
});
