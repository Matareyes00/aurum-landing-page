import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setEnabled, sceneClick } from '../fx/sound'

const TOTAL_FRAMES = 24 * 60 * 2.4

function formatTC(progress) {
  const frames = Math.round(progress * TOTAL_FRAMES)
  const ff = frames % 24
  const totalSec = Math.floor(frames / 24)
  const ss = totalSec % 60
  const mm = Math.floor(totalSec / 60) % 60
  const hh = Math.floor(totalSec / 3600)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(hh)}:${p(mm)}:${p(ss)}:${p(ff)}`
}

export default function Hud({ visible }) {
  const tcRef = useRef(null)
  const firstScene = useRef(true)
  const [scene, setScene] = useState('01')
  const [sala, setSala] = useState(false)

  useEffect(() => {
    let raf = null
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (tcRef.current) tcRef.current.textContent = `TC ${formatTC(progress)}`
      raf = null
    }
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })

    const triggers = gsap.utils.toArray('[data-scene]').map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => setScene(el.dataset.scene),
        onEnterBack: () => setScene(el.dataset.scene),
      })
    )

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
      triggers.forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    if (firstScene.current) {
      firstScene.current = false
      return
    }
    sceneClick()
  }, [scene])

  const toggleSala = () => {
    const next = !sala
    setSala(next)
    setEnabled(next)
  }

  return (
    <div className={`hud ${visible ? 'is-visible' : ''}`}>
      <span ref={tcRef} aria-hidden="true">TC 00:00:00:00</span>
      <div className="hud-right">
        <span aria-hidden="true">2.39:1 · 24 FPS</span>
        <span aria-hidden="true">ESC {scene} / 06</span>
        <button
          type="button"
          className={`hud-sala ${sala ? 'is-on' : ''}`}
          onClick={toggleSala}
          aria-pressed={sala}
          aria-label="Sonido de sala"
        >
          SALA {sala ? '●' : '○'}
        </button>
      </div>
    </div>
  )
}
