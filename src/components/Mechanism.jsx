import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCopy } from '../i18n'

const CLIP_SECONDS = 12

const ANNOT_TIMES = [2.46, 5.12, 7.79, 9.5]

const COPY = {
  es: {
    sceneName: 'El trabajo',
    hint: 'Seguí scrolleando',
    leadH2: (
      <>
        La IA ya genera video. Todavía no sabe si <em>está bien</em>.
      </>
    ),
    leadBody: (
      <>
        Un modelo puede producir mil planos por hora. No puede decirte si la cara del
        personaje cambió entre tomas, si la luz rompe la continuidad, si la escena
        respira o se cae. Eso lo da el oficio: años de set, de isla de edición y de sala
        oscura. <strong>Vos lo traés puesto.</strong>
      </>
    ),
    verdict: 'RECHAZADO',
    captionA: (
      <>
        La máquina no lo vio. <span className="highlight">Vos, en dos segundos.</span>
      </>
    ),
    captionB: 'OJO DE CINE → CODEX → DATO',
    afterP1: (
      <>
        Los laboratorios de IA más grandes del mundo necesitan ese veredicto para
        entrenar sus modelos. Se llama{' '}
        <strong>evaluación experta de video generativo</strong>: un oficio real y
        demandado —anotación de datos especializada— que nosotros hacemos con estándares
        de rodaje.
      </>
    ),
    afterP2: (
      <>
        Lo que ves con oficio se escribe en el <strong>Codex</strong> —el idioma de
        Aurum— y se convierte en un dato que la máquina puede aprender. No es una encuesta
        ni una microtarea: es tu criterio profesional aplicado plano por plano, con
        rúbricas claras y <strong>pago en dólares</strong>.
      </>
    ),
    wfLabel: 'WORKFLOW 01 · PREFERENCE EVALUATION · TU PRIMERA TAREA',
    wfH3: (
      <>
        Dos tomas entran. <em>Una sale.</em>
      </>
    ),
    wfBody: (
      <>
        Así de concreto: dos versiones del mismo plano, generadas por IA. Las mirás,
        elegís cuál sostiene la escena y firmás por qué. No es opinar — es mirar con
        oficio y traducirlo a una decisión con criterio, severidad y motivo.
      </>
    ),
    takeATag: 'TOMA A · CLIP_089',
    takeAFlag: '⚠ LA CARA NO SOBREVIVE EL PANEO',
    takeAFlagCodex: '⤷ CODEX · TEMPORAL INCONSISTENCY · SEV. ALTA · CONF. 0.93',
    takeBTag: 'TOMA B · CLIP_089',
    stamp: 'ELEGIDA',
    slipHead: 'HOJA DE EVALUACIÓN · WF-01 · CLIP_089 A/B',
    slipMain: 'GANA TOMA B — CRITERIO: CONSISTENCIA TEMPORAL',
    slipNote:
      'NOTA: LA CARA DE A PIERDE IDENTIDAD DURANTE EL MOVIMIENTO DE CÁMARA. B SOSTIENE PERSONAJE, LUZ Y PLANO.',
    slipSignA: 'EVALUADOR/A: ',
    slipSignB: 'VOS',
    annotations: [
      {
        craft: '⚠ 00:02:11 — LA CARA DEL PERSONAJE NO ES LA DEL PLANO ANTERIOR',
        codex: 'IDENTITY DRIFT · SEV. CRÍTICA · CONF. 0.96',
      },
      {
        craft: '⚠ 00:05:03 — TEMPERATURA DE COLOR SALTA DE 5600K A 3200K',
        codex: 'COLOR CONTINUITY BREAK · SEV. MEDIA · CONF. 0.98',
      },
      {
        craft: '⚠ 00:07:19 — SALTO DE EJE: LA MIRADA CRUZA LA LÍNEA',
        codex: 'SPATIAL CONTINUITY ERROR · SEV. ALTA · CONF. 0.91',
      },
      {
        craft: '⚠ 00:09:12 — LA SOMBRA NO RESPONDE A NINGUNA FUENTE',
        codex: 'LIGHT SOURCE MISMATCH · SEV. ALTA · CONF. 0.87',
      },
    ],
    roles: [
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
    ],
  },
  en: {
    sceneName: 'The work',
    hint: 'Keep scrolling',
    leadH2: (
      <>
        AI already generates video. It still doesn’t know if it’s <em>any good</em>.
      </>
    ),
    leadBody: (
      <>
        A model can produce a thousand shots an hour. It can’t tell you if the
        character’s face changed between takes, if the light breaks continuity, if the
        scene breathes or falls apart. That comes from the craft: years on set, in the
        edit bay and the dark room. <strong>You carry it with you.</strong>
      </>
    ),
    verdict: 'REJECTED',
    captionA: (
      <>
        The machine didn’t see it.{' '}
        <span className="highlight">You did, in two seconds.</span>
      </>
    ),
    captionB: 'FILM EYE → CODEX → DATA',
    afterP1: (
      <>
        The world’s largest AI labs need that verdict to train their models. It’s called{' '}
        <strong>expert generative-video evaluation</strong>: a real, in-demand craft
        —specialized data annotation— that we do to filmmaking standards.
      </>
    ),
    afterP2: (
      <>
        What you see with craft is written into the <strong>Codex</strong> —Aurum’s
        language— and becomes data the machine can learn from. It’s not a survey or a
        microtask: it’s your professional judgment applied shot by shot, with clear
        rubrics and <strong>payment in dollars</strong>.
      </>
    ),
    wfLabel: 'WORKFLOW 01 · PREFERENCE EVALUATION · YOUR FIRST TASK',
    wfH3: (
      <>
        Two takes go in. <em>One comes out.</em>
      </>
    ),
    wfBody: (
      <>
        This concrete: two versions of the same shot, AI-generated. You watch them,
        choose which one holds the scene and sign off on why. It’s not opinion — it’s
        watching with craft and translating it into a decision with judgment, severity
        and reason.
      </>
    ),
    takeATag: 'TAKE A · CLIP_089',
    takeAFlag: '⚠ THE FACE DOESN’T SURVIVE THE PAN',
    takeAFlagCodex: '⤷ CODEX · TEMPORAL INCONSISTENCY · SEV. HIGH · CONF. 0.93',
    takeBTag: 'TAKE B · CLIP_089',
    stamp: 'CHOSEN',
    slipHead: 'EVALUATION SHEET · WF-01 · CLIP_089 A/B',
    slipMain: 'TAKE B WINS — CRITERION: TEMPORAL CONSISTENCY',
    slipNote:
      'NOTE: A’S FACE LOSES IDENTITY DURING THE CAMERA MOVE. B HOLDS CHARACTER, LIGHT AND FRAME.',
    slipSignA: 'EVALUATOR: ',
    slipSignB: 'YOU',
    annotations: [
      {
        craft: '⚠ 00:02:11 — THE CHARACTER’S FACE ISN’T THE ONE FROM THE PREVIOUS SHOT',
        codex: 'IDENTITY DRIFT · SEV. CRITICAL · CONF. 0.96',
      },
      {
        craft: '⚠ 00:05:03 — COLOR TEMPERATURE JUMPS FROM 5600K TO 3200K',
        codex: 'COLOR CONTINUITY BREAK · SEV. MEDIUM · CONF. 0.98',
      },
      {
        craft: '⚠ 00:07:19 — AXIS BREAK: THE GAZE CROSSES THE LINE',
        codex: 'SPATIAL CONTINUITY ERROR · SEV. HIGH · CONF. 0.91',
      },
      {
        craft: '⚠ 00:09:12 — THE SHADOW ANSWERS TO NO SOURCE',
        codex: 'LIGHT SOURCE MISMATCH · SEV. HIGH · CONF. 0.87',
      },
    ],
    roles: [
      {
        num: 'CAM A',
        title: 'Cinematography',
        desc: 'Sourceless light, lenses that lie, lighting continuity that breaks between shots.',
      },
      {
        num: 'CAM B',
        title: 'Editing',
        desc: 'Rhythm, continuity, axes. The cut that feels wrong before it can be explained.',
      },
      {
        num: 'CAM C',
        title: 'Color',
        desc: 'Impossible skins, palettes that crack, grades that give the machine away.',
      },
      {
        num: 'CAM D',
        title: 'Sound',
        desc: 'Rooms that don’t exist, mixes with no space, ghost foley off-frame.',
      },
    ],
  },
}

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
  const hintRef = useRef(null)
  const t = useCopy(COPY)

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
      gsap.from('.wf-head > *', {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.wf-head', start: 'top 80%' },
      })
      gsap.from('.role', {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.roles', start: 'top 82%' },
      })

      const duelTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: '.duel',
          start: 'top 82%',
          end: 'top 18%',
          scrub: 0.7,
        },
      })
      duelTl
        .from('.duel-take--a', { autoAlpha: 0, x: -46, duration: 0.6 })
        .from('.duel-take--b', { autoAlpha: 0, x: 46, duration: 0.6 }, '<')
        .from('.duel-vs', { autoAlpha: 0, scale: 0.55, duration: 0.3 }, '-=0.25')
        .fromTo(
          '.duel .take-flag',
          { autoAlpha: 0, x: -18 },
          { autoAlpha: 1, x: 0, duration: 0.4 },
          '+=0.25'
        )
        .fromTo(
          '.take-stamp',
          { autoAlpha: 0, scale: 1.7, rotate: 3 },
          { autoAlpha: 1, scale: 1, rotate: -5, duration: 0.35, ease: 'power4.in' },
          '+=0.3'
        )
        .from(
          '.duel-slip .slip-row',
          { autoAlpha: 0, y: 12, stagger: 0.16, duration: 0.4 },
          '+=0.25'
        )

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
              if (hintRef.current)
                hintRef.current.style.opacity = String(
                  Math.max(0, 1 - self.progress * 6)
                )
            },
          },
        })
        ANNOT_TIMES.forEach((time, i) => {
          const chip = `.annotations--overlay .annotation:nth-child(${i + 1})`
          tl.fromTo(
            chip,
            { autoAlpha: 0, x: -26 },
            { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out' },
            time
          )
          tl.fromTo(
            `${chip} .annotation-codex`,
            { autoAlpha: 0, y: -5 },
            { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
            time + 0.55
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
        gsap.from('.annotations--log .annotation-codex', {
          autoAlpha: 0,
          y: -5,
          duration: 0.45,
          stagger: 0.5,
          delay: 0.4,
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
    <section className="scene" id="trabajo" ref={root} data-scene="01">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 01</span>
          <span className="scene-name">{t.sceneName}</span>
        </div>

        <div className="mech-lead">
          <h2>{t.leadH2}</h2>
          <p className="body-copy">{t.leadBody}</p>
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
                {t.annotations.map((a, i) => (
                  <div className="annotation" key={i}>
                    {a.craft}
                    <span className="annotation-codex">⤷ CODEX · {a.codex}</span>
                  </div>
                ))}
              </div>
              <div className="verdict">{t.verdict}</div>
            </div>
            <div className="viewer-hint" ref={hintRef} aria-hidden="true">
              {t.hint} <span className="viewer-hint-arrow">↓</span>
            </div>
          </div>
          <div className="annotations annotations--log">
            {t.annotations.map((a, i) => (
              <div className="annotation" key={i}>
                {a.craft}
                <span className="annotation-codex">⤷ CODEX · {a.codex}</span>
              </div>
            ))}
          </div>
          <div className="viewer-caption">
            <span>{t.captionA}</span>
            <span>{t.captionB}</span>
          </div>
        </div>

        <div className="mech-after">
          <p className="body-copy">{t.afterP1}</p>
          <p className="body-copy">{t.afterP2}</p>
        </div>

        <div className="workflow">
          <div className="wf-head">
            <span className="label">{t.wfLabel}</span>
            <h3>{t.wfH3}</h3>
            <p className="body-copy">{t.wfBody}</p>
          </div>

          <div className="duel">
            <div className="duel-takes">
              <figure className="duel-take duel-take--a">
                <span className="take-tag">{t.takeATag}</span>
                <div className="take-scene">
                  <span className="take-fig take-fig--ghost" />
                </div>
                <div className="take-flag">
                  <div className="annotation">
                    {t.takeAFlag}
                    <span className="annotation-codex">{t.takeAFlagCodex}</span>
                  </div>
                </div>
              </figure>
              <span className="duel-vs" aria-hidden="true">VS</span>
              <figure className="duel-take duel-take--b">
                <span className="take-tag">{t.takeBTag}</span>
                <div className="take-scene">
                  <span className="take-fig" />
                </div>
                <div className="take-stamp">{t.stamp}</div>
              </figure>
            </div>
            <div className="duel-slip">
              <span className="slip-row slip-row--head">{t.slipHead}</span>
              <span className="slip-row slip-row--main">{t.slipMain}</span>
              <span className="slip-row">{t.slipNote}</span>
              <span className="slip-row slip-row--sign">
                {t.slipSignA}<em>{t.slipSignB}</em>
              </span>
            </div>
          </div>
        </div>

        <div className="roles">
          {t.roles.map((r) => (
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
