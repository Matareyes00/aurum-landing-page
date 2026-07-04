const CHARS = 'AURUMVISOEC▮·—/0123456789'

export function scramble(el, duration = 850) {
  const original = el.dataset.scrambleText || el.textContent
  el.dataset.scrambleText = original
  const start = performance.now()

  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration)
    const revealed = Math.floor(p * original.length)
    let out = original.slice(0, revealed)
    for (let i = revealed; i < original.length; i++) {
      const c = original[i]
      out += c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    el.textContent = out
    if (p < 1) requestAnimationFrame(tick)
    else el.textContent = original
  }
  requestAnimationFrame(tick)
}
