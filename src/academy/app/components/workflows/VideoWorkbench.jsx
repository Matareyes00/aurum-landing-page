import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  IconChevronLeft, IconChevronRight, IconPause, IconPlay, IconPlus,
  IconRepeat, IconTarget, IconZoomIn, IconZoomOut,
} from '../../icons'
import { useCopy, WORKBENCH } from '../../copy'

function timecode(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safe / 60)
  const secs = Math.floor(safe % 60)
  const millis = Math.floor((safe % 1) * 1000)
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
}

export function createOutputControls(outputs) {
  return outputs.map((output) => ({
    duration: output.durationSec || 0,
    currentSec: 0,
    playing: false,
    rate: 1,
    inSec: null,
    outSec: null,
    looping: false,
    zoom: 1,
  }))
}

export function updateMarkRange(control, type, seconds) {
  const position = Math.max(0, Number(seconds) || 0)
  if (type === 'in') {
    return {
      ...control,
      inSec: position,
      outSec: control.outSec !== null && control.outSec < position ? null : control.outSec,
    }
  }
  return { ...control, outSec: Math.max(position, control.inSec ?? position) }
}

export default function VideoWorkbench({ task, issues, selectedIssue, onSelectIssue, onAddIssue, onInspect, disabled }) {
  const t = useCopy(WORKBENCH)
  const refs = useRef([])
  const [controls, setControls] = useState(() => createOutputControls(task.outputs))
  const [toolsOpen, setToolsOpen] = useState(() => typeof window === 'undefined' || window.innerWidth > 620)
  const [activeOutput, setActiveOutput] = useState(0)
  const [armedMark, setArmedMark] = useState(null)
  const inspectedRef = useRef(false)
  const toolsId = useId()
  const active = controls[activeOutput] || createOutputControls([task.outputs[activeOutput] || {}])[0]
  const activeMeta = task.outputs[activeOutput]
  const fps = activeMeta?.fps || 24

  useEffect(() => {
    setControls(createOutputControls(task.outputs))
    setActiveOutput(0)
    setArmedMark(null)
    inspectedRef.current = false
    refs.current = refs.current.slice(0, task.outputs.length)
  }, [task.id])

  const updateControl = (index, update) => {
    setControls((current) => current.map((control, controlIndex) => {
      if (controlIndex !== index) return control
      return typeof update === 'function' ? update(control) : { ...control, ...update }
    }))
  }

  const markInspected = () => {
    if (inspectedRef.current) return
    inspectedRef.current = true
    onInspect?.()
  }

  const seek = (seconds, index = activeOutput, applyArmedMark = true) => {
    markInspected()
    const control = controls[index]
    const duration = control?.duration || Number(seconds) || 0
    const next = Math.max(0, Math.min(Number(seconds) || 0, duration))
    const video = refs.current[index]
    if (video) video.currentTime = next
    updateControl(index, (current) => {
      const moved = { ...current, currentSec: next }
      return applyArmedMark && armedMark?.index === index
        ? updateMarkRange(moved, armedMark.type, next)
        : moved
    })
  }

  useEffect(() => {
    if (!selectedIssue) return
    const index = task.outputs.findIndex((output) => output.id === selectedIssue.outputId)
    if (index < 0) return
    setActiveOutput(index)
    setArmedMark(null)
    refs.current[index]?.pause()
    updateControl(index, { playing: false })
    seek(selectedIssue.startSec, index, false)
  }, [selectedIssue?.id])

  const markers = useMemo(() => {
    if (!activeMeta) return []
    return issues
      .filter((issue) => issue.outputId === activeMeta.id)
      .map((issue) => ({ ...issue, pct: active.duration ? (issue.startSec / active.duration) * 100 : 0 }))
  }, [issues, activeMeta?.id, active.duration])

  const selectOutput = (index) => {
    setActiveOutput(index)
    setArmedMark(null)
  }

  const togglePlay = () => {
    markInspected()
    const video = refs.current[activeOutput]
    if (!video) return
    if (video.paused) void video.play().catch(() => {})
    else video.pause()
  }

  const setRate = (next) => {
    const video = refs.current[activeOutput]
    if (video) video.playbackRate = next
    updateControl(activeOutput, { rate: next })
  }

  const step = (frames) => {
    refs.current[activeOutput]?.pause()
    updateControl(activeOutput, { playing: false })
    seek(active.currentSec + frames / fps)
  }

  const handleTime = (event, index) => {
    const next = event.currentTarget.currentTime
    const control = controls[index]
    if (control?.looping && control.inSec !== null && control.outSec !== null && next >= control.outSec) {
      seek(control.inSec, index, false)
      return
    }
    updateControl(index, { currentSec: next })
  }

  const handleLoadedMetadata = (event, index, output) => {
    const video = event.currentTarget
    const duration = video.duration || output.durationSec || 0
    const initial = duration > 0.1 ? 0.1 : 0
    if (video.currentTime === 0 && initial) video.currentTime = initial
    updateControl(index, { duration, currentSec: initial })
  }

  const setMark = (type) => {
    markInspected()
    updateControl(activeOutput, (control) => updateMarkRange(control, type, control.currentSec))
    setArmedMark((current) => current?.index === activeOutput && current.type === type
      ? null
      : { index: activeOutput, type })
  }

  const capture = (output, index) => {
    const video = refs.current[index]
    const control = controls[index]
    if (!video || !control) return
    markInspected()
    video.pause()
    updateControl(index, { playing: false })
    let frameDataUrl = null
    const width = video.videoWidth || output.width || 1920
    const height = video.videoHeight || output.height || 1080
    try {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(video, 0, 0, width, height)
      frameDataUrl = canvas.toDataURL('image/jpeg', 0.86)
    } catch {
      frameDataUrl = null
    }
    onAddIssue({
      output,
      frameDataUrl,
      width,
      height,
      currentSec: control.currentSec,
      inSec: control.inSec,
      outSec: control.outSec,
    })
  }

  const onKeyDown = (event) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return
    if (event.key === ' ') { event.preventDefault(); togglePlay() }
    if (event.key === 'ArrowLeft' || event.key === ',') { event.preventDefault(); step(event.shiftKey ? -5 : -1) }
    if (event.key === 'ArrowRight' || event.key === '.') { event.preventDefault(); step(event.shiftKey ? 5 : 1) }
    if (event.key.toLowerCase() === 'i') { setArmedMark(null); updateControl(activeOutput, (control) => updateMarkRange(control, 'in', control.currentSec)) }
    if (event.key.toLowerCase() === 'o') { setArmedMark(null); updateControl(activeOutput, (control) => updateMarkRange(control, 'out', control.currentSec)) }
    if (event.key.toLowerCase() === 'l' && active.inSec !== null && active.outSec !== null && active.outSec > active.inSec) {
      updateControl(activeOutput, (control) => ({ ...control, looping: !control.looping }))
    }
  }

  const hasRange = active.inSec !== null && active.outSec !== null && active.outSec > active.inSec
  const armedType = armedMark?.index === activeOutput ? armedMark.type : null

  return (
    <section className="video-workbench" tabIndex="0" onKeyDown={onKeyDown}>
      {task.outputs.length > 1 ? (
        <div className="output-switcher" role="tablist" aria-label={t.outputSwitch}>
          {task.outputs.map((output, index) => (
            <button type="button" role="tab" key={output.id} aria-selected={activeOutput === index} className={activeOutput === index ? 'is-active' : ''} onClick={() => selectOutput(index)}>{output.label}</button>
          ))}
        </div>
      ) : null}

      <div className={`video-grid video-grid--${task.outputs.length > 2 ? 'multi' : task.outputs.length}`}>
        {task.outputs.map((output, index) => {
          const overlay = selectedIssue?.outputId === output.id ? selectedIssue.spatialAnnotation : null
          const control = controls[index] || createOutputControls([output])[0]
          return (
            <article className={`video-pane ${activeOutput === index ? 'is-output-active' : ''}`} key={output.id} onPointerDown={() => selectOutput(index)} aria-current={activeOutput === index ? 'true' : undefined}>
              <header><span>{output.label}</span><small>{output.width}×{output.height} · {output.fps || 24} fps</small></header>
              <div className="video-stage">
                <video
                  ref={(node) => { refs.current[index] = node }}
                  src={output.src}
                  poster="/og.png"
                  crossOrigin="anonymous"
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(event) => handleLoadedMetadata(event, index, output)}
                  onSeeked={(event) => event.currentTarget.removeAttribute('poster')}
                  onTimeUpdate={(event) => handleTime(event, index)}
                  onPlay={() => updateControl(index, { playing: true })}
                  onPause={() => updateControl(index, { playing: false })}
                  style={{ transform: `scale(${control.zoom})` }}
                />
                {overlay ? <span className="video-bbox" style={{ left: `${overlay.x * 100}%`, top: `${overlay.y * 100}%`, width: `${overlay.width * 100}%`, height: `${overlay.height * 100}%` }}><IconTarget size={15} /></span> : null}
              </div>
              <button className="video-add-issue" type="button" disabled={disabled} onClick={() => capture(output, index)}><IconPlus size={14} /> {t.addIssueOn} {output.label}</button>
            </article>
          )
        })}
      </div>

      <div className="active-output-controls">
        <div className="frame-active-output"><span>{t.controlling}</span><strong>{activeMeta?.label}</strong></div>
        <div className="timeline">
          <input type="range" min="0" max={active.duration || 0} step="0.001" value={active.currentSec} onChange={(event) => seek(event.target.value)} onPointerUp={() => setArmedMark(null)} aria-label={`${t.seek} · ${activeMeta?.label}`} />
          {markers.map((marker) => <button key={marker.id} type="button" className={`timeline-marker sev-${marker.severity}`} style={{ left: `${Math.min(99.5, marker.pct)}%` }} title={`${marker.tagLabel} · ${timecode(marker.startSec)}`} onClick={() => onSelectIssue(marker)} />)}
          {active.inSec !== null && active.duration ? <button type="button" className="timeline-boundary is-in" style={{ left: `${(active.inSec / active.duration) * 100}%` }} onClick={() => seek(active.inSec)} title={`${t.markIn} · ${timecode(active.inSec)}`} /> : null}
          {active.outSec !== null && active.duration ? <button type="button" className="timeline-boundary is-out" style={{ left: `${(active.outSec / active.duration) * 100}%` }} onClick={() => seek(active.outSec)} title={`${t.markOut} · ${timecode(active.outSec)}`} /> : null}
          {hasRange ? <span className="timeline-range" style={{ left: `${(active.inSec / active.duration) * 100}%`, width: `${((active.outSec - active.inSec) / active.duration) * 100}%` }} /> : null}
        </div>

        <div className="frame-toolbar">
          <span className="frame-time">{timecode(active.currentSec)} <small>/ F{String(Math.round(active.currentSec * fps)).padStart(5, '0')}</small></span>
          <div className="frame-transport">
            <button type="button" onClick={() => step(-5)} title={t.back5} aria-label={t.back5}><IconChevronLeft size={14} /><IconChevronLeft size={14} /></button>
            <button type="button" onClick={() => step(-1)} title={t.prevFrame} aria-label={t.prevFrame}><IconChevronLeft size={15} /></button>
            <button type="button" className="frame-play" onClick={togglePlay} aria-label={active.playing ? t.pause : t.play}>{active.playing ? <IconPause size={16} /> : <IconPlay size={16} />}</button>
            <button type="button" onClick={() => step(1)} title={t.nextFrame} aria-label={t.nextFrame}><IconChevronRight size={15} /></button>
            <button type="button" onClick={() => step(5)} title={t.forward5} aria-label={t.forward5}><IconChevronRight size={14} /><IconChevronRight size={14} /></button>
          </div>
          <button type="button" className="frame-tools-toggle" aria-expanded={toolsOpen} aria-controls={toolsId} onClick={() => setToolsOpen((value) => !value)}>{t.tools}</button>
        </div>

        <div className={`frame-tools ${toolsOpen ? 'is-open' : ''}`} id={toolsId}>
          <div className="frame-rates" role="group" aria-label={t.speed}>{[0.1, 0.25, 0.5, 1, 2].map((value) => <button type="button" className={active.rate === value ? 'is-active' : ''} key={value} onClick={() => setRate(value)}>{value}×</button>)}</div>
          <div className="frame-marks">
            <button type="button" className={`${active.inSec !== null ? 'is-active' : ''} ${armedType === 'in' ? 'is-armed' : ''}`} onClick={() => setMark('in')} title={t.markIn} aria-label={t.markIn} aria-pressed={armedType === 'in'}><b>In</b><small>{active.inSec === null ? '—' : timecode(active.inSec)}</small></button>
            <button type="button" className={`${active.outSec !== null ? 'is-active' : ''} ${armedType === 'out' ? 'is-armed' : ''}`} onClick={() => setMark('out')} title={t.markOut} aria-label={t.markOut} aria-pressed={armedType === 'out'}><b>Out</b><small>{active.outSec === null ? '—' : timecode(active.outSec)}</small></button>
            <button type="button" className={active.looping ? 'is-active' : ''} disabled={!hasRange} onClick={() => updateControl(activeOutput, (control) => ({ ...control, looping: !control.looping }))} title={t.loop} aria-label={t.loop} aria-pressed={active.looping}><IconRepeat size={15} /></button>
          </div>
          <div className="frame-zoom" role="group" aria-label={t.zoomLevel}>
            <button type="button" disabled={active.zoom === 1} onClick={() => updateControl(activeOutput, (control) => ({ ...control, zoom: Math.max(1, control.zoom - 0.5) }))} aria-label={t.zoomOut}><IconZoomOut size={15} /></button>
            <span className="zoom-readout">{active.zoom}×</span>
            <button type="button" disabled={active.zoom === 3} onClick={() => updateControl(activeOutput, (control) => ({ ...control, zoom: Math.min(3, control.zoom + 0.5) }))} aria-label={t.zoomIn}><IconZoomIn size={15} /></button>
          </div>
          {armedType ? <span className="mark-arm-status" role="status">{armedType === 'in' ? t.chooseInPosition : t.chooseOutPosition}</span> : null}
        </div>
      </div>
    </section>
  )
}
