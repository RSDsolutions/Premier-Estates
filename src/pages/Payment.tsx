import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import toast from 'react-hot-toast'
import { stripePromise } from '../lib/stripe'
import { isStripeConfigured, supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAppStore } from '../store'
import { photoUrl } from '../lib/mockData'

const TOTAL = 1250

export default function Payment() {
  const { paymentProperty } = useAppStore()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (!isStripeConfigured() || !isSupabaseConfigured()) return
    supabase.functions.invoke('create-payment-intent', {
      body: { amount: TOTAL, property_id: paymentProperty?.id ?? null, description: `Listado destacado — ${paymentProperty?.title ?? 'Propiedad'}` },
    }).then(({ data }) => {
      if (data?.client_secret) setClientSecret(data.client_secret as string)
    })
  }, [paymentProperty])

  return (
    <div className="container">
      <Link to={paymentProperty ? `/propiedad/${paymentProperty.id}` : '/propiedades'} className="back-link">
        <i className="fa-solid fa-arrow-left" /> Volver
      </Link>
      <span className="eyebrow gold">Paso 1 de 2</span>
      <h1 className="page-title">Pago seguro</h1>
      <p className="muted">Completa los datos de tu tarjeta para reservar la visita y/o el listado destacado.</p>

      <div className="pay-layout">
        <div className="pay-main">
          {isStripeConfigured() && stripePromise && clientSecret
            ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#C9A84C' } } }}>
                <StripeForm />
              </Elements>
            )
            : <MockPaymentForm />
          }

          <div className="trust-grid" style={{ marginTop: 24 }}>
            <div><i className="fa-solid fa-shield-halved gold" /><span>Pago cifrado SSL 256-bit</span></div>
            <div><i className="fa-brands fa-cc-visa gold" /><span>Visa · Mastercard · Diners</span></div>
            <div><i className="fa-solid fa-rotate-left gold" /><span>Reembolso garantizado 7 días</span></div>
            <div><i className="fa-solid fa-headset gold" /><span>Soporte 24/7</span></div>
          </div>
        </div>

        <aside className="pay-aside">
          <div className="card summary">
            <h3>Resumen</h3>
            {paymentProperty && (
              <div className="sum-prop">
                <img src={photoUrl(paymentProperty.id, 200, 120)} alt={paymentProperty.title} />
                <div>
                  <strong>{paymentProperty.title}</strong>
                  <p className="muted">{paymentProperty.zone} · {paymentProperty.beds} hab · {paymentProperty.area} m²</p>
                </div>
              </div>
            )}
            <div className="sum-row"><span>Listado destacado (30 días)</span><span>$ 1.200,00</span></div>
            <div className="sum-row"><span>Servicio</span><span>$ 35,00</span></div>
            <div className="sum-row"><span>Impuestos</span><span>$ 15,00</span></div>
            <div className="sum-divider" />
            <div className="sum-row total"><span>Total</span><span className="gold">$ 1.250,00</span></div>
            <p className="muted sm">Al continuar, aceptas los <a className="link-gold-sm">Términos</a> y la <a className="link-gold-sm">Política de pagos</a>.</p>
          </div>
          <div className="aside-help">
            <i className="fa-solid fa-circle-question gold" />
            <div>
              <strong>¿Necesitas ayuda?</strong>
              <p className="muted">Llama al <a className="link-gold-sm">+593 2 600 1234</a> o escribe a soporte.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function StripeForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })
    if (error) {
      toast.error(error.message ?? 'Error en el pago')
    } else {
      toast.success('Pago procesado · redirigiendo a firma…')
      setTimeout(() => navigate('/firma'), 900)
    }
    setLoading(false)
  }

  return (
    <div className="card pay-card">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button className="btn btn-primary block" type="submit" disabled={loading} style={{ marginTop: 20 }}>
          <i className="fa-solid fa-lock" /> {loading ? 'Procesando...' : 'Pagar $ 1.250,00'}
        </button>
      </form>
    </div>
  )
}

function MockPaymentForm() {
  const navigate = useNavigate()
  const [card, setCard] = useState({ num: '', exp: '', cvv: '', name: '' })
  const [preview, setPreview] = useState({ num: '•••• •••• •••• ••••', name: 'NOMBRE APELLIDO', exp: 'MM/AA' })
  const [loading, setLoading] = useState(false)

  function formatCard(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    return digits.match(/.{1,4}/g)?.join(' ') ?? ''
  }

  function formatExp(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!card.num || !card.exp || !card.cvv || !card.name) {
      toast.error('Completa los datos de la tarjeta'); return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Pago procesado · redirigiendo a firma…')
    setTimeout(() => navigate('/firma'), 900)
    setLoading(false)
  }

  return (
    <div className="card pay-card">
      <div className="cc-preview">
        <div className="cc-brand"><i className="fa-brands fa-cc-visa" /></div>
        <div className="cc-chip" />
        <div className="cc-num">{preview.num}</div>
        <div className="cc-row">
          <div><div className="cc-lbl">Titular</div><div>{preview.name}</div></div>
          <div><div className="cc-lbl">Vence</div><div>{preview.exp}</div></div>
        </div>
      </div>

      <form className="pay-form" onSubmit={handleSubmit}>
        <label className="field full">
          <span>Número de tarjeta</span>
          <div className="input-icn">
            <i className="fa-regular fa-credit-card" />
            <input
              className="input"
              inputMode="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={card.num}
              onChange={e => {
                const formatted = formatCard(e.target.value)
                setCard(c => ({ ...c, num: formatted }))
                setPreview(p => ({ ...p, num: formatted.padEnd(19, '•') || '•••• •••• •••• ••••' }))
              }}
            />
          </div>
        </label>
        <label className="field">
          <span>Vencimiento</span>
          <input
            className="input"
            inputMode="numeric"
            maxLength={5}
            placeholder="MM/AA"
            value={card.exp}
            onChange={e => {
              const v = formatExp(e.target.value)
              setCard(c => ({ ...c, exp: v }))
              setPreview(p => ({ ...p, exp: v || 'MM/AA' }))
            }}
          />
        </label>
        <label className="field">
          <span>CVV</span>
          <input
            className="input"
            inputMode="numeric"
            maxLength={4}
            placeholder="123"
            value={card.cvv}
            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
          />
        </label>
        <label className="field full">
          <span>Nombre en la tarjeta</span>
          <input
            className="input"
            placeholder="Como aparece en la tarjeta"
            value={card.name}
            onChange={e => {
              setCard(c => ({ ...c, name: e.target.value }))
              setPreview(p => ({ ...p, name: e.target.value.toUpperCase() || 'NOMBRE APELLIDO' }))
            }}
          />
        </label>
        <div className="pay-actions">
          <button className="btn btn-primary block" type="submit" disabled={loading}>
            <i className="fa-solid fa-lock" /> {loading ? 'Procesando...' : 'Pagar $ 1.250,00'}
          </button>
        </div>
      </form>
    </div>
  )
}
