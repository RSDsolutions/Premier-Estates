import { useForm } from 'react-hook-form'
import { useProperties } from '../../hooks/useProperties'
import type { Property } from '../../types'

interface Props {
  property: Property
  onClose: () => void
}

type FormData = {
  title: string
  type: Property['type']
  zone: string
  price: number
  operation: Property['operation']
  beds: number
  baths: number
  area: number
  description: string
  featured: boolean
}

export default function EditPropertyModal({ property, onClose }: Props) {
  const { updateProperty } = useProperties()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      title: property.title,
      type: property.type,
      zone: property.zone,
      price: property.price,
      operation: property.operation,
      beds: property.beds,
      baths: property.baths,
      area: property.area,
      description: property.description ?? '',
      featured: property.featured ?? false,
    },
  })

  async function onSubmit(data: FormData) {
    await updateProperty(property.id, {
      ...data,
      price: Number(data.price),
      beds: Number(data.beds),
      baths: Number(data.baths),
      area: Number(data.area),
    })
    onClose()
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
            <label className="field full">
              <span>Título</span>
              <input className="input" placeholder="Ej. Casa moderna en Cumbayá" {...register('title', { required: true })} />
              {errors.title && <small style={{ color: 'var(--err)' }}>Requerido</small>}
            </label>
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
            <label className="field">
              <span>Tipo</span>
              <select className="select" {...register('type')}>
                <option>Casa</option><option>Departamento</option><option>Oficina</option><option>Local</option>
              </select>
            </label>
            <label className="field">
              <span>Zona</span>
              <select className="select" {...register('zone')}>
                <option>Cumbayá</option><option>Quito Norte</option><option>Valle de los Chillos</option>
                <option>La Carolina</option><option>González Suárez</option><option>Tumbaco</option>
              </select>
            </label>
            <label className="field">
              <span>Precio (USD)</span>
              <input className="input" type="number" placeholder="285000" {...register('price', { required: true })} />
            </label>
            <label className="field">
              <span>Operación</span>
              <select className="select" {...register('operation')}>
                <option>Venta</option><option>Arriendo</option>
              </select>
            </label>
            <label className="field">
              <span>Habitaciones</span>
              <input className="input" type="number" {...register('beds')} />
            </label>
            <label className="field">
              <span>Baños</span>
              <input className="input" type="number" {...register('baths')} />
            </label>
            <label className="field">
              <span>m² construidos</span>
              <input className="input" type="number" {...register('area')} />
            </label>
            <label className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" {...register('featured')} style={{ width: 18, height: 18 }} />
              <span>Propiedad destacada</span>
            </label>
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
