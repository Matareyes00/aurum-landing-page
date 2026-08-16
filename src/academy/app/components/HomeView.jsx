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
import { useCopy, HOME } from '../copy'

export default function HomeView({ user }) {
  useDb() // re-render on data changes
  const t = useCopy(HOME)
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
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1 className="view-title">
          {t.greeting}, <em className="gold-text shimmer">{firstName}</em>.
        </h1>
        <p className="view-lede">{isAdmin ? t.ledeAdmin : t.ledeStudent}</p>
      </header>

      <section className="home-stats">
        <StatPill label={isAdmin ? t.statCatalog : t.statAssigned} value={courses.length} />
        <StatPill label={t.statCompleted} value={completedCount} />
        <StatPill label={t.statAverage} value={`${avg}%`} />
      </section>

      {resume ? (
        <section className="home-resume">
          <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
          <div className="home-resume-info">
            <Eyebrow>{resume.started ? t.resumeStarted : t.resumeNew}</Eyebrow>
            <h2>{resume.course.title}</h2>
            <p>{resume.course.subtitle} · {resume.done}/{resume.total} {t.modules}</p>
          </div>
          <button className="btn btn--gold" type="button" onClick={() => navigate(`/curso/${resume.course.id}`)}>
            {resume.started ? t.continue : t.start} <IconArrowRight size={15} />
          </button>
        </section>
      ) : null}

      <section className="home-workflows-band">
        <div>
          <Eyebrow>{isAdmin ? t.opsEyebrow : t.deskEyebrow}</Eyebrow>
          <h2>{isAdmin ? `${workflowTasks.length} ${t.activeTasks}` : `${pendingTasks.length} ${t.pendingWorkflows}`}</h2>
          <p>{isAdmin ? t.opsLede : t.deskLede}</p>
        </div>
        <button className="wf-btn wf-btn--gold" type="button" onClick={() => navigate(isAdmin ? '/admin/tasks' : '/workflows')}>{isAdmin ? t.manageTasks : t.openWorkflows} <IconArrowRight size={15} /></button>
      </section>

      <section className="home-courses">
        <div className="section-head">
          <h2>{isAdmin ? t.catalog : t.myCourses}</h2>
          <button className="link-btn" type="button" onClick={() => navigate('/cursos')}>
            {t.seeAll} <IconArrowRight size={14} />
          </button>
        </div>

        {withProgress.length === 0 ? (
          <p className="empty-note">{t.emptyCourses}</p>
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
          <span>{t.adminCta}</span>
          <IconArrowRight size={16} />
        </button>
      ) : null}
    </div>
  )
}
