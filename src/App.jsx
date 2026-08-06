import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Ident from './components/Ident'
import Nav from './components/Nav'
import Hud from './components/Hud'
import ScrollRail from './components/ScrollRail'
import StickyCTA from './components/StickyCTA'
import { useLang } from './i18n'
import CursorFrame from './fx/CursorFrame'
import Letterbox from './fx/Letterbox'
import LightSweep from './fx/LightSweep'
import { scramble } from './fx/scramble'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Mechanism from './components/Mechanism'
import Process from './components/Process'
import PromiseScene from './components/Promise'
import Apply from './components/Apply'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const skipIntro =
  prefersReduced || (typeof window !== 'undefined' && !!window.location.hash)

export default function App() {
  const [revealed, setRevealed] = useState(skipIntro)
  const [identDone, setIdentDone] = useState(skipIntro)
  const lenisRef = useRef(null)
  const lightRef = useRef(null)
  const lang = useLang()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!window.location.hash) window.scrollTo(0, 0)
    if (prefersReduced) return

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis
    if (!skipIntro) lenis.stop()
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
    if (!revealed) return
    lenisRef.current?.start()
    ScrollTrigger.refresh()
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1))
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY
        window.scrollTo(0, y)
        lenisRef.current?.scrollTo(y, { immediate: true })
      }
    }
  }, [revealed])

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

  useEffect(() => {
    if (prefersReduced) return
    const triggers = gsap.utils.toArray('.scene-name').map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => scramble(el),
      })
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  useEffect(() => {
    if (prefersReduced) return
    // Text length changes between languages; recompute pin/scroll distances.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  const handleReveal = useCallback(() => setRevealed(true), [])
  const handleIdentDone = useCallback(() => setIdentDone(true), [])

  return (
    <div className="page">
      {!identDone && (
        <Ident onReveal={handleReveal} onDone={handleIdentDone} reduced={prefersReduced} />
      )}
      <Nav visible={revealed || prefersReduced} />
      <Hud visible={revealed || prefersReduced} />
      <ScrollRail visible={revealed || prefersReduced} />
      <StickyCTA />
      <CursorFrame reduced={prefersReduced} />
      <Letterbox />
      <LightSweep reduced={prefersReduced} />
      <div className="cursor-light" ref={lightRef} />
      <div className="vignette" />
      <div className="grain" />
      <main>
        <Hero started={revealed || prefersReduced} reduced={prefersReduced} />
        <Marquee />
        <Mechanism reduced={prefersReduced} />
        <PromiseScene reduced={prefersReduced} />
        <Process reduced={prefersReduced} />
        <Apply reduced={prefersReduced} />
      </main>
      <Footer />
    </div>
  )
}
