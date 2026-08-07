import { navigate } from '../router'
import { ProgressBar } from './ui'
import { IconPlay, IconClock, IconCheck, IconArrowRight } from '../icons'

export default function CourseCard({ course, percent = 0, completed = false, started = false }) {
  const cta = completed ? 'Repasar' : started ? 'Continuar' : 'Empezar'
  return (
    <article className="course-card">
      <span className="panel-corners" aria-hidden="true">
        <span /><span /><span /><span />
      </span>
      <header className="course-card-head">
        <span className="course-card-code">{course.code}</span>
        {completed ? (
          <span className="course-card-badge is-done"><IconCheck size={13} /> Certificado</span>
        ) : (
          <span className="course-card-badge">{course.level}</span>
        )}
      </header>

      <h3 className="course-card-title">{course.title}</h3>
      <p className="course-card-sub">{course.subtitle}</p>
      <p className="course-card-summary">{course.summary}</p>

      <div className="course-card-meta">
        <span><IconClock size={14} /> {course.duration}</span>
        <span><IconPlay size={13} /> {course.modules.length} módulos</span>
      </div>

      <ProgressBar percent={percent} label={`${percent}% · ${cta.toLowerCase()}`} />

      <button className="btn btn--gold course-card-cta" type="button" onClick={() => navigate(`/curso/${course.id}`)}>
        {cta} <IconArrowRight size={15} />
      </button>
    </article>
  )
}
