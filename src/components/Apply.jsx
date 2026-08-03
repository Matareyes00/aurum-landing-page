import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useCopy } from '../i18n'

const COPY = {
  es: {
    sceneName: 'Escena final — casting',
    label: 'Convocatoria abierta',
    h2a: 'El casting está ',
    h2em: 'abierto',
    body: (
      <>
        Contanos quién sos y qué mirás. Buscamos{' '}
        <strong>ojo formado en la práctica real</strong> —set, isla de edición, sala de
        color, sonido, dirección o estudio serio del lenguaje audiovisual—. Sin diplomas
        perfectos: oficio, hambre y amor por la imagen. Te responde una persona del
        equipo.
      </>
    ),
    mail1a: 'También podés escribirnos directo: ',
    mail2a: '¿Querés entrenar tu ojo primero? ',
    mail2link: 'Conocé Aurum Academy',
    roles: [
      'Dirección de fotografía',
      'Montaje / Edición',
      'Color / Etalonaje',
      'Sonido / Mezcla',
      'Dirección',
      'Estudiante de cine',
      'Otro oficio de la imagen',
    ],
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    roleLabel: 'Tu oficio',
    rolePlaceholder: 'Elegí tu rol',
    emailLabel: 'Email',
    emailPlaceholder: 'vos@tucine.com',
    reelLabel: 'Reel o muestra de trabajo (recomendado)',
    reelHint:
      'Una muestra de tu mirada hace avanzar tu aplicación mucho más rápido. Si no tenés reel armado, mandá lo que tengas.',
    messageLabel: '¿Qué te trajo hasta acá? (opcional)',
    messagePlaceholder:
      'El corto que querés filmar, la cámara que querés comprar, la historia que te debés…',
    submit: 'Aplicar a Aurum',
    note: 'SE ABRE TU CLIENTE DE CORREO · SIN SPAM, PALABRA DE CINÉFILOS',
    mailSubject: 'Aplicación a Aurum',
    mailName: 'Nombre',
    mailRole: 'Rol',
    mailEmail: 'Email',
    mailReel: 'Reel / portfolio',
  },
  en: {
    sceneName: 'Final scene — casting',
    label: 'Open call',
    h2a: 'The casting is ',
    h2em: 'open',
    body: (
      <>
        Tell us who you are and what you look at. We want{' '}
        <strong>an eye shaped by real practice</strong> —set, edit bay, color suite,
        sound, directing or serious study of the audiovisual language—. No perfect
        diplomas needed: craft, hunger and love for the image. A person from the team
        replies.
      </>
    ),
    mail1a: 'You can also write to us directly: ',
    mail2a: 'Want to train your eye first? ',
    mail2link: 'Discover Aurum Academy',
    roles: [
      'Cinematography',
      'Editing',
      'Color / Grading',
      'Sound / Mixing',
      'Directing',
      'Film student',
      'Another craft of the image',
    ],
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    roleLabel: 'Your craft',
    rolePlaceholder: 'Choose your role',
    emailLabel: 'Email',
    emailPlaceholder: 'you@yourfilm.com',
    reelLabel: 'Reel or work sample (recommended)',
    reelHint:
      'A sample of your eye moves your application forward much faster. If you don’t have a reel ready, send whatever you have.',
    messageLabel: 'What brought you here? (optional)',
    messagePlaceholder:
      'The short you want to film, the camera you want to buy, the story you owe yourself…',
    submit: 'Apply to Aurum',
    note: 'OPENS YOUR EMAIL CLIENT · NO SPAM, A CINEPHILE’S WORD',
    mailSubject: 'Application to Aurum',
    mailName: 'Name',
    mailRole: 'Role',
    mailEmail: 'Email',
    mailReel: 'Reel / portfolio',
  },
}

export default function Apply({ reduced }) {
  const root = useRef(null)
  const [form, setForm] = useState({ nombre: '', rol: '', email: '', reel: '', mensaje: '' })
  const t = useCopy(COPY)

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
    const subject = `${t.mailSubject} — ${form.nombre}${form.rol ? ` (${form.rol})` : ''}`
    const body = [
      `${t.mailName}: ${form.nombre}`,
      `${t.mailRole}: ${form.rol}`,
      `${t.mailEmail}: ${form.email}`,
      form.reel ? `${t.mailReel}: ${form.reel}` : null,
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
          <span className="scene-name">{t.sceneName}</span>
        </div>
        <div className="apply-frame">
          <div className="corners">
            <span /><span /><span /><span />
          </div>
          <div className="apply-grid">
            <div>
              <p className="label">{t.label}</p>
              <h2>
                {t.h2a}<em className="gold-text shimmer">{t.h2em}</em>.
              </h2>
              <p className="body-copy">{t.body}</p>
              <p className="apply-mail">
                {t.mail1a}
                <a href="mailto:hello@aurumvisual.com">hello@aurumvisual.com</a>
              </p>
              <p className="apply-mail">
                {t.mail2a}
                <a href="/academy/">{t.mail2link}</a>
              </p>
            </div>
            <form className="form" onSubmit={submit}>
              <div className="field">
                <label htmlFor="f-nombre">{t.nameLabel}</label>
                <input
                  id="f-nombre"
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  value={form.nombre}
                  onChange={set('nombre')}
                />
              </div>
              <div className="field">
                <label htmlFor="f-rol">{t.roleLabel}</label>
                <select id="f-rol" required value={form.rol} onChange={set('rol')}>
                  <option value="" disabled>
                    {t.rolePlaceholder}
                  </option>
                  {t.roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="f-email">{t.emailLabel}</label>
                <input
                  id="f-email"
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
              <div className="field">
                <label htmlFor="f-reel">{t.reelLabel}</label>
                <input
                  id="f-reel"
                  type="url"
                  placeholder="https://"
                  value={form.reel}
                  onChange={set('reel')}
                />
                <span className="field-hint">{t.reelHint}</span>
              </div>
              <div className="field field--full">
                <label htmlFor="f-mensaje">{t.messageLabel}</label>
                <textarea
                  id="f-mensaje"
                  placeholder={t.messagePlaceholder}
                  value={form.mensaje}
                  onChange={set('mensaje')}
                />
              </div>
              <div className="form-submit">
                <button className="btn btn--gold" type="submit">
                  {t.submit}
                </button>
                <span className="form-note">{t.note}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
