import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import CursorFrame from '../fx/CursorFrame'
import Dust from '../fx/Dust'
import Footer from '../components/Footer'
import { scramble } from '../fx/scramble'

gsap.registerPlugin(ScrollTrigger)

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PROGRAM = [
  {
    num: 'BOBINA 01',
    title: 'El Codex',
    desc: 'El idioma de Aurum: la taxonomía de errores del video generativo —identidad, luz, continuidad, física, sonido—, los niveles de severidad y los grados de confianza. Nombrar lo que ves como lo nombra la industria que entrena modelos.',
  },
  {
    num: 'BOBINA 02',
    title: 'Los workflows',
    desc: 'Preference Evaluation: comparar dos outputs y decidir con criterio, no con instinto suelto. Detección de fallas: marcar el frame exacto y justificar. Casos reales, feedback real, estándares de anotación profesional.',
  },
  {
    num: 'BOBINA 03',
    title: 'El certificado',
    desc: 'Un certificado verificable de Evaluador Cinematográfico de Video Generativo —para tu LinkedIn y tu CV— y la entrada a la pool de talento de Aurum, de donde salen los proyectos pagos en dólares.',
  },
]

const STEPS = [
  { num: 'F·01', title: 'Te anotás', desc: 'Dejás tu contacto. Te avisamos cuando abra la primera cohorte.' },
  { num: 'F·02', title: 'Cursás gratis', desc: 'El Codex, los workflows y práctica con clips reales. Sin costo.' },
  { num: 'F·03', title: 'Te certificás', desc: 'Demostrás criterio consistente y firmás tu certificado.' },
  { num: 'F·04', title: 'Entrás a la pool', desc: 'Proyectos de laboratorios de IA, pagos en dólares.' },
]

export default function AcademyApp() {
  const lightRef = useRef(null)
  const lenisRef = useRef(null)
  const [gatesDone, setGatesDone] = useState(prefersReduced)
  const [form, setForm] = useState({ nombre: '', email: '', rol: '' })

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!window.location.hash) window.scrollTo(0, 0)
    if (prefersReduced) return

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const onAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href').slice(1)
      const target = id && document.getElementById(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: 0, duration: 1.6 })
    }
    document.addEventListener('click', onAnchorClick)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (prefersReduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const light = lightRef.current
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    let raf
    const loop = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      light.style.setProperty('--mx', `${cx}px`)
      light.style.setProperty('--my', `${cy}px`)
      raf = requestAnimationFrame(loop)
    }
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      light.classList.add('is-on')
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useLayoutEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: () => setGatesDone(true) })
        .to('.acad-gate--top', { scaleY: 0, duration: 1.1, ease: 'power4.inOut', delay: 0.25 })
        .to('.acad-gate--bottom', { scaleY: 0, duration: 1.1, ease: 'power4.inOut' }, '<')

      gsap
        .timeline({ delay: 0.55 })
        .from('.acad-soon', { autoAlpha: 0, y: 14, duration: 0.8, ease: 'power2.out' })
        .from('.acad-title-word', { autoAlpha: 0, scale: 1.05, filter: 'blur(9px)', duration: 1.3, ease: 'power3.out' }, '-=0.4')
        .from('.acad-title-academy', { autoAlpha: 0, letterSpacing: '0.9em', duration: 1.2, ease: 'power3.out' }, '-=0.9')
        .from('.acad-hero h1 .line-inner', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.13 }, '-=0.7')
        .from('.acad-hero-sub', { autoAlpha: 0, y: 18, duration: 0.9, ease: 'power2.out' }, '-=0.5')
        .from('.acad-keyline', { autoAlpha: 0, duration: 0.8 }, '-=0.4')
        .from('.acad-hero .hero-ctas', { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' }, '-=0.4')

      gsap.utils.toArray('.acad-reveal').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })
      })
      gsap.from('.acad-program .bobina', {
        autoAlpha: 0,
        y: 44,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.acad-program .bobinas', start: 'top 82%' },
      })
      gsap.from('.strip-frame', {
        autoAlpha: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.strip', start: 'top 82%' },
      })
      gsap.fromTo(
        '.wf-stamp',
        { autoAlpha: 0, scale: 1.6, rotate: 2 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: -6,
          duration: 0.45,
          ease: 'power4.in',
          scrollTrigger: { trigger: '.acad-ticket', start: 'top 62%' },
        }
      )

      const triggers = gsap.utils.toArray('.scene-name').map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => scramble(el),
        })
      )
      return () => triggers.forEach((t) => t.kill())
    })
    return () => ctx.revert()
  }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const subject = `Aurum Academy — Reserva primera cohorte — ${form.nombre}`
    const body = [
      `Nombre: ${form.nombre}`,
      `Email: ${form.email}`,
      form.rol ? `Oficio: ${form.rol}` : null,
      '',
      'Quiero recibir el aviso cuando abra la primera cohorte de Aurum Academy (Workflow 01 — Preference Evaluation).',
    ]
      .filter((l) => l !== null)
      .join('\n')
    window.location.href = `mailto:hello@aurumvisual.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="page acad-page">
      {!gatesDone && (
        <div className="acad-gates" aria-hidden="true">
          <div className="acad-gate acad-gate--top" />
          <div className="acad-gate acad-gate--bottom" />
        </div>
      )}
      <CursorFrame reduced={prefersReduced} />
      <div className="cursor-light" ref={lightRef} />
      <div className="vignette" />
      <div className="grain" />

      <nav className="nav is-visible is-scrolled acad-nav">
        <a className="nav-brand" href="/" aria-label="Aurum Visual">
          <img src="/symbol-small.png" alt="" />
          <img className="nav-word" src="/aurum-word.png" alt="AURUM" />
        </a>
        <div className="nav-links">
          <a href="/">Volver a la sala</a>
          <a className="nav-cta" href="#anotarse">
            Reservar butaca
          </a>
        </div>
      </nav>

      <main>
        <header className="acad-hero" id="top">
          <div className="acad-hero-atmos" aria-hidden="true">
            <span className="acad-light acad-light--a" />
            <span className="acad-light acad-light--b" />
            <div className="hero-floor" />
          </div>
          <Dust reduced={prefersReduced} />
          <div className="container acad-hero-inner">
            <span className="label acad-soon">PRÓXIMAMENTE · PRIMERA COHORTE · CERTIFICACIÓN GRATUITA</span>
            <div className="acad-title">
              <img className="acad-title-word" src="/aurum-word.png" alt="Aurum" />
              <span className="acad-title-academy">ACADEMY</span>
            </div>
            <h1>
              <span className="line">
                <span className="line-inner">El nuevo oficio</span>
              </span>
              <span className="line">
                <span className="line-inner">
                  de <em className="gold-text shimmer">mirar</em>.
                </span>
              </span>
            </h1>
            <p className="acad-hero-sub">
              Convertí tu ojo de cine en un oficio nuevo. Una certificación gratuita
              donde aprendés a evaluar video generado por IA con criterio de oficio
              y estándares de anotación profesional. Al certificarte, entrás a la pool
              de Aurum: <strong>proyectos reales, pagos en dólares</strong>.
            </p>
            <span className="acad-keyline">
              CERTIFICACIÓN · EVALUACIÓN EXPERTA DE VIDEO GENERATIVO · ANOTACIÓN ESPECIALIZADA
            </span>
            <div className="hero-ctas">
              <a className="btn btn--gold" href="#anotarse">
                Reservá tu butaca
              </a>
              <a className="btn btn--ghost" href="#programa">
                Qué vas a aprender
              </a>
            </div>
          </div>
        </header>

        <section className="scene acad-program" id="programa">
          <div className="container">
            <div className="scene-head">
              <span className="scene-num">AC. 01</span>
              <span className="scene-name">El programa</span>
            </div>
            <h2 className="acad-reveal">
              Tres bobinas. Un oficio <em className="gold-text shimmer">nuevo</em>.
            </h2>
            <p className="body-copy acad-reveal">
              No venimos a enseñarte a mirar: eso ya lo traés. Venimos a darte el idioma
              y el estándar para que tu mirada se vuelva <strong>criterio útil para
              entrenar modelos</strong> — y un trabajo que se paga.
            </p>
            <div className="bobinas">
              {PROGRAM.map((b) => (
                <div className="bobina" key={b.num}>
                  <span className="label label--dim">{b.num}</span>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="scene acad-how">
          <div className="container">
            <div className="scene-head">
              <span className="scene-num">AC. 02</span>
              <span className="scene-name">Cómo funciona</span>
            </div>
            <div className="strip">
              <div className="strip-frames">
                {STEPS.map((s) => (
                  <div className="strip-frame" key={s.num}>
                    <span className="label label--dim">{s.num}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="acad-strip-note acad-reveal">
              GRATUITA DE PUNTA A PUNTA · TU OJO PONE EL RESTO
            </p>
          </div>
        </section>

        <section className="scene acad-cert">
          <div className="container">
            <div className="scene-head">
              <span className="scene-num">AC. 03</span>
              <span className="scene-name">Primera certificación</span>
            </div>
            <div className="acad-ticket acad-reveal">
              <div className="corners">
                <span /><span /><span /><span />
              </div>
              <div className="ticket-main">
                <span className="label">CERTIFICACIÓN 01 · WORKFLOW 01</span>
                <h3>Preference Evaluation</h3>
                <p className="body-copy">
                  Dos videos generados por IA, lado a lado. Decidís cuál cumple mejor y
                  explicás por qué, con criterios claros del Codex. Es la primera
                  certificación de Aurum — y tu entrada a la pool.
                </p>
                <div className="ticket-ab" aria-hidden="true">
                  <span className="ticket-take">A</span>
                  <span className="ticket-vs">VS</span>
                  <span className="ticket-take ticket-take--win">B</span>
                </div>
              </div>
              <div className="ticket-side">
                <span className="wf-stamp">PRÓXIMAMENTE</span>
                <span className="ticket-note">EL EQUIPO ESTÁ CARGANDO EL PROYECTOR</span>
              </div>
            </div>
          </div>
        </section>

        <section className="scene acad-signup" id="anotarse">
          <div className="container">
            <div className="scene-head">
              <span className="scene-num">AC. 04</span>
              <span className="scene-name">Función privada</span>
            </div>
            <div className="apply-frame acad-reveal">
              <div className="corners">
                <span /><span /><span /><span />
              </div>
              <div className="apply-grid">
                <div>
                  <p className="label">Cupos de la primera cohorte</p>
                  <h2>
                    Reservá tu <em className="gold-text shimmer">butaca</em>.
                  </h2>
                  <p className="body-copy">
                    La primera cohorte abre pronto y arranca con cupos cortos. Dejanos
                    tu contacto y te guardamos el asiento: te escribimos una sola vez,
                    cuando se abra la sala.
                  </p>
                  <p className="apply-mail">
                    ¿Ya te sentís listo/a para aplicar directo?{' '}
                    <a href="/#aplicar">El casting está abierto</a>
                  </p>
                </div>
                <form className="form" onSubmit={submit}>
                  <div className="field">
                    <label htmlFor="a-nombre">Nombre</label>
                    <input
                      id="a-nombre"
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={set('nombre')}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="a-email">Email</label>
                    <input
                      id="a-email"
                      type="email"
                      required
                      placeholder="vos@tucine.com"
                      value={form.email}
                      onChange={set('email')}
                    />
                  </div>
                  <div className="field field--full">
                    <label htmlFor="a-rol">Tu oficio (opcional)</label>
                    <input
                      id="a-rol"
                      type="text"
                      placeholder="Foto, montaje, color, sonido, dirección…"
                      value={form.rol}
                      onChange={set('rol')}
                    />
                  </div>
                  <div className="form-submit">
                    <button className="btn btn--gold" type="submit">
                      Reservar mi butaca
                    </button>
                    <span className="form-note">
                      SE ABRE TU CLIENTE DE CORREO · UN SOLO AVISO, PALABRA DE CINÉFILOS
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
