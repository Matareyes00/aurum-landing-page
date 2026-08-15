import { CODEX_SEED, WORKFLOW_IDS, createWorkflowConfigs } from './workflows'

export const DB_V1_KEY = 'aurum-academy-db:v1'
export const DB_V2_KEY = 'aurum-academy-db:v2'

const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

function sampleOutput(id, label) {
  return {
    id,
    label,
    src: SAMPLE_VIDEO,
    filename: `sample-${id.toLowerCase()}.mp4`,
    mime: 'video/mp4',
    fps: 24,
    width: 960,
    height: 540,
    durationSec: 30,
  }
}

function seedTasks() {
  const now = new Date(0).toISOString()
  const titles = {
    preference_evaluation: 'Jardín en movimiento · Comparación A/B',
    single_video_qc: 'Flor al viento · Control de calidad',
    event_temporal_annotation: 'Movimiento natural · Eventos temporales',
    prompt_adherence: 'Plano botánico · Adherencia al prompt',
    continuity_coherence: 'Secuencia de naturaleza · Continuidad',
    style_consistency: 'Botanical film · Consistencia visual',
    audio_visual_sync: 'Naturaleza sonora · Sincronización',
    physics_behavior: 'Pétalos y viento · Plausibilidad física',
    safety_compliance: 'Public release · Safety audit',
    adversarial_red_team: 'Motion stress test · Red team',
  }
  return WORKFLOW_IDS.map((workflowId, index) => ({
    id: `task-${workflowId}`,
    workflowId,
    mode: workflowId === 'preference_evaluation' ? 'ab' : undefined,
    title: titles[workflowId],
    status: index < 2 ? 'in_progress' : 'assigned',
    prompt: 'A cinematic close-up of flowers moving naturally in the wind, with stable detail and soft daylight.',
    objective: 'Aplicar criterio cinematográfico y producir evidencia estructurada.',
    priority: index % 2 === 0 ? 'Consistencia temporal y física.' : 'Adherencia y calidad visual.',
    outputs: workflowId === 'preference_evaluation'
      ? [sampleOutput('A', 'Output A'), sampleOutput('B', 'Output B')]
      : workflowId === 'continuity_coherence'
        ? [sampleOutput('C1', 'Clip 1'), sampleOutput('C2', 'Clip 2'), sampleOutput('C3', 'Clip 3')]
        : [sampleOutput('A', 'Output')],
    assignedUserIds: ['u_ana'],
    createdAt: now,
    updatedAt: now,
  }))
}

export function createSeedDb() {
  return {
    version: 2,
    users: [
      { id: 'u_admin', username: 'admin', password: 'admin', role: 'admin', name: 'Equipo Aurum', craft: 'Dirección', email: 'hola@aurumvisual.com', bio: 'Curaduría y evaluación de Aurum Academy.' },
      { id: 'u_ana', username: 'alumno', password: 'alumno', role: 'student', name: 'Ana Ríos', craft: 'Fotografía', email: 'ana@tucine.com', bio: '' },
      { id: 'u_leo', username: 'leo', password: 'leo', role: 'expert', name: 'Leo Duarte', craft: 'Montaje', email: 'leo@tucine.com', bio: '' },
    ],
    courseAssignments: { u_ana: ['c_wf01'], u_leo: ['c_codex'] },
    workflowAssignments: { u_ana: [...WORKFLOW_IDS], u_leo: ['preference_evaluation', 'single_video_qc'] },
    progress: {},
    workflowConfigs: createWorkflowConfigs(),
    tasks: seedTasks(),
    evaluations: {},
    codex: { version: 'v2', updatedAt: new Date(0).toISOString(), tags: CODEX_SEED },
  }
}

export function normalizeDb(candidate) {
  const seed = createSeedDb()
  if (!candidate || typeof candidate !== 'object') return seed
  return {
    ...seed,
    ...candidate,
    version: 2,
    users: Array.isArray(candidate.users) ? candidate.users : seed.users,
    courseAssignments: candidate.courseAssignments || candidate.assignments || seed.courseAssignments,
    workflowAssignments: candidate.workflowAssignments || seed.workflowAssignments,
    progress: candidate.progress || {},
    workflowConfigs: { ...seed.workflowConfigs, ...(candidate.workflowConfigs || {}) },
    tasks: Array.isArray(candidate.tasks) ? candidate.tasks : seed.tasks,
    evaluations: candidate.evaluations || {},
    codex: candidate.codex?.tags ? candidate.codex : seed.codex,
  }
}

export function migrateV1(v1) {
  return normalizeDb({
    ...createSeedDb(),
    users: Array.isArray(v1?.users) ? v1.users : undefined,
    courseAssignments: v1?.assignments,
    progress: v1?.progress,
  })
}

export function loadAcademyDb(storage = window.localStorage) {
  try {
    const rawV2 = storage.getItem(DB_V2_KEY)
    if (rawV2) return { db: normalizeDb(JSON.parse(rawV2)), error: null, migrated: false }
  } catch (error) {
    return { db: createSeedDb(), error: `No se pudo leer Academy v2: ${error.message}`, migrated: false }
  }

  try {
    const rawV1 = storage.getItem(DB_V1_KEY)
    const db = rawV1 ? migrateV1(JSON.parse(rawV1)) : createSeedDb()
    storage.setItem(DB_V2_KEY, JSON.stringify(db))
    return { db, error: null, migrated: Boolean(rawV1) }
  } catch (error) {
    return { db: createSeedDb(), error: `No se pudo iniciar Academy v2: ${error.message}`, migrated: false }
  }
}

export function writeAcademyDb(db, storage = window.localStorage) {
  try {
    storage.setItem(DB_V2_KEY, JSON.stringify(normalizeDb(db)))
    return { ok: true, error: null }
  } catch (error) {
    return { ok: false, error: `No se pudo guardar: ${error.message}` }
  }
}
