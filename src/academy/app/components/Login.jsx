import { useState } from 'react'
import { login } from '../auth'
import { IconArrowRight } from '../icons'

export default function Login() {
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
        <div className="login-brand">
          <img src="/aurum-word.png" alt="Aurum" className="login-word" />
          <span className="login-academy">ACADEMY</span>
        </div>
        <p className="login-eyebrow">EL AULA · ACCESO PRIVADO</p>
        <h1 className="login-title">
          Entrá a la <em className="gold-text shimmer">sala</em>.
        </h1>

        <form className="login-form" onSubmit={submit}>
          <label className="pfield">
            <span className="pfield-label">Usuario</span>
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
            <span className="pfield-label">Contraseña</span>
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

          {error ? <p className="login-error" role="alert">{error}</p> : null}

          <button className="btn btn--gold login-submit" type="submit" disabled={busy}>
            Entrar <IconArrowRight size={16} />
          </button>
        </form>

        <div className="login-hint">
          <span>Acceso de prueba</span>
          <code>admin / admin</code>
          <code>alumno / alumno</code>
        </div>

        <a className="login-back" href="/academy/">← Volver a Aurum Academy</a>
      </main>
    </div>
  )
}
