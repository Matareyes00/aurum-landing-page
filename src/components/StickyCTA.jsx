import { useEffect, useState } from 'react'
import { useCopy } from '../i18n'

const COPY = {
  es: { eyebrow: 'ACADEMY', label: 'Reservá tu butaca' },
  en: { eyebrow: 'ACADEMY', label: 'Reserve your seat' },
}

export default function StickyCTA() {
  const [show, setShow] = useState(false)
  const t = useCopy(COPY)

  useEffect(() => {
    let raf = null
    const update = () => {
      raf = null
      const past = window.scrollY > window.innerHeight * 0.9
      const apply = document.getElementById('aplicar')
      let nearEnd = false
      if (apply) {
        nearEnd = apply.getBoundingClientRect().top < window.innerHeight * 0.9
      }
      setShow((prev) => {
        const next = past && !nearEnd
        return prev === next ? prev : next
      })
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
    <a
      className={`sticky-cta ${show ? 'is-visible' : ''}`}
      href="/academy/"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
    >
      <span className="sticky-cta-eyebrow">{t.eyebrow}</span>
      <span className="sticky-cta-label">{t.label}</span>
      <span className="sticky-cta-arrow" aria-hidden="true">→</span>
    </a>
  )
}
