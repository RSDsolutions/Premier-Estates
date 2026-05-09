import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps'
import type { Property } from '../../types'
import { isMapsConfigured } from '../../lib/supabase'
import { fmtPrice, photoUrl } from '../../lib/mockData'

// Real coordinates for each zone center in Quito
const ZONE_CENTERS: Record<string, google.maps.LatLngLiteral> = {
  'Quito Norte':           { lat: -0.130, lng: -78.488 },
  'La Carolina':           { lat: -0.175, lng: -78.483 },
  'González Suárez':       { lat: -0.209, lng: -78.485 },
  'Cumbayá':               { lat: -0.197, lng: -78.428 },
  'Tumbaco':               { lat: -0.222, lng: -78.405 },
  'Valle de los Chillos':  { lat: -0.318, lng: -78.447 },
}

const QUITO_CENTER = { lat: -0.210, lng: -78.458 }

const ALL_ZONES = Object.keys(ZONE_CENTERS)

// CSS-only mock map zone positions (fallback)
const ZONE_POSITIONS: Record<string, { x: number; y: number }> = {
  'Quito Norte':           { x: 30, y: 30 },
  'La Carolina':           { x: 42, y: 42 },
  'González Suárez':       { x: 48, y: 48 },
  'Cumbayá':               { x: 74, y: 55 },
  'Tumbaco':               { x: 82, y: 50 },
  'Valle de los Chillos':  { x: 62, y: 78 },
}

function getPosition(p: Property): google.maps.LatLngLiteral {
  if (p.location) return { lat: p.location.lat, lng: p.location.lng }
  return ZONE_CENTERS[p.zone] ?? QUITO_CENTER
}

function formatShortPrice(p: Property): string {
  if (p.operation === 'Arriendo') return `$${(p.price / 1000).toFixed(1)}k/m`
  return p.price >= 1000000
    ? `$${(p.price / 1000000).toFixed(1)}M`
    : `$${Math.round(p.price / 1000)}k`
}

interface Props {
  properties: Property[]
  onZoneFilter?: (zone: string) => void
}

export default function PropertyMap({ properties, onZoneFilter }: Props) {
  const [activeZone, setActiveZone] = useState('')

  const handleZone = (zone: string) => {
    setActiveZone(zone)
    onZoneFilter?.(zone)
  }

  const visible = activeZone
    ? properties.filter(p => p.zone === activeZone)
    : properties

  if (isMapsConfigured()) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
    return (
      <div className="map-card">
        <APIProvider apiKey={apiKey}>
          <div style={{ height: 460, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <GoogleMapsView properties={visible} activeZone={activeZone} />
          </div>
        </APIProvider>
        <ZonePills activeZone={activeZone} onChange={handleZone} counts={properties} />
      </div>
    )
  }

  return (
    <div className="map-card">
      <MockMapView properties={visible} onNavigate={handleZone} />
      <ZonePills activeZone={activeZone} onChange={handleZone} counts={properties} />
    </div>
  )
}

// ─── Google Maps component ───────────────────────────────────────────────────

function GoogleMapsView({ properties, activeZone }: { properties: Property[]; activeZone: string }) {
  const navigate = useNavigate()
  const map = useMap()
  const [selected, setSelected] = useState<Property | null>(null)

  // Pan to zone center when filter changes
  useEffect(() => {
    if (!map) return
    if (activeZone && ZONE_CENTERS[activeZone]) {
      map.panTo(ZONE_CENTERS[activeZone])
      map.setZoom(14)
    } else {
      map.panTo(QUITO_CENTER)
      map.setZoom(12)
    }
  }, [map, activeZone])

  return (
    <Map
      defaultCenter={QUITO_CENTER}
      defaultZoom={12}
      mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string}
      gestureHandling="greedy"
      disableDefaultUI={false}
      zoomControl
      streetViewControl={false}
      mapTypeControl={false}
      fullscreenControl={false}
    >
      {properties.map(p => (
        <AdvancedMarker
          key={p.id}
          position={getPosition(p)}
          onClick={() => setSelected(prev => prev?.id === p.id ? null : p)}
        >
          <div
            className={`gmap-pin${selected?.id === p.id ? ' active' : ''}${p.featured ? ' featured' : ''}`}
            title={p.title}
          >
            <span className="gmap-pin-price">{formatShortPrice(p)}</span>
            <span className="gmap-pin-tip" />
          </div>
        </AdvancedMarker>
      ))}

      {selected && (
        <InfoWindow
          position={getPosition(selected)}
          onCloseClick={() => setSelected(null)}
          pixelOffset={[0, -48]}
        >
          <div className="gmap-info">
            <img
              src={photoUrl(selected.id, 280, 160)}
              alt={selected.title}
              className="gmap-info-img"
            />
            <div className="gmap-info-body">
              <span className="gmap-info-type">{selected.type} · {selected.zone}</span>
              <strong className="gmap-info-title">{selected.title}</strong>
              <span className="gmap-info-price">{fmtPrice(selected)}</span>
              <div className="gmap-info-specs">
                {selected.beds > 0 && <span><i className="fa-solid fa-bed" /> {selected.beds}</span>}
                <span><i className="fa-solid fa-bath" /> {selected.baths}</span>
                <span><i className="fa-solid fa-ruler-combined" /> {selected.area} m²</span>
              </div>
              <button
                className="gmap-info-btn"
                onClick={() => navigate(`/propiedad/${selected.id}`)}
              >
                Ver propiedad <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </Map>
  )
}

// ─── CSS fallback map ────────────────────────────────────────────────────────

function MockMapView({ properties, onNavigate }: { properties: Property[]; onNavigate: (zone: string) => void }) {
  const navigate = useNavigate()
  return (
    <div className="map" id="mapCanvas">
      {ALL_ZONES.map((zone) => {
        const count = properties.filter(p => p.zone === zone).length
        const pos = ZONE_POSITIONS[zone]
        return (
          <div
            key={zone}
            className="map-pin"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            title={zone}
            onClick={() => {
              onNavigate(zone)
              navigate(`/propiedades?zona=${encodeURIComponent(zone)}`)
            }}
          >
            <span className="mp-dot"><i className="fa-solid fa-house-chimney" /></span>
            <span className="mp-count">{zone} · {count}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Zone filter pills ───────────────────────────────────────────────────────

function ZonePills({ activeZone, onChange, counts }: {
  activeZone: string
  onChange: (zone: string) => void
  counts: Property[]
}) {
  return (
    <div className="zone-pills">
      <button
        className={`pill${activeZone === '' ? ' active' : ''}`}
        onClick={() => onChange('')}
      >
        Todas <span className="pill-count">{counts.length}</span>
      </button>
      {ALL_ZONES.map(zone => {
        const n = counts.filter(p => p.zone === zone).length
        return (
          <button
            key={zone}
            className={`pill${activeZone === zone ? ' active' : ''}`}
            onClick={() => onChange(zone)}
          >
            {zone} <span className="pill-count">{n}</span>
          </button>
        )
      })}
    </div>
  )
}

