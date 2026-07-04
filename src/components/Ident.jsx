import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const SEEN_KEY = 'aurum-ident-seen'

export default function Ident({ onReveal, onDone, reduced }) {
  const root = useRef(null)
  const tl = useRef(null)

  useLayoutEffect(() => {
    if (reduced) {
      onReveal()
      onDone()
      return
    }
    let seen = false
    try {
      seen = !!sessionStorage.getItem(SEEN_KEY)
    } catch { /* storage blocked */ }

    const ctx = gsap.context(() => {
      const t = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(SEEN_KEY, '1')
          } catch { /* storage blocked */ }
          onDone()
        },
      })
      tl.current = t

      if (!seen) {
        const CIRC = 2 * Math.PI * 46
        gsap.set('.count-sweep', { strokeDasharray: CIRC, strokeDashoffset: CIRC })
        t.set('.ident-count', { autoAlpha: 1 })
          .set('.count-num--3', { autoAlpha: 1 })
          .fromTo(
            '.count-sweep',
            { strokeDashoffset: CIRC },
            { strokeDashoffset: 0, duration: 0.5, ease: 'none' }
          )
          .set('.count-num--3', { autoAlpha: 0 })
          .set('.count-num--2', { autoAlpha: 1 })
          .fromTo(
            '.count-sweep',
            { strokeDashoffset: CIRC },
            { strokeDashoffset: 0, duration: 0.5, ease: 'none' }
          )
          .to('.ident-flicker', {
            duration: 0.28,
            keyframes: [
              { opacity: 0.14 },
              { opacity: 0 },
              { opacity: 0.22 },
              { opacity: 0 },
            ],
          }, '-=0.1')
          .set('.ident-count', { autoAlpha: 0 })
      }

      t.fromTo(
        '.ident-symbol',
        { autoAlpha: 0, scale: 0.86, filter: 'blur(6px)' },
        {
          autoAlpha: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: seen ? 0.9 : 1.3,
          ease: 'power2.out',
        }
      )
        .fromTo(
          '.ident-word',
          { autoAlpha: 0, scale: 0.94 },
          { autoAlpha: 1, scale: 1, duration: seen ? 0.7 : 1.1, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo('.ident-sub', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.6 }, '-=0.4')
        .to(
          '.ident-core',
          { autoAlpha: 0, duration: 0.55, ease: 'power1.in' },
          seen ? '+=0.2' : '+=0.55'
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
      </div>
      <div className="ident-core">
        <img className="ident-symbol" src="/symbol-small.png" alt="" />
        <img className="ident-word" src="/aurum-visual-word.png" alt="Aurum Visual" />
        <div className="ident-sub">PRESENTA</div>
      </div>
      <div className="ident-flicker" />
    </div>
  )
}
