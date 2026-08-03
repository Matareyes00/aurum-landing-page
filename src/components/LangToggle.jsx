import { useLang, setLang } from '../i18n'

export default function LangToggle({ className = '' }) {
  const lang = useLang()
  return (
    <div className={`lang-toggle ${className}`} role="group" aria-label="Language / Idioma">
      <button
        type="button"
        className={lang === 'es' ? 'is-active' : ''}
        onClick={() => setLang('es')}
        aria-pressed={lang === 'es'}
      >
        ES
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={lang === 'en' ? 'is-active' : ''}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  )
}
