import { useAuth } from './auth'
import { useRoute } from './router'
import Login from './components/Login'
import Shell from './components/Shell'
import HomeView from './components/HomeView'
import CoursesView from './components/CoursesView'
import CoursePlayer from './components/CoursePlayer'
import ProfileView from './components/ProfileView'
import AdminView from './components/AdminView'

export default function PortalApp() {
  const user = useAuth()
  const route = useRoute()

  if (!user) return <Login />

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
    case 'admin':
      view = isAdmin ? <AdminView user={user} /> : <HomeView user={user} />
      break
    case 'home':
    default:
      view = <HomeView user={user} />
  }

  return (
    <Shell user={user}>
      {view}
    </Shell>
  )
}
