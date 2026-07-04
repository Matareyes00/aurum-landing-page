import { useEffect, useRef } from 'react'

const LOCK_SELECTOR = 'a, button, select, .role, .community-item'

export default function CursorFrame({ reduced }) {
  const ref = useRef(null)

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    document.documentElement.classList.add('has-cursor-frame')

    const s = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      w: 34,
      h: 34,
      locked: null,
      visible: false,
    }

    let raf
    const loop = () => {
      let tw = 34
      let th = 34
      let tx = s.tx
      let ty = s.ty
      if (s.locked && s.locked.isConnected) {
        const r = s.locked.getBoundingClientRect()
        if (r.width > 0) {
          tx = r.left + r.width / 2
          ty = r.top + r.height / 2
          tw = Math.min(r.width + 18, 460)
          th = Math.min(r.height + 18, 300)
        }
      }
      s.x += (tx - s.x) * 0.22
      s.y += (ty - s.y) * 0.22
      s.w += (tw - s.w) * 0.2
      s.h += (th - s.h) * 0.2
      el.style.transform = `translate(${s.x - s.w / 2}px, ${s.y - s.h / 2}px)`
      el.style.width = `${s.w}px`
      el.style.height = `${s.h}px`
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      s.tx = e.clientX
      s.ty = e.clientY
      if (!s.visible) {
        s.x = e.clientX
        s.y = e.clientY
        s.visible = true
        el.classList.add('is-visible')
      }
    }

    const onOver = (e) => {
      if (e.target.closest('input, textarea')) {
        el.classList.add('is-suppressed')
        s.locked = null
        el.classList.remove('is-locked')
        return
      }
      el.classList.remove('is-suppressed')
      const lock = e.target.closest(LOCK_SELECTOR)
      s.locked = lock || null
      el.classList.toggle('is-locked', !!lock)
    }

    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => {
      s.visible = false
      el.classList.remove('is-visible')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('has-cursor-frame')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div className="cursor-frame" ref={ref} aria-hidden="true">
      <span /><span /><span /><span />
      <i className="cursor-dot" />
    </div>
  )
}
