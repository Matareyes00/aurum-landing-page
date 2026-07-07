import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const ROLES = [
  'Dirección de fotografía',
  'Montaje / Edición',
  'Color / Etalonaje',
  'Sonido / Mezcla',
  'Dirección',
  'Estudiante de cine',
  'Otro oficio de la imagen',
]

export default function Apply({ reduced }) {
  const root = useRef(null)
  const [form, setForm] = useState({ nombre: '', rol: '', email: '', reel: '', mensaje: '' })

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.apply-frame', {
        autoAlpha: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.apply-frame', start: 'top 80%' },
      })
      gsap.from('.apply-grid > *', {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.apply-frame', start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const subject = `Aplicación a Aurum — ${form.nombre}${form.rol ? ` (${form.rol})` : ''}`
    const body = [
      `Nombre: ${form.nombre}`,
      `Rol: ${form.rol}`,
      `Email: ${form.email}`,
      form.reel ? `Reel / portfolio: ${form.reel}` : null,
      form.mensaje ? `\n${form.mensaje}` : null,
    ]
      .filter(Boolean)
      .join('\n')
    window.location.href = `mailto:hello@aurumvisual.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="scene apply" id="aplicar" ref={root} data-scene="07">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 07</span>
          <span className="scene-name">Escena final — casting</span>
        </div>
        <div className="apply-frame">
          <div className="corners">
            <span /><span /><span /><span />
          </div>
          <div className="apply-grid">
            <div>
              <p className="label">Convocatoria abierta</p>
              <h2>
                El casting está <em className="gold-text shimmer">abierto</em>.
              </h2>
              <p className="body-copy">
                Contanos quién sos y qué mirás. Buscamos <strong>ojo formado en la
                práctica real</strong> —set, isla de edición, sala de color, sonido,
                dirección o estudio serio del lenguaje audiovisual—. Sin diplomas
                perfectos: oficio, hambre y amor por la imagen. Te responde una persona
                del equipo.
              </p>
              <p className="apply-mail">
                También podés escribirnos directo:{' '}
                <a href="mailto:hello@aurumvisual.com">hello@aurumvisual.com</a>
              </p>
              <p className="apply-mail">
                ¿Querés entrenar tu ojo primero?{' '}
                <a href="/academy/">Conocé Aurum Academy</a>
              </p>
            </div>
            <form className="form" onSubmit={submit}>
              <div className="field">
                <label htmlFor="f-nombre">Nombre</label>
                <input
                  id="f-nombre"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={set('nombre')}
                />
              </div>
              <div className="field">
                <label htmlFor="f-rol">Tu oficio</label>
                <select id="f-rol" required value={form.rol} onChange={set('rol')}>
                  <option value="" disabled>
                    Elegí tu rol
                  </option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="f-email">Email</label>
                <input
                  id="f-email"
                  type="email"
                  required
                  placeholder="vos@tucine.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
              <div className="field">
                <label htmlFor="f-reel">Reel o muestra de trabajo (recomendado)</label>
                <input
                  id="f-reel"
                  type="url"
                  placeholder="https://"
                  value={form.reel}
                  onChange={set('reel')}
                />
                <span className="field-hint">
                  Una muestra de tu mirada hace avanzar tu aplicación mucho más rápido.
                  Si no tenés reel armado, mandá lo que tengas.
                </span>
              </div>
              <div className="field field--full">
                <label htmlFor="f-mensaje">¿Qué te trajo hasta acá? (opcional)</label>
                <textarea
                  id="f-mensaje"
                  placeholder="El corto que querés filmar, la cámara que querés comprar, la historia que te debés…"
                  value={form.mensaje}
                  onChange={set('mensaje')}
                />
              </div>
              <div className="form-submit">
                <button className="btn btn--gold" type="submit">
                  Aplicar a Aurum
                </button>
                <span className="form-note">SE ABRE TU CLIENTE DE CORREO · SIN SPAM, PALABRA DE CINÉFILOS</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
