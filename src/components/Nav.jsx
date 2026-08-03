import { useEffect, useState } from 'react'
import { useCopy } from '../i18n'
import LangToggle from './LangToggle'

const COPY = {
  es: { work: 'El trabajo', training: 'Entrenamiento', community: 'Comunidad', apply: 'Aplicar' },
  en: { work: 'The work', training: 'Training', community: 'Community', apply: 'Apply' },
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
        <a href="#entrenamiento">{copy.training}</a>
        <a href="#comunidad">{copy.community}</a>
        <a href="/academy/">Academy</a>
        <LangToggle className="nav-lang" />
        <a className="nav-cta" href="#aplicar">
          {copy.apply}
        </a>
      </div>
    </nav>
  )
}
