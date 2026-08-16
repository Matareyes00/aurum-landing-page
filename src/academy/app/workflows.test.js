import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyResult, createEvaluation, exportEvaluation, validateEvaluation } from './evaluations'
import { annotationPixels } from './components/workflows/IssueDialog'
import { createSeedDb } from './storage'
import { getTasksForUser } from './tasks'
import { transact } from './store'
import { WORKFLOW_IDS, WORKFLOWS, workflowById } from './workflows'

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
})
