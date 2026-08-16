import { useEffect, useMemo, useState } from 'react'
import { navigate } from '../../router'
import { COURSES, assignCourse, getAssignments, unassignCourse, updateUser } from '../../data'
import { getEvaluation, reviewEvaluation } from '../../evaluations'
import { useDb } from '../../store'
import {
  TASK_STATUSES,
  addCodexTag,
  createTask,
  removeCodexTag,
  setWorkflowAssignment,
  updateCodexTag,
  updateTask,
  updateWorkflowConfig,
} from '../../tasks'
import { WORKFLOWS, workflowById } from '../../workflows'
import { IconArrowLeft, IconArrowRight, IconCheck, IconEdit, IconPlus, IconSave, IconSettings, IconTrash } from '../../icons'
import { useCopy, useLang, ADMIN_HUB } from '../../copy'
import { Avatar, Eyebrow } from '../ui'

const TABS = ['people', 'workflows', 'tasks', 'codex', 'results']
const TAB_KEYS = { people: 'tabPeople', workflows: 'tabWorkflows', tasks: 'tabTasks', codex: 'tabCodex', results: 'tabResults' }

function AdminTabs({ active }) {
  const t = useCopy(ADMIN_HUB)
  const normalized = active === 'workflow' ? 'workflows' : active === 'task' ? 'tasks' : active
  return <nav className="admin-tabs">{TABS.map((id) => <button type="button" className={normalized === id ? 'is-active' : ''} key={id} onClick={() => navigate(`/admin/${id}`)}>{t[TAB_KEYS[id]]}</button>)}</nav>
}

function Toggle({ checked, onChange, label }) {
  return <button type="button" className={`admin-switch ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)} aria-pressed={checked}><span />{label}</button>
}

function PeopleAdmin({ db }) {
  const t = useCopy(ADMIN_HUB)
  const evaluators = db.users.filter((user) => user.role !== 'admin')
  return <div className="admin-people-list">{evaluators.map((user) => {
    const workflows = new Set(db.workflowAssignments[user.id] || [])
    const courses = new Set(getAssignments(user.id))
    const assignedTasks = db.tasks.filter((task) => task.assignedUserIds?.includes(user.id)).length
    const submissions = Object.values(db.evaluations).filter((byUser) => byUser[user.id]?.status === 'submitted').length
    return <section className="admin-person" key={user.id}>
      <header><div className="admin-person-id"><Avatar name={user.name} size={44} /><div><h2>{user.name}</h2><span>{user.craft} · @{user.username}</span></div></div><div className="admin-person-stats"><span><strong>{assignedTasks}</strong> {t.tasks}</span><span><strong>{submissions}</strong> {t.sent}</span><select value={user.role} onChange={(event) => updateUser(user.id, { role: event.target.value })}><option value="student">{t.roleStudent}</option><option value="expert">{t.roleExpert}</option></select></div></header>
      <div className="admin-assignment-band"><h3>{t.enabledWorkflows}</h3><div className="assignment-grid">{WORKFLOWS.map((workflow) => <Toggle key={workflow.id} checked={workflows.has(workflow.id)} label={`WF${String(workflow.number).padStart(2, '0')} · ${workflow.title}`} onChange={(checked) => setWorkflowAssignment(user.id, workflow.id, checked)} />)}</div></div>
      <div className="admin-assignment-band"><h3>{t.courses}</h3><div className="assignment-grid assignment-grid--courses">{COURSES.map((course) => <Toggle key={course.id} checked={courses.has(course.id)} label={course.title} onChange={(checked) => checked ? assignCourse(user.id, course.id) : unassignCourse(user.id, course.id)} />)}</div></div>
    </section>
  })}</div>
}

function WorkflowsAdmin({ db }) {
  const t = useCopy(ADMIN_HUB)
  return <div className="admin-workflow-list">{WORKFLOWS.map((workflow) => {
    const config = db.workflowConfigs[workflow.id]
    const assigned = Object.values(db.workflowAssignments).filter((ids) => ids.includes(workflow.id)).length
    const tasks = db.tasks.filter((task) => task.workflowId === workflow.id).length
    return <article className="admin-workflow-row" key={workflow.id}>
      <span className="admin-workflow-number">WF{String(workflow.number).padStart(2, '0')}</span>
      <div><small>{workflow.tier}</small><h2>{workflow.title}</h2><p>{workflow.tagline}</p></div>
      <div className="admin-workflow-meta"><span>{assigned} {t.people}</span><span>{tasks} {t.tasks}</span><Toggle checked={config?.enabled !== false} label={config?.enabled === false ? t.paused : t.active} onChange={(enabled) => updateWorkflowConfig(workflow.id, { enabled })} /></div>
      <button type="button" className="admin-row-action" onClick={() => navigate(`/admin/workflow/${workflow.id}`)} aria-label={`${t.edit} ${workflow.title}`}><IconEdit size={16} /></button>
    </article>
  })}</div>
}

function WorkflowConfigEditor({ db, workflowId }) {
  const t = useCopy(ADMIN_HUB)
  const workflow = workflowById(workflowId)
  const stored = db.workflowConfigs[workflowId]
  const [form, setForm] = useState(stored)
  useEffect(() => setForm(stored), [workflowId, stored?.updatedAt])
  if (!workflow || !form) return <p className="wf-empty">{t.workflowNotFound}</p>
  const lines = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean)
  const save = () => {
    updateWorkflowConfig(workflowId, form)
    navigate('/admin/workflows')
  }
  return <div className="admin-editor">
    <button className="admin-back" type="button" onClick={() => navigate('/admin/workflows')}><IconArrowLeft size={14} /> {t.tabWorkflows}</button>
    <header><span>WF{String(workflow.number).padStart(2, '0')}</span><h2>{workflow.title}</h2><p>{workflow.tagline}</p></header>
    <Toggle checked={form.enabled} label={t.workflowEnabled} onChange={(enabled) => setForm({ ...form, enabled })} />
    <label className="wf-field"><span>{t.rubricDimensions}</span><textarea rows="8" value={form.rubricDimensions.join('\n')} onChange={(event) => setForm({ ...form, rubricDimensions: lines(event.target.value) })} /></label>
    <label className="wf-field"><span>{t.primaryReasons}</span><textarea rows="6" value={form.primaryReasons.join('\n')} onChange={(event) => setForm({ ...form, primaryReasons: lines(event.target.value) })} /></label>
    <label className="wf-field"><span>{t.codexCategories}</span><textarea rows="5" value={form.codexCategories.join('\n')} onChange={(event) => setForm({ ...form, codexCategories: lines(event.target.value) })} /></label>
    <button className="wf-btn wf-btn--gold" type="button" onClick={save}><IconSave size={15} /> {t.saveConfig}</button>
  </div>
}

function TasksAdmin({ db }) {
  const t = useCopy(ADMIN_HUB)
  const add = () => {
    const task = createTask()
    navigate(`/admin/task/${task.id}`)
  }
  return <><div className="admin-toolbar"><div><h2>{t.tabTasks}</h2><p>{t.tasksLede}</p></div><button className="wf-btn wf-btn--gold" type="button" onClick={add}><IconPlus size={15} /> {t.newTask}</button></div><div className="admin-task-list">{db.tasks.map((task) => {
    const workflow = workflowById(task.workflowId)
    const submitted = Object.values(db.evaluations[task.id] || {}).filter((evaluation) => evaluation.status === 'submitted').length
    return <button className="admin-task-row" type="button" key={task.id} onClick={() => navigate(`/admin/task/${task.id}`)}>
      <span>WF{String(workflow.number).padStart(2, '0')}</span><div><small>{workflow.title}{task.mode ? ` · ${task.mode}` : ''}</small><strong>{task.title}</strong><p>{task.outputs.length} {t.outputs} · {task.assignedUserIds?.length || 0} {t.assignedCount} · {submitted} {t.submissions}</p></div><em className={`status-${task.status}`}>{task.status}</em><IconArrowRight size={16} />
    </button>
  })}</div></>
}

function TaskEditor({ db, taskId }) {
  const t = useCopy(ADMIN_HUB)
  const task = db.tasks.find((item) => item.id === taskId)
  const [form, setForm] = useState(task)
  useEffect(() => setForm(task), [taskId, task?.updatedAt])
  if (!task || !form) return <p className="wf-empty">{t.taskNotFound}</p>
  const evaluators = db.users.filter((user) => user.role !== 'admin')
  const patchOutput = (index, patch) => setForm({ ...form, outputs: form.outputs.map((output, itemIndex) => itemIndex === index ? { ...output, ...patch } : output) })
  const addOutput = () => setForm({ ...form, outputs: [...form.outputs, { id: String.fromCharCode(65 + form.outputs.length), label: `Output ${form.outputs.length + 1}`, src: '', filename: '', mime: 'video/mp4', fps: 24, width: 1920, height: 1080, durationSec: 0 }] })
  const toggleUser = (userId) => {
    const ids = new Set(form.assignedUserIds || [])
    if (ids.has(userId)) ids.delete(userId); else ids.add(userId)
    setForm({ ...form, assignedUserIds: [...ids] })
  }
  const save = () => { updateTask(taskId, form); navigate('/admin/tasks') }
  return <div className="admin-editor task-editor">
    <button className="admin-back" type="button" onClick={() => navigate('/admin/tasks')}><IconArrowLeft size={14} /> {t.tabTasks}</button>
    <header><span>{t.taskEditor}</span><h2>{form.title}</h2></header>
    <div className="wf-field-row"><label className="wf-field"><span>{t.workflow}</span><select value={form.workflowId} onChange={(event) => setForm({ ...form, workflowId: event.target.value, mode: event.target.value === 'preference_evaluation' ? form.mode || 'ab' : undefined })}>{WORKFLOWS.map((workflow) => <option value={workflow.id} key={workflow.id}>WF{workflow.number} · {workflow.title}</option>)}</select></label><label className="wf-field"><span>{t.status}</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>{form.workflowId === 'preference_evaluation' ? <label className="wf-field"><span>{t.mode}</span><select value={form.mode || 'ab'} onChange={(event) => setForm({ ...form, mode: event.target.value })}><option value="ab">A/B</option><option value="nway">N-way</option></select></label> : null}</div>
    <label className="wf-field"><span>{t.taskTitle}</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
    <label className="wf-field"><span>{t.prompt}</span><textarea rows="4" value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} /></label>
    <div className="wf-field-row"><label className="wf-field"><span>{t.objective}</span><textarea rows="3" value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value })} /></label><label className="wf-field"><span>{t.priority}</span><textarea rows="3" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} /></label></div>
    <div className="admin-subhead"><h3>{t.outputsHead}</h3><button className="wf-btn wf-btn--small" type="button" onClick={addOutput}><IconPlus size={14} /> {t.output}</button></div>
    <div className="output-editor-list">{form.outputs.map((output, index) => <div className="output-editor" key={`${output.id}-${index}`}><label><span>{t.label}</span><input value={output.label} onChange={(event) => patchOutput(index, { label: event.target.value })} /></label><label className="output-url"><span>{t.sourceUrl}</span><input value={output.src} onChange={(event) => patchOutput(index, { src: event.target.value })} placeholder="/academy/media/video.mp4" /></label><label><span>{t.fps}</span><input type="number" value={output.fps} onChange={(event) => patchOutput(index, { fps: Number(event.target.value) })} /></label><label><span>{t.width}</span><input type="number" value={output.width} onChange={(event) => patchOutput(index, { width: Number(event.target.value) })} /></label><label><span>{t.height}</span><input type="number" value={output.height} onChange={(event) => patchOutput(index, { height: Number(event.target.value) })} /></label><button type="button" className="icon-danger" onClick={() => setForm({ ...form, outputs: form.outputs.filter((_, itemIndex) => itemIndex !== index) })}><IconTrash size={15} /></button></div>)}</div>
    <div className="admin-subhead"><h3>{t.assignEvaluators}</h3></div><div className="assignment-grid assignment-grid--courses">{evaluators.map((user) => <Toggle key={user.id} checked={form.assignedUserIds?.includes(user.id)} label={`${user.name} · ${user.role}`} onChange={() => toggleUser(user.id)} />)}</div>
    <button className="wf-btn wf-btn--gold" type="button" onClick={save}><IconSave size={15} /> {t.saveTask}</button>
  </div>
}

function CodexAdmin({ db }) {
  const t = useCopy(ADMIN_HUB)
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(null)
  const begin = (tag) => { setEditing(tag.id); setDraft(tag) }
  const add = () => { const tag = { id: `custom-${Date.now()}`, category: 'Custom', label: t.newTag, definition: '', useWhen: '', doNotUseWhen: '', defaultSeverity: 'medium' }; addCodexTag(tag); begin(tag) }
  const save = () => { updateCodexTag(editing, draft); setEditing(null); setDraft(null) }
  return <><div className="admin-toolbar"><div><h2>Codex · {db.codex.version}</h2><p>{db.codex.tags.length} {t.codexLede}</p></div><button className="wf-btn wf-btn--gold" type="button" onClick={add}><IconPlus size={15} /> {t.newTag}</button></div><div className="codex-admin-grid"><div className="codex-admin-list">{db.codex.tags.map((tag) => <button type="button" className={editing === tag.id ? 'is-active' : ''} key={tag.id} onClick={() => begin(tag)}><small>{tag.category}</small><strong>{tag.label}</strong><span>{tag.defaultSeverity}</span></button>)}</div>{draft ? <div className="codex-admin-editor"><label className="wf-field"><span>{t.label}</span><input value={draft.label} onChange={(event) => setDraft({ ...draft, label: event.target.value })} /></label><label className="wf-field"><span>{t.category}</span><input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label><label className="wf-field"><span>{t.definition}</span><textarea rows="3" value={draft.definition} onChange={(event) => setDraft({ ...draft, definition: event.target.value })} /></label><label className="wf-field"><span>{t.useWhen}</span><textarea rows="3" value={draft.useWhen} onChange={(event) => setDraft({ ...draft, useWhen: event.target.value })} /></label><label className="wf-field"><span>{t.doNotUseWhen}</span><textarea rows="3" value={draft.doNotUseWhen} onChange={(event) => setDraft({ ...draft, doNotUseWhen: event.target.value })} /></label><label className="wf-field"><span>{t.defaultSeverity}</span><select value={draft.defaultSeverity} onChange={(event) => setDraft({ ...draft, defaultSeverity: event.target.value })}>{['low', 'medium', 'high', 'critical'].map((value) => <option key={value}>{value}</option>)}</select></label><div className="admin-inline-actions"><button className="wf-btn wf-btn--gold" type="button" onClick={save}><IconSave size={14} /> {t.save}</button><button className="wf-btn wf-btn--danger" type="button" onClick={() => { removeCodexTag(editing); setEditing(null); setDraft(null) }}><IconTrash size={14} /> {t.remove}</button></div></div> : <div className="wf-empty">{t.pickTag}</div>}</div></>
}

function ResultsAdmin({ db }) {
  const t = useCopy(ADMIN_HUB)
  const lang = useLang()
  const locale = lang === 'en' ? 'en-US' : 'es-AR'
  const evaluations = Object.values(db.evaluations).flatMap((byUser) => Object.values(byUser)).filter((evaluation) => evaluation.status === 'submitted')
  return <div className="results-list">{evaluations.length ? evaluations.map((evaluation) => {
    const task = db.tasks.find((item) => item.id === evaluation.taskId)
    const user = db.users.find((item) => item.id === evaluation.evaluatorId)
    const workflow = task ? workflowById(task.workflowId) : null
    return <article className="result-row" key={`${evaluation.taskId}-${evaluation.evaluatorId}`}><div><span>{workflow?.title}</span><h2>{task?.title}</h2><p>{user?.name} · {evaluation.issues.length} {t.issues} · {new Date(evaluation.submittedAt).toLocaleDateString(locale)}</p></div><div className="review-actions"><em>{evaluation.reviewStatus || t.pendingReview}</em><button type="button" onClick={() => reviewEvaluation(evaluation.taskId, evaluation.evaluatorId, 'approved')}><IconCheck size={14} /> {t.approve}</button><button type="button" onClick={() => reviewEvaluation(evaluation.taskId, evaluation.evaluatorId, 'changes_requested', t.changesNote)}>{t.requestChanges}</button></div></article>
  }) : <p className="wf-empty">{t.noResults}</p>}</div>
}

export default function AdminHub({ route }) {
  const db = useDb()
  const t = useCopy(ADMIN_HUB)
  const section = route.section || 'people'
  const submissions = useMemo(() => Object.values(db.evaluations).flatMap((value) => Object.values(value)).filter((evaluation) => evaluation.status === 'submitted').length, [db.evaluations])
  let content
  if (section === 'people') content = <PeopleAdmin db={db} />
  else if (section === 'workflows') content = <WorkflowsAdmin db={db} />
  else if (section === 'workflow') content = <WorkflowConfigEditor db={db} workflowId={route.id} />
  else if (section === 'tasks') content = <TasksAdmin db={db} />
  else if (section === 'task') content = <TaskEditor db={db} taskId={route.id} />
  else if (section === 'codex') content = <CodexAdmin db={db} />
  else if (section === 'results') content = <ResultsAdmin db={db} />
  else content = <PeopleAdmin db={db} />

  return <div className="view view--admin-hub"><header className="view-hero admin-hub-hero"><div><Eyebrow>{t.eyebrow}</Eyebrow><h1 className="view-title">{t.title}</h1><p className="view-lede">{t.lede}</p></div><div className="admin-hub-summary"><span><strong>{db.users.length - 1}</strong> {t.evaluators}</span><span><strong>{db.tasks.length}</strong> {t.tasks}</span><span><strong>{submissions}</strong> {t.submissions}</span></div></header><AdminTabs active={section} /><div className="admin-hub-content">{content}</div></div>
}
