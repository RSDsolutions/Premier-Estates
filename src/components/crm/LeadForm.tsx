import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Mensaje muy corto')
})
type LeadFormData = z.infer<typeof schema>

export default function LeadForm({ propertyId, agentId }: { propertyId?: string, agentId?: string }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(schema)
  })

  async function sendLead(data: LeadFormData) {
    setLoading(true)
    const { error } = await supabase.from('leads').insert({
      ...data,
      property_id: propertyId,
      agent_id: agentId,
      source: 'web'
    })
    
    if (error) {
      toast.error('Error al enviar el mensaje')
    } else {
      toast.success('Mensaje enviado exitosamente')
      reset()
    }
    setLoading(false)
  }

  return (
    <form className="pay-form" onSubmit={handleSubmit(sendLead)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label className="field full">
        <span>Nombre completo</span>
        <input className="input" placeholder="Tu nombre" {...register('name')} />
        {errors.name && <small style={{ color: 'var(--err)' }}>{errors.name.message}</small>}
      </label>
      <label className="field full">
        <span>Correo electrónico</span>
        <input className="input" type="email" placeholder="tu@correo.com" {...register('email')} />
        {errors.email && <small style={{ color: 'var(--err)' }}>{errors.email.message}</small>}
      </label>
      <label className="field full">
        <span>Teléfono (opcional)</span>
        <input className="input" placeholder="+123..." {...register('phone')} />
      </label>
      <label className="field full">
        <span>Mensaje</span>
        <textarea className="input" rows={3} placeholder="Me interesa esta propiedad..." {...register('message')} />
        {errors.message && <small style={{ color: 'var(--err)' }}>{errors.message.message}</small>}
      </label>
      <button className="btn btn-primary block" type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Pedir Información'}
      </button>
    </form>
  )
}
