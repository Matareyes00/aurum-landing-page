import { useEffect, useState } from 'react'
import { navigate } from '../router'
import {
  useDb,
  courseById,
  getAssignments,
  getProgress,
  setProgress,
  resetProgress,
} from '../data'
import {
  IconCheck,
  IconLock,
  IconArrowLeft,
  IconArrowRight,
  IconStar,
} from '../icons'

function Section({ section }) {
  switch (section.type) {
    case 'heading':
      return <h2 className="reader-heading">{section.text}</h2>
    case 'paragraph':
      return <p className="reader-paragraph">{section.text}</p>
    case 'callout':
      return (
        <div className={`reader-callout tone-${section.tone || 'gold'}`}>
          {section.text}
        </div>
      )
    case 'note':
      return <p className="reader-note">{section.text}</p>
    case 'list':
      return (
        <ul className="reader-list">
          {section.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )
    case 'compare':
      return (
        <div className="reader-compare">
          <div className="reader-compare-col is-good">
            <span className="reader-compare-label">Sostiene</span>
            <ul>{section.good.map((it, i) => <li key={i}>{it}</li>)}</ul>
          </div>
          <div className="reader-compare-col is-bad">
            <span className="reader-compare-label">Rompe</span>
            <ul>{section.bad.map((it, i) => <li key={i}>{it}</li>)}</ul>
          </div>
        </div>
      )
    default:
      return null
  }
}

function Quiz({ module, savedAnswer, selected, feedback, onSelect, onConfirm }) {
  const answered = !!savedAnswer
  return (
    <div className="reader-quiz">
      <span className="reader-quiz-eyebrow">Comprobación</span>
      <h3 className="reader-quiz-q">{module.quiz.question}</h3>
      <div className="reader-quiz-options">
        {module.quiz.options.map((opt) => {
          const isCorrect = opt === module.quiz.correct
          const chosen = (answered ? savedAnswer : selected) === opt
          const state = answered
            ? isCorrect ? 'correct' : chosen ? 'wrong' : ''
            : chosen ? 'chosen' : ''
          return (
            <button
              key={opt}
              type="button"
              className={`quiz-option ${state}`}
              disabled={answered}
              onClick={() => onSelect(opt)}
            >
              <span className="quiz-option-mark">{answered && isCorrect ? <IconCheck size={14} /> : null}</span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {answered ? (
        <p className="quiz-explain is-correct">
          <IconCheck size={15} /> {module.quiz.explanation}
        </p>
      ) : feedback === 'wrong' ? (
        <p className="quiz-explain is-wrong">Esa no es. Volvé a mirar y probá de nuevo.</p>
      ) : null}

      {!answered ? (
        <button className="btn btn--gold quiz-confirm" type="button" disabled={!selected} onClick={onConfirm}>
          Confirmar
        </button>
      ) : null}
    </div>
  )
}

export default function CoursePlayer({ user, courseId }) {
  useDb()
  const course = courseById(courseId)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('idle')
  const [finished, setFinished] = useState(false)

  const progress = getProgress(user.id, courseId)
  const lastIndex = course ? course.modules.length - 1 : 0
  const currentIndex = Math.min(progress.currentIndex, lastIndex)

  useEffect(() => {
    if (!course) return
    if (!progress.startedAt) {
      setProgress(user.id, courseId, { startedAt: Date.now() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, course])

  useEffect(() => {
    setSelected(null)
    setFeedback('idle')
  }, [currentIndex])

  if (!course) {
    return (
      <div className="view view--player-empty">
        <h1 className="view-title">Curso no encontrado</h1>
        <button className="btn btn--ghost" type="button" onClick={() => navigate('/cursos')}>Volver a cursos</button>
      </div>
    )
  }

  const assigned = getAssignments(user.id).includes(courseId)
  if (user.role !== 'admin' && !assigned) {
    return (
      <div className="view view--player-empty">
        <span className="lock-badge"><IconLock size={22} /></span>
        <h1 className="view-title">Este curso no está en tu programa</h1>
        <p className="view-lede">Pedile al equipo de Aurum que te lo asigne.</p>
        <button className="btn btn--ghost" type="button" onClick={() => navigate('/cursos')}>Volver a cursos</button>
      </div>
    )
  }

  const modules = course.modules
  const module = modules[currentIndex]
  const completed = progress.completedModuleIds
  const percent = Math.round((completed.length / modules.length) * 100)
  const moduleDone = completed.includes(module.id)
  const hasQuiz = !!module.quiz
  const savedAnswer = progress.quizAnswers[module.id] || null
  const canContinue = moduleDone || !hasQuiz

  const goTo = (i) => {
    if (i < 0 || i > lastIndex) return
    if (i > progress.unlockedIndex) return
    setProgress(user.id, courseId, { currentIndex: i })
  }

  const markComplete = (answer) => {
    const p = getProgress(user.id, courseId)
    const nextCompleted = p.completedModuleIds.includes(module.id)
      ? p.completedModuleIds
      : [...p.completedModuleIds, module.id]
    const unlockedIndex = Math.min(Math.max(p.unlockedIndex, currentIndex + 1), lastIndex)
    setProgress(user.id, courseId, {
      completedModuleIds: nextCompleted,
      unlockedIndex,
      quizAnswers: answer ? { ...p.quizAnswers, [module.id]: answer } : p.quizAnswers,
    })
  }

  const confirmAnswer = () => {
    if (!selected) return
    if (selected === module.quiz.correct) {
      setFeedback('correct')
      markComplete(selected)
    } else {
      setFeedback('wrong')
    }
  }

  const goNext = () => {
    if (!canContinue) return
    if (!moduleDone && !hasQuiz) markComplete(null)
    if (currentIndex === lastIndex) {
      setProgress(user.id, courseId, { completedAt: Date.now() })
      setFinished(true)
      return
    }
    goTo(currentIndex + 1)
  }

  const doReset = () => {
    resetProgress(user.id, courseId)
    setProgress(user.id, courseId, { startedAt: Date.now() })
    setSelected(null)
    setFeedback('idle')
  }

  return (
    <div className="course-workspace">
      <aside className="course-map">
        <button className="course-map-back" type="button" onClick={() => navigate('/cursos')}>
          <IconArrowLeft size={15} /> Cursos
        </button>
        <div className="course-map-head">
          <span className="course-map-code">{course.code}</span>
          <h2>{course.title}</h2>
        </div>
        <div className="course-map-progress">
          <div className="course-map-progress-row">
            <span>{percent}% completo</span>
            <strong>{completed.length}/{modules.length}</strong>
          </div>
          <span className="course-map-track"><span style={{ width: `${percent}%` }} /></span>
        </div>

        <nav className="course-modnav">
          {modules.map((m, i) => {
            const locked = i > progress.unlockedIndex
            const done = completed.includes(m.id)
            const active = i === currentIndex
            return (
              <button
                key={m.id}
                type="button"
                className={`modnav-item ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                disabled={locked}
                onClick={() => goTo(i)}
              >
                <span className="modnav-status">
                  {locked ? <IconLock size={13} /> : done ? <IconCheck size={13} /> : String(i + 1).padStart(2, '0')}
                </span>
                <span className="modnav-text">
                  <small>{m.tag}</small>
                  <strong>{m.title}</strong>
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      <section className="course-reader">
        <header className="reader-toolbar">
          <span className="reader-toolbar-pos">Módulo {currentIndex + 1} de {modules.length}</span>
          <button className="link-btn" type="button" onClick={doReset}>Reiniciar</button>
        </header>

        <div className="reader-body">
          <article className="reader-article">
            <div className="reader-modlabel">
              <span>{module.tag}</span>
              <small>Módulo {String(currentIndex + 1).padStart(2, '0')}</small>
            </div>
            <h1 className="reader-title">{module.title}</h1>
            <p className="reader-summary">{module.summary}</p>

            <div className="reader-sections">
              {module.sections.map((s, i) => <Section key={i} section={s} />)}
            </div>

            {hasQuiz ? (
              <Quiz
                module={module}
                savedAnswer={savedAnswer}
                selected={selected}
                feedback={feedback}
                onSelect={(o) => { setSelected(o); setFeedback('idle') }}
                onConfirm={confirmAnswer}
              />
            ) : null}
          </article>
        </div>

        <footer className="reader-footer">
          <button className="btn btn--ghost" type="button" disabled={currentIndex === 0} onClick={() => goTo(currentIndex - 1)}>
            <IconArrowLeft size={15} /> Anterior
          </button>
          <span className="reader-gate">
            {canContinue ? 'Progreso guardado' : 'Respondé la comprobación para seguir'}
          </span>
          <button className="btn btn--gold" type="button" disabled={!canContinue} onClick={goNext}>
            {currentIndex === lastIndex ? 'Finalizar' : 'Siguiente'} <IconArrowRight size={15} />
          </button>
        </footer>
      </section>

      {finished ? (
        <div className="finish-overlay" role="dialog" aria-modal="true">
          <div className="finish-modal">
            <span className="panel-corners" aria-hidden="true"><span /><span /><span /><span /></span>
            <span className="finish-badge"><IconStar size={26} /></span>
            <span className="finish-eyebrow">Certificado · {course.code}</span>
            <h2>Terminaste el curso.</h2>
            <p>
              Firmaste <strong>{course.title}</strong>. Sumaste criterio a tu ojo y un
              paso más hacia la red de evaluadores de Aurum.
            </p>
            <div className="finish-actions">
              <button className="btn btn--gold" type="button" onClick={() => navigate('/cursos')}>
                Volver a cursos <IconArrowRight size={15} />
              </button>
              <button className="btn btn--ghost" type="button" onClick={() => setFinished(false)}>
                Repasar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
