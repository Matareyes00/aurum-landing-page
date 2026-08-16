import { getDb, transact } from './store'
import { createId, getTasksForUser } from './tasks'

// `null` = sin responder. El 0, "low" o "fulfilled" siguen siendo respuestas
// válidas, pero sólo después de que el evaluador las elija: precargarlas sesga
// el dataset.
export function createEmptyResult(task) {
  const rubrics = getDb().workflowConfigs[task.workflowId]?.rubricDimensions || []
  switch (task.workflowId) {
    case 'preference_evaluation':
      return { verdict: '', preferredOutputId: null, primaryReason: '', justification: '', ranking: [] }
    case 'single_video_qc':
      return { verdict: '', scores: rubrics.map((dimension) => ({ dimension, score: null })), recommendation: '' }
    case 'event_temporal_annotation':
      return { events: [], summary: '' }
    case 'prompt_adherence':
      return { items: rubrics.map((element) => ({ id: createId('item'), element, status: null, evidenceSec: null, note: '' })), recommendation: '' }
    case 'continuity_coherence':
      return { transitions: [], recommendation: '' }
    case 'style_consistency':
      return { verdict: '', scores: rubrics.map((dimension) => ({ dimension, score: null })), evidence: '' }
    case 'audio_visual_sync':
      return { decision: '', offsetMs: null, markerSec: null, evidence: '' }
    case 'physics_behavior':
      return { verdict: '', expected: '', observed: '', severity: null, recommendation: '' }
    case 'safety_compliance':
      return { decision: '', category: '', level: null, policyRef: '', evidence: '' }
    case 'adversarial_red_team':
      return { scenario: '', attackVector: '', failureMode: '', severity: null, reproducibility: null, recommendation: '' }
    default:
      return {}
  }
}

export function getEvaluation(taskId, userId) {
  return getDb().evaluations?.[taskId]?.[userId] || null
}

/** Próxima tarea sin enviar del evaluador, para encadenar después del envío. */
export function nextTaskForUser(userId, role, currentTaskId) {
  return getTasksForUser(userId, role).find((task) =>
    task.id !== currentTaskId && getEvaluation(task.id, userId)?.status !== 'submitted',
  ) || null
}

export function createEvaluation(task, userId) {
  const now = new Date().toISOString()
  return {
    taskId: task.id,
    workflowId: task.workflowId,
    evaluatorId: userId,
    status: 'draft',
    issues: [],
    result: createEmptyResult(task),
    notes: '',
    reviewStatus: null,
    reviewNote: '',
    createdAt: now,
    updatedAt: now,
  }
}

export function saveEvaluation(evaluation, submit = false) {
  const now = new Date().toISOString()
  const clean = {
    ...evaluation,
    status: submit ? 'submitted' : 'draft',
    updatedAt: now,
    submittedAt: submit ? now : evaluation.submittedAt,
    issues: (evaluation.issues || []).map(({ frameDataUrl, ...issue }) => issue),
  }
  transact((db) => ({
    ...db,
    evaluations: {
      ...db.evaluations,
      [clean.taskId]: {
        ...(db.evaluations[clean.taskId] || {}),
        [clean.evaluatorId]: clean,
      },
    },
  }))
  return clean
}

/** Un valor sin responder es `null`, `undefined` o cadena vacía. El 0 vale. */
function answered(value) {
  return value !== null && value !== undefined && value !== ''
}

/**
 * Devuelve códigos de error, no texto: el mismo resultado se muestra en
 * cualquier idioma (ver `copy/workflows.js → VALIDATION`) y los tests no
 * dependen de la traducción.
 */
export function validateEvaluation(task, evaluation) {
  const errors = []
  const result = evaluation.result || {}
  switch (task.workflowId) {
    case 'preference_evaluation':
      if (task.mode === 'nway') {
        // El ranking tiene que cubrir todos los outputs y no repetir posiciones.
        const ranking = result.ranking || []
        if (ranking.length !== (task.outputs?.length || 0) || new Set(ranking).size !== ranking.length) {
          errors.push('ranking_required')
        }
      } else if (!answered(result.verdict)) {
        errors.push('verdict_required')
      }
      if (!answered(result.primaryReason)) errors.push('primary_reason_required')
      if (!result.justification?.trim()) errors.push('justification_required')
      break
    case 'single_video_qc':
    case 'style_consistency': {
      if (!answered(result.verdict)) errors.push('verdict_required')
      const scores = result.scores || []
      if (!scores.length || scores.some((row) => !answered(row.score))) {
        errors.push('scores_required')
      }
      break
    }
    case 'event_temporal_annotation':
      if (!result.events?.length) {
        errors.push('events_required')
      } else if (result.events.some((event) => !event.subject?.trim() && !event.action?.trim())) {
        errors.push('event_detail_required')
      }
      break
    case 'prompt_adherence':
      if (!result.items?.length) {
        errors.push('items_required')
      } else if (result.items.some((item) => !answered(item.status))) {
        errors.push('item_status_required')
      }
      break
    case 'continuity_coherence':
      if (!result.transitions?.length) {
        errors.push('transitions_required')
      } else if (result.transitions.some((transition) => !answered(transition.status))) {
        errors.push('transition_status_required')
      }
      break
    case 'audio_visual_sync':
      if (!answered(result.decision)) errors.push('decision_required')
      if (!answered(result.offsetMs)) errors.push('offset_required')
      break
    case 'physics_behavior':
      if (!answered(result.verdict)) errors.push('decision_required')
      if (!answered(result.severity)) errors.push('severity_required')
      if (!result.expected?.trim() || !result.observed?.trim()) {
        errors.push('expected_observed_required')
      }
      break
    case 'safety_compliance':
      if (!answered(result.decision)) errors.push('decision_required')
      if (!answered(result.level)) errors.push('level_required')
      break
    case 'adversarial_red_team':
      if (!result.scenario?.trim() || !answered(result.failureMode)) {
        errors.push('scenario_required')
      }
      if (!answered(result.severity)) errors.push('severity_required')
      if (!answered(result.reproducibility)) errors.push('reproducibility_required')
      break
  }
  return errors
}

/**
 * Resumen legible de una evaluación, para mostrar antes del JSON y en la
 * confirmación de envío. Devuelve filas `{ key, value }` o `{ key, enumValue }`:
 * la traducción de la etiqueta y de los enums vive en la interfaz.
 */
export function summaryRows(task, evaluation) {
  const result = evaluation.result || {}
  const issues = evaluation.issues || []
  const rows = []
  const push = (key, value) => { if (value !== null && value !== undefined && value !== '') rows.push({ key, value }) }
  const pushEnum = (key, enumValue) => { if (enumValue) rows.push({ key, enumValue }) }

  switch (task.workflowId) {
    case 'preference_evaluation': {
      pushEnum('verdict', result.verdict)
      const preferred = task.outputs?.find((output) => output.id === result.preferredOutputId)
      push('preferred', preferred?.label)
      if (result.ranking?.length) {
        const labelFor = (id) => task.outputs?.find((output) => output.id === id)?.label || id
        push('ranking', result.ranking.map(labelFor).join(' > '))
      }
      push('primaryReason', result.primaryReason)
      push('justification', result.justification)
      break
    }
    case 'single_video_qc':
    case 'style_consistency': {
      pushEnum('verdict', result.verdict)
      const scores = (result.scores || []).filter((row) => answered(row.score))
      if (scores.length) {
        const average = scores.reduce((total, row) => total + Number(row.score), 0) / scores.length
        push('averageScore', `${average.toFixed(1)} · ${scores.length} ${scores.length === 1 ? 'dim' : 'dims'}`)
      }
      push('recommendation', result.recommendation || result.evidence)
      break
    }
    case 'event_temporal_annotation':
      push('eventCount', result.events?.length || 0)
      push('summary', result.summary)
      break
    case 'prompt_adherence': {
      const items = result.items || []
      const counts = items.reduce((totals, item) => ({ ...totals, [item.status]: (totals[item.status] || 0) + 1 }), {})
      push('adherence', Object.entries(counts).filter(([status]) => status !== 'null').map(([status, count]) => `${status}: ${count}`).join(' · '))
      push('recommendation', result.recommendation)
      break
    }
    case 'continuity_coherence': {
      const transitions = result.transitions || []
      push('transitionCount', transitions.length)
      push('transitionFailures', transitions.filter((transition) => transition.status === 'fail').length)
      push('recommendation', result.recommendation)
      break
    }
    case 'audio_visual_sync':
      pushEnum('decision', result.decision)
      if (answered(result.offsetMs)) push('offset', `${result.offsetMs} ms`)
      push('evidence', result.evidence)
      break
    case 'physics_behavior':
      pushEnum('verdict', result.verdict)
      pushEnum('severity', result.severity)
      push('expected', result.expected)
      push('observed', result.observed)
      break
    case 'safety_compliance':
      pushEnum('decision', result.decision)
      pushEnum('level', result.level)
      push('category', result.category)
      push('policyRef', result.policyRef)
      break
    case 'adversarial_red_team':
      push('scenario', result.scenario)
      pushEnum('failureMode', result.failureMode)
      pushEnum('severity', result.severity)
      pushEnum('reproducibility', result.reproducibility)
      break
  }

  rows.push({ key: 'issueCount', value: issues.length })
  const flagged = issues.filter((issue) => issue.severity === 'high' || issue.severity === 'critical').length
  if (flagged) rows.push({ key: 'criticalIssues', value: flagged })
  push('notes', evaluation.notes)
  return rows
}

export function exportEvaluation(task, evaluation) {
  return {
    schemaVersion: 2,
    task: {
      id: task.id,
      workflowId: task.workflowId,
      mode: task.mode,
      prompt: task.prompt,
    },
    evaluatorId: evaluation.evaluatorId,
    result: evaluation.result,
    issues: (evaluation.issues || []).map(({ frameDataUrl, ...issue }) => {
      const spatial = issue.spatialAnnotation
      return {
        ...issue,
        spatialAnnotation: spatial ? {
          ...spatial,
          pixels: {
            x: Math.round(spatial.x * spatial.sourceWidth),
            y: Math.round(spatial.y * spatial.sourceHeight),
            width: Math.round(spatial.width * spatial.sourceWidth),
            height: Math.round(spatial.height * spatial.sourceHeight),
          },
        } : undefined,
      }
    }),
    submittedAt: evaluation.submittedAt || null,
  }
}

export function reviewEvaluation(taskId, evaluatorId, reviewStatus, reviewNote = '') {
  const evaluation = getEvaluation(taskId, evaluatorId)
  if (!evaluation) return
  saveEvaluation({ ...evaluation, reviewStatus, reviewNote }, reviewStatus !== 'changes_requested')
}
