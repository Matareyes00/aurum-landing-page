import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconPause,
  IconPlay,
  IconPlus,
  IconRepeat,
  IconTarget,
  IconZoomIn,
  IconZoomOut,
} from '../../icons'

function timecode(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safe / 60)
  const secs = Math.floor(safe % 60)
  const millis = Math.floor((safe % 1) * 1000)
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
}

export default function VideoWorkbench({ task, issues, selectedIssue, onSelectIssue, onAddIssue, disabled }) {
  const refs = useRef([])
  const [duration, setDuration] = useState(task.outputs[0]?.durationSec || 0)
  const [currentSec, setCurrentSec] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [rate, setRateState] = useState(1)
  const [inSec, setInSec] = useState(null)
  const [outSec, setOutSec] = useState(null)
  const [looping, setLooping] = useState(false)
  const [zoom, setZoom] = useState(1)
  const fps = task.outputs[0]?.fps || 24

  useEffect(() => {
    if (!selectedIssue) return
    seek(selectedIssue.startSec)
    refs.current.forEach((video) => video?.pause())
  }, [selectedIssue?.id])

  const markers = useMemo(() => issues.map((issue) => ({ ...issue, pct: duration ? (issue.startSec / duration) * 100 : 0 })), [issues, duration])

  const seek = (seconds) => {
    const next = Math.max(0, Math.min(Number(seconds) || 0, duration || Number(seconds) || 0))
    refs.current.forEach((video) => { if (video) video.currentTime = next })
    setCurrentSec(next)
  }

  const togglePlay = () => {
    const shouldPlay = refs.current[0]?.paused ?? true
    refs.current.forEach((video) => {
      if (!video) return
      if (shouldPlay) void video.play().catch(() => {})
      else video.pause()
    })
    setPlaying(shouldPlay)
  }

  const setRate = (next) => {
    refs.current.forEach((video) => { if (video) video.playbackRate = next })
    setRateState(next)
  }

  const step = (frames) => {
    refs.current.forEach((video) => video?.pause())
    setPlaying(false)
    seek(currentSec + frames / fps)
  }

  const handleTime = (event) => {
    if (event.currentTarget !== refs.current[0]) return
    const next = event.currentTarget.currentTime
    if (looping && inSec !== null && outSec !== null && next >= outSec) {
      seek(inSec)
      return
    }
    setCurrentSec(next)
  }

  const capture = (output, index) => {
    const video = refs.current[index]
    if (!video) return
    refs.current.forEach((item) => item?.pause())
    setPlaying(false)
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
    onAddIssue({ output, frameDataUrl, width, height, currentSec, inSec, outSec })
  }

  const onKeyDown = (event) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return
    if (event.key === ' ') { event.preventDefault(); togglePlay() }
    if (event.key === 'ArrowLeft' || event.key === ',') { event.preventDefault(); step(event.shiftKey ? -5 : -1) }
    if (event.key === 'ArrowRight' || event.key === '.') { event.preventDefault(); step(event.shiftKey ? 5 : 1) }
    if (event.key.toLowerCase() === 'i') setInSec(currentSec)
    if (event.key.toLowerCase() === 'o') setOutSec(currentSec)
    if (event.key.toLowerCase() === 'l') setLooping((value) => !value)
  }

  return (
    <section className="video-workbench" tabIndex="0" onKeyDown={onKeyDown}>
      <div className={`video-grid video-grid--${task.outputs.length > 2 ? 'multi' : task.outputs.length}`}>
        {task.outputs.map((output, index) => {
          const overlay = selectedIssue?.outputId === output.id ? selectedIssue.spatialAnnotation : null
          return (
            <article className="video-pane" key={output.id}>
              <header><span>{output.label}</span><small>{output.width}×{output.height} · {output.fps || 24} fps</small></header>
              <div className="video-stage">
                <video
                  ref={(node) => { refs.current[index] = node }}
                  src={output.src}
                  crossOrigin="anonymous"
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(event) => index === 0 && setDuration(event.currentTarget.duration || output.durationSec || 0)}
                  onTimeUpdate={handleTime}
                  onPlay={() => index === 0 && setPlaying(true)}
                  onPause={() => index === 0 && setPlaying(false)}
                  style={{ transform: `scale(${zoom})` }}
                />
                {overlay ? <span className="video-bbox" style={{ left: `${overlay.x * 100}%`, top: `${overlay.y * 100}%`, width: `${overlay.width * 100}%`, height: `${overlay.height * 100}%` }}><IconTarget size={15} /></span> : null}
              </div>
              <button className="video-add-issue" type="button" disabled={disabled} onClick={() => capture(output, index)}><IconPlus size={14} /> Issue en {output.label}</button>
            </article>
          )
        })}
      </div>

      <div className="timeline">
        <input type="range" min="0" max={duration || 0} step="0.001" value={currentSec} onChange={(event) => seek(event.target.value)} aria-label="Posición del video" />
        {markers.map((marker) => <button key={marker.id} type="button" className={`timeline-marker sev-${marker.severity}`} style={{ left: `${Math.min(99.5, marker.pct)}%` }} title={`${marker.tagLabel} · ${timecode(marker.startSec)}`} onClick={() => onSelectIssue(marker)} />)}
        {inSec !== null && outSec !== null && duration ? <span className="timeline-range" style={{ left: `${(inSec / duration) * 100}%`, width: `${Math.max(0, ((outSec - inSec) / duration) * 100)}%` }} /> : null}
      </div>

      <div className="frame-toolbar">
        <span className="frame-time">{timecode(currentSec)} <small>/ F{String(Math.round(currentSec * fps)).padStart(5, '0')}</small></span>
        <button type="button" onClick={() => step(-5)} title="5 frames atrás"><IconChevronLeft size={14} /><IconChevronLeft size={14} /></button>
        <button type="button" onClick={() => step(-1)} title="Frame anterior"><IconChevronLeft size={15} /></button>
        <button type="button" className="frame-play" onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproducir'}>{playing ? <IconPause size={16} /> : <IconPlay size={16} />}</button>
        <button type="button" onClick={() => step(1)} title="Frame siguiente"><IconChevronRight size={15} /></button>
        <button type="button" onClick={() => step(5)} title="5 frames adelante"><IconChevronRight size={14} /><IconChevronRight size={14} /></button>
        <div className="frame-rates">{[0.1, 0.25, 0.5, 1, 2].map((value) => <button type="button" className={rate === value ? 'is-active' : ''} key={value} onClick={() => setRate(value)}>{value}×</button>)}</div>
        <button type="button" className={inSec !== null ? 'is-active' : ''} onClick={() => setInSec(currentSec)}>In</button>
        <button type="button" className={outSec !== null ? 'is-active' : ''} onClick={() => setOutSec(currentSec)}>Out</button>
        <button type="button" className={looping ? 'is-active' : ''} onClick={() => setLooping((value) => !value)} aria-label="Loop"><IconRepeat size={15} /></button>
        <button type="button" disabled={zoom === 1} onClick={() => setZoom((value) => Math.max(1, value - 0.5))} aria-label="Reducir zoom"><IconZoomOut size={15} /></button>
        <span className="zoom-readout">{zoom}×</span>
        <button type="button" disabled={zoom === 3} onClick={() => setZoom((value) => Math.min(3, value + 0.5))} aria-label="Aumentar zoom"><IconZoomIn size={15} /></button>
      </div>
    </section>
  )
}
