import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/property/PropertyCard'
import PropertyGrid from '../components/properties/PropertyGrid'
import PropertyFilters from '../components/properties/PropertyFilters'
import type { SearchFilters } from '../types'

const INITIAL_FILTERS: SearchFilters = {
  type: '', zone: '', operation: '', minPrice: 0, maxPrice: 10000000,
  beds: '', baths: '', minArea: 0, features: [], sort: 'recent',
}

export default function Listings() {
  const { properties, filterProperties } = useProperties()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<SearchFilters>({
    ...INITIAL_FILTERS,
    type: searchParams.get('tipo') || '',
    zone: searchParams.get('zona') || '',
    operation: searchParams.get('op') || '',
    beds: searchParams.get('habitaciones') || '',
    baths: searchParams.get('banos') || '',
    minPrice: Number(searchParams.get('precioMin')) || 0,
    maxPrice: searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : 10000000,
    minArea: Number(searchParams.get('areaMin')) || 0,
    features: searchParams.get('features') ? searchParams.get('features')!.split(',') : [],
  })
  const [listMode, setListMode] = useState<'grid' | 'list'>('grid')

  const results = filterProperties(filters)

  function setFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters(f => ({ ...f, [key]: value }))
  }

  function updateFiltersFromComponent(f: Partial<SearchFilters>) {
     setFilters(f as SearchFilters)
     
     const params = new URLSearchParams()
     if (f.zone) params.set('zona', f.zone)
     if (f.operation) params.set('op', f.operation)
     if (f.type) params.set('tipo', f.type)
     if (f.beds) params.set('habitaciones', String(f.beds))
     if (f.baths) params.set('banos', String(f.baths))
     if (f.minPrice && f.minPrice > 0) params.set('precioMin', String(f.minPrice))
     if (f.maxPrice && f.maxPrice < 10000000) params.set('precioMax', String(f.maxPrice))
     if (f.minArea && f.minArea > 0) params.set('areaMin', String(f.minArea))
     if (f.features && f.features.length > 0) params.set('features', f.features.join(','))
     
     setSearchParams(params, { replace: true })
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS)
  }

  return (
    <div className="listings-layout">
      {/* SIDEBAR FILTERS */}
      <PropertyFilters filters={filters} setFilters={updateFiltersFromComponent} />

      {/* RESULTS */}
      <section className="listings-main">
        <div className="results-head">
          <div>
            <h2 className="section-title sm">
              <span>{results.length}</span> propiedades encontradas
            </h2>
            <p className="muted">Mostrando los mejores resultados según tus filtros</p>
          </div>
          <div className="results-tools">
            <div className="view-toggle">
              <button
                className={`vt${listMode === 'grid' ? ' active' : ''}`}
                title="Grid"
                onClick={() => setListMode('grid')}
              >
                <i className="fa-solid fa-grip" />
              </button>
              <button
                className={`vt${listMode === 'list' ? ' active' : ''}`}
                title="Lista"
                onClick={() => setListMode('list')}
              >
                <i className="fa-solid fa-list" />
              </button>
            </div>
            <select
              className="select"
              value={filters.sort}
              onChange={e => setFilter('sort', e.target.value as SearchFilters['sort'])}
            >
              <option value="recent">Más recientes</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <PropertyGrid properties={results} view={listMode} />

        {results.length > 0 && (
          <div className="pagination">
            <button className="page-btn"><i className="fa-solid fa-chevron-left" /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">…</span>
            <button className="page-btn"><i className="fa-solid fa-chevron-right" /></button>
          </div>
        )}
      </section>
    </div>
  )
}
