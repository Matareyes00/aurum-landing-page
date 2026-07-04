import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Dust from '../fx/Dust'

export default function Hero({ started, reduced }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reduced || !started) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.15 })
        .from('.hero-mark', { autoAlpha: 0, y: 14, duration: 0.9, ease: 'power2.out' })
        .from(
          '.hero-brand',
          {
            autoAlpha: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            duration: 1.6,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from('.hero-descriptor', { autoAlpha: 0, y: 12, duration: 0.9, ease: 'power2.out' }, '-=0.9')
        .from(
          '.hero-thesis .line-inner',
          { yPercent: 115, duration: 1.3, ease: 'power4.out', stagger: 0.14 },
          '-=0.5'
        )
        .from('.hero-sub', { autoAlpha: 0, y: 20, duration: 0.9, ease: 'power2.out' }, '-=0.6')
        .from('.hero-ctas', { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' }, '-=0.5')
        .from('.hero-scrollcue', { autoAlpha: 0, duration: 1.2 }, '-=0.3')

      gsap.to('.hero-atmos', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-inner', {
        yPercent: -12,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: '30% top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [started, reduced])

  return (
    <header className="hero" id="top" ref={root} data-scene="00">
      <div className="hero-atmos" aria-hidden="true">
        <div className="hero-key" />
        <div className="hero-beam" />
        <div className="hero-floor" />
      </div>
      <Dust reduced={reduced} />
      <div className="container hero-inner">
        <img className="hero-mark" src="/symbol-small.png" alt="" />
        <h1 className="hero-brand">
          <img src="/aurum-word.png" alt="AURUM" />
        </h1>
        <p className="hero-descriptor">Criterio de cine para la era del video generativo</p>
        <p className="hero-thesis">
          <span className="line">
            <span className="line-inner">La máquina ya aprendió a generar.</span>
          </span>
          <span className="line">
            <span className="line-inner">
              Todavía no aprendió a <em>mirar</em>.
            </span>
          </span>
        </p>
        <p className="hero-sub">
          Fotografía, montaje, color y sonido evaluando video generativo con rigor de
          oficio. <strong>Pagado en dólares</strong>, para financiar lo que de verdad
          querés filmar.
        </p>
        <div className="hero-ctas">
          <a className="btn btn--gold" href="#aplicar">
            Quiero ser parte
          </a>
          <a className="btn btn--ghost" href="#escena-01">
            Ver cómo funciona
          </a>
        </div>
      </div>
      <div className="hero-scrollcue">
        <span className="label label--dim">Rodando</span>
        <span className="scroll-line" />
      </div>
    </header>
  )
}
