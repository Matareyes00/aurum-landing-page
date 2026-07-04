import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const CLIP_SECONDS = 12

const ANNOTATIONS = [
  { time: 2.46, text: '⚠ 00:02:11 — LA CARA DEL PERSONAJE NO ES LA DEL PLANO ANTERIOR' },
  { time: 5.12, text: '⚠ 00:05:03 — TEMPERATURA DE COLOR SALTA DE 5600K A 3200K' },
  { time: 7.79, text: '⚠ 00:07:19 — SALTO DE EJE: LA MIRADA CRUZA LA LÍNEA' },
  { time: 9.5, text: '⚠ 00:09:12 — LA SOMBRA NO RESPONDE A NINGUNA FUENTE' },
]

const ROLES = [
  {
    num: 'CAM A',
    title: 'Fotografía',
    desc: 'Luz sin fuente, ópticas que mienten, continuidad lumínica que se rompe entre planos.',
  },
  {
    num: 'CAM B',
    title: 'Montaje',
    desc: 'Ritmo, raccord, ejes. El corte que se siente mal antes de poder explicarse.',
  },
  {
    num: 'CAM C',
    title: 'Color',
    desc: 'Pieles imposibles, paletas que se quiebran, grados que delatan a la máquina.',
  },
  {
    num: 'CAM D',
    title: 'Sonido',
    desc: 'Salas que no existen, mezclas sin espacio, foley fantasma fuera de cuadro.',
  },
]

const fmtTC = (seconds) => {
  const total = Math.max(0, Math.min(CLIP_SECONDS, seconds))
  const ss = Math.floor(total)
  const ff = Math.floor((total - ss) * 24)
  const p = (n) => String(n).padStart(2, '0')
  return `00:00:${p(ss)}:${p(ff)}`
}

export default function Mechanism({ reduced }) {
  const root = useRef(null)
  const tcRef = useRef(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.mech-lead > *', {
        autoAlpha: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.mech-lead', start: 'top 78%' },
      })
      gsap.from('.mech-after > *', {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.mech-after', start: 'top 80%' },
      })
      gsap.from('.role', {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.roles', start: 'top 82%' },
      })

      const mm = gsap.matchMedia()

      mm.add('(min-width: 900px)', () => {
        gsap.set(['.shot-b', '.shot-c'], { autoAlpha: 0 })
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.viewer-wrap',
            start: 'center 52%',
            end: '+=1700',
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
            onToggle: (self) =>
              window.dispatchEvent(
                new CustomEvent('aurum:letterbox', { detail: self.isActive })
              ),
            onUpdate: (self) => {
              if (tcRef.current)
                tcRef.current.textContent = fmtTC(self.progress * CLIP_SECONDS)
            },
          },
        })
        ANNOTATIONS.forEach((a, i) => {
          tl.fromTo(
            `.annotations--overlay .annotation:nth-child(${i + 1})`,
            { autoAlpha: 0, x: -26 },
            { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out' },
            a.time
          )
        })
        tl.set('.shot-b', { autoAlpha: 1 }, 4.2)
        tl.set('.shot-c', { autoAlpha: 1 }, 8.3)
        tl.fromTo(
          '.verdict',
          { autoAlpha: 0, scale: 1.7, rotate: -2 },
          { autoAlpha: 1, scale: 1, rotate: -7, duration: 0.4, ease: 'power4.in' },
          10.6
        )
        tl.set({}, {}, CLIP_SECONDS)
      })

      mm.add('(max-width: 899px)', () => {
        gsap.from('.viewer-wrap', {
          autoAlpha: 0,
          y: 60,
          duration: 1.3,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.viewer-wrap', start: 'top 80%' },
        })
        gsap.from('.annotations--log .annotation', {
          autoAlpha: 0,
          x: -26,
          duration: 0.6,
          stagger: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.viewer-wrap', start: 'top 55%' },
        })
        gsap.from('.verdict', {
          autoAlpha: 0,
          scale: 1.7,
          rotate: -2,
          duration: 0.45,
          ease: 'power4.in',
          scrollTrigger: { trigger: '.viewer-wrap', start: 'top 32%' },
        })
        const proxy = { t: 0 }
        gsap.to(proxy, {
          t: CLIP_SECONDS,
          duration: 7,
          ease: 'none',
          scrollTrigger: { trigger: '.viewer-wrap', start: 'top 60%' },
          onUpdate: () => {
            if (tcRef.current) tcRef.current.textContent = fmtTC(proxy.t)
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const glint = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`)
  }

  return (
    <section className="scene" id="trabajo" ref={root} data-scene="02">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 02</span>
          <span className="scene-name">El trabajo</span>
        </div>

        <div className="mech-lead">
          <h2>
            La IA ya genera video. Todavía no sabe si <em>está bien</em>.
          </h2>
          <p className="body-copy">
            Un modelo puede producir mil planos por hora. No puede decirte si la cara del
            personaje cambió entre tomas, si la luz rompe la continuidad, si la escena
            respira o se cae. Eso lo da el oficio: años de set, de isla de edición y de
            sala oscura. <strong>Vos lo traés puesto.</strong>
          </p>
        </div>

        <div className="viewer-wrap">
          <div className="corners">
            <span /><span /><span /><span />
          </div>
          <div className="viewer">
            <div className="viewer-scene" />
            <div className="viewer-shot shot-b" />
            <div className="viewer-shot shot-c" />
            <div className="viewer-scanlines" />
            <div className="viewer-osd">
              <div className="osd-top">
                <span className="osd-rec">EVAL</span>
                <span>
                  CLIP_047 · GEN-V4 · <span ref={tcRef}>00:00:00:00</span>
                </span>
              </div>
              <span className="reticle" />
              <div className="annotations annotations--overlay">
                {ANNOTATIONS.map((a) => (
                  <div className="annotation" key={a.text}>
                    {a.text}
                  </div>
                ))}
              </div>
              <div className="verdict">RECHAZADO</div>
            </div>
          </div>
          <div className="annotations annotations--log">
            {ANNOTATIONS.map((a) => (
              <div className="annotation" key={a.text}>
                {a.text}
              </div>
            ))}
          </div>
          <div className="viewer-caption">
            <span>
              La máquina no lo vio. <span className="highlight">Vos, en dos segundos.</span>
            </span>
            <span>JUICIO HUMANO REQUERIDO</span>
          </div>
        </div>

        <div className="mech-after">
          <p className="body-copy">
            Los laboratorios de IA más grandes del mundo necesitan ese veredicto para
            entrenar sus modelos. Se llama <strong>evaluación experta de video
            generativo</strong>: un oficio real y demandado —anotación de datos
            especializada— que nosotros hacemos con estándares de rodaje.
          </p>
          <p className="body-copy">
            No es una encuesta ni una microtarea: es tu criterio profesional aplicado
            plano por plano, con rúbricas claras y <strong>pago en dólares</strong>. La
            doble formación —criterio de cine y rigor de anotación— es lo que los
            laboratorios no consiguen en ningún otro lado. Acá se entrena, se practica
            y se cobra.
          </p>
        </div>

        <div className="roles">
          {ROLES.map((r) => (
            <div className="role" key={r.title} onMouseMove={glint}>
              <span className="role-num">{r.num}</span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
