import { navigate } from '../../router'
import { getEvaluation } from '../../evaluations'
import { getTasksForUser } from '../../tasks'
import { useDb } from '../../store'
import { workflowById } from '../../workflows'
import { Eyebrow } from '../ui'
import { IconArrowRight, IconCheck, IconFilm, IconWorkflow } from '../../icons'
import { useCopy, QUEUE } from '../../copy'

export default function WorkflowQueue({ user }) {
  useDb()
  const t = useCopy(QUEUE)
  const tasks = getTasksForUser(user.id, user.role)
  const pending = tasks.filter((task) => getEvaluation(task.id, user.id)?.status !== 'submitted')
  const submitted = tasks.filter((task) => getEvaluation(task.id, user.id)?.status === 'submitted')

  const renderGroup = (title, entries, done = false) => (
    <section className="queue-section">
      <header className="queue-section-head"><h2>{title}</h2><span>{entries.length}</span></header>
      {entries.length ? <div className="task-list">{entries.map((task) => {
        const workflow = workflowById(task.workflowId)
        const evaluation = getEvaluation(task.id, user.id)
        return <button className="task-row" type="button" key={task.id} onClick={() => navigate(`/workflow/${task.id}`)}>
          <span className="task-index">WF{String(workflow.number).padStart(2, '0')}</span>
          <span className="task-copy"><small>{workflow.title}{task.mode ? ` · ${task.mode.toUpperCase()}` : ''}</small><strong>{task.title}</strong><span>{task.priority}</span></span>
          <span className={`task-state ${done ? 'is-done' : evaluation ? 'is-draft' : ''}`}>{done ? <><IconCheck size={14} /> {t.sent}</> : evaluation ? t.draft : t.fresh}</span>
          <IconArrowRight size={17} />
        </button>
      })}</div> : <p className="wf-empty">{t.emptySection}</p>}
    </section>
  )

  return <div className="view workflow-queue">
    <header className="view-hero queue-hero">
      <div><Eyebrow>{t.eyebrow}</Eyebrow><h1 className="view-title">{t.title}</h1><p className="view-lede">{t.lede}</p></div>
      <div className="queue-meter"><IconWorkflow size={24} /><strong>{pending.length}</strong><span>{t.pending}</span></div>
    </header>
    {!tasks.length ? <div className="wf-empty-state"><IconFilm size={28} /><h2>{t.emptyTitle}</h2><p>{t.emptyLede}</p></div> : <>{renderGroup(t.inProgress, pending)}{submitted.length ? renderGroup(t.delivered, submitted, true) : null}</>}
  </div>
}
