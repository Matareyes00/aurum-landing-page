import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const STEPS = [
  {
    num: '01',
    tag: 'TOMA 1',
    title: 'Aplicás',
    desc: 'Contanos quién sos: tu rol, tu recorrido, tu reel si tenés. Buscamos ojo y oficio, no diplomas. Te responde una persona, no un formulario.',
  },
  {
    num: '02',
    tag: 'TOMA 2',
    title: 'Calibrás',
    desc: 'Aprendés el Codex —el idioma de Aurum para nombrar errores y justificar decisiones—, practicás con casos reales y te certificás. Tu criterio ya existe; acá se afina como se calibra un monitor antes de etalonar.',
  },
  {
    num: '03',
    tag: 'TOMA 3',
    title: 'Evaluás',
    desc: 'Trabajás remoto, en tus horarios, con proyectos reales de laboratorios de IA. Cobrás en dólares. Y cada hora te acerca un poco más a tu próximo rodaje.',
  },
]

export default function Process({ reduced }) {
  const root = useRef(null)
  const track = useRef(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const getDistance = () => track.current.scrollWidth - window.innerWidth
        gsap.to(track.current, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      })
      mm.add('(max-width: 899px)', () => {
        gsap.utils.toArray('.process-panel').forEach((panel) => {
          gsap.from(panel, {
            autoAlpha: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 82%' },
          })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="scene process" id="recorrido" ref={root} data-scene="04">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 04</span>
          <span className="scene-name">El recorrido — travelling</span>
        </div>
      </div>
      <div className="container">
        <div className="process-track" ref={track}>
          {STEPS.map((s) => (
            <article className="process-panel" key={s.num}>
              <span className="label label--dim panel-tag">{s.tag}</span>
              <div className="big-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p className="body-copy">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
