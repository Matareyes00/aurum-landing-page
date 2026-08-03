import { useCopy } from '../i18n'

export default function Footer() {
  const t = useCopy({
    es: { tag: 'Hecho por gente que ama la imagen.', grain: 'Grano en cámara' },
    en: { tag: 'Made by people who love the image.', grain: 'In-camera grain' },
  })
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <img
          className="footer-lockup"
          src="/lockup-footer.png"
          alt="Aurum Visual"
        />
        <p className="footer-tag">{t.tag}</p>
        <div className="footer-meta">
          <span>© 2026 Aurum Visual</span>
          <a href="mailto:hello@aurumvisual.com">hello@aurumvisual.com</a>
          <a href="/academy/">Aurum Academy</a>
          <span>24 FPS · 2.39:1 · {t.grain}</span>
        </div>
      </div>
    </footer>
  )
}
