import {
  useDb,
  getUsers,
  COURSES,
  getAssignments,
  assignCourse,
  unassignCourse,
  courseCompletion,
} from '../data'
import { Avatar, Eyebrow, ProgressBar } from './ui'
import { IconCheck, IconPlus } from '../icons'
import { useCopy, ADMIN_VIEW } from '../copy'

export default function AdminView() {
  useDb()
  const t = useCopy(ADMIN_VIEW)
  const students = getUsers().filter((u) => u.role === 'student')
  const totalAssignments = students.reduce((total, student) => total + getAssignments(student.id).length, 0)
  const completedCourses = students.reduce(
    (total, student) => total + getAssignments(student.id).filter((courseId) => courseCompletion(student.id, courseId).completed).length,
    0,
  )

  return (
    <div className="view view--admin">
      <header className="view-hero">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1 className="view-title">{t.title}</h1>
        <p className="view-lede">{t.lede}</p>
      </header>

      <section className="admin-overview" aria-label={t.overviewAria}>
        <div><strong>{students.length}</strong><span>{t.activeStudents}</span></div>
        <div><strong>{totalAssignments}</strong><span>{t.assignments}</span></div>
        <div><strong>{completedCourses}</strong><span>{t.certifications}</span></div>
      </section>

      <div className="admin-list">
        {students.map((student) => {
          const assigned = getAssignments(student.id)
          return (
            <section className="admin-card" key={student.id}>
              <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
              <header className="admin-card-head">
                <div className="admin-student">
                  <Avatar name={student.name} size={44} />
                  <div>
                    <h3>{student.name}</h3>
                    <span>{student.craft} · @{student.username}</span>
                  </div>
                </div>
                <span className="admin-count">{assigned.length} {t.assigned}</span>
              </header>

              <div className="admin-courses">
                {COURSES.map((course) => {
                  const isAssigned = assigned.includes(course.id)
                  const comp = courseCompletion(student.id, course.id)
                  return (
                    <div className={`admin-course ${isAssigned ? 'is-assigned' : ''}`} key={course.id}>
                      <div className="admin-course-info">
                        <span className="admin-course-code">{course.code}</span>
                        <strong>{course.title}</strong>
                        {isAssigned ? (
                          <ProgressBar percent={comp.percent} label={comp.completed ? t.certified : `${comp.percent}%`} />
                        ) : (
                          <span className="admin-course-muted">{t.notAssigned}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={`admin-toggle ${isAssigned ? 'is-on' : ''}`}
                        onClick={() =>
                          isAssigned
                            ? unassignCourse(student.id, course.id)
                            : assignCourse(student.id, course.id)
                        }
                        aria-pressed={isAssigned}
                      >
                        {isAssigned ? (<><IconCheck size={14} /> {t.assignedLabel}</>) : (<><IconPlus size={14} /> {t.assign}</>)}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
