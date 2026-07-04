import { useEffect, useRef } from 'react'

export default function Dust({ reduced }) {
  const ref = useRef(null)

  useEffect(() => {
    if (reduced) return
    if (window.innerWidth < 900 || !window.matchMedia('(pointer: fine)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w, h, raf
    let running = false

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      w = canvas.width = rect.width
      h = canvas.height = rect.height
    }
    resize()

    const COUNT = 55
    const parts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1400,
      r: 0.5 + Math.random() * 1.8,
      a: 0.08 + Math.random() * 0.32,
      vy: -(0.05 + Math.random() * 0.14),
      vx: 0.02 + Math.random() * 0.06,
      ph: Math.random() * Math.PI * 2,
    }))

    let t = 0
    const draw = () => {
      if (!running) return
      t += 0.008
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y += p.vy
        p.x += p.vx + Math.sin(t * 2 + p.ph) * 0.08
        if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w }
        if (p.x > w + 8) p.x = -8
        const tw = 0.72 + Math.sin(t * 3 + p.ph * 2) * 0.28
        ctx.globalAlpha = p.a * tw
        ctx.fillStyle = '#e8c470'
        ctx.beginPath()
        ctx.arc(p.x % (w + 16), p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    const io = new IntersectionObserver(([entry]) => {
      const next = entry.isIntersecting && !document.hidden
      if (next && !running) {
        running = true
        draw()
      } else if (!next) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    io.observe(canvas)

    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return <canvas className="hero-dust" ref={ref} aria-hidden="true" />
}
