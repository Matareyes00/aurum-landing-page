import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createId } from '../../tasks'
import { IconTarget, IconTrash } from '../../icons'
import CodexPanel from './CodexPanel'

const SEVERITIES = ['low', 'medium', 'high', 'critical']
const CONFIDENCES = ['low', 'medium', 'high']

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}

export function annotationPixels(annotation) {
  if (!annotation) return null
  return {
    x: Math.round(annotation.x * annotation.sourceWidth),
    y: Math.round(annotation.y * annotation.sourceHeight),
    width: Math.round(annotation.width * annotation.sourceWidth),
    height: Math.round(annotation.height * annotation.sourceHeight),
  }
}

function BBoxEditor({ frameDataUrl, sourceWidth, sourceHeight, frameNumber, frameSec, value, onChange }) {
  const stageRef = useRef(null)
  const dragRef = useRef(null)

  const pointFor = (event) => {
    const rect = stageRef.current.getBoundingClientRect()
    return { x: clamp((event.clientX - rect.left) / rect.width), y: clamp((event.clientY - rect.top) / rect.height) }
  }

  const onPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    const point = pointFor(event)
    const inside = value && point.x >= value.x && point.x <= value.x + value.width && point.y >= value.y && point.y <= value.y + value.height
    dragRef.current = inside
      ? { mode: 'move', start: point, original: value }
      : { mode: 'draw', start: point }
    if (!inside) onChange({ type: 'bbox', x: point.x, y: point.y, width: 0, height: 0, sourceWidth, sourceHeight, frameNumber, frameSec })
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (!drag) return
    const point = pointFor(event)
    if (drag.mode === 'move') {
      const dx = point.x - drag.start.x
      const dy = point.y - drag.start.y
      onChange({
        ...drag.original,
        x: clamp(drag.original.x + dx, 0, 1 - drag.original.width),
        y: clamp(drag.original.y + dy, 0, 1 - drag.original.height),
      })
      return
    }
    const x = Math.min(drag.start.x, point.x)
    const y = Math.min(drag.start.y, point.y)
    onChange({ type: 'bbox', x, y, width: Math.abs(point.x - drag.start.x), height: Math.abs(point.y - drag.start.y), sourceWidth, sourceHeight, frameNumber, frameSec })
  }

  const onPointerUp = () => {
    if (value && (value.width < 0.005 || value.height < 0.005)) onChange(null)
    dragRef.current = null
  }

  const pixels = annotationPixels(value)
  return (
    <div className="bbox-editor">
      <div
        ref={stageRef}
        className="bbox-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <img src={frameDataUrl} alt={`Frame ${frameNumber}`} draggable="false" />
        {value ? <span className="bbox-selection" style={{ left: `${value.x * 100}%`, top: `${value.y * 100}%`, width: `${value.width * 100}%`, height: `${value.height * 100}%` }} /> : null}
      </div>
      <div className="bbox-readout">
        <span>{pixels ? `x ${pixels.x}px · y ${pixels.y}px · w ${pixels.width}px · h ${pixels.height}px` : 'Arrastrá para marcar el artefacto'}</span>
        <span>{value ? `${(value.x * 100).toFixed(1)}% / ${(value.y * 100).toFixed(1)}% · ${(value.width * 100).toFixed(1)}% × ${(value.height * 100).toFixed(1)}%` : null}</span>
        {value ? <button type="button" onClick={() => onChange(null)} aria-label="Borrar selección"><IconTrash size={14} /></button> : null}
      </div>
    </div>
  )
}

export default function IssueDialog({ context, tags, onClose, onCreate }) {
  const [selectedTag, setSelectedTag] = useState(null)
  const [severity, setSeverity] = useState('medium')
  const [confidence, setConfidence] = useState('high')
  const [startSec, setStartSec] = useState(context.inSec ?? context.currentSec ?? 0)
  const [endSec, setEndSec] = useState(context.outSec ?? context.inSec ?? context.currentSec ?? 0)
  const [affectedArea, setAffectedArea] = useState('')
  const [evidence, setEvidence] = useState('')
  const [annotation, setAnnotation] = useState(null)
  const fps = context.output.fps || 24
  const frameNumber = Math.round(startSec * fps)

  const filteredTags = useMemo(() => tags, [tags])
  const chooseTag = (tag) => {
    setSelectedTag(tag)
    if (tag.defaultSeverity) setSeverity(tag.defaultSeverity)
  }

  const confirm = () => {
    if (!selectedTag) return
    onCreate({
      id: createId('issue'),
      outputId: context.output.id,
      tagId: selectedTag.id,
      tagLabel: selectedTag.label,
      category: selectedTag.category,
      severity,
      confidence,
      startSec: Number(startSec),
      endSec: Math.max(Number(startSec), Number(endSec)),
      startFrame: Math.round(Number(startSec) * fps),
      endFrame: Math.round(Math.max(Number(startSec), Number(endSec)) * fps),
      affectedArea: affectedArea.trim(),
      evidence: evidence.trim(),
      spatialAnnotation: annotation ? { ...annotation, frameSec: Number(startSec), frameNumber } : undefined,
    })
  }

  return createPortal(
    <div className="wf-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="wf-modal issue-modal" role="dialog" aria-modal="true" aria-label={`Agregar issue en ${context.output.label}`}>
        <header className="wf-modal-head">
          <div><span>Evidence capture</span><h2>Issue · {context.output.label}</h2></div>
          <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <div className="issue-modal-grid">
          <div className="issue-codex"><CodexPanel tags={filteredTags} selectedId={selectedTag?.id} onSelect={chooseTag} /></div>
          <div className="issue-fields">
            <div className="wf-field-row">
              <label className="wf-field"><span>Inicio</span><input type="number" step="0.001" value={startSec} onChange={(event) => setStartSec(event.target.value)} /><small>Frame {frameNumber}</small></label>
              <label className="wf-field"><span>Fin</span><input type="number" step="0.001" value={endSec} onChange={(event) => setEndSec(event.target.value)} /></label>
            </div>
            <div className="wf-field"><span>Severidad</span><div className="segmented">{SEVERITIES.map((value) => <button type="button" className={severity === value ? 'is-active' : ''} key={value} onClick={() => setSeverity(value)}>{value}</button>)}</div></div>
            <div className="wf-field"><span>Confianza</span><div className="segmented">{CONFIDENCES.map((value) => <button type="button" className={confidence === value ? 'is-active' : ''} key={value} onClick={() => setConfidence(value)}>{value}</button>)}</div></div>
            <label className="wf-field"><span>Área afectada</span><input value={affectedArea} onChange={(event) => setAffectedArea(event.target.value)} placeholder="Mano derecha, fondo, reflejo…" /></label>
            <label className="wf-field"><span>Evidencia observable</span><textarea rows="3" value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Qué ves, dónde ocurre y por qué corresponde al tag." /></label>
            {context.frameDataUrl ? (
              <div className="wf-field"><span><IconTarget size={14} /> Selección espacial</span><BBoxEditor frameDataUrl={context.frameDataUrl} sourceWidth={context.width} sourceHeight={context.height} frameNumber={frameNumber} frameSec={Number(startSec)} value={annotation} onChange={setAnnotation} /></div>
            ) : <p className="wf-warning">El video no permitió capturar este frame. El issue temporal se puede guardar sin bbox.</p>}
            <div className="wf-modal-actions">
              <button className="wf-btn wf-btn--ghost" type="button" onClick={onClose}>Cancelar</button>
              <button className="wf-btn wf-btn--gold" type="button" disabled={!selectedTag} onClick={confirm}>Agregar issue</button>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}
