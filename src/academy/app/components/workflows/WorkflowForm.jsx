import { createId } from '../../tasks'
import { IconPlus, IconTrash } from '../../icons'
import { useCopy, WORKFLOW_FORM, ENUM_LABELS, DEFAULT_REASON_LABELS } from '../../copy'

function Field({ label, children, className = '' }) {
  return <label className={`wf-field ${className}`}><span>{label}</span>{children}</label>
}

function Select({ value, onChange, options, disabled, placeholder, labels = {} }) {
  return <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} disabled={disabled}><option value="">{placeholder}</option>{options.map((option) => {
    const item = typeof option === 'string' ? { value: option, label: labels[option] || option } : option
    return <option key={item.value} value={item.value}>{item.label}</option>
  })}</select>
}

// `score === null` es "sin responder": ningún botón queda activo y se avisa.
function ScoreRows({ scores = [], onChange, disabled, pendingLabel }) {
  return <div className="score-rows">{scores.map((row, index) => <div className="score-row" key={row.dimension}>
    <span>{row.dimension}{row.score === null || row.score === undefined ? <em className="score-pending"> {pendingLabel}</em> : null}</span>
    <div>{[0, 1, 2, 3, 4, 5].map((score) => <button type="button" disabled={disabled} aria-label={`${row.dimension}: ${score}`} className={row.score === score ? 'is-active' : ''} key={score} onClick={() => onChange(scores.map((item, itemIndex) => itemIndex === index ? { ...item, score } : item))}>{score}</button>)}</div>
  </div>)}</div>
}

// N-way: se ordenan todos los outputs. El primero elegido queda como preferido,
// así el export y el resumen no necesitan tratar A/B y N-way por separado.
function RankingPicker({ task, result, onChange, disabled, t }) {
  const ranking = result.ranking || []
  const remaining = task.outputs.filter((output) => !ranking.includes(output.id))
  const pick = (output) => {
    const next = [...ranking, output.id]
    onChange({
      ...result,
      ranking: next,
      verdict: next.length === 1 ? output.id : result.verdict,
      preferredOutputId: next.length === 1 ? output.id : result.preferredOutputId,
    })
  }
  return <div className="ranking-picker">
    {ranking.length ? <ol className="ranking-list">{ranking.map((id) => {
      const output = task.outputs.find((item) => item.id === id)
      return <li key={id}>{output?.label || id}</li>
    })}</ol> : null}
    {remaining.length ? <div className="ranking-options">{remaining.map((output) => (
      <button type="button" key={output.id} disabled={disabled} onClick={() => pick(output)}>{output.label}</button>
    ))}</div> : null}
    {ranking.length ? <button type="button" className="wf-btn wf-btn--small wf-btn--ghost" disabled={disabled} onClick={() => onChange({ ...result, ranking: [], verdict: '', preferredOutputId: null })}>{t.clearRanking}</button> : null}
  </div>
}

function PreferenceForm({ task, result, onChange, disabled, reasons, t, reasonLabel }) {
  const verdictOptions = [...task.outputs.map((output) => ({ value: output.id, label: output.label })), { value: 'tie', label: t.tie }, { value: 'neither', label: t.neither }]
  const reasonOptions = reasons.map((reason) => ({ value: reason, label: reasonLabel[reason] || reason }))
  return <>
    {task.mode === 'nway'
      ? <Field label={t.ranking}><RankingPicker task={task} result={result} onChange={onChange} disabled={disabled} t={t} /><small>{t.rankingHint}</small></Field>
      : <Field label={t.preferredOutput}><Select disabled={disabled} placeholder={t.select} value={result.verdict || ''} options={verdictOptions} onChange={(verdict) => onChange({ ...result, verdict, preferredOutputId: task.outputs.some((output) => output.id === verdict) ? verdict : null })} /></Field>}
    <Field label={t.primaryReason}><Select disabled={disabled} placeholder={t.select} value={result.primaryReason || ''} options={reasonOptions} onChange={(primaryReason) => onChange({ ...result, primaryReason })} /></Field>
    <Field label={t.justification}><textarea disabled={disabled} rows="4" value={result.justification || ''} onChange={(event) => onChange({ ...result, justification: event.target.value })} placeholder={t.justificationPlaceholder} /></Field>
  </>
}

function EventsForm({ result, onChange, disabled, t }) {
  const events = result.events || []
  const update = (index, patch) => onChange({ ...result, events: events.map((event, itemIndex) => itemIndex === index ? { ...event, ...patch } : event) })
  const add = () => onChange({ ...result, events: [...events, { id: createId('event'), subject: '', action: '', object: '', startSec: 0, endSec: 0, confidence: null }] })
  return <>
    <div className="wf-list-head"><span>{t.temporalEvents}</span><button className="wf-btn wf-btn--small" type="button" disabled={disabled} onClick={add}><IconPlus size={14} /> {t.event}</button></div>
    <div className="structured-list">{events.map((event, index) => <div className="structured-row event-row" key={event.id}>
      <Field label={t.subject}><input disabled={disabled} value={event.subject} onChange={(e) => update(index, { subject: e.target.value })} /></Field>
      <Field label={t.action}><input disabled={disabled} value={event.action} onChange={(e) => update(index, { action: e.target.value })} /></Field>
      <Field label={t.object}><input disabled={disabled} value={event.object} onChange={(e) => update(index, { object: e.target.value })} /></Field>
      <Field label={t.start}><input disabled={disabled} type="number" step="0.001" value={event.startSec} onChange={(e) => update(index, { startSec: Number(e.target.value) })} /></Field>
      <Field label={t.end}><input disabled={disabled} type="number" step="0.001" value={event.endSec} onChange={(e) => update(index, { endSec: Number(e.target.value) })} /></Field>
      <button type="button" disabled={disabled} className="icon-danger" aria-label={t.remove} onClick={() => onChange({ ...result, events: events.filter((_, itemIndex) => itemIndex !== index) })}><IconTrash size={15} /></button>
    </div>)}</div>
    <Field label={t.summary}><textarea disabled={disabled} rows="3" value={result.summary || ''} onChange={(event) => onChange({ ...result, summary: event.target.value })} /></Field>
  </>
}

function AdherenceForm({ result, onChange, disabled, t, enumLabel }) {
  const items = result.items || []
  const update = (index, patch) => onChange({ ...result, items: items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) })
  return <>
    <div className="adherence-table">{items.map((item, index) => <div className="adherence-row" key={item.id}>
      <strong>{item.element}{item.status === null || item.status === undefined ? <em className="score-pending"> {t.unanswered}</em> : null}</strong>
      <Select disabled={disabled} placeholder={t.select} labels={enumLabel} value={item.status} options={['fulfilled', 'partial', 'missing', 'wrong', 'na']} onChange={(status) => update(index, { status })} />
      <input disabled={disabled} type="number" step="0.001" value={item.evidenceSec ?? ''} placeholder={t.second} onChange={(event) => update(index, { evidenceSec: event.target.value === '' ? null : Number(event.target.value) })} />
      <input disabled={disabled} value={item.note || ''} placeholder={t.evidence} onChange={(event) => update(index, { note: event.target.value })} />
    </div>)}</div>
    <Field label={t.recommendation}><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field>
  </>
}

function ContinuityForm({ task, result, onChange, disabled, t, enumLabel }) {
  const transitions = result.transitions || []
  const add = () => {
    const index = transitions.length
    const from = task.outputs[index]?.id || task.outputs[0]?.id || ''
    const to = task.outputs[index + 1]?.id || task.outputs[1]?.id || ''
    onChange({ ...result, transitions: [...transitions, { id: createId('transition'), fromOutputId: from, toOutputId: to, status: null, severity: null, note: '' }] })
  }
  const update = (index, patch) => onChange({ ...result, transitions: transitions.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) })
  const outputOptions = task.outputs.map((output) => ({ value: output.id, label: output.label }))
  return <>
    <div className="wf-list-head"><span>{t.transitions}</span><button className="wf-btn wf-btn--small" type="button" disabled={disabled} onClick={add}><IconPlus size={14} /> {t.transition}</button></div>
    <div className="structured-list">{transitions.map((transition, index) => <div className="structured-row transition-row" key={transition.id}>
      <Select disabled={disabled} placeholder={t.select} value={transition.fromOutputId} options={outputOptions} onChange={(fromOutputId) => update(index, { fromOutputId })} />
      <span>→</span>
      <Select disabled={disabled} placeholder={t.select} value={transition.toOutputId} options={outputOptions} onChange={(toOutputId) => update(index, { toOutputId })} />
      <Select disabled={disabled} placeholder={t.select} labels={enumLabel} value={transition.status} options={['pass', 'minor', 'major', 'blocking', 'na']} onChange={(status) => update(index, { status })} />
      <input disabled={disabled} value={transition.note} placeholder={t.evidence} onChange={(event) => update(index, { note: event.target.value })} />
      <button type="button" disabled={disabled} className="icon-danger" aria-label={t.remove} onClick={() => onChange({ ...result, transitions: transitions.filter((_, itemIndex) => itemIndex !== index) })}><IconTrash size={15} /></button>
    </div>)}</div>
    <Field label={t.recommendation}><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field>
  </>
}

export default function WorkflowForm({ task, result, onChange, disabled, config }) {
  const t = useCopy(WORKFLOW_FORM)
  const enumLabel = useCopy(ENUM_LABELS)
  const reasonLabel = useCopy(DEFAULT_REASON_LABELS)
  const shared = { disabled, placeholder: t.select, labels: enumLabel }

  switch (task.workflowId) {
    case 'preference_evaluation':
      return <PreferenceForm task={task} result={result} onChange={onChange} disabled={disabled} reasons={config.primaryReasons || []} t={t} reasonLabel={reasonLabel} />
    case 'single_video_qc':
      return <>
        <Field label={t.qcVerdict}><Select {...shared} value={result.verdict || ''} options={['pass', 'marginal', 'fail']} onChange={(verdict) => onChange({ ...result, verdict })} /></Field>
        <ScoreRows disabled={disabled} pendingLabel={t.unanswered} scores={result.scores} onChange={(scores) => onChange({ ...result, scores })} />
        <Field label={t.recommendation}><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field>
      </>
    case 'event_temporal_annotation':
      return <EventsForm result={result} onChange={onChange} disabled={disabled} t={t} />
    case 'prompt_adherence':
      return <AdherenceForm result={result} onChange={onChange} disabled={disabled} t={t} enumLabel={enumLabel} />
    case 'continuity_coherence':
      return <ContinuityForm task={task} result={result} onChange={onChange} disabled={disabled} t={t} enumLabel={enumLabel} />
    case 'style_consistency':
      return <>
        <Field label={t.styleVerdict}><Select {...shared} value={result.verdict || ''} options={['on_brand', 'mostly_aligned', 'partially_aligned', 'off_brand', 'reject']} onChange={(verdict) => onChange({ ...result, verdict })} /></Field>
        <ScoreRows disabled={disabled} pendingLabel={t.unanswered} scores={result.scores} onChange={(scores) => onChange({ ...result, scores })} />
        <Field label={t.evidence}><textarea disabled={disabled} rows="3" value={result.evidence || ''} onChange={(event) => onChange({ ...result, evidence: event.target.value })} /></Field>
      </>
    case 'audio_visual_sync':
      return <>
        <Field label={t.decision}><Select {...shared} value={result.decision || ''} options={['acceptable', 'minor', 'major', 'reject', 'useful_negative']} onChange={(decision) => onChange({ ...result, decision })} /></Field>
        <div className="wf-field-row">
          <Field label={t.offsetMs}><input disabled={disabled} type="number" placeholder={t.offsetPlaceholder} value={result.offsetMs ?? ''} onChange={(event) => onChange({ ...result, offsetMs: event.target.value === '' ? null : Number(event.target.value) })} /></Field>
          <Field label={t.markerSec}><input disabled={disabled} type="number" step="0.001" placeholder={t.markerPlaceholder} value={result.markerSec ?? ''} onChange={(event) => onChange({ ...result, markerSec: event.target.value === '' ? null : Number(event.target.value) })} /></Field>
        </div>
        <Field label={t.evidence}><textarea disabled={disabled} rows="3" value={result.evidence || ''} onChange={(event) => onChange({ ...result, evidence: event.target.value })} /></Field>
      </>
    case 'physics_behavior':
      return <>
        <Field label={t.decision}><Select {...shared} value={result.verdict || ''} options={['plausible', 'minor_issue', 'major_issue', 'impossible']} onChange={(verdict) => onChange({ ...result, verdict })} /></Field>
        <div className="wf-field-row">
          <Field label={t.expected}><textarea disabled={disabled} rows="3" value={result.expected || ''} onChange={(event) => onChange({ ...result, expected: event.target.value })} /></Field>
          <Field label={t.observed}><textarea disabled={disabled} rows="3" value={result.observed || ''} onChange={(event) => onChange({ ...result, observed: event.target.value })} /></Field>
        </div>
        <Field label={t.severity}><Select {...shared} value={result.severity} options={['low', 'medium', 'high', 'critical']} onChange={(severity) => onChange({ ...result, severity })} /></Field>
        <Field label={t.recommendation}><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field>
      </>
    case 'safety_compliance':
      return <>
        <Field label={t.decision}><Select {...shared} value={result.decision || ''} options={['safe', 'safe_with_notes', 'needs_policy_review', 'escalate', 'block']} onChange={(decision) => onChange({ ...result, decision })} /></Field>
        <div className="wf-field-row">
          <Field label={t.riskCategory}><input disabled={disabled} value={result.category || ''} onChange={(event) => onChange({ ...result, category: event.target.value })} /></Field>
          <Field label={t.level}><Select {...shared} value={result.level} options={['low', 'medium', 'high', 'critical']} onChange={(level) => onChange({ ...result, level })} /></Field>
        </div>
        <Field label={t.policyRef}><input disabled={disabled} value={result.policyRef || ''} onChange={(event) => onChange({ ...result, policyRef: event.target.value })} /></Field>
        <Field label={t.evidence}><textarea disabled={disabled} rows="3" value={result.evidence || ''} onChange={(event) => onChange({ ...result, evidence: event.target.value })} /></Field>
      </>
    case 'adversarial_red_team':
      return <>
        <Field label={t.scenario}><textarea disabled={disabled} rows="3" value={result.scenario || ''} onChange={(event) => onChange({ ...result, scenario: event.target.value })} /></Field>
        <div className="wf-field-row">
          <Field label={t.attackVector}><Select {...shared} value={result.attackVector || ''} options={['consistency_attack', 'identity_forgery', 'semantic_mismatch', 'style_bypass', 'prompt_injection', 'other']} onChange={(attackVector) => onChange({ ...result, attackVector })} /></Field>
          <Field label={t.failureMode}><Select {...shared} value={result.failureMode || ''} options={['identity_not_preserved', 'temporal_incoherence', 'anatomy_failure', 'physics_failure', 'hallucinated_element', 'safety_policy_breach', 'other']} onChange={(failureMode) => onChange({ ...result, failureMode })} /></Field>
        </div>
        <div className="wf-field-row">
          <Field label={t.severity}><Select {...shared} value={result.severity} options={['low', 'medium', 'high', 'critical']} onChange={(severity) => onChange({ ...result, severity })} /></Field>
          <Field label={t.reproducibility}><Select {...shared} value={result.reproducibility} options={['once', 'low', 'medium', 'high']} onChange={(reproducibility) => onChange({ ...result, reproducibility })} /></Field>
        </div>
        <Field label={t.recommendation}><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field>
      </>
    default:
      return null
  }
}
