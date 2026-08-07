import { useEffect } from 'react'
import { IconCheck, IconPrint } from '../icons'

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
  const credential = credentialId(user.id, course.id, completedAt)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="certificate-overlay" role="dialog" aria-modal="true" aria-label="Certificado de finalización">
      <div className="certificate-shell">
        <div className="certificate-actions" data-no-print>
          <span>Credencial lista</span>
          <button className="btn btn--gold" type="button" onClick={() => window.print()}>
            <IconPrint size={15} /> Guardar PDF
          </button>
          <button className="btn btn--ghost" type="button" onClick={onClose}>Cerrar</button>
        </div>

        <article className="certificate" id="academy-certificate">
          <span className="certificate-frame" aria-hidden="true" />
          <header className="certificate-brand">
            <img src="/symbol-small.png" alt="" />
            <div>
              <img src="/aurum-word.png" alt="Aurum" />
              <span>ACADEMY</span>
            </div>
          </header>

          <div className="certificate-copy">
            <span className="certificate-kicker">CERTIFICADO DE FINALIZACIÓN</span>
            <p>Aurum Academy certifica que</p>
            <h1>{user.name}</h1>
            <p>completó y aprobó el programa</p>
            <h2>{course.title}</h2>
            <p className="certificate-statement">
              demostrando criterio consistente para evaluar video generativo con estándares cinematográficos.
            </p>
          </div>

          <footer className="certificate-footer">
            <div>
              <span>EMITIDO</span>
              <strong>{formatDate(completedAt)}</strong>
            </div>
            <span className="certificate-seal"><IconCheck size={26} /></span>
            <div className="certificate-credential">
              <span>CREDENCIAL</span>
              <strong>{credential}</strong>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}