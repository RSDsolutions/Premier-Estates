import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAppStore } from '../../store'
import type { Property } from '../../types'

interface Props {
  property: Property
  onClose: () => void
}

interface FormData {
  date: string
  name: string
  phone: string
  notes: string
}

const defaultDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
const SLOTS = ['09:00', '11:00', '15:00', '17:00']

export default function VisitModal({ property, onClose }: Props) {
  const { user } = useAppStore()
  const [slot, setSlot] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { date: defaultDate }
  })

  async function onSubmit(data: FormData) {
    if (!slot) { toast.error('Selecciona una hora'); return }
    setLoading(true)

    if (isSupabaseConfigured() && user) {
      await supabase.from('visits').insert({
        property_id: property.id,
        user_id: user.id,
        visit_date: data.date,
        visit_time: slot,
        notes: data.notes || null,
      })
    }

    toast.success('Visita agendada · Carlos te contactará en breve')
    onClose()
    setLoading(false)
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <span className="eyebrow gold">Reserva tu visita</span>
        <h2>Agendar visita</h2>
        <p className="muted">Selecciona la fecha y hora. Carlos confirmará en menos de 1 hora.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <label className="field">
              <span>Fecha</span>
              <input className="input" type="date" {...register('date', { required: true })} />
            </label>
            <label className="field">
              <span>Tu nombre</span>
              <input className="input" placeholder="Nombre completo" {...register('name', { required: true })} />
              {errors.name && <small style={{ color: 'var(--err)' }}>Requerido</small>}
            </label>
            <label className="field">
              <span>Teléfono / WhatsApp</span>
              <input className="input" placeholder="+593 99 ..." inputMode="tel" {...register('phone', { required: true })} />
              {errors.phone && <small style={{ color: 'var(--err)' }}>Requerido</small>}
            </label>
            <div className="field full">
              <span>Hora</span>
              <div className="slot-grid">
                {SLOTS.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`slot${slot === s ? ' active' : ''}`}
                    onClick={() => setSlot(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <label className="field full">
              <span>Mensaje (opcional)</span>
              <textarea className="input" rows={3} placeholder="Cuéntale a Carlos qué te interesa…" {...register('notes')} />
            </label>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Agendando...' : 'Confirmar visita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
