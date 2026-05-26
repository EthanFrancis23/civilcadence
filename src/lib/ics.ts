import { FE_CIVIL_TOPICS } from '../constants/feCivilTopics';
import type { Schedule } from '../types';

export function generateICS(schedule: Schedule): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CivilCadence//FE Civil Study Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const sortedEntries = Object.entries(schedule).sort(([a], [b]) => a.localeCompare(b));

  for (const [date, entry] of sortedEntries) {
    const topic = FE_CIVIL_TOPICS[entry.topicIndex];
    const dtstart = date.replace(/-/g, '');
    const uid = `civilcadence-${topic.id}-${entry.sessionNumber}@civilcadence.app`;
    const summary = `FE Civil — ${topic.name} (session ${entry.sessionNumber}/${entry.totalSessions})`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${dtstart}`,
      `DTEND;VALUE=DATE:${dtstart}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:FE Civil exam prep — ${topic.name}. Session ${entry.sessionNumber} of ${entry.totalSessions}.`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(schedule: Schedule): void {
  const content = generateICS(schedule);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'civilcadence-study-plan.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
