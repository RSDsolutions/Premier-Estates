import PropertyCard from '../property/PropertyCard'
import type { Property } from '../../types'

interface Props {
  properties: Property[]
  view?: 'grid' | 'list'
}

export default function PropertyGrid({ properties, view = 'grid' }: Props) {
  if (properties.length === 0) {
    return (
      <div className="empty-state">
        <i className="fa-regular fa-folder-open" />
        <h3>No se encontraron propiedades</h3>
        <p className="muted">Intenta ajustando los filtros de búsqueda.</p>
      </div>
    )
  }

  return (
    <div className={`grid-cards ${view === 'list' ? 'list-view' : ''}`}>
      {properties.map(p => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  )
}
