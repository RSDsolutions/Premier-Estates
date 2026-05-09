import { useForm } from 'react-hook-form'
import { useProperties } from '../../hooks/useProperties'
import type { Property } from '../../types'

interface Props {
  property: Property
  onClose: () => void
}

const AMENITY_OPTIONS = ['Piscina', 'Gimnasio', 'Garaje', 'Jardín', 'Terraza', 'Seguridad 24h', 'Amoblado', 'Chimenea', 'Pet friendly']

type FormData = {
  title: string
  description: string
  type: Property['type']
  zone: string
  address: string
  price: number
  operation: Property['operation']
  status: NonNullable<Property['status']>
  beds: number
  baths: number
  area: number
  year: number
  featured: boolean
  amenities: string[]
}

export default function EditPropertyModal({ property, onClose }: Props) {
  const { updateProperty } = useProperties()
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      title: property.title,
      description: property.description ?? '',
      type: property.type,
      zone: property.zone,
      address: property.address ?? '',
      price: property.price,
      operation: property.operation,
      status: property.status ?? 'active',
      beds: property.beds,
      baths: property.baths,
      area: property.area,
      year: property.year ?? new Date().getFullYear(),
      featured: property.featured ?? false,
      amenities: property.amenities ?? [],
    },
  })

  const watchedAmenities = watch('amenities') ?? []

  function toggleAmenity(amenity: string) {
    const current = watch('amenities') ?? []
    if (current.includes(amenity)) {
      setValue('amenities', current.filter(a => a !== amenity))
    } else {
      setValue('amenities', [...current, amenity])
    }
  }

  async function onSubmit(data: FormData) {
    const ok = await updateProperty(property.id, {
      ...data,
      price: Number(data.price),
      beds: Number(data.beds),
      baths: Number(data.baths),
      area: Number(data.area),
      year: Number(data.year),
      amenities: data.amenities ?? [],
    })
    if (ok !== false) onClose()
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-card lg">
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <span className="eyebrow gold">Editar publicación</span>
        <h2>Editar propiedad</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">

            {/* Título */}
            <label className="field full">
              <span>Título *</span>
              <input className="input" placeholder="Ej. Casa moderna en Cumbayá" {...register('title', { required: 'Requerido' })} />
              {errors.title && <small style={{ color: 'var(--err)' }}>{errors.title.message}</small>}
            </label>

            {/* Descripción */}
            <label className="field full">
              <span>Descripción</span>
              <textarea
                className="input"
                rows={3}
                placeholder="Describe la propiedad…"
                style={{ resize: 'vertical' }}
                {...register('description')}
              />
            </label>

            {/* Tipo + Operación */}
            <label className="field">
              <span>Tipo</span>
              <select className="select" {...register('type')}>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Oficina</option>
                <option>Local</option>
              </select>
            </label>
            <label className="field">
              <span>Operación</span>
              <select className="select" {...register('operation')}>
                <option>Venta</option>
                <option>Arriendo</option>
              </select>
            </label>

            {/* Zona + Estado */}
            <label className="field">
              <span>Zona</span>
              <select className="select" {...register('zone')}>
                <option>Cumbayá</option>
                <option>Quito Norte</option>
                <option>Valle de los Chillos</option>
                <option>La Carolina</option>
                <option>González Suárez</option>
                <option>Tumbaco</option>
              </select>
            </label>
            <label className="field">
              <span>Estado</span>
              <select className="select" {...register('status')}>
                <option value="active">Activo</option>
                <option value="sold">Vendido</option>
                <option value="rented">Arrendado</option>
                <option value="inactive">Inactivo</option>
              </select>
            </label>

            {/* Dirección */}
            <label className="field full">
              <span>Dirección</span>
              <input className="input" placeholder="Ej. Av. Interoceánica km 12, Cumbayá" {...register('address')} />
            </label>

            {/* Precio + Año */}
            <label className="field">
              <span>Precio (USD) *</span>
              <input className="input" type="number" {...register('price', { required: 'Requerido', min: 1 })} />
              {errors.price && <small style={{ color: 'var(--err)' }}>{errors.price.message}</small>}
            </label>
            <label className="field">
              <span>Año de construcción</span>
              <input className="input" type="number" {...register('year')} />
            </label>

            {/* Habitaciones + Baños + m² */}
            <label className="field">
              <span>Habitaciones</span>
              <input className="input" type="number" min={0} {...register('beds')} />
            </label>
            <label className="field">
              <span>Baños</span>
              <input className="input" type="number" min={0} {...register('baths')} />
            </label>
            <label className="field">
              <span>m² construidos</span>
              <input className="input" type="number" min={1} {...register('area')} />
            </label>

            {/* Destacada */}
            <label className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" {...register('featured')} style={{ width: 18, height: 18, cursor: 'pointer' }} />
              <span>Propiedad destacada</span>
            </label>

            {/* Amenidades */}
            <div className="field full">
              <span style={{ display: 'block', marginBottom: 10, fontSize: '0.85rem', color: 'var(--muted)' }}>Amenidades</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AMENITY_OPTIONS.map(amenity => {
                  const active = watchedAmenities.includes(amenity)
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
                        background: active ? 'var(--gold-dim)' : 'transparent',
                        color: active ? 'var(--gold)' : 'var(--muted)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        transition: 'all 0.15s',
                      }}
                    >
                      {amenity}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
