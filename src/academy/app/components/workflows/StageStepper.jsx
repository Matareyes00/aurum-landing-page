import { IconCheck } from '../../icons'
import { STAGES, stageProgress, firstPendingStage } from '../../stages'
import { useCopy, STAGE_UI } from '../../copy'

/**
 * Recorrido de etapas de la evaluación. En desktop funciona como índice: marca
 * la etapa activa y salta a la sección. En mobile es el único navegador, porque
 * el CSS oculta las secciones que no son la etapa activa.
 */
export default function StageStepper({ stage, states, onStage }) {
  const t = useCopy(STAGE_UI)
  const { done, total } = stageProgress(states)
  const pending = firstPendingStage(states)

  return (
    <nav className="stage-stepper" aria-label={t.stage}>
      <ol>
        {STAGES.map((item, index) => {
          const state = states[item]
          return (
            <li key={item}>
              <button
                type="button"
                className={`stage-step is-${state} ${stage === item ? 'is-active' : ''}`}
                aria-current={stage === item ? 'step' : undefined}
                onClick={() => onStage(item)}
              >
                <span className="stage-step-mark">{state === 'done' ? <IconCheck size={12} /> : index + 1}</span>
                <span className="stage-step-copy">
                  <strong>{t[item]}</strong>
                  <small>{state === 'optional' ? t.optional : state === 'done' ? t.complete : t.pending}</small>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="stage-progress">
        <span>{t.progress} {done}/{total}</span>
        {done < total ? <button type="button" onClick={() => onStage(pending)}>{t.goToPending}</button> : null}
      </div>
    </nav>
  )
}
