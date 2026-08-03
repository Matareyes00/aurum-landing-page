import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCopy } from '../i18n'

export default function Tension({ reduced }) {
  const root = useRef(null)
  const sceneName = useCopy({ es: 'La escena que conocés', en: 'The scene you know' })

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
          <span className="scene-name">{sceneName}</span>
        </div>
        <div className="tension-grid">
          <div className="screenplay">
            <div className="slug">INT. PIEZA DE EDICIÓN — 3:47 AM</div>
            <p className="action">
              Sobre la mesa: un guión en su quinta reescritura, un presupuesto que no
              cierra y una cámara que vive en la pestaña de favoritos desde hace meses.
            </p>
            <div className="character">CINEASTA</div>
            <div className="parenthetical">(bajando el brillo del monitor)</div>
            <p className="dialogue">
              ¿Cómo pago mi película sin dejar de ser cineasta?
            </p>
          </div>
          <div className="tension-copy">
            <h2>
              Esa escena la <em>filmamos</em> todos.
            </h2>
            <p className="body-copy">
              Para sostener tu cine casi siempre hay que hacer otra cosa: la publicidad
              ajena, el evento del fin de semana, el trabajo que paga pero te aleja del
              set. No es falta de talento ni de oficio: es la economía del cine
              independiente.
            </p>
            <p className="body-copy">
              Aurum existe para cortar ese plano. Un trabajo que se hace <strong>con lo
              mismo que te hace cineasta</strong> —tu ojo, tu criterio, tus horas de sala
              y de rodaje— y que paga en dólares el cine que querés hacer.
            </p>
          </div>
        </div>
        <p className="pullquote">
          <span className="line">
            <span className="line-inner">Que el oficio</span>
          </span>
          <span className="line">
            <span className="line-inner">
              pague <em className="gold-text shimmer">la obra.</em>
            </span>
          </span>
        </p>
      </div>
    </section>
  )
}
