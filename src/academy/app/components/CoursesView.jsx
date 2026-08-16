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
import { useCopy, COURSES_VIEW } from '../copy'

export default function CoursesView({ user }) {
  useDb()
  const t = useCopy(COURSES_VIEW)
  const isAdmin = user.role === 'admin'
  const assignedIds = getAssignments(user.id)
  const courses = isAdmin ? COURSES : assignedIds.map(courseById).filter(Boolean)

  return (
    <div className="view view--courses">
      <header className="view-hero">
        <div>
          <Eyebrow>{isAdmin ? t.eyebrowAdmin : t.eyebrowStudent}</Eyebrow>
          <h1 className="view-title">{t.title}</h1>
          <p className="view-lede">{isAdmin ? t.ledeAdmin : t.ledeStudent}</p>
        </div>
        <div className="courses-summary" aria-label={`${courses.length} ${t.summaryAria}`}>
          <strong>{String(courses.length).padStart(2, '0')}</strong>
          <span>{courses.length === 1 ? t.availableOne : t.availableMany}</span>
        </div>
      </header>

      {courses.length === 0 ? (
        <p className="empty-note">{t.empty}</p>
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
