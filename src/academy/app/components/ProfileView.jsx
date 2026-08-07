import { useEffect, useState } from 'react'
import { updateUser, useDb, getAssignments, courseById, courseCompletion } from '../data'
import { Avatar, Field, Eyebrow, ProgressBar } from './ui'
import { IconCheck, IconStar } from '../icons'

export default function ProfileView({ user }) {
  useDb()
  const [form, setForm] = useState({
    name: user.name,
    craft: user.craft || '',
    email: user.email || '',
    bio: user.bio || '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({ name: user.name, craft: user.craft || '', email: user.email || '', bio: user.bio || '' })
  }, [user.id, user.name, user.craft, user.email, user.bio])

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setSaved(false)
  }

  const save = (e) => {
    e.preventDefault()
    updateUser(user.id, form)
    setSaved(true)
  }

  const isAdmin = user.role === 'admin'
  const assigned = isAdmin ? [] : getAssignments(user.id).map(courseById).filter(Boolean)
  const certificates = assigned
    .map((c) => ({ course: c, ...courseCompletion(user.id, c.id) }))
    .filter((c) => c.completed)

  return (
    <div className="view view--profile">
      <header className="view-hero">
        <Eyebrow>Tu ficha</Eyebrow>
        <h1 className="view-title">Perfil</h1>
      </header>

      <div className="profile-grid">
        <section className="profile-card">
          <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
          <div className="profile-id">
            <Avatar name={form.name} size={72} gold={isAdmin} />
            <div>
              <h2>{form.name || 'Sin nombre'}</h2>
              <p>{isAdmin ? 'Equipo · Gestión' : form.craft || 'Oficio sin definir'}</p>
              <span className="profile-user">@{user.username}</span>
            </div>
          </div>

          <form className="profile-form" onSubmit={save}>
            <Field label="Nombre">
              <input type="text" value={form.name} onChange={set('name')} required />
            </Field>
            <Field label="Oficio">
              <input type="text" value={form.craft} onChange={set('craft')} placeholder="Fotografía, montaje, color…" />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Bio" hint="Una línea sobre tu mirada.">
              <textarea rows={3} value={form.bio} onChange={set('bio')} placeholder="Contá quién sos como cineasta." />
            </Field>
            <div className="profile-actions">
              <button className="btn btn--gold" type="submit">Guardar cambios</button>
              {saved ? <span className="profile-saved"><IconCheck size={14} /> Guardado</span> : null}
            </div>
          </form>
        </section>

        <aside className="profile-side">
          <div className="profile-panel">
            <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
            <Eyebrow>Certificados</Eyebrow>
            {isAdmin ? (
              <p className="empty-note">La gestión no cursa: administrás la sala.</p>
            ) : certificates.length === 0 ? (
              <p className="empty-note">Todavía no tenés certificados. Completá un curso para firmar el primero.</p>
            ) : (
              <ul className="cert-list">
                {certificates.map((c) => (
                  <li key={c.course.id}>
                    <IconStar size={16} />
                    <div>
                      <strong>{c.course.title}</strong>
                      <span>Evaluador certificado · {c.course.code}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!isAdmin ? (
            <div className="profile-panel">
              <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
              <Eyebrow>Avance</Eyebrow>
              {assigned.length === 0 ? (
                <p className="empty-note">Sin cursos asignados aún.</p>
              ) : (
                <ul className="progress-list">
                  {assigned.map((c) => {
                    const comp = courseCompletion(user.id, c.id)
                    return (
                      <li key={c.id}>
                        <span className="progress-list-title">{c.title}</span>
                        <ProgressBar percent={comp.percent} />
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
