import type { PlanState } from '../types';
import { FE_CIVIL_TOPICS } from '../constants/feCivilTopics';

function toBase64url(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  )).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromBase64url(str: string): string {
  const padded = str + '==='.slice((str.length + 3) % 4);
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return decodeURIComponent(Array.from(binary, c =>
    '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
  ).join(''));
}

export function encodePlan(state: PlanState): string {
  return toBase64url(JSON.stringify(state));
}

export function decodePlan(encoded: string): PlanState | null {
  try {
    const json = fromBase64url(encoded);
    const obj = JSON.parse(json);
    if (obj.v !== 1) return null;
    if (typeof obj.examDate !== 'string' || typeof obj.startDate !== 'string') return null;
    if (!obj.confidence || typeof obj.confidence !== 'object') return null;
    for (const topic of FE_CIVIL_TOPICS) {
      const c = obj.confidence[topic.id];
      if (typeof c !== 'number' || c < 1 || c > 5) return null;
    }
    return obj as PlanState;
  } catch {
    return null;
  }
}
