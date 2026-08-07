import { useEffect, useRef, useState } from 'react'
import { logout } from '../auth'
import { navigate, useRoute } from '../router'
import { Avatar } from './ui'
import { IconHome, IconBook, IconUser, IconShield, IconLogout } from '../icons'

function NavLink({ to, active, icon: Icon, children }) {
  return (
    <button
      type="button"
      className={`pnav-link ${active ? 'is-active' : ''}`}
      onClick={() => navigate(to)}
    >
      <Icon size={16} />
      <span>{children}</span>
    </button>
  )
}

export default function Shell({ user, children }) {
  const route = useRoute()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const isAdmin = user.role === 'admin'

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <div className="portal">
      <div className="vignette" />
      <div className="grain" />

      <header className="pnav">
        <button className="pnav-brand" type="button" onClick={() => navigate('/')} aria-label="Aurum Academy — Inicio">
          <img src="/symbol-small.png" alt="" />
          <span className="pnav-brand-word">
            <img src="/aurum-word.png" alt="AURUM" />
            <span className="pnav-academy">ACADEMY</span>
          </span>
        </button>

        <nav className="pnav-links">
          <NavLink to="/" active={route.name === 'home'} icon={IconHome}>Inicio</NavLink>
          <NavLink to="/cursos" active={route.name === 'cursos' || route.name === 'curso'} icon={IconBook}>Cursos</NavLink>
          <NavLink to="/perfil" active={route.name === 'perfil'} icon={IconUser}>Perfil</NavLink>
          {isAdmin ? (
            <NavLink to="/admin" active={route.name === 'admin'} icon={IconShield}>Gestión</NavLink>
          ) : null}
        </nav>

        <div className="pnav-user" ref={menuRef}>
          <button
            type="button"
            className="pnav-user-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            <Avatar name={user.name} size={34} gold={isAdmin} />
            <span className="pnav-user-meta">
              <span className="pnav-user-name">{user.name}</span>
              <span className="pnav-user-role">{isAdmin ? 'Gestión' : user.craft}</span>
            </span>
          </button>
          {menuOpen ? (
            <div className="pnav-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/perfil') }}>
                <IconUser size={15} /> Mi perfil
              </button>
              <button type="button" role="menuitem" className="pnav-menu-danger" onClick={() => { setMenuOpen(false); logout() }}>
                <IconLogout size={15} /> Cerrar sesión
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="portal-main">{children}</main>
    </div>
  )
}
