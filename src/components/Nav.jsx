import { useEffect, useState } from 'react'
import { useCopy } from '../i18n'
import LangToggle from './LangToggle'

const COPY = {
  es: { work: 'El trabajo', path: 'El recorrido', apply: 'Aplicar' },
  en: { work: 'The work', path: 'The path', apply: 'Apply' },
}

export default function Nav({ visible }) {
  const [scrolled, setScrolled] = useState(false)
  const copy = useCopy(COPY)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${visible ? 'is-visible' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="nav-brand" href="#top" aria-label="Aurum Visual">
        <img src="/symbol-small.png" alt="" />
        <img className="nav-word" src="/aurum-word.png" alt="AURUM" />
      </a>
      <div className="nav-links">
        <a href="#trabajo">{copy.work}</a>
        <a href="#recorrido">{copy.path}</a>
        <a href="/academy/">Academy</a>
        <LangToggle className="nav-lang" />
        <a className="nav-cta" href="#aplicar">
          {copy.apply}
        </a>
      </div>
    </nav>
  )
}
