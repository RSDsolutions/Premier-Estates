import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProperties } from '../hooks/useProperties'
import PropertyGallery from '../components/property/PropertyGallery'
import PropertyCard from '../components/property/PropertyCard'
import VisitModal from '../components/property/VisitModal'
import PropertyMiniMap from '../components/property/PropertyMiniMap'
import { useAppStore } from '../store'
import AgentCard from '../components/crm/AgentCard'
import LeadForm from '../components/crm/LeadForm'

const AMEN_ICONS: Record<string, string> = {
  Piscina: 'water-ladder',
  'Seguridad 24h': 'shield-halved',
  Gimnasio: 'dumbbell',
  Jardín: 'tree',
  Terraza: 'mountain-sun',
  Garaje: 'car',
  Chimenea: 'fire',
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { properties, getProperty } = useProperties()
  const { setPaymentProperty } = useAppStore()
  const [visitOpen, setVisitOpen] = useState(false)

  const property = getProperty(id ?? '')

  if (!property) {
    return (
      <div className="container" style={{ padding: '80px 32px', textAlign: 'center' }}>
        <h2 className="page-title">Propiedad no encontrada</h2>
        <Link to="/propiedades" className="btn btn-primary" style={{ marginTop: 24 }}>
          Ver propiedades
        </Link>
      </div>
    )
  }

  const similar = properties
    .filter(p => p.zone === property.zone && p.id !== property.id)
    .slice(0, 3)
  const fallback = properties.filter(p => p.id !== property.id).slice(0, 3)
  const similarProps = similar.length >= 3 ? similar : fallback

  const floors = property.type === 'Casa' ? 2 : 1
  const garage = property.amenities.includes('Garaje') ? 2 : 0
  const amenitySet = new Set([...property.amenities, 'Terraza'])

  function handlePayment() {
    setPaymentProperty(property ?? null)
    navigate('/pago')
  }

  return (
    <div className="container">
      <Link to="/propiedades" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Volver a propiedades
      </Link>

      <div className="detail-layout">
        <div className="detail-main">
          <PropertyGallery propertyId={property.id} photos={property.photos} />

          <div className="detail-body">
            <div className="d-head">
              <div>
                <span className="zone-badge">
                  <i className="fa-solid fa-location-dot" /> {property.zone}
                </span>
                <h1 className="d-title">{property.title}</h1>
              </div>
              <div className="d-price-block">
                <div className="d-price gold">
                  {property.operation === 'Arriendo'
                    ? `$ ${property.price.toLocaleString('es-EC')} / mes`
                    : `$ ${property.price.toLocaleString('es-EC')}`}
                </div>
                <div className="d-op">
                  {property.operation === 'Arriendo' ? 'Arriendo / mes' : 'Venta'}
                </div>
              </div>
            </div>

            <div className="spec-grid">
              <div className="spec"><i className="fa-solid fa-bed" /><span className="spec-num">{property.beds}</span><span className="spec-lbl">Habitaciones</span></div>
              <div className="spec"><i className="fa-solid fa-bath" /><span className="spec-num">{property.baths}</span><span className="spec-lbl">Baños</span></div>
              <div className="spec"><i className="fa-solid fa-vector-square" /><span className="spec-num">{property.area}</span><span className="spec-lbl">m² construidos</span></div>
              <div className="spec"><i className="fa-solid fa-layer-group" /><span className="spec-num">{floors}</span><span className="spec-lbl">Plantas</span></div>
              <div className="spec"><i className="fa-solid fa-car" /><span className="spec-num">{garage}</span><span className="spec-lbl">Garaje</span></div>
              <div className="spec"><i className="fa-solid fa-calendar" /><span className="spec-num">{property.year}</span><span className="spec-lbl">Año</span></div>
            </div>

            <h3 className="sub-title">Descripción</h3>
            <div className="d-desc">
              {property.description
                ? <p>{property.description}</p>
                : <>
                  <p>Espectacular residencia de diseño contemporáneo emplazada en una de las zonas más exclusivas del valle. Acabados de primer nivel, luz natural en cada ambiente y una integración perfecta entre el espacio interior y el jardín privado.</p>
                  <p>La planta baja ofrece un gran salón con doble altura, cocina equipada estilo italiano, comedor formal y sala familiar abierta a la terraza con piscina climatizada. Conjunto privado con seguridad 24h, áreas verdes comunes y acceso controlado.</p>
                </>
              }
            </div>

            <h3 className="sub-title">Comodidades</h3>
            <div className="amenities">
              {[...amenitySet].map(feat => (
                <span key={feat} className="amen">
                  <i className={`fa-solid fa-${AMEN_ICONS[feat] || 'check'}`} /> {feat}
                </span>
              ))}
            </div>

            <h3 className="sub-title">Ubicación</h3>
            <PropertyMiniMap property={property} />
          </div>
        </div>

        {/* ASIDE */}
        <aside className="detail-aside">
          <AgentCard agent={{
             id: '1',
             user_id: 'c',
             full_name: 'Carlos Mendoza',
             phone: '+593 99 234 5678',
             email: 'c.mendoza@premier.ec',
             photo_url: 'https://picsum.photos/seed/agent-carlos/120/120',
             license_number: 'PE-4029',
             whatsapp: '59399234567',
             active: true,
             listings_count: 32,
             specialties: []
          }} />

          <button className="btn btn-primary block" style={{ marginTop: 16 }} onClick={() => setVisitOpen(true)}>
            <i className="fa-regular fa-calendar" /> Agendar visita
          </button>
          <button className="btn btn-outline block" style={{ marginTop: 8 }} onClick={handlePayment}>
            <i className="fa-solid fa-bolt" /> Reservar ahora
          </button>

          <div className="card" style={{ marginTop: 24, padding: 24, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: 16 }}>Solicitar información</h4>
            <LeadForm propertyId={property.id} agentId="1" />
          </div>

          <div className="quick-fact" style={{ marginTop: 24 }}>
            <div className="qf-row"><span className="muted">Código</span><strong>PE-{Number(property.id) + 1000}</strong></div>
            <div className="qf-row"><span className="muted">Publicado</span><strong>hace 4 días</strong></div>
            <div className="qf-row"><span className="muted">Visitas</span><strong>1.284</strong></div>
          </div>
        </aside>
      </div>

      {/* SIMILAR */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow gold">Otras opciones</span>
            <h2 className="section-title">Propiedades <em>similares</em></h2>
          </div>
        </div>
        <div className="grid-cards">
          {similarProps.map(p => <PropertyCard key={p.id} property={p} showBadge={false} />)}
        </div>
      </section>

      {visitOpen && (
        <VisitModal
          property={property}
          onClose={() => setVisitOpen(false)}
        />
      )}
    </div>
  )
}
