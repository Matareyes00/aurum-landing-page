import { useState } from 'react'
import { login } from '../auth'
import { IconArrowRight } from '../icons'
import { LangSwitch } from './ui'
import { useCopy, LOGIN, AUTH_ERRORS } from '../copy'

export default function Login() {
  const t = useCopy(LOGIN)
  const authErrors = useCopy(AUTH_ERRORS)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setBusy(true)
    const res = login(username, password)
    if (!res.ok) {
      setError(res.error)
      setBusy(false)
    }
    // on success, PortalApp re-renders via the auth store.
  }

  const useDemo = (nextUsername) => {
    setUsername(nextUsername)
    setPassword(nextUsername === 'admin' ? 'admin' : 'alumno')
    setError('')
  }

  return (
    <div className="login-screen">
      <div className="login-atmos" aria-hidden="true">
        <span className="login-beam" />
      </div>
      <div className="vignette" />
      <div className="grain" />

      <main className="login-card">
        <span className="panel-corners" aria-hidden="true">
          <span /><span /><span /><span />
        </span>
        <LangSwitch className="login-lang" />
        <div className="login-brand">
          <img src="/aurum-word.png" alt="Aurum" className="login-word" />
          <span className="login-academy">ACADEMY</span>
        </div>
        <p className="login-eyebrow">{t.eyebrow}</p>
        <h1 className="login-title">
          {t.titleLead}<em className="gold-text shimmer">{t.titleAccent}</em>.
        </h1>

        <form className="login-form" onSubmit={submit}>
          <label className="pfield">
            <span className="pfield-label">{t.user}</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder="admin"
              required
            />
          </label>
          <label className="pfield">
            <span className="pfield-label">{t.password}</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="••••••"
              required
            />
          </label>

          {error ? <p className="login-error" role="alert">{authErrors[error] || error}</p> : null}

          <button className="btn btn--gold login-submit" type="submit" disabled={busy}>
            {t.submit} <IconArrowRight size={16} />
          </button>
        </form>

        <div className="login-hint">
          <span>{t.demoLabel}</span>
          <div className="login-demo-options">
            <button type="button" onClick={() => useDemo('admin')}>{t.demoAdmin}</button>
            <button type="button" onClick={() => useDemo('alumno')}>{t.demoStudent}</button>
          </div>
        </div>

        <a className="login-back" href="/academy/">{t.back}</a>
      </main>
    </div>
  )
}
