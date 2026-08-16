import { getDb, transact } from './store'
import { createId } from './tasks'

export function createEmptyResult(task) {
  const rubrics = getDb().workflowConfigs[task.workflowId]?.rubricDimensions || []
  switch (task.workflowId) {
    case 'preference_evaluation':
      return { verdict: '', preferredOutputId: null, primaryReason: '', justification: '' }
    case 'single_video_qc':
      return { verdict: '', scores: rubrics.map((dimension) => ({ dimension, score: 0 })), recommendation: '' }
    case 'event_temporal_annotation':
      return { events: [], summary: '' }
    case 'prompt_adherence':
      return { items: rubrics.map((element) => ({ id: createId('item'), element, status: 'fulfilled', evidenceSec: null, note: '' })), recommendation: '' }
    case 'continuity_coherence':
      return { transitions: [], recommendation: '' }
    case 'style_consistency':
      return { verdict: '', scores: rubrics.map((dimension) => ({ dimension, score: 0 })), evidence: '' }
    case 'audio_visual_sync':
      return { decision: '', offsetMs: 0, markerSec: 0, evidence: '' }
    case 'physics_behavior':
      return { verdict: '', expected: '', observed: '', severity: 'medium', recommendation: '' }
    case 'safety_compliance':
      return { decision: '', category: '', level: 'low', policyRef: '', evidence: '' }
    case 'adversarial_red_team':
      return { scenario: '', attackVector: '', failureMode: '', severity: 'medium', reproducibility: 'once', recommendation: '' }
    default:
      return {}
  }
}

export function getEvaluation(taskId, userId) {
  return getDb().evaluations?.[taskId]?.[userId] || null
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

export function validateEvaluation(task, evaluation) {
  const errors = []
  const result = evaluation.result || {}
  switch (task.workflowId) {
    case 'preference_evaluation':
      if (!result.verdict) errors.push('Elegí un veredicto.')
      if (!result.primaryReason) errors.push('Indicá la razón principal.')
      break
    case 'single_video_qc':
    case 'style_consistency':
      if (!result.verdict) errors.push('Elegí un veredicto.')
      break
    case 'event_temporal_annotation':
      if (!result.events?.length) errors.push('Agregá al menos un evento temporal.')
      break
    case 'prompt_adherence':
      if (!result.items?.length) errors.push('Evaluá al menos un elemento del prompt.')
      break
    case 'continuity_coherence':
      if (!result.transitions?.length) errors.push('Evaluá al menos una transición.')
      break
    case 'audio_visual_sync':
    case 'physics_behavior':
    case 'safety_compliance':
      if (!result.decision && !result.verdict) errors.push('Completá la decisión final.')
      break
    case 'adversarial_red_team':
      if (!result.scenario || !result.failureMode) errors.push('Completá escenario y modo de falla.')
      break
  }
  return errors
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
