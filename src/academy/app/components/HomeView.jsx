import { navigate } from '../router'
import {
  useDb,
  COURSES,
  courseById,
  getAssignments,
  getProgress,
  courseCompletion,
} from '../data'
import CourseCard from './CourseCard'
import { StatPill, Eyebrow } from './ui'
import { IconArrowRight, IconShield } from '../icons'
import { getTasksForUser } from '../tasks'
import { getEvaluation } from '../evaluations'

export default function HomeView({ user }) {
  useDb() // re-render on data changes
  const isAdmin = user.role === 'admin'
  const firstName = user.name.split(' ')[0]

  const assignedIds = getAssignments(user.id)
  const courses = isAdmin ? COURSES : assignedIds.map(courseById).filter(Boolean)

  const withProgress = courses.map((course) => {
    const comp = courseCompletion(user.id, course.id)
    const prog = getProgress(user.id, course.id)
    return { course, ...comp, started: !!prog.startedAt }
  })

  const completedCount = withProgress.filter((c) => c.completed).length
  const avg = withProgress.length
    ? Math.round(withProgress.reduce((a, c) => a + c.percent, 0) / withProgress.length)
    : 0
  const resume = withProgress.find((c) => c.started && !c.completed) || withProgress.find((c) => !c.completed)
  const workflowTasks = getTasksForUser(user.id, user.role)
  const pendingTasks = workflowTasks.filter((task) => getEvaluation(task.id, user.id)?.status !== 'submitted')

  return (
    <div className="view view--home">
      <header className="view-hero">
        <Eyebrow>El aula · sesión abierta</Eyebrow>
        <h1 className="view-title">
          Buenas, <em className="gold-text shimmer">{firstName}</em>.
        </h1>
        <p className="view-lede">
          {isAdmin
            ? 'Panel del equipo. Gestioná alumnos, asigná cursos y seguí el avance de la sala.'
            : 'Tu sala de proyección privada. Retomá donde dejaste y seguí sumando criterio.'}
        </p>
      </header>

      <section className="home-stats">
        <StatPill label={isAdmin ? 'Cursos en catálogo' : 'Cursos asignados'} value={courses.length} />
        <StatPill label="Completados" value={completedCount} />
        <StatPill label="Progreso promedio" value={`${avg}%`} />
      </section>

      {resume ? (
        <section className="home-resume">
          <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
          <div className="home-resume-info">
            <Eyebrow>{resume.started ? 'Continuá donde ibas' : 'Empezá tu recorrido'}</Eyebrow>
            <h2>{resume.course.title}</h2>
            <p>{resume.course.subtitle} · {resume.done}/{resume.total} módulos</p>
          </div>
          <button className="btn btn--gold" type="button" onClick={() => navigate(`/curso/${resume.course.id}`)}>
            {resume.started ? 'Continuar' : 'Empezar'} <IconArrowRight size={15} />
          </button>
        </section>
      ) : null}

      <section className="home-workflows-band">
        <div>
          <Eyebrow>{isAdmin ? 'Academy operations' : 'Mesa de evaluación'}</Eyebrow>
          <h2>{isAdmin ? `${workflowTasks.length} tareas activas` : `${pendingTasks.length} workflows pendientes`}</h2>
          <p>{isAdmin ? 'Configurá asignaciones, media, Codex y resultados.' : 'Inspeccioná video frame a frame con el Codex siempre a mano.'}</p>
        </div>
        <button className="wf-btn wf-btn--gold" type="button" onClick={() => navigate(isAdmin ? '/admin/tasks' : '/workflows')}>{isAdmin ? 'Gestionar tareas' : 'Abrir workflows'} <IconArrowRight size={15} /></button>
      </section>

      <section className="home-courses">
        <div className="section-head">
          <h2>{isAdmin ? 'Catálogo' : 'Mis cursos'}</h2>
          <button className="link-btn" type="button" onClick={() => navigate('/cursos')}>
            Ver todos <IconArrowRight size={14} />
          </button>
        </div>

        {withProgress.length === 0 ? (
          <p className="empty-note">
            Todavía no tenés cursos asignados. El equipo de Aurum te va a asignar el primero muy pronto.
          </p>
        ) : (
          <div className="course-grid">
            {withProgress.slice(0, 3).map((c) => (
              <CourseCard key={c.course.id} course={c.course} percent={c.percent} completed={c.completed} started={c.started} />
            ))}
          </div>
        )}
      </section>

      {isAdmin ? (
        <button className="home-admin-cta" type="button" onClick={() => navigate('/admin')}>
          <IconShield size={18} />
          <span>Ir a Gestión — asignar cursos y ver alumnos</span>
          <IconArrowRight size={16} />
        </button>
      ) : null}
    </div>
  )
}
