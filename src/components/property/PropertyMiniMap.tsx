import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import type { Property } from '../../types'
import { isMapsConfigured } from '../../lib/supabase'

const ZONE_CENTERS: Record<string, { lat: number; lng: number }> = {
  'Quito Norte':          { lat: -0.130, lng: -78.488 },
  'La Carolina':          { lat: -0.175, lng: -78.483 },
  'González Suárez':      { lat: -0.209, lng: -78.485 },
  'Cumbayá':              { lat: -0.197, lng: -78.428 },
  'Tumbaco':              { lat: -0.222, lng: -78.405 },
  'Valle de los Chillos': { lat: -0.318, lng: -78.447 },
}

interface Props {
  property: Property
}

export default function PropertyMiniMap({ property }: Props) {
  const center = property.location
    ? { lat: property.location.lat, lng: property.location.lng }
    : ZONE_CENTERS[property.zone] ?? { lat: -0.210, lng: -78.458 }

  if (!isMapsConfigured()) {
    return (
      <div className="mini-map">
        <div className="mini-map-grid" />
        <div className="mini-pin"><i className="fa-solid fa-location-dot" /></div>
        <div className="mini-map-label">{property.zone}, Quito</div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
      <div style={{ height: 300, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <Map
          mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string}
          defaultCenter={center}
          defaultZoom={15}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={true}
          fullscreenControl={true}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <AdvancedMarker position={center}>
            <div className="gmap-pin featured">
              <span className="gmap-pin-price">
                {property.operation === 'Arriendo'
                  ? `$${property.price.toLocaleString('es-EC')}/mes`
                  : `$${Math.round(property.price / 1000)}k`}
              </span>
              <div className="gmap-pin-tip" />
            </div>
          </AdvancedMarker>
        </Map>
      </div>
      <p className="muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>
        <i className="fa-solid fa-location-dot gold" /> {property.address ?? property.zone}, Quito · Ecuador
      </p>
    </APIProvider>
  )
}
