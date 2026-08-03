import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCopy } from '../i18n'

const COPY = {
  es: {
    sceneName: 'La comunidad',
    line1: 'No es una plataforma.',
    line2a: 'Es una ',
    line2em: 'casa de cine',
    body: (
      <>
        Nadie evalúa solo. Detrás de cada plano hay foros que arden con la película del
        momento, mesas de crítica, y referentes de la industria que sirven de faro para
        quienes recién empiezan.
      </>
    ),
    items: [
      {
        tag: 'FARO',
        title: 'Referentes cerca',
        desc: 'Directores de foto, editores y coloristas de trayectoria que ya recorrieron el camino que estás empezando — y responden, sin escenario de por medio.',
      },
      {
        tag: 'FORO',
        title: 'Conversación de oficio',
        desc: 'Del etalonaje de esa serie al lente de aquel plano. La película del momento, discutida por gente que la mira cuadro a cuadro.',
      },
      {
        tag: 'MESA',
        title: 'Crítica entre pares',
        desc: 'El criterio se entrena mirando y se agudiza discutiendo. Mesas de crítica donde tu lectura de un plano crece con la de los demás.',
      },
    ],
  },
  en: {
    sceneName: 'The community',
    line1: 'It’s not a platform.',
    line2a: 'It’s a ',
    line2em: 'house of cinema',
    body: (
      <>
        Nobody evaluates alone. Behind every shot there are forums blazing about the film
        of the moment, critique tables, and industry mentors who act as a beacon for
        those just starting out.
      </>
    ),
    items: [
      {
        tag: 'BEACON',
        title: 'Mentors nearby',
        desc: 'Cinematographers, editors and colorists with real careers who already walked the path you’re starting — and answer, with no stage in between.',
      },
      {
        tag: 'FORUM',
        title: 'Shop talk',
        desc: 'From the grade on that series to the lens on that shot. The film of the moment, discussed by people who watch it frame by frame.',
      },
      {
        tag: 'TABLE',
        title: 'Peer critique',
        desc: 'Judgment is trained by watching and sharpened by arguing. Critique tables where your read of a shot grows with everyone else’s.',
      },
    ],
  },
}

export default function Community({ reduced }) {
  const root = useRef(null)
  const t = useCopy(COPY)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.community h2 .line-inner', {
        yPercent: 115,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.community h2', start: 'top 80%' },
      })
      gsap.from('.community > .container > .body-copy', {
        autoAlpha: 0,
        y: 26,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.community h2', start: 'top 70%' },
      })
      gsap.from('.community-item', {
        autoAlpha: 0,
        y: 44,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.community-items', start: 'top 82%' },
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
    <section className="scene community" id="comunidad" ref={root} data-scene="05">
      <div className="container">
        <div className="scene-head">
          <span className="scene-num">ESC. 05</span>
          <span className="scene-name">{t.sceneName}</span>
        </div>
        <h2>
          <span className="line">
            <span className="line-inner">{t.line1}</span>
          </span>
          <span className="line">
            <span className="line-inner">
              {t.line2a}<em className="gold-text shimmer">{t.line2em}</em>.
            </span>
          </span>
        </h2>
        <p className="body-copy">{t.body}</p>
        <div className="community-items">
          {t.items.map((item) => (
            <div className="community-item" key={item.title} onMouseMove={glint}>
              <span className="label">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
