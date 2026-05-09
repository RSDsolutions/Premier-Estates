import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: 'Consulta general' })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Completa los campos requeridos')
      return
    }
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Mensaje enviado. Te contactaremos pronto.')
    setForm({ name: '', email: '', phone: '', message: '', type: 'Consulta general' })
    setSending(false)
  }

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
        <span className="eyebrow gold">Contáctanos</span>
        <h1 className="page-title" style={{ marginBottom: 12 }}>Estamos para <em>ayudarte</em></h1>
        <p className="muted">Nuestro equipo de asesores está disponible de lunes a sábado, de 9:00 a 18:00. Respuesta en menos de 2 horas.</p>
      </div>

      <div className="pay-layout" style={{ alignItems: 'flex-start' }}>
        {/* FORM */}
        <div className="pay-main">
          <div className="card pay-card">
            <h3 style={{ marginBottom: 24 }}>Envíanos un mensaje</h3>
            <form className="pay-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Nombre completo *</span>
                <input className="input" placeholder="Tu nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </label>
              <label className="field">
                <span>Correo electrónico *</span>
                <input className="input" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </label>
              <label className="field">
                <span>Teléfono (opcional)</span>
                <input className="input" type="tel" placeholder="+593 99 000 0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </label>
              <label className="field full">
                <span>Tipo de consulta</span>
                <select className="select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option>Consulta general</option>
                  <option>Compra de propiedad</option>
                  <option>Arriendo</option>
                  <option>Publicar una propiedad</option>
                  <option>Inversión</option>
                </select>
              </label>
              <label className="field full">
                <span>Mensaje *</span>
                <textarea
                  className="input"
                  rows={5}
                  placeholder="Cuéntanos en qué podemos ayudarte…"
                  style={{ resize: 'vertical' }}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </label>
              <div className="pay-actions">
                <button className="btn btn-primary block" type="submit" disabled={sending}>
                  <i className="fa-solid fa-paper-plane" /> {sending ? 'Enviando…' : 'Enviar mensaje'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ASIDE INFO */}
        <aside className="pay-aside">
          <div className="card summary">
            <h3>Información de contacto</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
              {[
                { icon: 'fa-phone', label: 'Teléfono', value: '+593 2 600 1234' },
                { icon: 'fa-envelope', label: 'Email', value: 'info@premierestates.ec' },
                { icon: 'fa-whatsapp brands', label: 'WhatsApp', value: '+593 99 123 4567' },
                { icon: 'fa-location-dot', label: 'Oficina', value: 'Av. González Suárez N27-55, Quito' },
                { icon: 'fa-clock', label: 'Horario', value: 'Lun – Sáb · 9:00 – 18:00' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <i className={`fa-${item.icon} gold`} style={{ marginTop: 2, width: 18, textAlign: 'center' }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: '0.95rem' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card summary" style={{ marginTop: 0 }}>
            <h3>Zonas que cubrimos</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {['Cumbayá', 'González Suárez', 'La Carolina', 'Quito Norte', 'Valle de los Chillos', 'Tumbaco'].map(z => (
                <span key={z} className="badge ok" style={{ fontSize: '0.8rem' }}>{z}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
