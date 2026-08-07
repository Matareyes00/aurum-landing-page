import { useSyncExternalStore } from 'react'

/* ------------------------------------------------------------------ *
 * Aurum Academy — mock data layer (localStorage).
 * PROTOTYPE ONLY: passwords are plaintext and everything lives in the
 * browser. Real auth/persistence belongs on a backend (see PENDIENTES.md).
 * ------------------------------------------------------------------ */

const DB_KEY = 'aurum-academy-db:v1'

export const DEFAULT_PROGRESS = {
  completedModuleIds: [],
  currentIndex: 0,
  unlockedIndex: 0,
  quizAnswers: {},
  startedAt: null,
  completedAt: null,
}

/* ---------------- course catalog (authored in-repo) ---------------- */

export const COURSES = [
  {
    id: 'c_codex',
    code: 'CODEX 01',
    title: 'El Codex — Fundamentos',
    subtitle: 'El idioma para nombrar el error',
    summary:
      'Tu ojo ya ve el error. Acá aprendés a nombrarlo como lo nombra la industria: la taxonomía del video generativo, la severidad y la confianza.',
    duration: '~40 min',
    level: 'Fundacional',
    modules: [
      {
        id: 'm1',
        tag: 'IDENTIDAD',
        title: 'Identidad y deriva',
        summary: 'Cuando la cara del personaje deja de ser la misma entre planos.',
        sections: [
          { type: 'heading', text: 'Qué es la deriva de identidad' },
          {
            type: 'paragraph',
            text: 'Un modelo puede sostener una cara durante un plano y perderla en el siguiente: cambian los rasgos, la edad aparente o la estructura ósea. Se llama identity drift y es uno de los errores más costosos, porque rompe la ilusión de que estamos viendo a una persona.',
          },
          {
            type: 'callout',
            tone: 'gold',
            text: 'Regla práctica: si no reconocerías al personaje en un casting entre dos tomas, hay deriva.',
          },
          {
            type: 'compare',
            good: [
              'Los rasgos sostienen identidad durante el paneo.',
              'La edad y la estructura de la cara se mantienen.',
            ],
            bad: [
              'El mentón o los ojos cambian al mover la cámara.',
              'El personaje “rejuvenece” o “envejece” entre cortes.',
            ],
          },
          {
            type: 'note',
            text: 'La deriva se anota sobre el frame exacto donde empieza a notarse, no sobre el clip entero.',
          },
        ],
        quiz: {
          question: '¿Cuál es el síntoma central de la deriva de identidad?',
          options: [
            'La temperatura de color salta entre planos.',
            'Los rasgos del personaje cambian entre planos.',
            'El audio se desincroniza de la imagen.',
            'La cámara tiembla sin motivo.',
          ],
          correct: 'Los rasgos del personaje cambian entre planos.',
          explanation:
            'La deriva de identidad es la pérdida de consistencia facial/corporal del mismo personaje a lo largo del tiempo.',
        },
      },
      {
        id: 'm2',
        tag: 'LUZ',
        title: 'Luz y continuidad',
        summary: 'Sombras sin fuente y saltos de temperatura que delatan a la máquina.',
        sections: [
          { type: 'heading', text: 'La luz tiene que tener causa' },
          {
            type: 'paragraph',
            text: 'En un set, toda luz responde a una fuente. Los modelos suelen “pintar” luz sin origen: una sombra que cae hacia el lado equivocado, un contraluz que nadie motivó, una temperatura que salta de cálida a fría sin corte.',
          },
          {
            type: 'list',
            items: [
              'Fuente y sombra coherentes (dirección, dureza, color).',
              'Continuidad de temperatura entre planos de la misma escena.',
              'Reflejos y specular acordes al material.',
            ],
          },
          {
            type: 'callout',
            tone: 'ivory',
            text: 'Preguntá siempre: ¿dónde está la lámpara que produce esta luz? Si no hay respuesta, es un hallazgo.',
          },
        ],
        quiz: {
          question: '¿Qué describe mejor una ruptura de continuidad lumínica?',
          options: [
            'Una transición suave entre dos escenas.',
            'Una sombra que no responde a ninguna fuente visible.',
            'Un plano detalle bien expuesto.',
            'Un movimiento de cámara lento.',
          ],
          correct: 'Una sombra que no responde a ninguna fuente visible.',
          explanation:
            'La continuidad lumínica se rompe cuando la luz o la sombra no tienen una fuente que las justifique o cambian sin motivo.',
        },
      },
      {
        id: 'm3',
        tag: 'MÉTRICA',
        title: 'Severidad y confianza',
        summary: 'Cómo puntuar un hallazgo para que sea un dato útil, no una opinión.',
        sections: [
          { type: 'heading', text: 'Dos ejes: cuánto rompe y cuán seguro estás' },
          {
            type: 'paragraph',
            text: 'Cada hallazgo se califica en dos ejes. Severidad: cuánto daña la credibilidad del plano (baja, media, alta, crítica). Confianza: qué tan seguro estás de que el error existe (0 a 1). Juntos convierten tu criterio en un dato comparable.',
          },
          {
            type: 'compare',
            good: [
              'SEV. ALTA · CONF. 0.9 — deriva evidente y sostenida.',
              'Justificación en una frase concreta y verificable.',
            ],
            bad: [
              'Marcar todo como “crítico” sin graduar.',
              '“Se siente raro” sin señalar qué ni dónde.',
            ],
          },
        ],
        quiz: {
          question: '¿Para qué sirve el eje de confianza?',
          options: [
            'Para indicar cuánto te gustó el plano.',
            'Para expresar qué tan seguro estás de que el error existe.',
            'Para medir la duración del clip.',
            'Para elegir la música.',
          ],
          correct: 'Para expresar qué tan seguro estás de que el error existe.',
          explanation:
            'La confianza (0–1) comunica tu certeza; la severidad comunica el daño. Son ejes distintos y complementarios.',
        },
      },
    ],
  },
  {
    id: 'c_wf01',
    code: 'WORKFLOW 01',
    title: 'Workflow 01 — Preference Evaluation',
    subtitle: 'Dos tomas entran, una sale',
    summary:
      'El primer workflow pago de Aurum: comparás dos versiones de un mismo plano generado por IA, elegís cuál sostiene la escena y firmás por qué.',
    duration: '~35 min',
    level: 'Aplicado',
    modules: [
      {
        id: 'm1',
        tag: 'PREFERENCIA',
        title: 'Qué es preferencia',
        summary: 'Elegir con criterio no es opinar: es aplicar una jerarquía.',
        sections: [
          { type: 'heading', text: 'Preferir es decidir, no gustar' },
          {
            type: 'paragraph',
            text: 'En Preference Evaluation te muestran dos outputs del mismo prompt. No se trata de cuál te gusta más, sino de cuál cumple mejor: identidad, luz, continuidad, física y sonido, en ese orden de peso cuando hay conflicto.',
          },
          {
            type: 'callout',
            tone: 'gold',
            text: 'Cuando dos criterios chocan, gana el que más rompe la ilusión de realidad.',
          },
        ],
        quiz: {
          question: 'En Preference Evaluation, ¿qué estás decidiendo?',
          options: [
            'Cuál output te gusta estéticamente.',
            'Cuál output cumple mejor los criterios de calidad.',
            'Cuál se generó más rápido.',
            'Cuál tiene mejor música.',
          ],
          correct: 'Cuál output cumple mejor los criterios de calidad.',
          explanation:
            'La preferencia es una decisión con criterio jerárquico, no una cuestión de gusto personal.',
        },
      },
      {
        id: 'm2',
        tag: 'COMPARAR',
        title: 'Comparar A/B',
        summary: 'Un método para no perderte entre dos clips parecidos.',
        sections: [
          { type: 'heading', text: 'Mirá por capas, no en bloque' },
          {
            type: 'list',
            items: [
              'Pasada 1 — Identidad: ¿alguno pierde al personaje?',
              'Pasada 2 — Luz y continuidad: ¿hay saltos o sombras sin fuente?',
              'Pasada 3 — Física y movimiento: ¿algo se mueve imposible?',
              'Pasada 4 — Sonido y espacio (si aplica).',
            ],
          },
          {
            type: 'note',
            text: 'Si tras las pasadas hay empate real, gana el que tenga el error de menor severidad.',
          },
        ],
        quiz: {
          question: '¿Cuál es la primera pasada al comparar A/B?',
          options: ['Sonido', 'Identidad', 'Color grade', 'Duración'],
          correct: 'Identidad',
          explanation:
            'La identidad es el eje de mayor peso: un fallo de identidad suele decidir la comparación.',
        },
      },
      {
        id: 'm3',
        tag: 'JUSTIFICAR',
        title: 'Justificar la decisión',
        summary: 'Una decisión sin motivo no es un dato.',
        sections: [
          { type: 'heading', text: 'Firmá tu veredicto' },
          {
            type: 'paragraph',
            text: 'La justificación es lo que transforma tu elección en dato de entrenamiento. Nombrá el criterio ganador, el hallazgo decisivo y su severidad, en una o dos frases verificables.',
          },
          {
            type: 'compare',
            good: [
              'Gana B — criterio: consistencia temporal. A pierde identidad en el paneo (SEV. ALTA).',
              'Concreto, señala qué y dónde.',
            ],
            bad: ['“B es mejor.”', '“A queda feo, no sé.”'],
          },
        ],
        quiz: {
          question: '¿Qué convierte tu elección en un dato útil?',
          options: [
            'Elegir rápido.',
            'Una justificación concreta y verificable.',
            'Elegir siempre la opción A.',
            'No dar motivos para no sesgar.',
          ],
          correct: 'Una justificación concreta y verificable.',
          explanation:
            'La justificación nombra el criterio y el hallazgo decisivo: eso es lo que el modelo puede aprender.',
        },
      },
    ],
  },
]

export function courseById(id) {
  return COURSES.find((c) => c.id === id) || null
}

/* ---------------- seed + store ---------------- */

function seed() {
  return {
    users: [
      {
        id: 'u_admin',
        username: 'admin',
        password: 'admin',
        role: 'admin',
        name: 'Equipo Aurum',
        craft: 'Dirección',
        email: 'hola@aurumvisual.com',
        bio: 'Curaduría y evaluación de Aurum Academy.',
      },
      {
        id: 'u_ana',
        username: 'alumno',
        password: 'alumno',
        role: 'student',
        name: 'Ana Ríos',
        craft: 'Fotografía',
        email: 'ana@tucine.com',
        bio: '',
      },
      {
        id: 'u_leo',
        username: 'leo',
        password: 'leo',
        role: 'student',
        name: 'Leo Duarte',
        craft: 'Montaje',
        email: 'leo@tucine.com',
        bio: '',
      },
    ],
    assignments: {
      u_ana: ['c_wf01'],
      u_leo: ['c_codex'],
    },
    progress: {},
  }
}

const listeners = new Set()

function load() {
  if (typeof window === 'undefined') return seed()
  try {
    const raw = window.localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  const s = seed()
  persist(s)
  return s
}

let db = load()

function persist(next) {
  db = next
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn())
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useDb() {
  return useSyncExternalStore(subscribe, () => db, () => db)
}

/* ---------------- selectors ---------------- */

export function getUsers() {
  return db.users
}

export function getUser(id) {
  return db.users.find((u) => u.id === id) || null
}

export function findByCredentials(username, password) {
  const u = (username || '').trim().toLowerCase()
  return (
    db.users.find(
      (x) => x.username.toLowerCase() === u && x.password === password
    ) || null
  )
}

export function getAssignments(userId) {
  return db.assignments[userId] || []
}

export function getProgress(userId, courseId) {
  return db.progress?.[userId]?.[courseId] || DEFAULT_PROGRESS
}

/* ---------------- mutators ---------------- */

export function updateUser(userId, patch) {
  persist({
    ...db,
    users: db.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
  })
}

export function assignCourse(userId, courseId) {
  const current = db.assignments[userId] || []
  if (current.includes(courseId)) return
  persist({
    ...db,
    assignments: { ...db.assignments, [userId]: [...current, courseId] },
  })
}

export function unassignCourse(userId, courseId) {
  const current = db.assignments[userId] || []
  persist({
    ...db,
    assignments: {
      ...db.assignments,
      [userId]: current.filter((id) => id !== courseId),
    },
  })
}

export function setProgress(userId, courseId, patch) {
  const prevUser = db.progress[userId] || {}
  const prev = prevUser[courseId] || DEFAULT_PROGRESS
  const next = { ...prev, ...patch }
  persist({
    ...db,
    progress: {
      ...db.progress,
      [userId]: { ...prevUser, [courseId]: next },
    },
  })
}

export function resetProgress(userId, courseId) {
  setProgress(userId, courseId, { ...DEFAULT_PROGRESS })
}

/* ---------------- helpers ---------------- */

export function courseCompletion(userId, courseId) {
  const course = courseById(courseId)
  if (!course) return { percent: 0, done: 0, total: 0, completed: false }
  const total = course.modules.length
  const done = getProgress(userId, courseId).completedModuleIds.length
  return {
    percent: total ? Math.round((done / total) * 100) : 0,
    done,
    total,
    completed: total > 0 && done >= total,
  }
}
