import { useForm } from 'react-hook-form'
import { useProperties } from '../../hooks/useProperties'
import type { Property } from '../../types'

interface Props { onClose: () => void }

type FormData = {
  title: string
  type: Property['type']
  zone: string
  price: number
  operation: Property['operation']
  beds: number
  baths: number
  area: number
}

export default function AddPropertyModal({ onClose }: Props) {
  const { createProperty } = useProperties()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { type: 'Casa', zone: 'Cumbayá', operation: 'Venta', beds: 3, baths: 2, area: 180 }
  })

  async function onSubmit(data: FormData) {
    await createProperty({
      ...data,
      price: Number(data.price),
      beds: Number(data.beds),
      baths: Number(data.baths),
      area: Number(data.area),
      year: 2024,
      featured: false,
      amenities: [],
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
        <span className="eyebrow gold">Nueva publicación</span>
        <h2>Agregar propiedad</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <label className="field full">
              <span>Título</span>
              <input className="input" placeholder="Ej. Casa moderna en Cumbayá" {...register('title', { required: true })} />
              {errors.title && <small style={{ color: 'var(--err)' }}>Requerido</small>}
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
          </div>
          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Publicar propiedad</button>
          </div>
        </form>
      </div>
    </div>
  )
}
