// The 14 NCEES FE Civil knowledge areas. Frozen — not user-editable.
// Question counts are the official ranges from the NCEES FE Civil exam spec.
// Update only when NCEES publishes a new spec revision.

export const FE_CIVIL_TOPICS = [
  { id: 'math',         name: 'Mathematics and Statistics',                    qMin: 8,  qMax: 12 },
  { id: 'ethics',       name: 'Ethics and Professional Practice',              qMin: 4,  qMax: 6  },
  { id: 'econ',         name: 'Engineering Economics',                         qMin: 5,  qMax: 8  },
  { id: 'statics',      name: 'Statics',                                       qMin: 8,  qMax: 12 },
  { id: 'dynamics',     name: 'Dynamics',                                      qMin: 4,  qMax: 6  },
  { id: 'mechmat',      name: 'Mechanics of Materials',                        qMin: 7,  qMax: 11 },
  { id: 'materials',    name: 'Materials',                                     qMin: 5,  qMax: 8  },
  { id: 'fluids',       name: 'Fluid Mechanics',                               qMin: 6,  qMax: 9  },
  { id: 'surveying',    name: 'Surveying',                                     qMin: 6,  qMax: 9  },
  { id: 'water',        name: 'Water Resources and Environmental Engineering', qMin: 10, qMax: 15 },
  { id: 'structural',   name: 'Structural Engineering',                        qMin: 10, qMax: 15 },
  { id: 'geotech',      name: 'Geotechnical Engineering',                      qMin: 10, qMax: 15 },
  { id: 'transport',    name: 'Transportation Engineering',                    qMin: 9,  qMax: 14 },
  { id: 'construction', name: 'Construction Engineering',                      qMin: 8,  qMax: 12 },
] as const;

export type TopicId = typeof FE_CIVIL_TOPICS[number]['id'];
export type FeCivilTopic = typeof FE_CIVIL_TOPICS[number];

export const TOPIC_IDS: readonly TopicId[] = FE_CIVIL_TOPICS.map(t => t.id);

export function qMid(topic: { qMin: number; qMax: number }): number {
  return (topic.qMin + topic.qMax) / 2;
}
