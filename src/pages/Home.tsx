import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/property/PropertyCard'
import PropertyMap from '../components/property/PropertyMap'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Property } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const { properties } = useProperties()
  const [search, setSearch] = useState({ type: '', zone: '', price: '', op: '' })
  const [aiProps, setAiProps] = useState<Property[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReasons, setAiReasons] = useState<Record<string, string>>({})
  const countersRef = useRef<HTMLDivElement>(null)
  const [counted, setCounted] = useState(false)

  const featured = properties.filter(p => p.featured).slice(0, 6)

  const fetchAI = useCallback(async (zone?: string, type?: string, budget?: number, operation?: string) => {
    setAiLoading(true)
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.functions.invoke('recommendations', {
          body: { zone: zone || undefined, type: type || undefined, budget: budget || undefined, operation: operation || undefined },
        })
        if (!error && data?.recommendations?.length) {
          setAiProps(data.recommendations as Property[])
          const reasons: Record<string, string> = {}
          ;(data.recommendations as Array<Property & { aiReason?: string }>).forEach(p => {
            if (p.aiReason) reasons[p.id] = p.aiReason
          })
          setAiReasons(reasons)
          return
        }
      }
    } catch { /* fall through to fallback */ }
    // Fallback: featured properties or random slice
    const fallback = properties.filter(p => p.featured).slice(0, 3)
    setAiProps(fallback.length >= 3 ? fallback : [...properties].sort(() => Math.random() - 0.5).slice(0, 3))
    setAiReasons({})
    setAiLoading(false)
  }, [properties])

  useEffect(() => {
    if (properties.length > 0 && aiProps.length === 0) {
      void fetchAI()
    }
  }, [properties, aiProps.length, fetchAI])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted) {
        setCounted(true)
        animateCounters()
      }
    })
    if (countersRef.current) observer.observe(countersRef.current)
    return () => observer.disconnect()
  }, [counted])

  function animateCounters() {
    document.querySelectorAll<HTMLSpanElement>('[data-count]').forEach(el => {
      const target = Number(el.dataset.count)
      let cur = 0
      const step = Math.max(1, Math.round(target / 40))
      const tick = () => {
        cur = Math.min(target, cur + step)
        el.textContent = cur.toLocaleString('es-EC')
        if (cur < target) requestAnimationFrame(tick)
      }
      tick()
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.type) params.set('tipo', search.type)
    if (search.zone) params.set('zona', search.zone)
    if (search.price) params.set('precioMax', search.price)
    if (search.op) params.set('op', search.op)
    navigate(`/propiedades?${params.toString()}`)
  }

  function refreshAI() {
    void fetchAI(search.zone, search.type, search.price ? Number(search.price) : undefined, search.op)
  }

  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&h=1000&fit=crop&auto=format&q=80')" }}
        />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <span className="eyebrow gold">Bienvenido a Premier Estates</span>
          <h1 className="hero-title">Encuentra la propiedad <em>de tus sueños</em></h1>
          <p className="hero-sub">Miles de propiedades exclusivas en las mejores zonas. Curadas con un estándar de lujo.</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="sb-field">
              <label>Tipo</label>
              <select value={search.type} onChange={e => setSearch(s => ({ ...s, type: e.target.value }))}>
                <option value="">Todos</option>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Oficina</option>
                <option>Local</option>
              </select>
            </div>
            <div className="sb-field">
              <label>Zona</label>
              <select value={search.zone} onChange={e => setSearch(s => ({ ...s, zone: e.target.value }))}>
                <option value="">Todas las zonas</option>
                <option>Cumbayá</option>
                <option>Quito Norte</option>
                <option>Valle de los Chillos</option>
                <option>La Carolina</option>
                <option>González Suárez</option>
                <option>Tumbaco</option>
              </select>
            </div>
            <div className="sb-field">
              <label>Precio máx.</label>
              <input
                type="number"
                placeholder="$ 500.000"
                min="0"
                step="1000"
                value={search.price}
                onChange={e => setSearch(s => ({ ...s, price: e.target.value }))}
              />
            </div>
            <div className="sb-field">
              <label>Operación</label>
              <select value={search.op} onChange={e => setSearch(s => ({ ...s, op: e.target.value }))}>
                <option value="">Cualquiera</option>
                <option>Venta</option>
                <option>Arriendo</option>
              </select>
            </div>
            <button className="btn btn-primary sb-btn" type="submit">
              <i className="fa-solid fa-magnifying-glass" /> Buscar
            </button>
          </form>
        </div>
      </div>

      {/* STATS */}
      <section className="stats-bar container" ref={countersRef}>
        <div className="stat">
          <div className="stat-num"><span data-count="1200">1.200</span><span className="gold">+</span></div>
          <div className="stat-label">Propiedades</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-num"><span data-count="850">850</span><span className="gold">+</span></div>
          <div className="stat-label">Clientes satisfechos</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-num"><span data-count="12">12</span></div>
          <div className="stat-label">Años de experiencia</div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow gold">Selección curada</span>
            <h2 className="section-title">Propiedades <em>destacadas</em></h2>
          </div>
          <Link className="link-gold" to="/propiedades">
            Ver todas <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
        <div className="grid-cards">
          {featured.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      {/* MAP */}
      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow gold">Mapa interactivo</span>
            <h2 className="section-title">Propiedades <em>por zona</em></h2>
          </div>
        </div>
        <PropertyMap properties={properties} />
      </section>

      {/* AI RECOMMENDATIONS */}
      <section className="container section">
        <div className="ai-banner">
          <div className="ai-head">
            <div className="ai-icon"><i className="fa-solid fa-wand-magic-sparkles" /></div>
            <div>
              <span className="eyebrow gold">Recomendado para ti</span>
              <h3>Basado en tus búsquedas, estas propiedades podrían interesarte</h3>
            </div>
            <button className="btn btn-ghost ai-refresh" onClick={refreshAI} disabled={aiLoading}>
              <i className={`fa-solid ${aiLoading ? 'fa-spinner fa-spin' : 'fa-rotate'}`} />
              {aiLoading ? 'Analizando…' : 'Actualizar'}
            </button>
          </div>
          <div className="ai-strip">
            {aiLoading
              ? [1, 2, 3].map(i => <div key={i} className="prop-card skeleton" style={{ minHeight: 320 }} />)
              : aiProps.map(p => (
                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <PropertyCard property={p} showBadge={false} />
                  {aiReasons[p.id] && (
                    <div className="ai-reason">
                      <i className="fa-solid fa-wand-magic-sparkles gold" style={{ fontSize: 11 }} />
                      <span>{aiReasons[p.id]}</span>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </>
  )
}
