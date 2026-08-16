import { navigate } from '../../router'
import { IconArrowRight, IconCheck } from '../../icons'
import EvaluationSummary from './EvaluationSummary'
import { useCopy, STAGE_UI } from '../../copy'

/** Confirmación tras enviar: resumen humano y acceso a la próxima tarea. */
export default function SubmittedPanel({ task, evaluation, nextTask }) {
  const t = useCopy(STAGE_UI)

  return (
    <section className="submitted-panel" role="status">
      <header>
        <span className="submitted-mark"><IconCheck size={20} /></span>
        <div>
          <h2>{t.submittedTitle}</h2>
          <p>{t.submittedLede}</p>
        </div>
      </header>
      <EvaluationSummary task={task} evaluation={evaluation} />
      <div className="submitted-actions">
        <button className="wf-btn wf-btn--ghost" type="button" onClick={() => navigate('/workflows')}>{t.backToQueue}</button>
        {nextTask
          ? <button className="wf-btn wf-btn--gold" type="button" onClick={() => navigate(`/workflow/${nextTask.id}`)}>{t.nextTask} <IconArrowRight size={15} /></button>
          : <span className="wf-muted">{t.noNextTask}</span>}
      </div>
    </section>
  )
}
