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

export default function AdminView() {
  useDb()
  const students = getUsers().filter((u) => u.role === 'student')
  const totalAssignments = students.reduce((total, student) => total + getAssignments(student.id).length, 0)
  const completedCourses = students.reduce(
    (total, student) => total + getAssignments(student.id).filter((courseId) => courseCompletion(student.id, courseId).completed).length,
    0,
  )

  return (
    <div className="view view--admin">
      <header className="view-hero">
        <Eyebrow>Panel del equipo</Eyebrow>
        <h1 className="view-title">Gestión</h1>
        <p className="view-lede">
          Asigná cursos y seguí el avance de cada alumno. Los cambios se guardan al instante.
        </p>
      </header>

      <section className="admin-overview" aria-label="Resumen de gestión">
        <div><strong>{students.length}</strong><span>Alumnos activos</span></div>
        <div><strong>{totalAssignments}</strong><span>Asignaciones</span></div>
        <div><strong>{completedCourses}</strong><span>Certificaciones</span></div>
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
                <span className="admin-count">{assigned.length} asignados</span>
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
                          <ProgressBar percent={comp.percent} label={comp.completed ? 'Certificado' : `${comp.percent}%`} />
                        ) : (
                          <span className="admin-course-muted">No asignado</span>
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
                        {isAssigned ? (<><IconCheck size={14} /> Asignado</>) : (<><IconPlus size={14} /> Asignar</>)}
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
