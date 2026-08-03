import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'

const SCENES = [
  { id: 'top', num: '00', es: 'Apertura', en: 'Opening' },
  { id: 'escena-01', num: '01', es: 'La escena', en: 'The scene' },
  { id: 'trabajo', num: '02', es: 'El trabajo', en: 'The work' },
  { id: 'entrenamiento', num: '03', es: 'Entrenamiento', en: 'Training' },
  { id: 'recorrido', num: '04', es: 'El recorrido', en: 'The path' },
  { id: 'comunidad', num: '05', es: 'Comunidad', en: 'Community' },
  { id: 'promesa', num: '06', es: 'La promesa', en: 'The promise' },
  { id: 'aplicar', num: '07', es: 'El casting', en: 'Casting' },
]

export default function ScrollRail({ visible }) {
  const lang = useLang()
  const [active, setActive] = useState(0)
  const fillRef = useRef(null)

  useEffect(() => {
    let raf = null
    const update = () => {
      raf = null
      const mid = window.scrollY + window.innerHeight / 2
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`
      let idx = 0
      for (let i = 0; i < SCENES.length; i++) {
        const el = document.getElementById(SCENES[i].id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= mid) idx = i
        }
      }
      setActive((prev) => (prev === idx ? prev : idx))
    }
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <nav
      className={`rail ${visible ? 'is-visible' : ''}`}
      aria-label={lang === 'es' ? 'Secciones de la página' : 'Page sections'}
    >
      <span className="rail-track" aria-hidden="true">
        <span className="rail-fill" ref={fillRef} />
      </span>
      <ol className="rail-list">
        {SCENES.map((s, i) => (
          <li
            key={s.id}
            className={`rail-item ${i === active ? 'is-active' : ''} ${
              i < active ? 'is-past' : ''
            }`}
          >
            <a
              href={`#${s.id}`}
              className="rail-link"
              aria-current={i === active ? 'true' : undefined}
            >
              <span className="rail-num">{s.num}</span>
              <span className="rail-label">{s[lang] ?? s.es}</span>
              <span className="rail-node" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
