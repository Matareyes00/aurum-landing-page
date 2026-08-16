import { validateEvaluation } from './evaluations'

/** Etapas de la mesa de evaluación, en el orden en que se recorren. */
export const STAGES = ['context', 'inspection', 'annotation', 'decision', 'review']

/**
 * Estado de cada etapa: `done`, `todo` u `optional`.
 * `optional` es para la anotación, que no bloquea el envío en ningún workflow.
 */
export function stageStates(task, evaluation, { inspected = false } = {}) {
  const submitted = evaluation.status === 'submitted'
  const pending = validateEvaluation(task, evaluation)
  return {
    context: 'done',
    inspection: inspected || submitted ? 'done' : 'todo',
    annotation: evaluation.issues?.length ? 'done' : 'optional',
    decision: pending.length ? 'todo' : 'done',
    review: submitted ? 'done' : 'todo',
  }
}

/** Cuántas etapas bloqueantes están resueltas, para el medidor de progreso. */
export function stageProgress(states) {
  const blocking = STAGES.filter((stage) => states[stage] !== 'optional')
  const done = blocking.filter((stage) => states[stage] === 'done')
  return { done: done.length, total: blocking.length }
}

/** Primera etapa sin resolver, para el acceso directo del stepper. */
export function firstPendingStage(states) {
  return STAGES.find((stage) => states[stage] === 'todo') || 'review'
}
