import { createId } from '../../tasks'
import { IconPlus, IconTrash } from '../../icons'

function Field({ label, children, className = '' }) {
  return <label className={`wf-field ${className}`}><span>{label}</span>{children}</label>
}

function Select({ value, onChange, options, disabled }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}><option value="">Seleccionar…</option>{options.map((option) => {
    const item = typeof option === 'string' ? { value: option, label: option } : option
    return <option key={item.value} value={item.value}>{item.label}</option>
  })}</select>
}

function ScoreRows({ scores = [], onChange, disabled }) {
  return <div className="score-rows">{scores.map((row, index) => <div className="score-row" key={row.dimension}><span>{row.dimension}</span><div>{[0, 1, 2, 3, 4, 5].map((score) => <button type="button" disabled={disabled} className={row.score === score ? 'is-active' : ''} key={score} onClick={() => onChange(scores.map((item, itemIndex) => itemIndex === index ? { ...item, score } : item))}>{score}</button>)}</div></div>)}</div>
}

function PreferenceForm({ task, result, onChange, disabled, reasons }) {
  const verdictOptions = [...task.outputs.map((output) => ({ value: output.id, label: output.label })), { value: 'tie', label: 'Empate' }, { value: 'neither', label: 'Ninguno sirve' }]
  return <>
    <Field label="Output preferido"><Select disabled={disabled} value={result.verdict || ''} options={verdictOptions} onChange={(verdict) => onChange({ ...result, verdict, preferredOutputId: task.outputs.some((output) => output.id === verdict) ? verdict : null })} /></Field>
    <Field label="Razón principal"><Select disabled={disabled} value={result.primaryReason || ''} options={reasons} onChange={(primaryReason) => onChange({ ...result, primaryReason })} /></Field>
    <Field label="Justificación observable"><textarea disabled={disabled} rows="4" value={result.justification || ''} onChange={(event) => onChange({ ...result, justification: event.target.value })} placeholder="Nombrá el criterio decisivo y la evidencia concreta." /></Field>
  </>
}

function EventsForm({ result, onChange, disabled }) {
  const events = result.events || []
  const update = (index, patch) => onChange({ ...result, events: events.map((event, itemIndex) => itemIndex === index ? { ...event, ...patch } : event) })
  const add = () => onChange({ ...result, events: [...events, { id: createId('event'), subject: '', action: '', object: '', startSec: 0, endSec: 0, confidence: 'high' }] })
  return <>
    <div className="wf-list-head"><span>Eventos temporales</span><button className="wf-btn wf-btn--small" type="button" disabled={disabled} onClick={add}><IconPlus size={14} /> Evento</button></div>
    <div className="structured-list">{events.map((event, index) => <div className="structured-row event-row" key={event.id}>
      <Field label="Sujeto"><input disabled={disabled} value={event.subject} onChange={(e) => update(index, { subject: e.target.value })} /></Field>
      <Field label="Acción"><input disabled={disabled} value={event.action} onChange={(e) => update(index, { action: e.target.value })} /></Field>
      <Field label="Objeto"><input disabled={disabled} value={event.object} onChange={(e) => update(index, { object: e.target.value })} /></Field>
      <Field label="Inicio"><input disabled={disabled} type="number" step="0.001" value={event.startSec} onChange={(e) => update(index, { startSec: Number(e.target.value) })} /></Field>
      <Field label="Fin"><input disabled={disabled} type="number" step="0.001" value={event.endSec} onChange={(e) => update(index, { endSec: Number(e.target.value) })} /></Field>
      <button type="button" disabled={disabled} className="icon-danger" onClick={() => onChange({ ...result, events: events.filter((_, itemIndex) => itemIndex !== index) })}><IconTrash size={15} /></button>
    </div>)}</div>
    <Field label="Resumen"><textarea disabled={disabled} rows="3" value={result.summary || ''} onChange={(event) => onChange({ ...result, summary: event.target.value })} /></Field>
  </>
}

function AdherenceForm({ result, onChange, disabled }) {
  const items = result.items || []
  const update = (index, patch) => onChange({ ...result, items: items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) })
  return <>
    <div className="adherence-table">{items.map((item, index) => <div className="adherence-row" key={item.id}>
      <strong>{item.element}</strong>
      <Select disabled={disabled} value={item.status} options={['fulfilled', 'partial', 'missing', 'wrong', 'na']} onChange={(status) => update(index, { status })} />
      <input disabled={disabled} type="number" step="0.001" value={item.evidenceSec ?? ''} placeholder="segundo" onChange={(event) => update(index, { evidenceSec: event.target.value === '' ? null : Number(event.target.value) })} />
      <input disabled={disabled} value={item.note || ''} placeholder="evidencia" onChange={(event) => update(index, { note: event.target.value })} />
    </div>)}</div>
    <Field label="Recomendación"><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field>
  </>
}

function ContinuityForm({ task, result, onChange, disabled }) {
  const transitions = result.transitions || []
  const add = () => {
    const index = transitions.length
    const from = task.outputs[index]?.id || task.outputs[0]?.id || ''
    const to = task.outputs[index + 1]?.id || task.outputs[1]?.id || ''
    onChange({ ...result, transitions: [...transitions, { id: createId('transition'), fromOutputId: from, toOutputId: to, status: 'pass', severity: 'low', note: '' }] })
  }
  const update = (index, patch) => onChange({ ...result, transitions: transitions.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) })
  return <>
    <div className="wf-list-head"><span>Transiciones</span><button className="wf-btn wf-btn--small" type="button" disabled={disabled} onClick={add}><IconPlus size={14} /> Transición</button></div>
    <div className="structured-list">{transitions.map((transition, index) => <div className="structured-row transition-row" key={transition.id}>
      <Select disabled={disabled} value={transition.fromOutputId} options={task.outputs.map((output) => ({ value: output.id, label: output.label }))} onChange={(fromOutputId) => update(index, { fromOutputId })} />
      <span>→</span>
      <Select disabled={disabled} value={transition.toOutputId} options={task.outputs.map((output) => ({ value: output.id, label: output.label }))} onChange={(toOutputId) => update(index, { toOutputId })} />
      <Select disabled={disabled} value={transition.status} options={['pass', 'minor', 'major', 'blocking', 'na']} onChange={(status) => update(index, { status })} />
      <input disabled={disabled} value={transition.note} placeholder="evidencia" onChange={(event) => update(index, { note: event.target.value })} />
      <button type="button" disabled={disabled} className="icon-danger" onClick={() => onChange({ ...result, transitions: transitions.filter((_, itemIndex) => itemIndex !== index) })}><IconTrash size={15} /></button>
    </div>)}</div>
    <Field label="Recomendación"><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field>
  </>
}

export default function WorkflowForm({ task, result, onChange, disabled, config }) {
  switch (task.workflowId) {
    case 'preference_evaluation':
      return <PreferenceForm task={task} result={result} onChange={onChange} disabled={disabled} reasons={config.primaryReasons || []} />
    case 'single_video_qc':
      return <><Field label="Veredicto QC"><Select disabled={disabled} value={result.verdict || ''} options={['pass', 'marginal', 'fail']} onChange={(verdict) => onChange({ ...result, verdict })} /></Field><ScoreRows disabled={disabled} scores={result.scores} onChange={(scores) => onChange({ ...result, scores })} /><Field label="Recomendación"><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field></>
    case 'event_temporal_annotation':
      return <EventsForm result={result} onChange={onChange} disabled={disabled} />
    case 'prompt_adherence':
      return <AdherenceForm result={result} onChange={onChange} disabled={disabled} />
    case 'continuity_coherence':
      return <ContinuityForm task={task} result={result} onChange={onChange} disabled={disabled} />
    case 'style_consistency':
      return <><Field label="Veredicto de estilo"><Select disabled={disabled} value={result.verdict || ''} options={['on_brand', 'mostly_aligned', 'partially_aligned', 'off_brand', 'reject']} onChange={(verdict) => onChange({ ...result, verdict })} /></Field><ScoreRows disabled={disabled} scores={result.scores} onChange={(scores) => onChange({ ...result, scores })} /><Field label="Evidencia"><textarea disabled={disabled} rows="3" value={result.evidence || ''} onChange={(event) => onChange({ ...result, evidence: event.target.value })} /></Field></>
    case 'audio_visual_sync':
      return <><Field label="Decisión"><Select disabled={disabled} value={result.decision || ''} options={['acceptable', 'minor', 'major', 'reject', 'useful_negative']} onChange={(decision) => onChange({ ...result, decision })} /></Field><div className="wf-field-row"><Field label="Offset (ms)"><input disabled={disabled} type="number" value={result.offsetMs || 0} onChange={(event) => onChange({ ...result, offsetMs: Number(event.target.value) })} /></Field><Field label="Marcador (s)"><input disabled={disabled} type="number" step="0.001" value={result.markerSec || 0} onChange={(event) => onChange({ ...result, markerSec: Number(event.target.value) })} /></Field></div><Field label="Evidencia"><textarea disabled={disabled} rows="3" value={result.evidence || ''} onChange={(event) => onChange({ ...result, evidence: event.target.value })} /></Field></>
    case 'physics_behavior':
      return <><Field label="Decisión"><Select disabled={disabled} value={result.verdict || ''} options={['plausible', 'minor_issue', 'major_issue', 'impossible']} onChange={(verdict) => onChange({ ...result, verdict })} /></Field><div className="wf-field-row"><Field label="Comportamiento esperado"><textarea disabled={disabled} rows="3" value={result.expected || ''} onChange={(event) => onChange({ ...result, expected: event.target.value })} /></Field><Field label="Comportamiento observado"><textarea disabled={disabled} rows="3" value={result.observed || ''} onChange={(event) => onChange({ ...result, observed: event.target.value })} /></Field></div><Field label="Severidad"><Select disabled={disabled} value={result.severity} options={['low', 'medium', 'high', 'critical']} onChange={(severity) => onChange({ ...result, severity })} /></Field><Field label="Recomendación"><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field></>
    case 'safety_compliance':
      return <><Field label="Decisión"><Select disabled={disabled} value={result.decision || ''} options={['safe', 'safe_with_notes', 'needs_policy_review', 'escalate', 'block']} onChange={(decision) => onChange({ ...result, decision })} /></Field><div className="wf-field-row"><Field label="Categoría de riesgo"><input disabled={disabled} value={result.category || ''} onChange={(event) => onChange({ ...result, category: event.target.value })} /></Field><Field label="Nivel"><Select disabled={disabled} value={result.level} options={['low', 'medium', 'high', 'critical']} onChange={(level) => onChange({ ...result, level })} /></Field></div><Field label="Referencia de política"><input disabled={disabled} value={result.policyRef || ''} onChange={(event) => onChange({ ...result, policyRef: event.target.value })} /></Field><Field label="Evidencia"><textarea disabled={disabled} rows="3" value={result.evidence || ''} onChange={(event) => onChange({ ...result, evidence: event.target.value })} /></Field></>
    case 'adversarial_red_team':
      return <><Field label="Escenario"><textarea disabled={disabled} rows="3" value={result.scenario || ''} onChange={(event) => onChange({ ...result, scenario: event.target.value })} /></Field><div className="wf-field-row"><Field label="Vector de ataque"><Select disabled={disabled} value={result.attackVector || ''} options={['consistency_attack', 'identity_forgery', 'semantic_mismatch', 'style_bypass', 'prompt_injection', 'other']} onChange={(attackVector) => onChange({ ...result, attackVector })} /></Field><Field label="Modo de falla"><Select disabled={disabled} value={result.failureMode || ''} options={['identity_not_preserved', 'temporal_incoherence', 'anatomy_failure', 'physics_failure', 'hallucinated_element', 'safety_policy_breach', 'other']} onChange={(failureMode) => onChange({ ...result, failureMode })} /></Field></div><div className="wf-field-row"><Field label="Severidad"><Select disabled={disabled} value={result.severity} options={['low', 'medium', 'high', 'critical']} onChange={(severity) => onChange({ ...result, severity })} /></Field><Field label="Reproducibilidad"><Select disabled={disabled} value={result.reproducibility} options={['once', 'low', 'medium', 'high']} onChange={(reproducibility) => onChange({ ...result, reproducibility })} /></Field></div><Field label="Recomendación"><textarea disabled={disabled} rows="3" value={result.recommendation || ''} onChange={(event) => onChange({ ...result, recommendation: event.target.value })} /></Field></>
    default:
      return null
  }
}
