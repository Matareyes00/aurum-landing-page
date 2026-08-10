import {
  useDb,
  COURSES,
  courseById,
  getAssignments,
  getProgress,
  courseCompletion,
} from '../data'
import CourseCard from './CourseCard'
import { Eyebrow } from './ui'

export default function CoursesView({ user }) {
  useDb()
  const isAdmin = user.role === 'admin'
  const assignedIds = getAssignments(user.id)
  const courses = isAdmin ? COURSES : assignedIds.map(courseById).filter(Boolean)

  return (
    <div className="view view--courses">
      <header className="view-hero">
        <div>
          <Eyebrow>{isAdmin ? 'Catálogo completo' : 'Tu programa'}</Eyebrow>
          <h1 className="view-title">Cursos</h1>
          <p className="view-lede">
            {isAdmin
              ? 'Todos los cursos disponibles en Aurum Academy.'
              : 'Los cursos que el equipo te asignó. Cada uno te acerca a la certificación y a la red de evaluadores.'}
          </p>
        </div>
        <div className="courses-summary" aria-label={`${courses.length} cursos disponibles`}>
          <strong>{String(courses.length).padStart(2, '0')}</strong>
          <span>{courses.length === 1 ? 'curso disponible' : 'cursos disponibles'}</span>
        </div>
      </header>

      {courses.length === 0 ? (
        <p className="empty-note">
          Todavía no tenés cursos asignados. Escribinos si creés que debería haber alguno acá.
        </p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const comp = courseCompletion(user.id, course.id)
            const prog = getProgress(user.id, course.id)
            return (
              <CourseCard
                key={course.id}
                course={course}
                percent={comp.percent}
                completed={comp.completed}
                started={!!prog.startedAt}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
