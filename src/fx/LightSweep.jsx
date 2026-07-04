import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function LightSweep({ reduced }) {
  const ref = useRef(null)

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    let tween = null
    const play = () => {
      if (tween && tween.isActive()) return
      tween = gsap.fromTo(
        el,
        { xPercent: -130, opacity: 0 },
        {
          xPercent: 130,
          duration: 1.5,
          ease: 'power2.inOut',
          opacity: 1,
          onUpdate() {
            const p = this.progress()
            el.style.opacity = String(Math.sin(p * Math.PI) * 0.55)
          },
          onComplete() {
            el.style.opacity = '0'
          },
        }
      )
    }

    const triggers = gsap.utils
      .toArray('[data-scene]')
      .filter((s) => s.dataset.scene !== '00')
      .map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: 'top 62%',
          onEnter: play,
        })
      )

    return () => {
      triggers.forEach((t) => t.kill())
      if (tween) tween.kill()
    }
  }, [reduced])

  return <div className="light-sweep" ref={ref} aria-hidden="true" />
}
