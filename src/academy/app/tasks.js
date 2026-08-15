import { getDb, transact } from './store'
import { WORKFLOW_IDS } from './workflows'

export const TASK_STATUSES = ['draft', 'assigned', 'in_progress', 'submitted', 'archived']

export function createId(prefix) {
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${prefix}-${id}`
}

export function getTasks() {
  return getDb().tasks
}

export function getTask(taskId) {
  return getDb().tasks.find((task) => task.id === taskId) || null
}

export function getTasksForUser(userId, role = 'student') {
  const db = getDb()
  if (role === 'admin') return db.tasks.filter((task) => task.status !== 'archived')
  const enabled = new Set(db.workflowAssignments[userId] || [])
  return db.tasks.filter((task) =>
    task.status !== 'draft' &&
    task.status !== 'archived' &&
    enabled.has(task.workflowId) &&
    task.assignedUserIds?.includes(userId),
  )
}

function sanitizeOutput(output, index) {
  const src = String(output.src || '')
  return {
    id: String(output.id || String.fromCharCode(65 + index)),
    label: String(output.label || `Output ${index + 1}`),
    src: src.startsWith('data:') || src.startsWith('blob:') ? '' : src,
    filename: String(output.filename || ''),
    mime: String(output.mime || 'video/mp4'),
    fps: Math.max(1, Number(output.fps) || 24),
    width: Math.max(1, Number(output.width) || 1920),
    height: Math.max(1, Number(output.height) || 1080),
    durationSec: Math.max(0, Number(output.durationSec) || 0),
  }
}

export function createTask(workflowId = WORKFLOW_IDS[0]) {
  const now = new Date().toISOString()
  const task = {
    id: createId('task'),
    workflowId,
    mode: workflowId === 'preference_evaluation' ? 'ab' : undefined,
    title: 'Nueva tarea',
    status: 'draft',
    prompt: '',
    objective: '',
    priority: '',
    outputs: [],
    assignedUserIds: [],
    createdAt: now,
    updatedAt: now,
  }
  transact((db) => ({ ...db, tasks: [...db.tasks, task] }))
  return task
}

export function updateTask(taskId, patch) {
  transact((db) => ({
    ...db,
    tasks: db.tasks.map((task) => task.id === taskId ? {
      ...task,
      ...patch,
      id: task.id,
      outputs: patch.outputs ? patch.outputs.map(sanitizeOutput) : task.outputs,
      updatedAt: new Date().toISOString(),
    } : task),
  }))
}

export function assignTask(taskId, userId, assigned) {
  const task = getTask(taskId)
  if (!task) return
  const users = new Set(task.assignedUserIds || [])
  if (assigned) users.add(userId)
  else users.delete(userId)
  updateTask(taskId, { assignedUserIds: [...users] })
}

export function setWorkflowAssignment(userId, workflowId, assigned) {
  transact((db) => {
    const workflows = new Set(db.workflowAssignments[userId] || [])
    if (assigned) workflows.add(workflowId)
    else workflows.delete(workflowId)
    return {
      ...db,
      workflowAssignments: { ...db.workflowAssignments, [userId]: [...workflows] },
    }
  })
}

export function updateWorkflowConfig(workflowId, patch) {
  transact((db) => ({
    ...db,
    workflowConfigs: {
      ...db.workflowConfigs,
      [workflowId]: {
        ...db.workflowConfigs[workflowId],
        ...patch,
        workflowId,
        updatedAt: new Date().toISOString(),
      },
    },
  }))
}

export function updateCodexTag(tagId, patch) {
  transact((db) => ({
    ...db,
    codex: {
      ...db.codex,
      updatedAt: new Date().toISOString(),
      tags: db.codex.tags.map((tag) => tag.id === tagId ? { ...tag, ...patch, id: tag.id } : tag),
    },
  }))
}

export function addCodexTag(tag) {
  transact((db) => ({
    ...db,
    codex: {
      ...db.codex,
      updatedAt: new Date().toISOString(),
      tags: [...db.codex.tags, { ...tag, id: tag.id || createId('tag') }],
    },
  }))
}

export function removeCodexTag(tagId) {
  transact((db) => ({
    ...db,
    codex: { ...db.codex, tags: db.codex.tags.filter((tag) => tag.id !== tagId) },
  }))
}
