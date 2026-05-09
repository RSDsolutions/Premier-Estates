import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { user, profile, notifications, authModalOpen, setAuthModalOpen, navOpen, setNavOpen } = useAppStore()
  const navigate = useNavigate()
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  async function handleLogout() {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    toast('Sesión cerrada')
  }

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <NavLink to="/" className="brand" onClick={() => setNavOpen(false)}>
          <span className="brand-mark"><i className="fa-solid fa-gem" /></span>
          <span className="brand-name">Premier <em>Estates</em></span>
        </NavLink>

        <nav className={`nav-links${navOpen ? ' open' : ''}`} id="navLinks">
          {[
            { to: '/', label: 'Inicio', end: true },
            { to: '/propiedades', label: 'Propiedades', end: false },
            { to: '/nosotros', label: 'Nosotros', end: false },
            { to: '/contacto', label: 'Contacto', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setNavOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="icon-btn nav-icon"
            title="Mi perfil"
            onClick={() => {
              setNavOpen(false)
              if (user) navigate('/mi-cuenta')
              else setAuthModalOpen(!authModalOpen)
            }}
          >
            <i className={user ? 'fa-solid fa-user' : 'fa-regular fa-user'} />
          </button>

          <button
            className="icon-btn nav-icon notif-btn"
            title="Notificaciones"
            onClick={() => { navigate('/admin'); setNavOpen(false) }}
          >
            <i className="fa-regular fa-bell" />
            {unread > 0 && <span className="notif-dot" />}
          </button>

          {user && (profile?.role === 'agent' || profile?.role === 'admin') && (
            <Link
              to="/admin"
              className="btn btn-primary publish-btn"
              onClick={() => setNavOpen(false)}
            >
              <i className="fa-solid fa-plus" /> Publicar propiedad
            </Link>
          )}
          {user ? (
            <button className="btn btn-outline" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" /> Salir
            </button>
          ) : (
            <button
              className="btn btn-outline"
              onClick={() => { setAuthModalOpen(true); setNavOpen(false) }}
            >
              <i className="fa-regular fa-user" /> Iniciar sesión
            </button>
          )}

          <button
            className="hamburger"
            aria-label="Menú"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
