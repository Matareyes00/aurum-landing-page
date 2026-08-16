import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IconCheck, IconPrint } from '../icons'
import { useCopy, CERTIFICATE } from '../copy'

function credentialId(userId, courseId, completedAt) {
  const source = `${userId}:${courseId}:${completedAt || 'pending'}`
  let hash = 2166136261
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `AUR-${Math.abs(hash >>> 0).toString(16).toUpperCase().padStart(8, '0')}`
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(timestamp ? new Date(timestamp) : new Date())
}

export default function Certificate({ user, course, completedAt, onClose }) {
  const t = useCopy(CERTIFICATE)
  const credential = credentialId(user.id, course.id, completedAt)
  const dialogRef = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const focusable = dialogRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || []
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    focusable[0]?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      previousFocus?.focus()
    }
  }, [onClose])

  return createPortal(
    <div
      ref={dialogRef}
      className="certificate-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t.aria}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="certificate-shell"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <div className="certificate-actions">
          <span>Credencial lista</span>
          <button className="btn btn--gold" type="button" onClick={() => window.print()}>
            <IconPrint size={15} /> Guardar PDF
          </button>
          <button className="btn btn--ghost" type="button" onClick={onClose}>Cerrar</button>
        </div>

        <article className="certificate" id="academy-certificate">
          <div className="certificate-atmosphere" aria-hidden="true">
            <span className="certificate-grain" />
            <span className="certificate-flare" />
            <span className="certificate-letterbox certificate-letterbox--top" />
            <span className="certificate-letterbox certificate-letterbox--bottom" />
          </div>
          <span className="certificate-frame" aria-hidden="true" />

          <header className="certificate-brand">
            <div className="certificate-lockup">
              <span className="certificate-lockup-symbol" aria-hidden="true">
                <img src="/symbol-mid.png" alt="" />
              </span>
              <div className="certificate-lockup-copy">
                <img src="/aurum-word.png" alt="Aurum" />
                <span>Academy</span>
              </div>
            </div>
            <div className="certificate-slate" aria-label="Metadatos de la credencial">
              <span>{t.edition}</span>
              <strong>CREDENCIAL INTERNA / 01</strong>
            </div>
          </header>

          <main className="certificate-body">
            <div className="certificate-copy">
              <span className="certificate-kicker"><i /> {t.kicker}</span>
              <p className="certificate-intro">Aurum Academy reconoce a</p>
              <h1>{user.name}</h1>
              <div className="certificate-program">
                <span>PROGRAMA APROBADO</span>
                <h2>{course.title}</h2>
              </div>
              <p className="certificate-statement">
                {t.rationale}
              </p>
            </div>

            <aside className="certificate-verdict">
              <span className="certificate-seal"><IconCheck size={30} /></span>
              <div>
                <span>VEREDICTO</span>
                <strong>APROBADO</strong>
              </div>
              <div>
                <span>DISCIPLINA</span>
                <strong>{t.discipline}</strong>
              </div>
              <div>
                <span>{t.standard}</span>
                <strong>AURUM QUALITY / AQS-01</strong>
              </div>
            </aside>
          </main>

          <footer className="certificate-footer">
            <div>
              <span>EMITIDO</span>
              <strong>{formatDate(completedAt)}</strong>
            </div>
            <div className="certificate-signature">
                <span>{t.validation}</span>
              <div className="certificate-authority">
                <img src="/symbol-small.png" alt="" />
                <div>
                  <strong>Aurum Academy</strong>
                  <small>{t.issuer}</small>
                </div>
              </div>
            </div>
            <div className="certificate-credential">
              <span>CREDENCIAL</span>
              <strong>{credential}</strong>
            </div>
          </footer>
        </article>
      </div>
    </div>,
    document.body,
  )
}
