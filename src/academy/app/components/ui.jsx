/* Reusable portal UI primitives — all Aurum-styled, no external deps. */

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '·'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ name, size = 40, gold = false }) {
  return (
    <span
      className={`av ${gold ? 'av--gold' : ''}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

export function ProgressBar({ percent = 0, label }) {
  const p = Math.max(0, Math.min(100, percent))
  return (
    <div className="pbar" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
      {label ? <span className="pbar-label">{label}</span> : null}
      <span className="pbar-track">
        <span className="pbar-fill" style={{ width: `${p}%` }} />
      </span>
    </div>
  )
}

export function Panel({ className = '', corners = true, children, ...rest }) {
  return (
    <div className={`panel ${className}`} {...rest}>
      {corners ? (
        <span className="panel-corners" aria-hidden="true">
          <span /><span /><span /><span />
        </span>
      ) : null}
      {children}
    </div>
  )
}

export function StatPill({ label, value }) {
  return (
    <div className="stat-pill">
      <span className="stat-pill-value">{value}</span>
      <span className="stat-pill-label">{label}</span>
    </div>
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="pfield">
      <span className="pfield-label">{label}</span>
      {children}
      {hint ? <span className="pfield-hint">{hint}</span> : null}
    </label>
  )
}

export function Eyebrow({ children }) {
  return <span className="p-eyebrow">{children}</span>
}
