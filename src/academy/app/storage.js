import { CODEX_SEED, WORKFLOW_IDS, createWorkflowConfigs } from './workflows'

export const DB_V1_KEY = 'aurum-academy-db:v1'
export const DB_V2_KEY = 'aurum-academy-db:v2'

// Clips CC0 de MDN. El host viejo (`interactive-examples.mdn.mozilla.net`) está
// descontinuado; `mdn.github.io/shared-assets` responde con `Access-Control-Allow-Origin: *`,
// que es lo que necesita `crossOrigin="anonymous"` para capturar frames al canvas.
const CLIP_FLOWER = {
  src: 'https://mdn.github.io/shared-assets/videos/flower.mp4',
  filename: 'flower.mp4',
  width: 960,
  height: 540,
  durationSec: 30,
}
const CLIP_FRIDAY = {
  src: 'https://mdn.github.io/shared-assets/videos/friday.mp4',
  filename: 'friday.mp4',
  width: 640,
  height: 360,
  durationSec: 12,
}

// Las dimensiones y la duración reales las sobreescribe el reproductor al leer
// los metadatos; acá sólo sirven de fallback antes de que cargue el video.
function sampleOutput(id, label, clip = CLIP_FLOWER) {
  return {
    id,
    label,
    src: clip.src,
    filename: clip.filename,
    mime: 'video/mp4',
    fps: 24,
    width: clip.width,
    height: clip.height,
    durationSec: clip.durationSec,
  }
}

// Consigna por workflow. El material demo es un plano botánico benigno: las
// tareas están escritas como simulacro sobre ese material, no como casos reales
// de producción.
const BRIEFS = {
  preference_evaluation: {
    title: 'Jardín en movimiento · Comparación A/B',
    prompt: 'Cinematic close-up of flowers moving naturally in the wind, stable detail, soft daylight.',
    objective: 'Elegí qué output responde mejor al prompt y defendé la preferencia con evidencia observable.',
    priority: 'Adherencia al prompt por encima del atractivo visual.',
  },
  single_video_qc: {
    title: 'Flor al viento · Control de calidad',
    prompt: 'Cinematic close-up of flowers moving naturally in the wind, stable detail, soft daylight.',
    objective: 'Puntuá cada dimensión de la rúbrica y registrá los defectos que sostienen el veredicto.',
    priority: 'Estabilidad del detalle y coherencia del movimiento.',
  },
  event_temporal_annotation: {
    title: 'Movimiento natural · Eventos temporales',
    prompt: 'Cinematic close-up of flowers moving naturally in the wind, stable detail, soft daylight.',
    objective: 'Marcá los eventos con su ventana temporal: ráfagas, cambios de foco, entradas y salidas de cuadro.',
    priority: 'Precisión del timecode antes que cantidad de eventos.',
  },
  prompt_adherence: {
    title: 'Plano botánico · Adherencia al prompt',
    prompt: 'Cinematic close-up of flowers moving naturally in the wind, stable detail, soft daylight.',
    objective: 'Verificá elemento por elemento del prompt: encuadre, sujeto, movimiento, luz y nitidez.',
    priority: 'Un elemento no pedido no compensa uno faltante.',
  },
  continuity_coherence: {
    title: 'Secuencia de naturaleza · Continuidad',
    prompt: 'Three consecutive shots of the same garden scene, matching light, lens and grade.',
    objective: 'Revisá cada transición: el material demo incluye un corte que rompe la continuidad a propósito.',
    priority: 'Identidad de la escena y consistencia de luz entre planos.',
  },
  style_consistency: {
    title: 'Botanical film · Consistencia visual',
    prompt: 'Cinematic close-up of flowers moving naturally in the wind, stable detail, soft daylight.',
    objective: 'Evaluá si el tratamiento visual se sostiene de principio a fin del clip.',
    priority: 'Deriva de color, grano y profundidad de campo.',
  },
  audio_visual_sync: {
    title: 'Naturaleza sonora · Sincronización',
    prompt: 'Cinematic close-up of flowers in the wind with matching ambient sound design.',
    objective: 'Medí el desfase entre imagen y sonido. El material demo puede no traer pista de audio: si falta, registralo como hallazgo.',
    priority: 'Un desfase medido vale más que una impresión.',
  },
  physics_behavior: {
    title: 'Pétalos y viento · Plausibilidad física',
    prompt: 'Cinematic close-up of flowers moving naturally in the wind, stable detail, soft daylight.',
    objective: 'Contrastá lo esperado con lo observado en el comportamiento del viento sobre los pétalos.',
    priority: 'Inercia, peso aparente y dirección del viento.',
  },
  safety_compliance: {
    title: 'Public release · Safety audit',
    prompt: 'Cinematic close-up of flowers moving naturally in the wind, stable detail, soft daylight.',
    objective: 'Simulacro de auditoría sobre material benigno: recorré la checklist completa y justificá el nivel de riesgo asignado.',
    priority: 'El nivel de riesgo siempre se declara, incluso cuando es bajo.',
  },
  adversarial_red_team: {
    title: 'Motion stress test · Red team',
    prompt: 'Cinematic close-up of flowers moving naturally in the wind, stable detail, soft daylight.',
    objective: 'Buscá el límite del modelo sobre este material: describí escenario, modo de falla y cómo reproducirlo.',
    priority: 'Reproducibilidad por encima de espectacularidad.',
  },
}

function seedOutputs(workflowId) {
  // A/B compara dos clips distintos: con el mismo video la preferencia no tiene sentido.
  if (workflowId === 'preference_evaluation') {
    return [sampleOutput('A', 'Output A', CLIP_FLOWER), sampleOutput('B', 'Output B', CLIP_FRIDAY)]
  }
  // Continuidad: el clip del medio rompe la escena a propósito.
  if (workflowId === 'continuity_coherence') {
    return [
      sampleOutput('C1', 'Clip 1', CLIP_FLOWER),
      sampleOutput('C2', 'Clip 2', CLIP_FRIDAY),
      sampleOutput('C3', 'Clip 3', CLIP_FLOWER),
    ]
  }
  return [sampleOutput('A', 'Output', CLIP_FLOWER)]
}

function seedTasks() {
  const now = new Date(0).toISOString()
  return WORKFLOW_IDS.map((workflowId, index) => {
    const brief = BRIEFS[workflowId]
    return {
      id: `task-${workflowId}`,
      workflowId,
      mode: workflowId === 'preference_evaluation' ? 'ab' : undefined,
      title: brief.title,
      status: index < 2 ? 'in_progress' : 'assigned',
      prompt: brief.prompt,
      objective: brief.objective,
      priority: brief.priority,
      outputs: seedOutputs(workflowId),
      assignedUserIds: ['u_ana'],
      createdAt: now,
      updatedAt: now,
    }
  })
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

const USER_ROLES = new Set(['admin', 'student', 'expert'])
const USER_TEXT_FIELDS = ['password', 'name', 'craft', 'email', 'bio']

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeUsers(value, fallback) {
  if (!Array.isArray(value)) return fallback
  return value
    .filter((user) => (
      isRecord(user)
      && typeof user.id === 'string'
      && typeof user.username === 'string'
      && USER_ROLES.has(user.role)
    ))
    .map((user) => {
      const normalized = { id: user.id, username: user.username, role: user.role }
      for (const field of USER_TEXT_FIELDS) {
        if (typeof user[field] === 'string') normalized[field] = user[field]
      }
      return normalized
    })
}

function normalizeAssignments(value, fallback) {
  if (!isRecord(value)) return fallback
  return Object.fromEntries(
    Object.entries(value)
      .filter(([userId, ids]) => typeof userId === 'string' && Array.isArray(ids))
      .map(([userId, ids]) => [userId, ids.filter((id) => typeof id === 'string')]),
  )
}

function normalizeWorkflowConfigs(value, fallback) {
  if (!isRecord(value)) return fallback
  return Object.fromEntries(WORKFLOW_IDS.map((workflowId) => {
    const base = fallback[workflowId]
    const config = value[workflowId]
    if (!isRecord(config)) return [workflowId, base]
    return [workflowId, {
      workflowId,
      enabled: typeof config.enabled === 'boolean' ? config.enabled : base.enabled,
      rubricDimensions: Array.isArray(config.rubricDimensions) ? config.rubricDimensions.filter((item) => typeof item === 'string') : base.rubricDimensions,
      primaryReasons: Array.isArray(config.primaryReasons) ? config.primaryReasons.filter(isRecord) : base.primaryReasons,
      codexCategories: Array.isArray(config.codexCategories) ? config.codexCategories.filter((item) => typeof item === 'string') : base.codexCategories,
      artifactTaxonomy: Array.isArray(config.artifactTaxonomy) ? config.artifactTaxonomy.filter(isRecord) : base.artifactTaxonomy,
      updatedAt: typeof config.updatedAt === 'string' ? config.updatedAt : base.updatedAt,
    }]
  }))
}

function normalizeTasks(value, fallback) {
  if (!Array.isArray(value)) return fallback
  return value.filter((task) => (
    isRecord(task)
    && typeof task.id === 'string'
    && WORKFLOW_IDS.includes(task.workflowId)
    && Array.isArray(task.outputs)
    && Array.isArray(task.assignedUserIds)
  ))
}

export function normalizeDb(candidate) {
  const seed = createSeedDb()
  if (!isRecord(candidate)) return seed
  const legacyAssignments = isRecord(candidate.assignments) ? candidate.assignments : undefined
  return {
    version: 2,
    users: normalizeUsers(candidate.users, seed.users),
    courseAssignments: normalizeAssignments(
      candidate.courseAssignments ?? legacyAssignments,
      seed.courseAssignments,
    ),
    workflowAssignments: normalizeAssignments(candidate.workflowAssignments, seed.workflowAssignments),
    progress: isRecord(candidate.progress) ? candidate.progress : {},
    workflowConfigs: normalizeWorkflowConfigs(candidate.workflowConfigs, seed.workflowConfigs),
    tasks: normalizeTasks(candidate.tasks, seed.tasks),
    evaluations: isRecord(candidate.evaluations) ? candidate.evaluations : {},
    codex: isRecord(candidate.codex) && Array.isArray(candidate.codex.tags)
      ? { version: String(candidate.codex.version || 'v2'), updatedAt: String(candidate.codex.updatedAt || ''), tags: candidate.codex.tags.filter(isRecord) }
      : seed.codex,
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
