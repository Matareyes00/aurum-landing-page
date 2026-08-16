import { useEffect, useRef, useState } from 'react'
import { logout } from '../auth'
import { navigate, useRoute } from '../router'
import { Avatar, LangSwitch } from './ui'
import { IconHome, IconBook, IconUser, IconShield, IconLogout, IconWorkflow } from '../icons'
import { useStorageStatus } from '../store'
import { useCopy, SHELL } from '../copy'

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
  const t = useCopy(SHELL)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const isAdmin = user.role === 'admin'
  const storage = useStorageStatus()

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
        <button className="pnav-brand" type="button" onClick={() => navigate('/')} aria-label={t.brandAria}>
          <span className="pnav-brand-symbol" aria-hidden="true">
            <img src="/symbol-mid.png" alt="" />
          </span>
          <span className="pnav-brand-word">
            <img src="/aurum-word.png" alt="AURUM" />
            <span className="pnav-brand-divider" aria-hidden="true" />
            <span className="pnav-academy">Academy</span>
          </span>
        </button>

        <nav className="pnav-links">
          <NavLink to="/" active={route.name === 'home'} icon={IconHome}>{t.home}</NavLink>
          <NavLink to="/cursos" active={route.name === 'cursos' || route.name === 'curso'} icon={IconBook}>{t.courses}</NavLink>
          <NavLink to="/workflows" active={route.name === 'workflows' || route.name === 'workflow'} icon={IconWorkflow}>{t.workflows}</NavLink>
          <NavLink to="/codex" active={route.name === 'codex'} icon={IconBook}>{t.codex}</NavLink>
          <NavLink to="/perfil" active={route.name === 'perfil'} icon={IconUser}>{t.profile}</NavLink>
          {isAdmin ? (
            <NavLink to="/admin" active={route.name === 'admin'} icon={IconShield}>{t.admin}</NavLink>
          ) : null}
        </nav>

        <div className="pnav-side">
          <LangSwitch />
          <div className="pnav-user" ref={menuRef}>
          <button
            type="button"
            className="pnav-user-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            <Avatar name={user.name} size={34} gold={isAdmin} />
            <span className={`storage-dot is-${storage.state}`} title={storage.error || (storage.state === 'saving' ? t.saving : t.saved)} />
            <span className="pnav-user-meta">
              <span className="pnav-user-name">{user.name}</span>
              <span className="pnav-user-role">{isAdmin ? t.adminRole : user.craft}</span>
            </span>
          </button>
          {menuOpen ? (
            <div className="pnav-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/perfil') }}>
                <IconUser size={15} /> {t.myProfile}
              </button>
              <button type="button" role="menuitem" className="pnav-menu-danger" onClick={() => { setMenuOpen(false); logout() }}>
                <IconLogout size={15} /> {t.logout}
              </button>
            </div>
          ) : null}
          </div>
        </div>
      </header>

      <main className="portal-main">{children}</main>
    </div>
  )
}
