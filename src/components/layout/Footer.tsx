import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="foot-brand">
          <Link to="/" className="brand">
            <span className="brand-mark"><i className="fa-solid fa-gem" /></span>
            <span className="brand-name">Premier <em>Estates</em></span>
          </Link>
          <p className="muted">Encuentra tu propiedad ideal. Más de una década conectando familias con su próximo hogar en Ecuador.</p>
          <div className="socials">
            <a href="#"><i className="fa-brands fa-instagram" /></a>
            <a href="#"><i className="fa-brands fa-facebook" /></a>
            <a href="#"><i className="fa-brands fa-x-twitter" /></a>
            <a href="#"><i className="fa-brands fa-linkedin" /></a>
            <a href="#"><i className="fa-brands fa-tiktok" /></a>
          </div>
        </div>

        <div className="foot-col">
          <h5>Compañía</h5>
          <a href="#">Sobre nosotros</a>
          <a href="#">Equipo</a>
          <a href="#">Carreras</a>
          <a href="#">Prensa</a>
        </div>

        <div className="foot-col">
          <h5>Productos</h5>
          <Link to="/propiedades">Comprar</Link>
          <Link to="/propiedades">Arrendar</Link>
          <Link to="/admin">Vender</Link>
          <Link to="/propiedades">Comerciales</Link>
        </div>

        <div className="foot-col">
          <h5>Soporte</h5>
          <a href="#">Centro de ayuda</a>
          <a href="#">Contáctanos</a>
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
        </div>

        <div className="foot-col foot-newsletter">
          <h5>Boletín exclusivo</h5>
          <p className="muted sm">Las mejores propiedades, antes que nadie.</p>
          <form
            className="foot-form"
            onSubmit={(e) => {
              e.preventDefault()
              if (email) { setSubscribed(true); setEmail('') }
            }}
          >
            <input
              className="input"
              placeholder="tu@correo.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              <i className="fa-solid fa-paper-plane" />
            </button>
            {subscribed && (
              <span className="foot-ok" style={{ display: 'inline-flex' }}>¡Suscrito!</span>
            )}
          </form>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>© 2026 Premier Estates · Todos los derechos reservados</span>
        <span>Hecho con <i className="fa-solid fa-heart gold" /> en Quito</span>
      </div>
    </footer>
  )
}
