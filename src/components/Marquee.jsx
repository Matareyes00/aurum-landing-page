import { useCopy } from '../i18n'

const WORDS = {
  es: [
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
  ],
  en: [
    'FRAMING',
    'MATCH CUT',
    'CHIAROSCURO',
    'COLOR GRADING',
    'TRAVELLING',
    'CONTINUITY',
    'FOLEY',
    'EDITING',
    'MOTIVATED LIGHT',
    'DEPTH OF FIELD',
  ],
}

export default function Marquee() {
  const words = useCopy(WORDS)
  const row = words.map((w) => `${w} · `).join('')
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  )
}
