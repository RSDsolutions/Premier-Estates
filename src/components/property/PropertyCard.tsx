import { useNavigate } from 'react-router-dom'
import type { Property } from '../../types'
import { photoUrl, fmtPrice } from '../../lib/mockData'
import { useFavorites } from '../../hooks/useFavorites'

interface Props {
  property: Property
  showBadge?: boolean
}

export default function PropertyCard({ property: p, showBadge = true }: Props) {
  const navigate = useNavigate()
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(p.id)

  return (
    <article className="prop-card" onClick={() => navigate(`/propiedad/${p.id}`)}>
      <div className="pc-photo">
        <img src={photoUrl(p.id)} alt={p.title} loading="lazy" />
        <div className="pc-badges">
          {showBadge && p.featured && <span className="pc-badge">Destacado</span>}
          <span className="pc-tag">{p.type}</span>
          {p.operation === 'Arriendo' && <span className="pc-tag">Arriendo</span>}
        </div>
        <button
          className={`pc-fav${fav ? ' on' : ''}`}
          onClick={(e) => { e.stopPropagation(); void toggle(p.id) }}
          title={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <i className={`fa-${fav ? 'solid' : 'regular'} fa-heart`} />
        </button>
      </div>

      <div className="pc-body">
        <div className="pc-zone">
          <i className="fa-solid fa-location-dot" /> {p.zone}
        </div>
        <h3 className="pc-title">{p.title}</h3>
        <div className="pc-specs">
          {p.beds > 0 && <span><i className="fa-solid fa-bed" /> {p.beds}</span>}
          {p.baths > 0 && <span><i className="fa-solid fa-bath" /> {p.baths}</span>}
          <span><i className="fa-solid fa-vector-square" /> {p.area} m²</span>
        </div>
        <div className="pc-price">
          {p.operation === 'Arriendo'
            ? <><span>$ {p.price.toLocaleString('es-EC')}</span><small>/ mes</small></>
            : `$ ${p.price.toLocaleString('es-EC')}`
          }
        </div>
      </div>

      <div className="pc-cta">
        Ver detalles <i className="fa-solid fa-arrow-right" />
      </div>
    </article>
  )
}
