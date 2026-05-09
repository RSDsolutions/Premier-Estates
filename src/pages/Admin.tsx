import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { useAuth } from '../hooks/useAuth'
import { useNotifications } from '../hooks/useNotifications'
import { useVisits } from '../hooks/useVisits'
import PropertiesTable from '../components/admin/PropertiesTable'
import { isStripeConfigured, isDocusealConfigured } from '../lib/supabase'
import StatsCards from '../components/admin/StatsCards'
import LeadsTable from '../components/admin/LeadsTable'
import { useLeads } from '../hooks/useLeads'

type AdminPanel = 'dashboard' | 'props' | 'visitas' | 'clientes' | 'pagos' | 'notif' | 'config'

const CLIENTS = [
  { name: 'María González', meta: 'Cliente activo · 4 visitas', seed: 'maria' },
  { name: 'Andrés Paredes', meta: 'Lead caliente · 2 consultas', seed: 'andres' },
  { name: 'Lucía Romero', meta: 'Contrato firmado · arriendo', seed: 'lucia' },
  { name: 'Pedro Salinas', meta: 'Lead nuevo', seed: 'pedro' },
  { name: 'Carla Vinueza', meta: 'Cliente recurrente', seed: 'carla' },
  { name: 'Diego Erazo', meta: 'Lead frío', seed: 'diego' },
  { name: 'Sofía Mantilla', meta: 'Cliente activo · 1 visita', seed: 'sofia' },
  { name: 'Juan Carlos T.', meta: 'Inversionista', seed: 'juancarlos' },
]

const VISITS_DATA = [
  { c: 'María González', p: 'Casa Cumbayá Hills', d: 'Vie 10 May', t: '11:00', s: 'Confirmada' },
  { c: 'Andrés Paredes', p: 'Depto González Suárez', d: 'Sáb 11 May', t: '15:00', s: 'Pendiente' },
  { c: 'Lucía Romero', p: 'Penthouse La Carolina', d: 'Dom 12 May', t: '09:00', s: 'Confirmada' },
  { c: 'Pedro Salinas', p: 'Loft Tumbaco', d: 'Lun 13 May', t: '17:00', s: 'Cancelada' },
  { c: 'Carla Vinueza', p: 'Casa Valle de los Chillos', d: 'Mar 14 May', t: '11:00', s: 'Confirmada' },
  { c: 'Diego Erazo', p: 'Oficina La Carolina', d: 'Mié 15 May', t: '15:00', s: 'Pendiente' },
]

const ICON_MAP: Record<string, string> = {
  calendar: 'calendar', comment: 'comments', 'dollar-sign': 'dollar-sign',
  signature: 'signature', 'house-chimney': 'house-chimney', 'chart-line': 'chart-line',
}

function statusClass(s: string) {
  if (s === 'Confirmada' || s === 'ok') return 'ok'
  if (s === 'Pendiente' || s === 'warn') return 'warn'
  return 'err'
}

export default function Admin() {
  const navigate = useNavigate()
  const { user, profile } = useAppStore()
  const { signOut } = useAuth()
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useNotifications()
  const { visits, updateStatus } = useVisits(true)
  const { leads, loading: lLoad } = useLeads()
  const [panel, setPanel] = useState<AdminPanel>('dashboard')
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({
    emailLeads: true, smsVisitas: true, resumenSemanal: false, alertasPago: true,
    temaOscuro: true, animReducidas: false,
  })

  // Role guard — redirect non-agents/admins
  if (user === null) {
    return (
      <div className="container" style={{ padding: '120px 32px', textAlign: 'center' }}>
        <h2 className="page-title">Acceso restringido</h2>
        <p className="muted" style={{ marginBottom: 24 }}>Debes iniciar sesión para acceder al panel.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Ir al inicio</button>
      </div>
    )
  }
  if (profile && profile.role === 'buyer') {
    return (
      <div className="container" style={{ padding: '120px 32px', textAlign: 'center' }}>
        <h2 className="page-title">Sin permisos</h2>
        <p className="muted" style={{ marginBottom: 24 }}>Esta área es exclusiva para agentes y administradores.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    )
  }

  const displayName = profile?.full_name ?? user?.email ?? 'Admin'
  const avatarSeed = profile?.full_name?.toLowerCase().replace(/\s/g, '') ?? 'admin'

  function toggleSwitch(key: string) {
    setSwitchStates(s => ({ ...s, [key]: !s[key] }))
  }

  const navItems: { key: AdminPanel; icon: string; label: string; badge?: number }[] = [
    { key: 'dashboard', icon: 'gauge-high', label: 'Dashboard' },
    { key: 'props', icon: 'house-chimney', label: 'Propiedades' },
    { key: 'visitas', icon: 'calendar', label: 'Visitas' },
    { key: 'clientes', icon: 'user', label: 'Clientes' },
    { key: 'pagos', icon: 'credit-card', label: 'Pagos' },
    { key: 'notif', icon: 'bell', label: 'Notificaciones', badge: unreadCount },
    { key: 'config', icon: 'gear', label: 'Configuración' },
  ]

  return (
    <div className="view-admin" style={{ minHeight: '100vh' }}>
      <div className="admin-shell">
        {/* SIDEBAR */}
        <aside className="admin-side">
          <div className="admin-brand">
            <span className="brand-mark sm"><i className="fa-solid fa-gem" /></span>
            <span>Admin</span>
          </div>
          <nav className="admin-nav">
            {navItems.map(item => (
              <a
                key={item.key}
                className={`anav${panel === item.key ? ' active' : ''}`}
                onClick={() => setPanel(item.key)}
              >
                <i className={`fa-${item.key === 'dashboard' || item.key === 'config' ? 'solid' : 'regular'} fa-${item.icon}`} />
                <span>{item.label}</span>
                {item.badge ? <span className="badge-num">{item.badge}</span> : null}
              </a>
            ))}
          </nav>
          <div className="admin-user" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={`https://picsum.photos/seed/${avatarSeed}/64/64`} alt={displayName} />
              <div>
                <div className="au-name">{displayName}</div>
                <div className="au-mail muted">{user?.email ?? 'admin@premier.ec'}</div>
              </div>
            </div>
            <button 
              title="Cerrar sesión" 
              onClick={async () => { await signOut(); navigate('/'); }}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 8, fontSize: 16 }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket" />
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <section className="admin-main">

          {/* DASHBOARD */}
          <div className={`apanel${panel === 'dashboard' ? ' active' : ''}`}>
            <header className="apanel-head">
              <div>
                <h2 className="section-title sm">Dashboard</h2>
                <p className="muted">Resumen ejecutivo · Mayo 2026</p>
              </div>
              <div className="apanel-tools">
                <button className="btn btn-ghost"><i className="fa-solid fa-download" /> Exportar</button>
                <button className="btn btn-primary" onClick={() => navigate('/pago')}>
                  <i className="fa-solid fa-bolt" /> Boost listing
                </button>
              </div>
            </header>

            {(!isStripeConfigured() || !isDocusealConfigured()) && (
              <div className="alert-box" style={{ background: 'var(--red-dim)', padding: 16, borderRadius: 8, marginBottom: 24, border: '1px solid var(--red-border)' }}>
                <strong style={{ color: 'var(--red)' }}><i className="fa-solid fa-triangle-exclamation" /> Alerta de Configuración Incompleta</strong>
                <p className="sm muted" style={{ marginTop: 4 }}>
                  Faltan variables de entorno esenciales: 
                  {!isStripeConfigured() && <strong> VITE_STRIPE_PUBLISHABLE_KEY </strong>} 
                  {!isDocusealConfigured() && <strong> VITE_DOCUSEAL_TEMPLATE_ID </strong>}. 
                  El sistema de cobros y firma electrónica se encuentra operando en modo Mock (Simulado).
                </p>
              </div>
            )}

            <StatsCards stats={[
                { icon: 'house-chimney', num: '124', label: 'Propiedades activas', delta: '+8 este mes', up: true },
                { icon: 'calendar', num: '38', label: 'Visitas agendadas', delta: '+12% vs sem. ant.', up: true },
                { icon: 'comments', num: '17', label: 'Consultas nuevas', delta: '−3 vs ayer', up: false },
                { icon: 'dollar-sign', num: '$ 4.800', label: 'Ingresos del mes', delta: '+22%', up: true },
            ]} />

            <div className="dash-row">
              <div className="card chart-card">
                <div className="card-head">
                  <div>
                    <h3>Visitas — últimos 7 días</h3>
                    <p className="muted">Total: 217 · Promedio diario: 31</p>
                  </div>
                  <div className="legend">
                    <span className="dot gold" /> Visitas
                    <span className="dot" /> Consultas
                  </div>
                </div>
                <svg className="chart" viewBox="0 0 600 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="ggrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g className="grid-lines">
                    <line x1="0" x2="600" y1="40" y2="40" />
                    <line x1="0" x2="600" y1="90" y2="90" />
                    <line x1="0" x2="600" y1="140" y2="140" />
                    <line x1="0" x2="600" y1="190" y2="190" />
                  </g>
                  <path d="M30,150 L120,110 L210,135 L300,80 L390,95 L480,55 L570,70 L570,200 L30,200 Z" fill="url(#ggrad)" />
                  <path d="M30,150 L120,110 L210,135 L300,80 L390,95 L480,55 L570,70" fill="none" stroke="#C9A84C" strokeWidth="2.5" />
                  <path d="M30,180 L120,170 L210,175 L300,160 L390,165 L480,150 L570,158" fill="none" stroke="#555" strokeWidth="2" strokeDasharray="4 4" />
                  <g className="dots">
                    {[[30,150],[120,110],[210,135],[300,80],[390,95],[480,55],[570,70]].map(([cx,cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="4" fill="#C9A84C" />
                    ))}
                  </g>
                  <g className="axis-labels">
                    {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d,i) => (
                      <text key={d} x={30 + i * 90} y="215">{d}</text>
                    ))}
                  </g>
                </svg>
              </div>

              <div className="card activity-card">
                <div className="card-head">
                  <h3>Actividad reciente</h3>
                  <a className="link-gold-sm">Ver todo</a>
                </div>
                <ul className="activity">
                  {[
                    { gold: true, text: '<strong>María L.</strong> agendó una visita para <em>Casa Cumbayá Hills</em>', time: 'hace 12 min' },
                    { gold: false, text: '<strong>Andrés P.</strong> envió consulta sobre <em>Depto González Suárez</em>', time: 'hace 38 min' },
                    { gold: true, text: 'Pago confirmado · <strong>$ 1.200</strong> · Listado destacado', time: 'hace 1 h' },
                    { gold: false, text: '<strong>Lucía R.</strong> firmó contrato de arriendo', time: 'hace 3 h' },
                    { gold: false, text: 'Nueva propiedad publicada · <em>Oficina La Carolina</em>', time: 'hoy 09:14' },
                  ].map((item, i) => (
                    <li key={i}>
                      <span className={`ac-dot${item.gold ? ' gold' : ''}`} />
                      <div dangerouslySetInnerHTML={{ __html: `${item.text}<br><span class="muted">${item.time}</span>` }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* PROPIEDADES */}
          <div className={`apanel${panel === 'props' ? ' active' : ''}`}>
            <PropertiesTable />
          </div>

          {/* VISITAS */}
          <div className={`apanel${panel === 'visitas' ? ' active' : ''}`}>
            <header className="apanel-head">
              <div>
                <h2 className="section-title sm">Visitas</h2>
                <p className="muted"><span>{visits.length}</span> registros</p>
              </div>
            </header>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Cliente</th><th>Propiedad</th><th>Fecha</th><th>Hora</th><th>Estado</th><th className="ta-r">Acciones</th></tr>
                </thead>
                <tbody>
                  {visits.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>Sin visitas registradas</td></tr>
                  )}
                  {visits.map(v => {
                    const prop = v.property as { title?: string } | undefined
                    const statusLabel = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada' }[v.status]
                    const statusCls = { pending: 'warn', confirmed: 'ok', cancelled: 'err', completed: 'ok' }[v.status]
                    return (
                      <tr key={v.id}>
                        <td><strong>{v.user_id.slice(0, 8)}…</strong></td>
                        <td>{prop?.title ?? v.property_id}</td>
                        <td>{new Date(v.visit_date).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}</td>
                        <td>{v.visit_time}</td>
                        <td><span className={`badge ${statusCls}`}>{statusLabel}</span></td>
                        <td className="ta-r">
                          <div className="row-actions">
                            {v.status === 'pending' && (
                              <button title="Confirmar" onClick={() => void updateStatus(v.id, 'confirmed')}>
                                <i className="fa-solid fa-check" />
                              </button>
                            )}
                            {(v.status === 'pending' || v.status === 'confirmed') && (
                              <button className="del" title="Cancelar" onClick={() => void updateStatus(v.id, 'cancelled')}>
                                <i className="fa-solid fa-xmark" />
                              </button>
                            )}
                            {v.status === 'confirmed' && (
                              <button title="Marcar completada" onClick={() => void updateStatus(v.id, 'completed')}>
                                <i className="fa-solid fa-flag-checkered" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CLIENTES */}
          <div className={`apanel${panel === 'clientes' ? ' active' : ''}`}>
            <header className="apanel-head">
              <div><h2 className="section-title sm">Clientes</h2><p className="muted">Base de contactos activa</p></div>
              <div className="apanel-tools">
                <button className="btn btn-primary"><i className="fa-solid fa-plus" /> Agregar cliente</button>
              </div>
            </header>
            <div style={{ marginTop: 20 }}>
              {lLoad ? <div className="muted">Cargando leads...</div> : <LeadsTable leads={leads} />}
            </div>
          </div>

          {/* PAGOS */}
          <div className={`apanel${panel === 'pagos' ? ' active' : ''}`}>
            <header className="apanel-head">
              <div><h2 className="section-title sm">Pagos</h2><p className="muted">Histórico de transacciones</p></div>
            </header>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>ID</th><th>Cliente</th><th>Concepto</th><th>Monto</th><th>Fecha</th><th>Estado</th></tr></thead>
                <tbody>
                  {[
                    { id: '#PG-2041', c: 'María González', desc: 'Listado destacado', amt: '$ 1.200', date: '06 May 2026', s: 'ok', label: 'Pagado' },
                    { id: '#PG-2040', c: 'Andrés Paredes', desc: 'Reserva visita', amt: '$ 50', date: '06 May 2026', s: 'ok', label: 'Pagado' },
                    { id: '#PG-2039', c: 'Lucía Romero', desc: 'Comisión arriendo', amt: '$ 850', date: '05 May 2026', s: 'ok', label: 'Pagado' },
                    { id: '#PG-2038', c: 'Pedro Salinas', desc: 'Listado destacado', amt: '$ 1.200', date: '04 May 2026', s: 'warn', label: 'Pendiente' },
                    { id: '#PG-2037', c: 'Carla Vinueza', desc: 'Reserva visita', amt: '$ 50', date: '03 May 2026', s: 'err', label: 'Reembolso' },
                  ].map(row => (
                    <tr key={row.id}>
                      <td>{row.id}</td><td>{row.c}</td><td>{row.desc}</td>
                      <td>{row.amt}</td><td>{row.date}</td>
                      <td><span className={`badge ${row.s}`}>{row.label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NOTIFICACIONES */}
          <div className={`apanel${panel === 'notif' ? ' active' : ''}`}>
            <header className="apanel-head">
              <div>
                <h2 className="section-title sm">Notificaciones</h2>
                <p className="muted"><span>{unreadCount}</span> sin leer</p>
              </div>
              <div className="apanel-tools">
                <button className="btn btn-ghost" onClick={markAllNotificationsRead}>
                  <i className="fa-solid fa-check-double" /> Marcar todas como leídas
                </button>
              </div>
            </header>
            <ul className="notif-list">
              {notifications.map(n => (
                <li
                  key={n.id}
                  className={n.read ? 'read' : ''}
                  onClick={() => markNotificationRead(n.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="nf-dot" />
                  <span className="nf-icn">
                    <i className={`fa-solid fa-${ICON_MAP[n.icn ?? ''] ?? 'bell'}`} />
                  </span>
                  <div className="nf-body">
                    <strong>{n.title}</strong>
                    <div className="muted sm">{n.body}</div>
                  </div>
                  <span className="nf-time">{n.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CONFIG */}
          <div className={`apanel${panel === 'config' ? ' active' : ''}`}>
            <header className="apanel-head">
              <div><h2 className="section-title sm">Configuración</h2><p className="muted">Preferencias del sistema</p></div>
            </header>
            <div className="config-grid">
              <div className="card config-card">
                <h4>Perfil de empresa</h4>
                <label className="field"><span>Nombre comercial</span><input className="input" defaultValue="Premier Estates Ecuador" /></label>
                <label className="field"><span>RUC</span><input className="input" defaultValue="1792345678001" /></label>
                <label className="field"><span>Sitio web</span><input className="input" defaultValue="premier.ec" /></label>
              </div>
              <div className="card config-card">
                <h4>Notificaciones</h4>
                {[['emailLeads','Email de nuevos leads'],['smsVisitas','SMS de visitas confirmadas'],['resumenSemanal','Resumen semanal'],['alertasPago','Alertas de pago']].map(([k,label]) => (
                  <label key={k} className="switch-row">
                    <span>{label}</span>
                    <span className={`switch${switchStates[k] ? ' on' : ''}`} onClick={() => toggleSwitch(k)} />
                  </label>
                ))}
              </div>
              <div className="card config-card">
                <h4>Apariencia</h4>
                {[['temaOscuro','Tema oscuro'],['animReducidas','Animaciones reducidas']].map(([k,label]) => (
                  <label key={k} className="switch-row">
                    <span>{label}</span>
                    <span className={`switch${switchStates[k] ? ' on' : ''}`} onClick={() => toggleSwitch(k)} />
                  </label>
                ))}
                <label className="field"><span>Idioma</span>
                  <select className="select"><option>Español</option><option>English</option></select>
                </label>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  )
}
