import { useEffect, useMemo, useRef, useState } from 'react'
import { navigate } from '../../router'
import { createEvaluation, exportEvaluation, getEvaluation, saveEvaluation, validateEvaluation } from '../../evaluations'
import { getTask } from '../../tasks'
import { useDb } from '../../store'
import { workflowById } from '../../workflows'
import { IconArrowLeft, IconCheck, IconSave, IconTarget } from '../../icons'
import CodexPanel from './CodexPanel'
import IssueDialog, { annotationPixels } from './IssueDialog'
import VideoWorkbench from './VideoWorkbench'
import WorkflowForm from './WorkflowForm'

export default function WorkflowWorkspace({ user, taskId }) {
  const db = useDb()
  const task = getTask(taskId)
  const initial = task ? getEvaluation(task.id, user.id) || createEvaluation(task, user.id) : null
  const [evaluation, setEvaluation] = useState(initial)
  const [issueContext, setIssueContext] = useState(null)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [codexOpen, setCodexOpen] = useState(true)
  const [saveState, setSaveState] = useState('idle')
  const [errors, setErrors] = useState([])
  const autoSaveReady = useRef(false)

  useEffect(() => {
    if (!task) return
    setEvaluation(getEvaluation(task.id, user.id) || createEvaluation(task, user.id))
    autoSaveReady.current = false
  }, [taskId, user.id])

  useEffect(() => {
    if (!evaluation || evaluation.status === 'submitted') return undefined
    if (!autoSaveReady.current) {
      autoSaveReady.current = true
      return undefined
    }
    setSaveState('saving')
    const timer = setTimeout(() => {
      saveEvaluation(evaluation)
      setSaveState('saved')
    }, 750)
    return () => clearTimeout(timer)
  }, [evaluation])

  if (!task || !evaluation) return <div className="view wf-empty-state"><h1>Tarea no encontrada</h1><button className="wf-btn" onClick={() => navigate('/workflows')}>Volver</button></div>

  const config = db.workflowConfigs[task.workflowId]
  const workflow = workflowById(task.workflowId)
  const assigned = task.assignedUserIds?.includes(user.id)
  const enabled = db.workflowAssignments[user.id]?.includes(task.workflowId)
  const canAccess = user.role === 'admin' || (assigned && enabled)
  if (!canAccess) return <div className="view wf-empty-state"><h1>Tarea no disponible</h1><p>Esta evaluación no está asignada a tu cuenta.</p></div>

  const disabled = evaluation.status === 'submitted'
  const allowedTags = config?.codexCategories?.length
    ? db.codex.tags.filter((tag) => config.codexCategories.includes(tag.category))
    : db.codex.tags
  const counts = evaluation.issues.reduce((result, issue) => ({ ...result, [issue.tagId]: (result[issue.tagId] || 0) + 1 }), {})
  const exportData = useMemo(() => exportEvaluation(task, evaluation), [task, evaluation])

  const manualSave = () => {
    setSaveState('saving')
    saveEvaluation(evaluation)
    setSaveState('saved')
  }

  const submit = () => {
    const nextErrors = validateEvaluation(task, evaluation)
    setErrors(nextErrors)
    if (nextErrors.length) return
    const saved = saveEvaluation(evaluation, true)
    setEvaluation(saved)
    setSaveState('submitted')
  }

  const addIssue = (issue) => {
    setEvaluation((current) => ({ ...current, issues: [...current.issues, issue] }))
    setSelectedIssue(issue)
    setIssueContext(null)
  }

  const removeIssue = (issueId) => {
    setEvaluation((current) => ({ ...current, issues: current.issues.filter((issue) => issue.id !== issueId) }))
    if (selectedIssue?.id === issueId) setSelectedIssue(null)
  }

  return <div className="workflow-workspace">
    <header className="workflow-topbar">
      <button type="button" onClick={() => navigate('/workflows')}><IconArrowLeft size={15} /> Workflows</button>
      <div><span>WF{String(workflow.number).padStart(2, '0')} · {workflow.title}</span><h1>{task.title}</h1></div>
      <div className={`save-indicator is-${saveState}`}>{disabled ? <><IconCheck size={14} /> Enviada</> : saveState === 'saving' ? 'Guardando…' : saveState === 'saved' ? <><IconCheck size={14} /> Guardada</> : 'Borrador'}</div>
    </header>

    <div className={`workflow-layout ${codexOpen ? '' : 'is-codex-closed'}`}>
      <main className="workflow-main">
        <section className="task-brief"><div><span>Prompt</span><p>{task.prompt || 'Sin prompt'}</p></div><div><span>Objetivo</span><p>{task.objective || 'Sin objetivo adicional'}</p></div><div><span>Prioridad</span><p>{task.priority || 'Criterio general'}</p></div></section>

        <VideoWorkbench task={task} issues={evaluation.issues} selectedIssue={selectedIssue} onSelectIssue={setSelectedIssue} onAddIssue={setIssueContext} disabled={disabled} />

        <section className="issues-section">
          <header><div><span>Evidence ledger</span><h2>Issues ({evaluation.issues.length})</h2></div><button className="wf-btn wf-btn--ghost wf-codex-toggle" type="button" onClick={() => setCodexOpen((value) => !value)}>{codexOpen ? 'Ocultar Codex' : 'Abrir Codex'}</button></header>
          {evaluation.issues.length ? <div className="issue-list">{evaluation.issues.map((issue) => {
            const pixels = annotationPixels(issue.spatialAnnotation)
            return <article className={`issue-row sev-${issue.severity} ${selectedIssue?.id === issue.id ? 'is-selected' : ''}`} key={issue.id} onClick={() => setSelectedIssue(issue)}>
              <button type="button" className="issue-time">F{String(issue.startFrame).padStart(5, '0')}<small>{issue.startSec.toFixed(3)}s</small></button>
              <div><strong>{issue.tagLabel}</strong><span>{issue.category} · {issue.severity} · {issue.confidence}</span>{issue.evidence ? <p>{issue.evidence}</p> : null}{pixels ? <small><IconTarget size={12} /> x {pixels.x}, y {pixels.y}, {pixels.width}×{pixels.height}px</small> : null}</div>
              {!disabled ? <button type="button" className="issue-remove" onClick={(event) => { event.stopPropagation(); removeIssue(issue.id) }} aria-label="Eliminar issue">×</button> : null}
            </article>
          })}</div> : <p className="wf-empty">Todavía no marcaste evidencia. Pausá el video y agregá un issue sobre el output correspondiente.</p>}
        </section>

        <section className="evaluation-form"><header><span>Structured result</span><h2>{workflow.title}</h2></header><WorkflowForm task={task} config={config} result={evaluation.result} disabled={disabled} onChange={(result) => setEvaluation((current) => ({ ...current, result }))} /><label className="wf-field"><span>Notas de tarea</span><textarea disabled={disabled} rows="3" value={evaluation.notes || ''} onChange={(event) => setEvaluation((current) => ({ ...current, notes: event.target.value }))} /></label></section>

        <details className="export-preview"><summary>Vista previa del export JSON</summary><pre>{JSON.stringify(exportData, null, 2)}</pre></details>
        {errors.length ? <div className="wf-errors">{errors.map((error) => <p key={error}>{error}</p>)}</div> : null}
        <footer className="workflow-actions"><button className="wf-btn wf-btn--ghost" type="button" disabled={disabled} onClick={manualSave}><IconSave size={15} /> Guardar borrador</button><button className="wf-btn wf-btn--gold" type="button" disabled={disabled} onClick={submit}>Enviar evaluación <IconCheck size={15} /></button></footer>
      </main>

      {codexOpen ? <aside className="workflow-codex"><header><span>Aurum Codex</span><button type="button" onClick={() => setCodexOpen(false)} aria-label="Cerrar Codex">×</button></header><CodexPanel tags={allowedTags} counts={counts} selectedId={selectedIssue?.tagId} onSelect={() => {}} /></aside> : null}
    </div>

    {issueContext ? <IssueDialog context={issueContext} tags={allowedTags} onClose={() => setIssueContext(null)} onCreate={addIssue} /> : null}
  </div>
}
