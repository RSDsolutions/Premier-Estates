import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { useProperties } from '../hooks/useProperties'
import { useVisits } from '../hooks/useVisits'
import PropertyCard from '../components/property/PropertyCard'

type TabKey = 'favs' | 'visits' | 'queries'

export default function Profile() {
  const navigate = useNavigate()
  const { user, profile, favorites } = useAppStore()
  const { properties } = useProperties()
  const { visits, cancelVisit } = useVisits()
  const [tab, setTab] = useState<TabKey>('favs')

  const favProps = [...favorites]
    .map(id => properties.find(p => p.id === id))
    .filter(Boolean) as typeof properties

  const avatarSeed = profile?.full_name?.toLowerCase().replace(/\s/g, '') ?? 'user'
  const displayName = profile?.full_name ?? user?.email ?? 'Usuario'
  const displayEmail = user?.email ?? 'usuario@premier.ec'

  return (
    <div className="container">
      <div className="profile-head">
        <img
          src={profile?.avatar_url ?? `https://picsum.photos/seed/${avatarSeed}/200/200`}
          className="profile-avatar"
          alt={displayName}
        />
        <div>
          <span className="eyebrow gold">Mi cuenta</span>
          <h1 className="profile-name">{displayName}</h1>
          <p className="muted">{displayEmail}</p>
          <div className="profile-stats">
            <span><strong>{favorites.size}</strong> favoritos</span>
            <span><strong>3</strong> visitas agendadas</span>
            <span><strong>5</strong> consultas</span>
          </div>
        </div>
        <button className="btn btn-outline">
          <i className="fa-solid fa-pen" /> Editar perfil
        </button>
      </div>

      <div className="tabs">
        {([['favs', 'fa-regular fa-heart', 'Favoritos'], ['visits', 'fa-regular fa-calendar', 'Mis visitas'], ['queries', 'fa-regular fa-comments', 'Mis consultas']] as const).map(([key, icon, label]) => (
          <button
            key={key}
            className={`tab${tab === key ? ' active' : ''}`}
            onClick={() => setTab(key as TabKey)}
          >
            <i className={icon} /> {label}
          </button>
        ))}
      </div>

      {tab === 'favs' && (
        <div className="tab-panel active">
          {favProps.length > 0
            ? <div className="grid-cards">{favProps.map(p => <PropertyCard key={p.id} property={p} showBadge={false} />)}</div>
            : (
              <div className="empty-state">
                <i className="fa-regular fa-heart" />
                <h3>Aún no tienes favoritos</h3>
                <p className="muted">Toca el corazón en cualquier propiedad para guardarla aquí.</p>
                <button className="btn btn-primary" onClick={() => navigate('/propiedades')}>
                  Explorar propiedades
                </button>
              </div>
            )
          }
        </div>
      )}

      {tab === 'visits' && (
        <div className="tab-panel active">
          {visits.length === 0 ? (
            <p className="muted" style={{ textAlign: 'center', padding: '40px 0' }}>No tienes visitas agendadas.</p>
          ) : (
            <ul className="visit-list">
              {visits.map(v => {
                const prop = v.property as { title?: string; zone?: string } | undefined
                const statusLabel = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada' }[v.status]
                const statusCls = { pending: 'warn', confirmed: 'ok', cancelled: 'err', completed: 'ok' }[v.status]
                return (
                  <li key={v.id} className="card">
                    <div className="vl-info">
                      <strong>{prop?.title ?? 'Propiedad'}</strong>
                      <div className="vl-meta">
                        <i className="fa-solid fa-location-dot" />{prop?.zone ?? '—'}
                        <i className="fa-regular fa-calendar" style={{ marginLeft: 14 }} />
                        {new Date(v.visit_date).toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })} · {v.visit_time}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className={`badge ${statusCls}`}>{statusLabel}</span>
                      {v.status === 'pending' && (
                        <button className="btn btn-ghost" onClick={() => void cancelVisit(v.id)}>
                          <i className="fa-solid fa-xmark" /> Cancelar
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {tab === 'queries' && (
        <div className="tab-panel active">
          <ul className="query-list">
            {[
              { prop: 'Casa Cumbayá Hills', q: '¿Aceptan crédito hipotecario BIESS?', status: 'warn', label: 'Pendiente respuesta' },
              { prop: 'Depto González Suárez Tower', q: 'Información sobre alícuota mensual', status: 'ok', label: 'Respondida' },
              { prop: 'Oficina La Carolina', q: 'Disponibilidad para visita el sábado', status: 'ok', label: 'Respondida' },
            ].map((item, i) => (
              <li key={i} className="card q-item">
                <div>
                  <strong>{item.prop}</strong><br />
                  <span className="muted">«{item.q}»</span>
                </div>
                <span className={`badge ${item.status}`}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
