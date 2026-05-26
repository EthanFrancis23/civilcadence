import { describe, it, expect } from 'vitest';
import { calculateAllocation, buildSchedule } from '../lib/allocator';
import type { TopicInput } from '../lib/allocator';

function makeTopics(confidences: number[]): TopicInput[] {
  return confidences.map(c => ({ confidence: c as 1|2|3|4|5 }));
}

describe('calculateAllocation', () => {
  it('Test A — canonical weakest-vs-strongest', () => {
    const topics = makeTopics([1, 2, 3, 4]);
    const result = calculateAllocation(topics, 100, 2, 2);
    expect(result).toEqual([45, 29, 17, 9]);
    expect(result.reduce((a, b) => a + b, 0)).toBe(100);
  });

  it('Test B — all mastered (conf=5), near-even distribution', () => {
    const topics = makeTopics(Array(14).fill(5));
    const result = calculateAllocation(topics, 100, 2, 2);
    expect(result.reduce((a, b) => a + b, 0)).toBe(100);
    result.forEach(v => expect(v).toBeGreaterThanOrEqual(7));
    result.forEach(v => expect(v).toBeLessThanOrEqual(8));
  });

  it('Test C — under-floor case, remainder to weakest', () => {
    const topics = makeTopics([3, 3, 3, 3, 3]);
    const result = calculateAllocation(topics, 8, 2);
    expect(result).toEqual([2, 2, 2, 1, 1]);
    expect(result.reduce((a, b) => a + b, 0)).toBe(8);
  });

  it('Test D — exponent controls bias ratio', () => {
    const topics = makeTopics([1, 3]);
    expect(calculateAllocation(topics, 100, 2, 1)).toEqual([62, 38]);
    expect(calculateAllocation(topics, 100, 2, 2)).toEqual([73, 27]);
    expect(calculateAllocation(topics, 100, 2, 3)).toEqual([81, 19]);
  });

  it('edge — 0 available dates returns zeros', () => {
    const topics = makeTopics([1, 2, 3]);
    expect(calculateAllocation(topics, 0, 2, 2)).toEqual([0, 0, 0]);
  });
});

describe('buildSchedule', () => {
  it('Test E — fractional sequencing, even spread', () => {
    const dates: string[] = [];
    for (let i = 0; i < 100; i++) {
      const d = new Date(2025, 0, 1 + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${day}`);
    }

    const topics = makeTopics([1, 1]);
    const allocations = [45, 9];
    const schedule = buildSchedule(topics, allocations, dates);

    const topic0Indices: number[] = [];
    const topic1Indices: number[] = [];
    dates.forEach((d, i) => {
      const entry = schedule[d];
      if (!entry) return;
      if (entry.topicIndex === 0) topic0Indices.push(i);
      if (entry.topicIndex === 1) topic1Indices.push(i);
    });

    expect(topic0Indices[0]).toBeGreaterThanOrEqual(0);
    expect(topic0Indices[0]).toBeLessThanOrEqual(2);

    if (topic0Indices.length > 1) {
      const gaps = topic0Indices.slice(1).map((idx, i) => idx - topic0Indices[i]);
      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      expect(avgGap).toBeGreaterThan(2.0);
      expect(avgGap).toBeLessThan(2.6);
    }

    expect(topic1Indices[0]).toBeGreaterThanOrEqual(6);
    expect(topic1Indices[0]).toBeLessThanOrEqual(8);

    if (topic1Indices.length > 1) {
      const gaps = topic1Indices.slice(1).map((idx, i) => idx - topic1Indices[i]);
      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      expect(avgGap).toBeGreaterThan(10.7);
      expect(avgGap).toBeLessThan(11.3);
    }
  });
});
