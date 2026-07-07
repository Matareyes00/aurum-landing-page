import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const EXAMPLES = [
  {
    eye: '«La sombra no responde a ninguna fuente.»',
    code: 'LIGHT SOURCE MISMATCH',
    meta: 'SEV. ALTA · CONF. 0.87',
    datum: 'DATO DE ENTRENAMIENTO N.º 48.291',
  },
  {
    eye: '«La mirada cruza la línea: se rompió el eje.»',
    code: 'SPATIAL CONTINUITY ERROR',
    meta: 'SEV. ALTA · CONF. 0.91',
    datum: 'DATO DE ENTRENAMIENTO N.º 48.292',
  },
  {
    eye: '«Esa piel no existe en ningún mundo con sol.»',
    code: 'SKIN TONE ARTIFACT',
    meta: 'SEV. MEDIA · CONF. 0.94',
    datum: 'DATO DE ENTRENAMIENTO N.º 48.293',
  },
]

const BOBINAS = [
  {
    num: 'BOBINA 01',
    title: 'El idioma',
    desc: 'Aprendés el Codex: los nombres de los errores, los niveles de severidad, los grados de confianza. Lo que siempre supiste ver, ahora se puede decir — y medir.',
  },
  {
    num: 'BOBINA 02',
    title: 'La práctica',
    desc: 'Evaluás clips reales generados por IA: comparás versiones, marcás la falla en el frame exacto, justificás cada decisión. Con feedback de evaluadores que ya recorrieron el camino.',
  },
  {
    num: 'BOBINA 03',
    title: 'La firma',
    desc: 'Cuando tu criterio se vuelve consistente, te certificás y entrás a la pool de Aurum. De ahí salen los proyectos pagos, en dólares.',
  },
]

export default function Training({ reduced }) {
  const root = useRef(null)
  const [idx, setIdx] = useState(0)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.training h2 .line-inner', {
        yPercent: 115,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.training h2', start: 'top 80%' },
      })
      gsap.from('.training-lede', {
        autoAlpha: 0,
        y: 26,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.training h2', start: 'top 70%' },
      })
      gsap.from('.prism > *', {
        autoAlpha: 0,
        y: 34,
        duration: 1,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.prism', start: 'top 78%' },
      })
      gsap.from('.bobina', {
        autoAlpha: 0,
        y: 44,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.bobinas', start: 'top 82%' },
      })
      gsap.from('.academy-cta > *:not(.corners):not(.acta-lights)', {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.academy-cta', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setIdx((i) => (i + 1) % EXAMPLES.length), 4600)
    return () => clearInterval(id)
  }, [reduced])

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.prism-swap',
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' }
      )
    }, root)
    return () => ctx.revert()
  }, [idx, reduced])

  const glint = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`)
  }

  const ex = EXAMPLES[idx]

  return (
    <section className="scene training" id="entrenamiento" ref={root} data-scene="03">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 03</span>
          <span className="scene-name">El entrenamiento</span>
        </div>
        <h2>
          <span className="line">
            <span className="line-inner">Tener ojo abre la puerta.</span>
          </span>
          <span className="line">
            <span className="line-inner">
              El Codex lo vuelve <em className="gold-text shimmer">criterio</em>.
            </span>
          </span>
        </h2>
        <p className="body-copy training-lede">
          Tu ojo ya sabe ver. Aurum le suma el idioma: el <strong>Codex</strong>, el
          vocabulario común que convierte «esto se siente mal» en algo preciso,
          consistente y comparable. Criterio de cine + rigor de anotación:{' '}
          <strong>la combinación que los laboratorios de IA no consiguen en ningún otro
          lado</strong>, junta y entrenada.
        </p>

        <div className="prism" aria-label="Traducción de lenguaje de cine a dato de entrenamiento">
          <div className="prism-col prism-col--eye">
            <span className="label label--dim">TU OJO DICE</span>
            <p className="prism-quote prism-swap">{ex.eye}</p>
          </div>
          <div className="prism-core" aria-hidden="true">
            <span className="prism-beam prism-beam--in" />
            <div className="prism-glass">
              <img src="/symbol-mid.png" alt="" />
            </div>
            <span className="prism-beam prism-beam--out" />
            <span className="label prism-core-label">EL CODEX TRADUCE</span>
          </div>
          <div className="prism-col prism-col--data">
            <span className="label label--dim">LA MÁQUINA APRENDE</span>
            <p className="prism-data prism-swap">
              {ex.code}
              <span className="prism-meta">{ex.meta}</span>
            </p>
            <span className="prism-datum prism-swap">{ex.datum}</span>
          </div>
        </div>

        <div className="bobinas">
          {BOBINAS.map((b) => (
            <div className="bobina" key={b.num} onMouseMove={glint}>
              <span className="label label--dim">{b.num}</span>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>

        <aside className="academy-cta">
          <div className="corners">
            <span /><span /><span /><span />
          </div>
          <div className="acta-lights" aria-hidden="true">
            <span /><span />
          </div>
          <span className="label acta-soon">PRÓXIMAMENTE · EN ESTA SALA</span>
          <div className="acta-title">
            <img className="acta-word" src="/aurum-word.png" alt="Aurum" />
            <span className="acta-academy">ACADEMY</span>
          </div>
          <p className="acta-copy">
            La certificación <strong>gratuita</strong> que convierte tu ojo de cine en un
            oficio nuevo. Primera cohorte: Workflow 01 — Preference Evaluation.
          </p>
          <div className="acta-ctas">
            <a className="btn btn--gold" href="/academy/">
              Reservá tu butaca
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
