import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import CursorFrame from '../fx/CursorFrame'
import Dust from '../fx/Dust'
import Footer from '../components/Footer'
import LangToggle from '../components/LangToggle'
import { scramble } from '../fx/scramble'
import { useCopy, useLang } from '../i18n'

let hasRegisteredScrollTrigger = false

function ensureScrollTrigger() {
  if (hasRegisteredScrollTrigger) return
  gsap.registerPlugin(ScrollTrigger)
  hasRegisteredScrollTrigger = true
}

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SEO = {
  es: {
    title: 'Aurum Academy — Certificá tu criterio cinematográfico',
    description:
      'Certificación gratuita para evaluar video generado por IA con criterio cinematográfico y acceder a proyectos pagos.',
  },
  en: {
    title: 'Aurum Academy — Certify your cinematic judgment',
    description:
      'Free certification to evaluate AI-generated video with cinematic judgment and access paid projects.',
  },
}

const COPY = {
  es: {
    navBack: 'Volver a la sala',
    navCta: 'Reservar butaca',
    navPortal: 'El Aula',
    heroSoon: 'PRIMERA COHORTE · CERTIFICACIÓN GRATUITA',
    h1a: 'El nuevo oficio',
    h1b: 'de ',
    h1em: 'mirar',
    heroSub: (
      <>
        Convertí tu ojo de cine en un oficio nuevo. Una certificación gratuita donde
        aprendés a evaluar video generado por IA con criterio de oficio y estándares de
        anotación profesional. Al certificarte, entrás a la red de evaluadores de
        Aurum:{' '}
        <strong>proyectos reales, pagos en dólares</strong>.
      </>
    ),
    keyline: [
      'Certificación gratuita',
      'Evaluación experta de video',
      'Acceso a proyectos pagos',
    ],
    cta1: 'Reservá tu butaca',
    cta2: 'Qué vas a aprender',
    progName: 'El programa',
    progH2a: 'Tres bobinas. Un oficio ',
    progH2em: 'nuevo',
    progBody: (
      <>
        No venimos a enseñarte a mirar: eso ya lo traés. Venimos a darte el idioma y el
        estándar para que tu mirada se vuelva{' '}
        <strong>criterio útil para entrenar modelos</strong> — y un trabajo que se paga.
      </>
    ),
    program: [
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
        desc: 'Un certificado verificable de Evaluador Cinematográfico de Video Generativo —para tu LinkedIn y tu CV— y la entrada a la red de talento de Aurum, de donde salen los proyectos pagos en dólares.',
      },
    ],
    howName: 'Cómo funciona',
    steps: [
      { num: 'F·01', title: 'Te anotás', desc: 'Dejás tu contacto. Te avisamos cuando abra la primera cohorte.' },
      { num: 'F·02', title: 'Cursás gratis', desc: 'El Codex, los workflows y práctica con clips reales. Sin costo.' },
      { num: 'F·03', title: 'Te certificás', desc: 'Demostrás criterio consistente y firmás tu certificado.' },
      { num: 'F·04', title: 'Entrás a la pool', desc: 'Proyectos de laboratorios de IA, pagos en dólares.' },
    ],
    stripNote: 'GRATUITA DE PUNTA A PUNTA · TU OJO PONE EL RESTO',
    certName: 'Primera certificación',
    ticketLabel: 'CERTIFICACIÓN 01 · WORKFLOW 01',
    ticketBody:
      'Dos videos generados por IA, lado a lado. Decidís cuál cumple mejor y explicás por qué, con criterios claros del Codex. Es la primera certificación de Aurum — y tu entrada a la red de evaluadores.',
    ticketStamp: 'PRÓXIMAMENTE',
    ticketNote: 'EL EQUIPO ESTÁ CARGANDO EL PROYECTOR',
    signName: 'Función privada',
    signLabel: 'Cupos de la primera cohorte',
    signH2a: 'Reservá tu ',
    signH2em: 'butaca',
    signBody:
      'La primera cohorte abre pronto y arranca con cupos cortos. Dejanos tu contacto y te guardamos el asiento: te escribimos una sola vez, cuando se abra la sala.',
    signMailA: '¿Ya te sentís listo/a para aplicar directo? ',
    signMailLink: 'El casting está abierto',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Email',
    emailPlaceholder: 'vos@tucine.com',
    roleLabel: 'Tu oficio (opcional)',
    rolePlaceholder: 'Foto, montaje, color, sonido, dirección…',
    submit: 'Reservar mi butaca',
    note: 'SE ABRE TU CLIENTE DE CORREO · UN SOLO AVISO, PALABRA DE CINÉFILOS',
    mailSubject: 'Aurum Academy — Reserva primera cohorte',
    mailName: 'Nombre',
    mailEmail: 'Email',
    mailRole: 'Oficio',
    mailBody:
      'Quiero recibir el aviso cuando abra la primera cohorte de Aurum Academy (Workflow 01 — Preference Evaluation).',
  },
  en: {
    navBack: 'Back to the theater',
    navCta: 'Reserve a seat',
    navPortal: 'The Classroom',
    heroSoon: 'FIRST COHORT · FREE CERTIFICATION',
    h1a: 'The new craft',
    h1b: 'of ',
    h1em: 'seeing',
    heroSub: (
      <>
        Turn your cinematic eye into a new craft. A free certification where you learn to
        evaluate AI-generated video with the rigor of the craft and professional
        annotation standards. Once certified, you join Aurum’s evaluator network:{' '}
        <strong>real projects, paid in dollars</strong>.
      </>
    ),
    keyline: [
      'Free certification',
      'Expert video evaluation',
      'Access to paid projects',
    ],
    cta1: 'Reserve your seat',
    cta2: 'What you’ll learn',
    progName: 'The program',
    progH2a: 'Three reels. A ',
    progH2em: 'new craft',
    progBody: (
      <>
        We’re not here to teach you to see: you already bring that. We’re here to give
        you the language and the standard so your eye becomes{' '}
        <strong>judgment useful for training models</strong> — and work that pays.
      </>
    ),
    program: [
      {
        num: 'REEL 01',
        title: 'The Codex',
        desc: 'Aurum’s language: the taxonomy of generative-video errors —identity, light, continuity, physics, sound—, the severity levels and confidence grades. Naming what you see the way the model-training industry names it.',
      },
      {
        num: 'REEL 02',
        title: 'The workflows',
        desc: 'Preference Evaluation: compare two outputs and decide with judgment, not loose instinct. Flaw detection: mark the exact frame and justify it. Real cases, real feedback, professional annotation standards.',
      },
      {
        num: 'REEL 03',
        title: 'The certificate',
        desc: 'A verifiable Cinematic Generative-Video Evaluator certificate —for your LinkedIn and your CV— and entry to Aurum’s talent network, where the projects paid in dollars come from.',
      },
    ],
    howName: 'How it works',
    steps: [
      { num: 'F·01', title: 'You sign up', desc: 'Leave your contact. We’ll let you know when the first cohort opens.' },
      { num: 'F·02', title: 'You study free', desc: 'The Codex, the workflows and practice with real clips. No cost.' },
      { num: 'F·03', title: 'You get certified', desc: 'You show consistent judgment and sign your certificate.' },
      { num: 'F·04', title: 'You join the pool', desc: 'Projects from AI labs, paid in dollars.' },
    ],
    stripNote: 'FREE END TO END · YOUR EYE DOES THE REST',
    certName: 'First certification',
    ticketLabel: 'CERTIFICATION 01 · WORKFLOW 01',
    ticketBody:
      'Two AI-generated videos, side by side. You decide which one delivers better and explain why, with clear Codex criteria. It’s Aurum’s first certification — and your entry to the evaluator network.',
    ticketStamp: 'COMING SOON',
    ticketNote: 'THE TEAM IS LOADING THE PROJECTOR',
    signName: 'Private screening',
    signLabel: 'First cohort spots',
    signH2a: 'Reserve your ',
    signH2em: 'seat',
    signBody:
      'The first cohort opens soon and starts with limited spots. Leave us your contact and we’ll hold your seat: we write once, when the theater opens.',
    signMailA: 'Already feel ready to apply directly? ',
    signMailLink: 'The casting is open',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@yourfilm.com',
    roleLabel: 'Your craft (optional)',
    rolePlaceholder: 'Photography, editing, color, sound, directing…',
    submit: 'Reserve my seat',
    note: 'OPENS YOUR EMAIL CLIENT · ONE NOTICE ONLY, A CINEPHILE’S WORD',
    mailSubject: 'Aurum Academy — First cohort reservation',
    mailName: 'Name',
    mailEmail: 'Email',
    mailRole: 'Craft',
    mailBody:
      'I want to be notified when the first cohort of Aurum Academy (Workflow 01 — Preference Evaluation) opens.',
  },
}

export default function AcademyApp() {
  const lightRef = useRef(null)
  const lenisRef = useRef(null)
  const [gatesDone, setGatesDone] = useState(prefersReduced)
  const [form, setForm] = useState({ nombre: '', email: '', rol: '', website: '' })
  const lang = useLang()
  const t = useCopy(COPY)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!window.location.hash) window.scrollTo(0, 0)
    if (prefersReduced) return
    ensureScrollTrigger()

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
    ensureScrollTrigger()
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

  useEffect(() => {
    if (prefersReduced) return
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  useEffect(() => {
    const seo = SEO[lang] ?? SEO.es
    document.title = seo.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', seo.description)
  }, [lang])

  const submit = (e) => {
    e.preventDefault()
    if (form.website) return // honeypot: silently drop bot submissions
    const subject = `${t.mailSubject} — ${form.nombre}`
    const body = [
      `${t.mailName}: ${form.nombre}`,
      `${t.mailEmail}: ${form.email}`,
      form.rol ? `${t.mailRole}: ${form.rol}` : null,
      '',
      t.mailBody,
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
          <a href="/">{t.navBack}</a>
          <a href="/academy/app/">{t.navPortal}</a>
          <LangToggle className="nav-lang" />
          <a className="nav-cta" href="#anotarse">
            {t.navCta}
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
            <span className="label acad-soon">{t.heroSoon}</span>
            <div className="acad-title">
              <img className="acad-title-word" src="/aurum-word.png" alt="Aurum" />
              <span className="acad-title-academy">ACADEMY</span>
            </div>
            <h1>
              <span className="line">
                <span className="line-inner">{t.h1a}</span>
              </span>
              <span className="line">
                <span className="line-inner">
                  {t.h1b}<em className="gold-text shimmer">{t.h1em}</em>.
                </span>
              </span>
            </h1>
            <p className="acad-hero-sub">{t.heroSub}</p>
            <div className="acad-keyline" aria-label={t.keyline.join(', ')}>
              {t.keyline.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="hero-ctas">
              <a className="btn btn--gold" href="#anotarse">
                {t.cta1}
              </a>
              <a className="btn btn--ghost" href="#programa">
                {t.cta2}
              </a>
            </div>
          </div>
        </header>

        <section className="scene acad-program" id="programa">
          <div className="container">
            <div className="scene-head">
              <span className="scene-num">AC. 01</span>
              <span className="scene-name">{t.progName}</span>
            </div>
            <h2 className="acad-reveal">
              {t.progH2a}<em className="gold-text shimmer">{t.progH2em}</em>.
            </h2>
            <p className="body-copy acad-reveal">{t.progBody}</p>
            <div className="bobinas">
              {t.program.map((b) => (
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
              <span className="scene-name">{t.howName}</span>
            </div>
            <div className="strip">
              <div className="strip-frames">
                {t.steps.map((s) => (
                  <div className="strip-frame" key={s.num}>
                    <span className="label label--dim">{s.num}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="acad-strip-note acad-reveal">{t.stripNote}</p>
          </div>
        </section>

        <section className="scene acad-cert">
          <div className="container">
            <div className="scene-head">
              <span className="scene-num">AC. 03</span>
              <span className="scene-name">{t.certName}</span>
            </div>
            <div className="acad-ticket acad-reveal">
              <div className="corners">
                <span /><span /><span /><span />
              </div>
              <div className="ticket-main">
                <span className="label">{t.ticketLabel}</span>
                <h3>Preference Evaluation</h3>
                <p className="body-copy">{t.ticketBody}</p>
                <div className="ticket-ab" aria-hidden="true">
                  <span className="ticket-take">A</span>
                  <span className="ticket-vs">VS</span>
                  <span className="ticket-take ticket-take--win">B</span>
                </div>
              </div>
              <div className="ticket-side">
                <span className="wf-stamp">{t.ticketStamp}</span>
                <span className="ticket-note">{t.ticketNote}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="scene acad-signup" id="anotarse">
          <div className="container">
            <div className="scene-head">
              <span className="scene-num">AC. 04</span>
              <span className="scene-name">{t.signName}</span>
            </div>
            <div className="apply-frame acad-reveal">
              <div className="corners">
                <span /><span /><span /><span />
              </div>
              <div className="apply-grid">
                <div>
                  <p className="label">{t.signLabel}</p>
                  <h2>
                    {t.signH2a}<em className="gold-text shimmer">{t.signH2em}</em>.
                  </h2>
                  <p className="body-copy">{t.signBody}</p>
                  <p className="apply-mail">
                    {t.signMailA}
                    <a href="/#aplicar">{t.signMailLink}</a>
                  </p>
                </div>
                <form className="form" onSubmit={submit}>
                  <div className="field">
                    <label htmlFor="a-nombre">{t.nameLabel}</label>
                    <input
                      id="a-nombre"
                      type="text"
                      required
                      placeholder={t.namePlaceholder}
                      value={form.nombre}
                      onChange={set('nombre')}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="a-email">{t.emailLabel}</label>
                    <input
                      id="a-email"
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={form.email}
                      onChange={set('email')}
                    />
                  </div>
                  <div className="field field--full">
                    <label htmlFor="a-rol">{t.roleLabel}</label>
                    <input
                      id="a-rol"
                      type="text"
                      placeholder={t.rolePlaceholder}
                      value={form.rol}
                      onChange={set('rol')}
                    />
                  </div>
                  <div className="hp-field" aria-hidden="true">
                    <label htmlFor="a-website">No completar</label>
                    <input
                      id="a-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={set('website')}
                    />
                  </div>
                  <div className="form-submit">
                    <button className="btn btn--gold" type="submit">
                      {t.submit}
                    </button>
                    <span className="form-note">{t.note}</span>
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
