import { useCopy } from '../i18n'

export default function Footer() {
  const tag = useCopy({
    es: 'Hecho por gente que ama la imagen.',
    en: 'Made by people who love the image.',
  })
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <img
          className="footer-lockup"
          src="/lockup-footer.png"
          alt="Aurum Visual"
        />
        <p className="footer-tag">{tag}</p>
        <div className="footer-meta">
          <span>© 2026 Aurum Visual</span>
          <a href="mailto:hello@aurumvisual.com">hello@aurumvisual.com</a>
          <a href="/academy/">Aurum Academy</a>
          <span>24 FPS · 2.39:1 · Grano en cámara</span>
        </div>
      </div>
    </footer>
  )
}
