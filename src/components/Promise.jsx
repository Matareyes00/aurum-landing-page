import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCopy } from '../i18n'

const COPY = {
  es: {
    sceneName: 'La promesa',
    line1: 'Nuestra escena soñada',
    line2a: 'no sale acá. Sale en ',
    line2em: 'tus créditos',
    creditsTitle: 'TU PRÓXIMA PELÍCULA',
    creditsSub: 'FICHA TÉCNICA',
    credits: [
      { role: 'Guión', name: 'Vos' },
      { role: 'Dirección', name: 'Vos' },
      { role: 'Fotografía', name: 'Vos y los tuyos' },
      { role: 'Montaje', name: 'Vos' },
      { role: 'Color', name: 'Vos' },
      { role: 'Sonido', name: 'Vos' },
      { role: 'Financiación', name: 'Tu ojo', gold: true },
    ],
    close: (
      <>
        Cada hora que evaluás acá es una luz que alquilás, un día de rodaje que asegurás,
        una escena que filmás. Que cuando cuentes cómo la hiciste,{' '}
        <strong>Aurum sea parte de la respuesta</strong>.
      </>
    ),
  },
  en: {
    sceneName: 'The promise',
    line1: 'Our dream scene',
    line2a: 'doesn’t play here. It plays in ',
    line2em: 'your credits',
    creditsTitle: 'YOUR NEXT FILM',
    creditsSub: 'CREW',
    credits: [
      { role: 'Writing', name: 'You' },
      { role: 'Directing', name: 'You' },
      { role: 'Cinematography', name: 'You and yours' },
      { role: 'Editing', name: 'You' },
      { role: 'Color', name: 'You' },
      { role: 'Sound', name: 'You' },
      { role: 'Financing', name: 'Your eye', gold: true },
    ],
    close: (
      <>
        Every hour you evaluate here is a light you rent, a shoot day you lock, a scene
        you film. So that when you tell how you made it,{' '}
        <strong>Aurum is part of the answer</strong>.
      </>
    ),
  },
}

export default function PromiseScene({ reduced }) {
  const root = useRef(null)
  const viewport = useRef(null)
  const roll = useRef(null)
  const t = useCopy(COPY)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.promise h2 .line-inner', {
        yPercent: 115,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.promise h2', start: 'top 80%' },
      })
      gsap.fromTo(
        roll.current,
        { y: () => viewport.current.clientHeight },
        {
          y: () => -(roll.current.scrollHeight - viewport.current.clientHeight * 0.55),
          ease: 'none',
          scrollTrigger: {
            trigger: viewport.current,
            start: 'top 88%',
            end: 'bottom 8%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      )
      gsap.from('.promise-close', {
        autoAlpha: 0,
        y: 30,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.promise-close', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene promise" id="promesa" ref={root} data-scene="06">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 06</span>
          <span className="scene-name">{t.sceneName}</span>
        </div>
        <h2>
          <span className="line">
            <span className="line-inner">{t.line1}</span>
          </span>
          <span className="line">
            <span className="line-inner">
              {t.line2a}<em className="gold-text shimmer">{t.line2em}</em>.
            </span>
          </span>
        </h2>
        <div className="credits">
          <div className="credits-viewport" ref={viewport}>
            <div className="credits-roll" ref={roll}>
              <div className="credits-title">{t.creditsTitle}</div>
              <div className="credits-sub">{t.creditsSub}</div>
              {t.credits.map((c) => (
                <div
                  className={`credit-row ${c.gold ? 'credit-row--gold' : ''}`}
                  key={c.role}
                >
                  <span className="credit-role">{c.role}</span>
                  <span className="credit-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="promise-close">{t.close}</p>
      </div>
    </section>
  )
}
