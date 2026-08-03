import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCopy } from '../i18n'

const COPY = {
  es: {
    sceneName: 'La escena que conocés',
    slug: 'INT. PIEZA DE EDICIÓN — 3:47 AM',
    action:
      'Sobre la mesa: un guión en su quinta reescritura, un presupuesto que no cierra y una cámara que vive en la pestaña de favoritos desde hace meses.',
    character: 'CINEASTA',
    parenthetical: '(bajando el brillo del monitor)',
    dialogue: '¿Cómo pago mi película sin dejar de ser cineasta?',
    h2: (
      <>
        Esa escena la <em>filmamos</em> todos.
      </>
    ),
    body1: (
      <>
        Para sostener tu cine casi siempre hay que hacer otra cosa: la publicidad ajena,
        el evento del fin de semana, el trabajo que paga pero te aleja del set. No es
        falta de talento ni de oficio: es la economía del cine independiente.
      </>
    ),
    body2: (
      <>
        Aurum existe para cortar ese plano. Un trabajo que se hace{' '}
        <strong>con lo mismo que te hace cineasta</strong> —tu ojo, tu criterio, tus
        horas de sala y de rodaje— y que paga en dólares el cine que querés hacer.
      </>
    ),
    quote1: 'Que el oficio',
    quote2a: 'pague ',
    quote2em: 'la obra.',
  },
  en: {
    sceneName: 'The scene you know',
    slug: 'INT. EDIT SUITE — 3:47 AM',
    action:
      'On the desk: a script on its fifth rewrite, a budget that won’t close, and a camera that’s lived in the bookmarks tab for months.',
    character: 'FILMMAKER',
    parenthetical: '(dimming the monitor)',
    dialogue: 'How do I pay for my film without giving up being a filmmaker?',
    h2: (
      <>
        We’ve all <em>shot</em> that scene.
      </>
    ),
    body1: (
      <>
        To sustain your cinema you almost always have to do something else: someone
        else’s commercial, the weekend event, the job that pays but pulls you away from
        set. It’s not a lack of talent or craft: it’s the economics of independent film.
      </>
    ),
    body2: (
      <>
        Aurum exists to cut that shot. Work done{' '}
        <strong>with the very thing that makes you a filmmaker</strong> —your eye, your
        judgment, your hours in the theater and on set— that pays, in dollars, for the
        cinema you want to make.
      </>
    ),
    quote1: 'Let the craft',
    quote2a: 'pay for ',
    quote2em: 'the work.',
  },
}

export default function Tension({ reduced }) {
  const root = useRef(null)
  const t = useCopy(COPY)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.screenplay', {
        autoAlpha: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.screenplay', start: 'top 78%' },
      })
      gsap.from('.screenplay > *', {
        autoAlpha: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.22,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.screenplay', start: 'top 72%' },
      })
      gsap.from('.tension-copy > *', {
        autoAlpha: 0,
        y: 34,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.tension-copy', start: 'top 75%' },
      })
      gsap.from('.pullquote .line-inner', {
        yPercent: 115,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.pullquote', start: 'top 82%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene tension" id="escena-01" ref={root} data-scene="01">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 01</span>
          <span className="scene-name">{t.sceneName}</span>
        </div>
        <div className="tension-grid">
          <div className="screenplay">
            <div className="slug">{t.slug}</div>
            <p className="action">{t.action}</p>
            <div className="character">{t.character}</div>
            <div className="parenthetical">{t.parenthetical}</div>
            <p className="dialogue">{t.dialogue}</p>
          </div>
          <div className="tension-copy">
            <h2>{t.h2}</h2>
            <p className="body-copy">{t.body1}</p>
            <p className="body-copy">{t.body2}</p>
          </div>
        </div>
        <p className="pullquote">
          <span className="line">
            <span className="line-inner">{t.quote1}</span>
          </span>
          <span className="line">
            <span className="line-inner">
              {t.quote2a}<em className="gold-text shimmer">{t.quote2em}</em>
            </span>
          </span>
        </p>
      </div>
    </section>
  )
}
