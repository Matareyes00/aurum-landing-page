import { useEffect, useState } from 'react'

export default function Nav({ visible }) {
  const [scrolled, setScrolled] = useState(false)

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
        <a href="#trabajo">El trabajo</a>
        <a href="#entrenamiento">Entrenamiento</a>
        <a href="#comunidad">Comunidad</a>
        <a href="/academy/">Academy</a>
        <a className="nav-cta" href="#aplicar">
          Aplicar
        </a>
      </div>
    </nav>
  )
}
