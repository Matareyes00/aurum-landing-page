import { IconArrowLeft, IconArrowRight, IconCheck, IconSave } from '../../icons'
import { STAGES, stageProgress } from '../../stages'
import { useCopy, STAGE_UI, WORKSPACE } from '../../copy'

/**
 * Barra inferior fija en mobile: estado de guardado, progreso, navegación entre
 * etapas y envío. En desktop el CSS la oculta, porque las acciones ya viven al
 * pie del formulario.
 */
export default function EvaluationBottomBar({ stage, states, saveState, disabled, onStage, onSave, onSubmit, onCodex }) {
  const t = useCopy(STAGE_UI)
  const workspace = useCopy(WORKSPACE)
  const { done, total } = stageProgress(states)
  const index = STAGES.indexOf(stage)
  const isLast = index === STAGES.length - 1

  return (
    <footer className="evaluation-bottom-bar">
      <div className="ebb-meta">
        <span className={`ebb-save is-${saveState}`}>
          {disabled ? <><IconCheck size={12} /> {workspace.sent}</> : saveState === 'saving' ? workspace.saving : saveState === 'saved' ? <><IconCheck size={12} /> {workspace.savedState}</> : workspace.draft}
        </span>
        <span className="ebb-progress">{done}/{total}</span>
      </div>
      <div className="ebb-actions">
        <button type="button" className="wf-btn wf-btn--ghost" disabled={index === 0} onClick={() => onStage(STAGES[index - 1])} aria-label={t.prev}><IconArrowLeft size={15} /></button>
        <button type="button" className="wf-btn wf-btn--ghost" onClick={onCodex}>{t.openCodex}</button>
        {!disabled ? <button type="button" className="wf-btn wf-btn--ghost" onClick={onSave} aria-label={workspace.saveDraft}><IconSave size={15} /></button> : null}
        {isLast
          ? <button type="button" className="wf-btn wf-btn--gold" disabled={disabled} onClick={onSubmit}>{workspace.submit}</button>
          : <button type="button" className="wf-btn wf-btn--gold" onClick={() => onStage(STAGES[index + 1])}>{t.next} <IconArrowRight size={15} /></button>}
      </div>
    </footer>
  )
}
