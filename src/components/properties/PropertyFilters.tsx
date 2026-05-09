import type { SearchFilters } from '../../types'

interface Props {
  filters: Partial<SearchFilters>
  setFilters: (f: Partial<SearchFilters>) => void
}

export default function PropertyFilters({ filters, setFilters }: Props) {
  const update = (key: keyof SearchFilters, val: any) => {
    setFilters({ ...filters, [key]: val })
  }

  return (
    <div className="filters-side">
      <div className="filters-head">
        <h3>Filtros</h3>
        <button className="link-gold-sm" onClick={() => setFilters({})}>Limpiar</button>
      </div>
      
      <div className="filter-block">
        <label className="filter-label">Búsqueda rápida</label>
        <div className="search-input" style={{ minWidth: 0, width: '100%' }}>
          <i className="fa-solid fa-magnifying-glass" />
          <input 
             type="text" 
             placeholder="Título o zona..." 
             autoComplete="off"
             onChange={e => update('zone', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label">Operación</label>
        <div className="chip-group">
          {['', 'Venta', 'Arriendo'].map(val => (
            <button
              key={val}
              className={`chip ${filters.operation === val ? 'active' : ''}`}
              onClick={() => update('operation', val || undefined)}
            >
              {val === 'Venta' ? 'Comprar' : val === 'Arriendo' ? 'Alquilar' : 'Cualquiera'}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label">Tipo de inmueble</label>
        <div className="chip-group">
          {['', 'Casa', 'Departamento', 'Oficina', 'Local'].map(val => (
            <button
              key={val}
              className={`chip ${filters.type === val ? 'active' : ''}`}
              onClick={() => update('type', val || undefined)}
            >
              {val || 'Cualquiera'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-block">
        <label className="filter-label">Rango de Precio</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <span className="sm muted" style={{ display: 'block', marginBottom: 4 }}>Mínimo</span>
            <input type="number" className="input" placeholder="0" value={filters.minPrice || ''} onChange={e => update('minPrice', Number(e.target.value) || 0)} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="sm muted" style={{ display: 'block', marginBottom: 4 }}>Máximo</span>
            <input type="number" className="input" placeholder="Sin límite" value={filters.maxPrice || ''} onChange={e => update('maxPrice', Number(e.target.value) || undefined)} />
          </div>
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label">Habitaciones</label>
        <div className="chip-group">
          {[0, 1, 2, 3, 4].map(n => (
            <button 
               key={n} 
               className={`chip ${Number(filters.beds || 0) === n ? 'active' : ''}`}
               onClick={() => update('beds', n === 0 ? undefined : n)}
            >{n === 0 ? 'Cualquiera' : `${n}+`}</button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label">Baños</label>
        <div className="chip-group">
          {[0, 1, 2, 3, 4].map(n => (
            <button 
               key={n} 
               className={`chip ${Number(filters.baths || 0) === n ? 'active' : ''}`}
               onClick={() => update('baths', n === 0 ? undefined : n)}
            >{n === 0 ? 'Cualquiera' : `${n}+`}</button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label">Características Principales</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px' }}>
          {['Piscina', 'Seguridad 24h', 'Garaje', 'Jardín', 'Gimnasio', 'Terraza', 'Pet friendly', 'Amoblado'].map(feat => {
            const isChecked = (filters.features || []).includes(feat)
            return (
              <label key={feat} className="check" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    const current = filters.features || []
                    const next = e.target.checked ? [...current, feat] : current.filter(f => f !== feat)
                    update('features', next)
                  }}
                  style={{ accentColor: 'var(--gold)' }}
                />
                <span className="sm">{feat}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label">Superficie mínima</label>
        <div className="search-input" style={{ minWidth: 0, width: '100%' }}>
          <input 
            type="number" 
            className="input" 
            placeholder="m²" 
            value={filters.minArea || ''} 
            onChange={e => update('minArea', Number(e.target.value) || 0)} 
          />
        </div>
      </div>
    </div>
  )
}
