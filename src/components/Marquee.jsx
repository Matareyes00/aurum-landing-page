const WORDS = [
  'ENCUADRE',
  'RACCORD',
  'CLAROSCURO',
  'ETALONAJE',
  'TRAVELLING',
  'CONTINUIDAD',
  'FOLEY',
  'MONTAJE',
  'LUZ MOTIVADA',
  'PROFUNDIDAD DE CAMPO',
]

export default function Marquee() {
  const row = WORDS.map((w) => `${w} · `).join('')
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  )
}
