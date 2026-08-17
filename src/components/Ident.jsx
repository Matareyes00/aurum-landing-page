import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCopy } from '../i18n'

const COUNTDOWN = ['3', '2', '1']

export default function Ident({ onReveal, onDone, reduced }) {
  const root = useRef(null)
  const tl = useRef(null)
  const presents = useCopy({ es: 'PRESENTA', en: 'PRESENTS' })

  useLayoutEffect(() => {
    if (reduced) {
      onReveal()
      onDone()
      return
    }
    const ctx = gsap.context(() => {
      const t = gsap.timeline({
        onComplete: onDone,
      })
      tl.current = t

      const CIRC = 2 * Math.PI * 46
      gsap.set('.count-sweep', { strokeDasharray: CIRC, strokeDashoffset: CIRC })
      gsap.set('.ident-core, .ident-symbol, .ident-word, .ident-sub', { autoAlpha: 0 })
      gsap.set('.count-num', { autoAlpha: 0 })

      t.set('.ident-count', { autoAlpha: 1 })

      COUNTDOWN.forEach((number) => {
        t.set(`.count-num--${number}`, { autoAlpha: 1 })
          .fromTo(
            '.count-sweep',
            { strokeDashoffset: CIRC },
            { strokeDashoffset: 0, duration: 0.62, ease: 'none' }
          )
          .set(`.count-num--${number}`, { autoAlpha: 0 })
      })

      t.to('.ident-flicker', {
        duration: 0.28,
        keyframes: [
          { opacity: 0.14 },
          { opacity: 0 },
          { opacity: 0.22 },
          { opacity: 0 },
        ],
      }, '-=0.08')
        .set('.ident-count', { autoAlpha: 0 })
        .set('.ident-core', { autoAlpha: 1 })

      t.fromTo(
        '.ident-symbol',
        { autoAlpha: 0, scale: 0.86, filter: 'blur(6px)' },
        {
          autoAlpha: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.15,
          ease: 'power2.out',
        }
      )
        .fromTo(
          '.ident-word',
          { autoAlpha: 0, scale: 0.94 },
          { autoAlpha: 1, scale: 1, duration: 0.95, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo('.ident-sub', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.6 }, '-=0.4')
        .to(
          '.ident-core',
          { autoAlpha: 0, duration: 0.55, ease: 'power1.in' },
          '+=0.55'
        )
        .call(onReveal, [], '-=0.1')
        .to('.ident-gate--top', { scaleY: 0, duration: 1.15, ease: 'power4.inOut' })
        .to(
          '.ident-gate--bottom',
          { scaleY: 0, duration: 1.15, ease: 'power4.inOut' },
          '<'
        )
    }, root)
    return () => ctx.revert()
  }, [onReveal, onDone, reduced])

  if (reduced) return null

  return (
    <div
      className="ident"
      ref={root}
      onClick={() => tl.current && tl.current.progress(1)}
      aria-hidden="true"
    >
      <div className="ident-gate ident-gate--top" />
      <div className="ident-gate ident-gate--bottom" />
      <div className="ident-count">
        <div className="count-cross count-cross--h" />
        <div className="count-cross count-cross--v" />
        <svg viewBox="0 0 100 100" className="count-circle">
          <circle cx="50" cy="50" r="46" className="count-track" />
          <circle cx="50" cy="50" r="46" className="count-sweep" />
        </svg>
        <span className="count-num count-num--3">3</span>
        <span className="count-num count-num--2">2</span>
        <span className="count-num count-num--1">1</span>
      </div>
      <div className="ident-core">
        <img className="ident-symbol" src="/symbol-small.png" alt="" />
        <img className="ident-word" src="/aurum-visual-word.png" alt="Aurum Visual" />
        <div className="ident-sub">{presents}</div>
      </div>
      <div className="ident-flicker" />
    </div>
  )
}
