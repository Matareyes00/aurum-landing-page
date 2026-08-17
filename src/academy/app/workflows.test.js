import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyResult, createEvaluation, exportEvaluation, summaryRows, validateEvaluation } from './evaluations'
import { annotationPixels } from './components/workflows/IssueDialog'
import { createOutputControls, updateMarkRange } from './components/workflows/VideoWorkbench'
import { createSeedDb } from './storage'
import { firstPendingStage, STAGES, stageProgress, stageStates } from './stages'
import { getTasksForUser } from './tasks'
import { transact } from './store'
import { WORKFLOW_IDS, WORKFLOWS, workflowById, CODEX_SEED } from './workflows'
import { CODEX_TEXT, SUMMARY_LABELS, VALIDATION, WORKFLOW_TAGLINES } from './copy/workflows'

describe('workflow domain', () => {
  beforeEach(() => transact(createSeedDb()))

  it('registers all ten workflows with a seed task and structured result', () => {
    const db = createSeedDb()
    expect(WORKFLOWS.map((workflow) => workflow.id)).toEqual(WORKFLOW_IDS)
    for (const workflowId of WORKFLOW_IDS) {
      const task = db.tasks.find((item) => item.workflowId === workflowId)
      expect(task).toBeTruthy()
      expect(createEmptyResult(task)).toBeTypeOf('object')
      expect(workflowById(workflowId).number).toBeGreaterThan(0)
    }
  })

  it('keeps video controls and temporal marks independent per output', () => {
    const controls = createOutputControls([{ durationSec: 10 }, { durationSec: 20 }])
    const markedIn = updateMarkRange({ ...controls[0], outSec: 2 }, 'in', 3)
    const markedOut = updateMarkRange(markedIn, 'out', 2)

    expect(controls).toHaveLength(2)
    expect(controls[0]).not.toBe(controls[1])
    expect(markedIn.inSec).toBe(3)
    expect(markedIn.outSec).toBeNull()
    expect(markedOut.outSec).toBe(3)
    expect(controls[1]).toMatchObject({ inSec: null, outSec: null, zoom: 1, rate: 1 })
  })

  it('only exposes assigned and enabled tasks to an evaluator', () => {
    const anaTasks = getTasksForUser('u_ana', 'student')
    const leoTasks = getTasksForUser('u_leo', 'expert')
    const adminTasks = getTasksForUser('u_admin', 'admin')
    expect(anaTasks).toHaveLength(10)
    expect(leoTasks).toHaveLength(0)
    expect(adminTasks).toHaveLength(10)
  })

  it('validates and exports every workflow result without frame captures', () => {
    const db = createSeedDb()
    for (const task of db.tasks) {
      const evaluation = createEvaluation(task, 'u_ana')
      expect(validateEvaluation(task, evaluation)).toBeInstanceOf(Array)
      evaluation.issues = [{
        id: 'issue-1',
        outputId: task.outputs[0].id,
        tagId: 'identity-drift',
        tagLabel: 'Identity Drift',
        severity: 'high',
        frameDataUrl: 'data:image/jpeg;base64,never-export-this',
        spatialAnnotation: { x: 0.1, y: 0.2, width: 0.3, height: 0.4, sourceWidth: 1000, sourceHeight: 500 },
      }]
      const exported = exportEvaluation(task, evaluation)
      expect(JSON.stringify(exported)).not.toContain('frameDataUrl')
      expect(exported.issues[0].spatialAnnotation.pixels).toEqual({ x: 100, y: 100, width: 300, height: 200 })
    }
  })

  it('converts normalized bbox coordinates to source pixels', () => {
    expect(annotationPixels({ x: 0.25, y: 0.1, width: 0.5, height: 0.4, sourceWidth: 1920, sourceHeight: 1080 })).toEqual({
      x: 480,
      y: 108,
      width: 960,
      height: 432,
    })
  })

  it('starts every workflow result without preloaded answers', () => {
    const db = createSeedDb()
    const preloaded = []
    for (const task of db.tasks) {
      const result = createEmptyResult(task)
      for (const [field, value] of Object.entries(result)) {
        if (field === 'scores') {
          if (value.some((row) => row.score !== null)) preloaded.push(`${task.workflowId}.scores`)
          continue
        }
        if (field === 'items') {
          if (value.some((item) => item.status !== null)) preloaded.push(`${task.workflowId}.items`)
          continue
        }
        // Sólo importan los enums y números: los strings vacíos ya son "sin responder".
        if (typeof value === 'number') preloaded.push(`${task.workflowId}.${field}`)
      }
    }
    expect(preloaded).toEqual([])
  })

  it('rejects an incomplete submit for every workflow', () => {
    const db = createSeedDb()
    for (const task of db.tasks) {
      const evaluation = createEvaluation(task, 'u_ana')
      const errors = validateEvaluation(task, evaluation)
      expect(errors.length, `${task.workflowId} debería rechazar un envío vacío`).toBeGreaterThan(0)
    }
  })

  it('accepts 0 as a QC score only once it was chosen', () => {
    const db = createSeedDb()
    const task = db.tasks.find((item) => item.workflowId === 'single_video_qc')
    const evaluation = createEvaluation(task, 'u_ana')
    evaluation.result.verdict = 'pass'

    expect(validateEvaluation(task, evaluation)).toContain('scores_required')

    evaluation.result.scores = evaluation.result.scores.map((row) => ({ ...row, score: 0 }))
    expect(validateEvaluation(task, evaluation)).toEqual([])
  })

  it('requires an explicit risk level before submitting a safety audit', () => {
    const db = createSeedDb()
    const task = db.tasks.find((item) => item.workflowId === 'safety_compliance')
    const evaluation = createEvaluation(task, 'u_ana')
    evaluation.result.decision = 'safe'

    expect(validateEvaluation(task, evaluation)).toContain('level_required')

    evaluation.result.level = 'low'
    expect(validateEvaluation(task, evaluation)).toEqual([])
  })

  it('translates every validation code and workflow tagline in both languages', () => {
    const db = createSeedDb()
    const emitted = new Set()
    for (const task of db.tasks) {
      const evaluation = createEvaluation(task, 'u_ana')
      for (const code of validateEvaluation(task, evaluation)) emitted.add(code)
    }

    for (const lang of ['es', 'en']) {
      for (const code of emitted) {
        expect(VALIDATION[lang][code], `falta ${lang}.${code}`).toBeTypeOf('string')
      }
      for (const workflowId of WORKFLOW_IDS) {
        expect(WORKFLOW_TAGLINES[lang][workflowId], `falta tagline ${lang}.${workflowId}`).toBeTypeOf('string')
      }
      for (const tag of CODEX_SEED) {
        expect(CODEX_TEXT[lang][tag.id], `falta codex ${lang}.${tag.id}`).toHaveLength(3)
      }
    }
  })

  it('marks decision and review as pending until the evaluation is complete', () => {
    const db = createSeedDb()
    const task = db.tasks.find((item) => item.workflowId === 'safety_compliance')
    const evaluation = createEvaluation(task, 'u_ana')

    const empty = stageStates(task, evaluation, { inspected: false })
    expect(empty.context).toBe('done')
    expect(empty.inspection).toBe('todo')
    expect(empty.annotation).toBe('optional')
    expect(empty.decision).toBe('todo')
    expect(empty.review).toBe('todo')
    expect(firstPendingStage(empty)).toBe('inspection')
    // La anotacion nunca bloquea: quedan cuatro etapas obligatorias.
    expect(stageProgress(empty)).toEqual({ done: 1, total: 4 })

    evaluation.result.decision = 'safe'
    evaluation.result.level = 'low'
    const ready = stageStates(task, evaluation, { inspected: true })
    expect(ready.decision).toBe('done')
    expect(firstPendingStage(ready)).toBe('review')
    expect(stageProgress(ready)).toEqual({ done: 3, total: 4 })

    const sent = stageStates(task, { ...evaluation, status: 'submitted' }, { inspected: false })
    expect(sent.review).toBe('done')
    expect(stageProgress(sent)).toEqual({ done: 4, total: 4 })
  })

  it('builds a translatable human summary for every workflow', () => {
    const db = createSeedDb()
    for (const task of db.tasks) {
      const evaluation = createEvaluation(task, 'u_ana')
      const rows = summaryRows(task, evaluation)
      expect(rows.some((row) => row.key === 'issueCount'), `${task.workflowId} sin conteo de issues`).toBe(true)
      for (const lang of ['es', 'en']) {
        for (const row of rows) {
          expect(SUMMARY_LABELS[lang][row.key], `falta ${lang}.${row.key}`).toBeTypeOf('string')
        }
      }
    }
  })

  it('keeps the five stages in the documented order', () => {
    expect(STAGES).toEqual(['context', 'inspection', 'annotation', 'decision', 'review'])
  })

  it('requires a complete ranking in N-way preference and a verdict in A/B', () => {
    const db = createSeedDb()
    const abTask = db.tasks.find((item) => item.workflowId === 'preference_evaluation')
    const nwayTask = { ...abTask, mode: 'nway', outputs: [...abTask.outputs, { ...abTask.outputs[0], id: 'C', label: 'Output C' }] }

    const ab = createEvaluation(abTask, 'u_ana')
    expect(validateEvaluation(abTask, ab)).toContain('verdict_required')

    const nway = createEvaluation(nwayTask, 'u_ana')
    expect(validateEvaluation(nwayTask, nway)).toContain('ranking_required')
    expect(validateEvaluation(nwayTask, nway)).not.toContain('verdict_required')

    // Ranking incompleto y con repetidos sigue siendo invalido.
    nway.result.ranking = ['A', 'A', 'B']
    expect(validateEvaluation(nwayTask, nway)).toContain('ranking_required')

    nway.result.ranking = ['B', 'A', 'C']
    nway.result.preferredOutputId = 'B'
    nway.result.primaryReason = 'Adherencia al prompt'
    nway.result.justification = 'B mantiene el encuadre pedido en todo el clip.'
    expect(validateEvaluation(nwayTask, nway)).toEqual([])

    const rows = summaryRows(nwayTask, nway)
    expect(rows.find((row) => row.key === 'ranking').value).toBe('Output B > Output A > Output C')
  })
})
