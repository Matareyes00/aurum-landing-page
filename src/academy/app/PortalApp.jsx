import { useEffect, useRef } from 'react'
import { useAuth } from './auth'
import { useRoute } from './router'
import CursorFrame from '../../fx/CursorFrame'
import Login from './components/Login'
import Shell from './components/Shell'
import HomeView from './components/HomeView'
import CoursesView from './components/CoursesView'
import CoursePlayer from './components/CoursePlayer'
import ProfileView from './components/ProfileView'
import AdminHub from './components/admin/AdminHub'
import CodexView from './components/workflows/CodexView'
import WorkflowQueue from './components/workflows/WorkflowQueue'
import WorkflowWorkspace from './components/workflows/WorkflowWorkspace'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function PortalApp() {
  const user = useAuth()
  const route = useRoute()
  const lightRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.name, route.id])

  useEffect(() => {
    if (prefersReduced || !window.matchMedia('(pointer: fine)').matches) return
    const light = lightRef.current
    const onMove = (event) => {
      light.style.setProperty('--mx', `${event.clientX}px`)
      light.style.setProperty('--my', `${event.clientY}px`)
      light.classList.add('is-on')
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  if (!user) {
    return (
      <>
        <CursorFrame reduced={prefersReduced} />
        <div className="cursor-light portal-cursor-light" ref={lightRef} />
        <Login />
      </>
    )
  }

  const isAdmin = user.role === 'admin'

  let view
  switch (route.name) {
    case 'cursos':
      view = <CoursesView user={user} />
      break
    case 'curso':
      view = <CoursePlayer user={user} courseId={route.id} />
      break
    case 'perfil':
      view = <ProfileView user={user} />
      break
    case 'workflows':
      view = <WorkflowQueue user={user} />
      break
    case 'workflow':
      view = <WorkflowWorkspace user={user} taskId={route.id} />
      break
    case 'codex':
      view = <CodexView />
      break
    case 'admin':
      view = isAdmin ? <AdminHub route={route} /> : <HomeView user={user} />
      break
    case 'home':
    default:
      view = <HomeView user={user} />
  }

  return (
    <>
      <CursorFrame reduced={prefersReduced} />
      <div className="cursor-light portal-cursor-light" ref={lightRef} />
      <Shell user={user}>
        <div className="portal-route" key={`${route.name}:${route.id || ''}`}>{view}</div>
      </Shell>
    </>
  )
}
