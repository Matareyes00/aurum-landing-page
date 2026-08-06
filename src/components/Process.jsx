import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCopy } from '../i18n'

const COPY = {
  es: {
    name: 'El recorrido — travelling',
    hint: 'Seguí scrolleando',
    steps: [
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
    ],
  },
  en: {
    name: 'The path — travelling',
    hint: 'Keep scrolling',
    steps: [
      {
        num: '01',
        tag: 'TAKE 1',
        title: 'You apply',
        desc: 'Tell us who you are: your role, your path, your reel if you have one. We look for eye and craft, not diplomas. A person replies — not a form.',
      },
      {
        num: '02',
        tag: 'TAKE 2',
        title: 'You calibrate',
        desc: 'You learn the Codex —Aurum’s language for naming errors and justifying decisions—, practice on real cases and get certified. Your judgment already exists; here it is fine-tuned the way a monitor is calibrated before a grade.',
      },
      {
        num: '03',
        tag: 'TAKE 3',
        title: 'You evaluate',
        desc: 'You work remotely, on your own schedule, on real projects from AI labs. You get paid in dollars. And every hour brings you a little closer to your next shoot.',
      },
    ],
  },
}

export default function Process({ reduced }) {
  const root = useRef(null)
  const track = useRef(null)
  const progress = useRef(null)
  const hint = useRef(null)
  const copy = useCopy(COPY)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const getDistance = () =>
          Math.max(0, track.current.scrollWidth - window.innerWidth)
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
            onUpdate: (self) => {
              if (progress.current)
                progress.current.style.transform = `scaleX(${self.progress})`
              if (hint.current)
                hint.current.style.opacity = String(
                  Math.max(0, 1 - self.progress * 5)
                )
            },
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
  }, [reduced, copy])

  return (
    <section className="scene process" id="recorrido" ref={root} data-scene="03">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 03</span>
          <span className="scene-name">{copy.name}</span>
        </div>
      </div>
      <div className="process-viewport">
        <div className="process-track" ref={track}>
          {copy.steps.map((s) => (
            <article className="process-panel" key={s.num}>
              <span className="label label--dim panel-tag">{s.tag}</span>
              <div className="big-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p className="body-copy">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="process-cue" aria-hidden="true">
        <span className="process-hint" ref={hint}>
          {copy.hint} <span className="process-hint-arrow">↓</span>
        </span>
        <span className="process-progress">
          <span className="process-progress-fill" ref={progress} />
        </span>
      </div>
    </section>
  )
}
