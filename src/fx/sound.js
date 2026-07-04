let ctx = null
let master = null
let enabled = false

function ensure() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const seconds = 3
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.2
  }
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 340
  const roomGain = ctx.createGain()
  roomGain.gain.value = 0.028
  src.connect(lp)
  lp.connect(roomGain)
  roomGain.connect(master)
  src.start()

  const flutter = ctx.createOscillator()
  flutter.frequency.value = 0.4
  const flutterGain = ctx.createGain()
  flutterGain.gain.value = 0.008
  flutter.connect(flutterGain)
  flutterGain.connect(roomGain.gain)
  flutter.start()
}

export function isEnabled() {
  return enabled
}

export function setEnabled(next) {
  enabled = next
  if (next) {
    ensure()
    if (!ctx) return
    ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(1, ctx.currentTime, 0.6)
  } else if (ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
  }
}

export function sceneClick() {
  if (!enabled || !ctx) return
  const now = ctx.currentTime

  const len = Math.floor(ctx.sampleRate * 0.05)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const click = ctx.createBufferSource()
  click.buffer = buf
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1400
  bp.Q.value = 1.4
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.09, now)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)
  click.connect(bp)
  bp.connect(g)
  g.connect(master)
  click.start(now)

  const thump = ctx.createOscillator()
  thump.type = 'sine'
  thump.frequency.setValueAtTime(110, now)
  thump.frequency.exponentialRampToValueAtTime(52, now + 0.12)
  const tg = ctx.createGain()
  tg.gain.setValueAtTime(0.05, now)
  tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.14)
  thump.connect(tg)
  tg.connect(master)
  thump.start(now)
  thump.stop(now + 0.16)
}
