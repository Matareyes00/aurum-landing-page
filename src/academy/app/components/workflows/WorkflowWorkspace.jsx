import { useEffect, useRef, useState } from 'react'
import { navigate } from '../../router'
import { createEvaluation, exportEvaluation, getEvaluation, nextTaskForUser, saveEvaluation, validateEvaluation } from '../../evaluations'
import { getTask } from '../../tasks'
import { stageStates } from '../../stages'
import { useDb } from '../../store'
import { workflowById } from '../../workflows'
import { IconArrowLeft, IconCheck, IconSave, IconTarget } from '../../icons'
import CodexPanel from './CodexPanel'
import EvaluationBottomBar from './EvaluationBottomBar'
import EvaluationSummary from './EvaluationSummary'
import IssueDialog, { annotationPixels } from './IssueDialog'
import StageStepper from './StageStepper'
import SubmittedPanel from './SubmittedPanel'
import VideoWorkbench from './VideoWorkbench'
import WorkflowForm from './WorkflowForm'
import { useCopy, WORKSPACE, STAGE_UI, VALIDATION, WORKFLOW_TAGLINES } from '../../copy'

export default function WorkflowWorkspace({ user, taskId }) {
  const db = useDb()
  const t = useCopy(WORKSPACE)
  const stageCopy = useCopy(STAGE_UI)
  const validationCopy = useCopy(VALIDATION)
  const taglines = useCopy(WORKFLOW_TAGLINES)
  const task = getTask(taskId)
  const initial = task ? getEvaluation(task.id, user.id) || createEvaluation(task, user.id) : null
  const [evaluation, setEvaluation] = useState(initial)
  const [issueContext, setIssueContext] = useState(null)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [codexOpen, setCodexOpen] = useState(() => typeof window === 'undefined' || window.innerWidth > 860)
  const [saveState, setSaveState] = useState('idle')
  const [errors, setErrors] = useState([])
  const [stage, setStage] = useState('context')
  const [inspected, setInspected] = useState(false)
  const autoSaveReady = useRef(false)
  const mainRef = useRef(null)

  useEffect(() => {
    if (!task) return
    setEvaluation(getEvaluation(task.id, user.id) || createEvaluation(task, user.id))
    setStage('context')
    setInspected(false)
    setErrors([])
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

  // El Codex se comporta como panel superpuesto por debajo de 860px.
  useEffect(() => {
    if (!codexOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && window.innerWidth <= 860) setCodexOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [codexOpen])

  if (!task || !evaluation) return <div className="view wf-empty-state"><h1>{t.notFound}</h1><button className="wf-btn" onClick={() => navigate('/workflows')}>{t.back}</button></div>

  const config = db.workflowConfigs[task.workflowId]
  const workflow = workflowById(task.workflowId)
  const assigned = task.assignedUserIds?.includes(user.id)
  const enabled = db.workflowAssignments[user.id]?.includes(task.workflowId)
  const canAccess = user.role === 'admin' || (assigned && enabled)
  if (!canAccess) return <div className="view wf-empty-state"><h1>{t.unavailable}</h1><p>{t.unavailableLede}</p></div>

  const disabled = evaluation.status === 'submitted'
  const states = stageStates(task, evaluation, { inspected })
  const allowedTags = config?.codexCategories?.length
    ? db.codex.tags.filter((tag) => config.codexCategories.includes(tag.category))
    : db.codex.tags
  const counts = evaluation.issues.reduce((result, issue) => ({ ...result, [issue.tagId]: (result[issue.tagId] || 0) + 1 }), {})
  const exportData = exportEvaluation(task, evaluation)
  const nextTask = disabled ? nextTaskForUser(user.id, user.role, task.id) : null

  const goToStage = (next) => {
    setStage(next)
    requestAnimationFrame(() => {
      if (window.innerWidth <= 860) {
        mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      mainRef.current?.querySelector(`[data-stage="${next}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const manualSave = () => {
    setSaveState('saving')
    saveEvaluation(evaluation)
    setSaveState('saved')
  }

  const submit = () => {
    const nextErrors = validateEvaluation(task, evaluation)
    setErrors(nextErrors)
    if (nextErrors.length) {
      goToStage('decision')
      return
    }
    const saved = saveEvaluation(evaluation, true)
    setEvaluation(saved)
    setSaveState('submitted')
    goToStage('review')
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

  const stageClass = (name) => `wf-stage ${stage === name ? 'is-stage-active' : ''}`

  return <div className="workflow-workspace">
    <header className="workflow-topbar">
      <button type="button" onClick={() => navigate('/workflows')}><IconArrowLeft size={15} /> {t.backToWorkflows}</button>
      <div><span>WF{String(workflow.number).padStart(2, '0')} · {workflow.title}</span><h1>{task.title}</h1></div>
      <div className={`save-indicator is-${saveState}`}>{disabled ? <><IconCheck size={14} /> {t.sent}</> : saveState === 'saving' ? t.saving : saveState === 'saved' ? <><IconCheck size={14} /> {t.savedState}</> : t.draft}</div>
    </header>

    <div className={`workflow-layout ${codexOpen ? '' : 'is-codex-closed'}`}>
      <main className="workflow-main" ref={mainRef}>
        <StageStepper stage={stage} states={states} onStage={goToStage} />

        <section className={`task-brief ${stageClass('context')}`} data-stage="context"><div><span>{t.prompt}</span><p>{task.prompt || t.noPrompt}</p></div><div><span>{t.objective}</span><p>{task.objective || t.noObjective}</p></div><div><span>{t.priority}</span><p>{task.priority || t.generalCriteria}</p></div></section>

        <div className={stageClass('inspection')} data-stage="inspection">
          <VideoWorkbench key={task.id} task={task} issues={evaluation.issues} selectedIssue={selectedIssue} onSelectIssue={setSelectedIssue} onAddIssue={setIssueContext} onInspect={() => setInspected(true)} disabled={disabled} />
        </div>

        <section className={`issues-section ${stageClass('annotation')}`} data-stage="annotation">
          <header><div><span>{t.ledger}</span><h2>{t.issues} ({evaluation.issues.length})</h2></div><button className="wf-btn wf-btn--ghost wf-codex-toggle" type="button" onClick={() => setCodexOpen((value) => !value)}>{codexOpen ? t.hideCodex : t.openCodex}</button></header>
          {evaluation.issues.length ? <div className="issue-list">{evaluation.issues.map((issue) => {
            const pixels = annotationPixels(issue.spatialAnnotation)
            return <article className={`issue-row sev-${issue.severity} ${selectedIssue?.id === issue.id ? 'is-selected' : ''}`} key={issue.id} onClick={() => setSelectedIssue(issue)}>
              <button type="button" className="issue-time">F{String(issue.startFrame).padStart(5, '0')}<small>{issue.startSec.toFixed(3)}s</small></button>
              <div><strong>{issue.tagLabel}</strong><span>{issue.category} · {issue.severity} · {issue.confidence}</span>{issue.evidence ? <p>{issue.evidence}</p> : null}{pixels ? <small><IconTarget size={12} /> x {pixels.x}, y {pixels.y}, {pixels.width}×{pixels.height}px</small> : null}</div>
              {!disabled ? <button type="button" className="issue-remove" onClick={(event) => { event.stopPropagation(); removeIssue(issue.id) }} aria-label={t.removeIssue}>×</button> : null}
            </article>
          })}</div> : <p className="wf-empty">{t.noIssues}</p>}
        </section>

        <section className={`evaluation-form ${stageClass('decision')}`} data-stage="decision"><header><span>{t.structuredResult}</span><h2>{workflow.title}</h2><p>{taglines[task.workflowId]}</p></header><WorkflowForm task={task} config={config} result={evaluation.result} disabled={disabled} onChange={(result) => setEvaluation((current) => ({ ...current, result }))} /><label className="wf-field"><span>{t.taskNotes}</span><textarea disabled={disabled} rows="3" value={evaluation.notes || ''} onChange={(event) => setEvaluation((current) => ({ ...current, notes: event.target.value }))} /></label></section>

        <section className={`review-stage ${stageClass('review')}`} data-stage="review">
          {disabled
            ? <SubmittedPanel task={task} evaluation={evaluation} nextTask={nextTask} />
            : <EvaluationSummary task={task} evaluation={evaluation} />}
          {errors.length ? <div className="wf-errors">{errors.map((error) => <p key={error}>{validationCopy[error] || error}</p>)}</div> : null}
          <details className="export-preview"><summary>{stageCopy.jsonToggle}</summary><pre>{JSON.stringify(exportData, null, 2)}</pre></details>
          <footer className="workflow-actions"><button className="wf-btn wf-btn--ghost" type="button" disabled={disabled} onClick={manualSave}><IconSave size={15} /> {t.saveDraft}</button><button className="wf-btn wf-btn--gold" type="button" disabled={disabled} onClick={submit}>{t.submit} <IconCheck size={15} /></button></footer>
        </section>
      </main>

      {codexOpen ? <>
        <div className="workflow-codex-backdrop" onClick={() => setCodexOpen(false)} aria-hidden="true" />
        <aside className="workflow-codex"><header><span>{t.codex}</span><button type="button" onClick={() => setCodexOpen(false)} aria-label={t.closeCodex}>×</button></header><CodexPanel tags={allowedTags} counts={counts} selectedId={selectedIssue?.tagId} onSelect={() => {}} /></aside>
      </> : null}
    </div>

    <EvaluationBottomBar
      stage={stage}
      states={states}
      saveState={saveState}
      disabled={disabled}
      onStage={goToStage}
      onSave={manualSave}
      onSubmit={submit}
      onCodex={() => setCodexOpen((value) => !value)}
    />

    {issueContext ? <IssueDialog context={issueContext} tags={allowedTags} onClose={() => setIssueContext(null)} onCreate={addIssue} /> : null}
  </div>
}
