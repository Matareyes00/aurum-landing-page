import { useEffect, useState } from 'react'
import { updateProfile, useDb, getAssignments, getProgress, courseById, courseCompletion } from '../data'
import { Avatar, Field, Eyebrow, ProgressBar } from './ui'
import { IconCheck, IconStar } from '../icons'
import Certificate from './Certificate'
import { useCopy, PROFILE } from '../copy'

export default function ProfileView({ user }) {
  useDb()
  const t = useCopy(PROFILE)
  const [form, setForm] = useState({
    name: user.name,
    craft: user.craft || '',
    email: user.email || '',
    bio: user.bio || '',
  })
  const [saved, setSaved] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState(null)

  useEffect(() => {
    setForm({ name: user.name, craft: user.craft || '', email: user.email || '', bio: user.bio || '' })
  }, [user.id, user.name, user.craft, user.email, user.bio])

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setSaved(false)
  }

  const save = (e) => {
    e.preventDefault()
    updateProfile(user.id, form)
    setSaved(true)
  }

  const isAdmin = user.role === 'admin'
  const assigned = isAdmin ? [] : getAssignments(user.id).map(courseById).filter(Boolean)
  const certificates = assigned
    .map((c) => ({ course: c, ...courseCompletion(user.id, c.id), completedAt: getProgress(user.id, c.id).completedAt }))
    .filter((c) => c.completed)

  return (
    <div className="view view--profile">
      <header className="view-hero profile-hero">
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="view-title">{t.title}</h1>
          <p className="view-lede">{t.lede}</p>
        </div>
        {!isAdmin ? (
          <div className="profile-hero-stats" aria-label={t.statsAria}>
            <span><strong>{assigned.length}</strong> {t.courses}</span>
            <span><strong>{certificates.length}</strong> {t.certificates}</span>
          </div>
        ) : null}
      </header>

      <div className="profile-grid">
        <section className="profile-card">
          <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
          <div className="profile-id">
            <Avatar name={form.name} size={72} gold={isAdmin} />
            <div>
              <h2>{form.name || t.noName}</h2>
              <p>{isAdmin ? t.adminRole : form.craft || t.noCraft}</p>
              <span className="profile-user">@{user.username}</span>
            </div>
          </div>

          <form className="profile-form" onSubmit={save}>
            <Field label={t.fieldName}>
              <input type="text" value={form.name} onChange={set('name')} required />
            </Field>
            <Field label={t.fieldCraft}>
              <input type="text" value={form.craft} onChange={set('craft')} placeholder={t.craftPlaceholder} />
            </Field>
            <Field label={t.fieldEmail}>
              <input type="email" value={form.email} onChange={set('email')} />
            </Field>
            <Field label={t.fieldBio} hint={t.bioHint}>
              <textarea rows={3} value={form.bio} onChange={set('bio')} placeholder={t.bioPlaceholder} />
            </Field>
            <div className="profile-actions">
              <button className="btn btn--gold" type="submit">{t.save}</button>
              {saved ? <span className="profile-saved"><IconCheck size={14} /> {t.saved}</span> : null}
            </div>
          </form>
        </section>

        <aside className="profile-side">
          <div className="profile-panel">
            <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
            <Eyebrow>{t.certificatesTitle}</Eyebrow>
            {isAdmin ? (
              <p className="empty-note">{t.adminNoCourses}</p>
            ) : certificates.length === 0 ? (
              <p className="empty-note">{t.noCertificates}</p>
            ) : (
              <ul className="cert-list">
                {certificates.map((c) => (
                  <li key={c.course.id}>
                    <IconStar size={16} />
                    <div>
                      <strong>{c.course.title}</strong>
                      <span>{t.certifiedEvaluator} · {c.course.code}</span>
                    </div>
                    <button className="link-btn" type="button" onClick={() => setSelectedCertificate(c)}>
                      {t.view}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!isAdmin ? (
            <div className="profile-panel">
              <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
              <Eyebrow>{t.progressTitle}</Eyebrow>
              {assigned.length === 0 ? (
                <p className="empty-note">{t.noAssigned}</p>
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

      {selectedCertificate ? (
        <Certificate
          user={user}
          course={selectedCertificate.course}
          completedAt={selectedCertificate.completedAt}
          onClose={() => setSelectedCertificate(null)}
        />
      ) : null}
    </div>
  )
}
