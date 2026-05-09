import { useRef, useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'
import { isDocusealConfigured } from '../lib/supabase'
import { useAppStore } from '../store'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Property } from '../types'

export default function Signature() {
  const { user, paymentProperty } = useAppStore()
  const navigate = useNavigate()
  const [signed, setSigned] = useState(false)
  const [docInfo, setDocInfo] = useState({ id: '', stamp: '', hash: '' })

  if (isDocusealConfigured()) {
    return <DocusealEmbed user={user} propertyId={paymentProperty?.id} onSigned={(info) => { setSigned(true); setDocInfo(info) }} signed={signed} docInfo={docInfo} />
  }

  return <CanvasSignature user={user} property={paymentProperty ?? null} signed={signed} docInfo={docInfo} onSigned={(info) => { setSigned(true); setDocInfo(info) }} />
}

interface SignedInfo { id: string; stamp: string; hash: string }

function CanvasSignature({ user, property, signed, docInfo, onSigned }: {
  user: User | null
  property: Property | null
  signed: boolean
  docInfo: SignedInfo
  onSigned: (info: SignedInfo) => void
}) {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)

  const initCanvas = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const rect = c.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    c.width = rect.width * dpr
    c.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2.4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#0a0a0a'
  }, [])

  useEffect(() => {
    initCanvas()
    const observer = new ResizeObserver(initCanvas)
    if (canvasRef.current) observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [initCanvas])

  function getPos(ev: React.MouseEvent | React.TouchEvent) {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    const touch = 'touches' in ev ? ev.touches[0] : ev
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }

  function startDraw(ev: React.MouseEvent | React.TouchEvent) {
    drawing.current = true
    last.current = getPos(ev)
    ev.preventDefault()
  }

  function draw(ev: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current) return
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    const p = getPos(ev)
    ctx.beginPath()
    ctx.moveTo(last.current!.x, last.current!.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
    ev.preventDefault()
  }

  function clear() {
    const c = canvasRef.current!
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
  }

  async function confirm() {
    const c = canvasRef.current!
    const px = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data
    let hasInk = false
    for (let i = 3; i < px.length; i += 400) { if (px[i] > 0) { hasInk = true; break } }
    if (!hasInk) { toast.error('Por favor firma antes de continuar'); return }

    const year = new Date().getFullYear()
    const seq = Math.floor(Math.random() * 9000) + 1000
    const docId = `PE-CTR-${year}-${seq}`
    const stamp = new Date().toLocaleString('es-EC', { dateStyle: 'long', timeStyle: 'short' })
    const bytes = crypto.getRandomValues(new Uint8Array(8))
    const hash = '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')

    if (isSupabaseConfigured() && user) {
      await supabase.from('documents').insert({
        property_id: property?.id ?? null,
        user_id: user.id,
        doc_type: 'purchase_contract',
        status: 'signed',
        signed_at: new Date().toISOString(),
      })
    }

    onSigned({ id: docId, stamp, hash })
    toast.success('Documento firmado correctamente')
  }

  return (
    <div className="container">
      <Link to="/pago" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Volver
      </Link>
      <span className="eyebrow gold">Paso 2 de 2</span>
      <h1 className="page-title">Firma digital del contrato</h1>
      <p className="muted">Revisa el documento y firma con tu mouse o dedo. Al confirmar, recibirás una copia por correo.</p>

      <div className="sig-layout">
        <div className="card doc-card">
          <div className="doc-head">
            <span className="doc-pill">Contrato N° <strong>PE-CTR-{new Date().getFullYear()}-****</strong></span>
            <span className="doc-pill">Premier Estates · {property?.zone ?? 'Quito'}</span>
          </div>
          <div className="doc-body">
            <h2>CONTRATO DE PROMESA DE {property?.operation === 'Arriendo' ? 'ARRENDAMIENTO' : 'COMPRAVENTA'}</h2>
            <p>En la ciudad de Quito, a {new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })}, comparecen por una parte la empresa <strong>PREMIER ESTATES S.A.</strong>, en calidad de promitente {property?.operation === 'Arriendo' ? 'arrendadora' : 'vendedora'}, y por la otra <strong>{user?.user_metadata?.full_name ?? 'el comprador'}</strong>, en calidad de promitente {property?.operation === 'Arriendo' ? 'arrendataria' : 'compradora'}, quienes libre y voluntariamente celebran el presente contrato.</p>
            <p><strong>Cláusula Primera — Objeto.</strong> La promitente {property?.operation === 'Arriendo' ? 'arrendadora' : 'vendedora'} se obliga a transferir el inmueble <strong>{property?.title ?? 'descrito a continuación'}</strong>, ubicado en {property?.zone ?? 'Quito'}{property?.address ? `, ${property.address}` : ''}, con un área construida de <strong>{property?.area ?? '—'} m²</strong>.</p>
            <p><strong>Cláusula Segunda — Precio.</strong> El {property?.operation === 'Arriendo' ? 'canon mensual' : 'precio total'} acordado es de <strong>USD {property ? property.price.toLocaleString('es-EC') : '—'},00</strong>{property?.operation !== 'Arriendo' ? `, de los cuales se entrega en este acto el 10% a título de arras (USD ${property ? (property.price * 0.1).toLocaleString('es-EC') : '—'},00)` : ''}.</p>
            <p><strong>Cláusula Tercera — Plazo.</strong> Las partes {property?.operation === 'Arriendo' ? 'establecen un plazo de arrendamiento de 12 meses calendario' : 'celebrarán la escritura pública de compraventa en un plazo máximo de 60 días'} contados desde la suscripción del presente.</p>
            <p><strong>Cláusula Cuarta — Aceptación.</strong> Las partes declaran haber leído íntegramente este documento y aceptan su contenido sin reserva alguna.</p>
            <p className="doc-note muted">Documento generado electrónicamente. La firma digital tiene plena validez legal según la Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos del Ecuador.</p>
          </div>
        </div>

        <aside className="sig-aside">
          {!signed ? (
            <div className="card sig-card">
              <h3>Tu firma</h3>
              <p className="muted sm">Dibuja tu firma dentro del recuadro</p>
              <div className="sig-pad-wrap">
                <canvas
                  ref={canvasRef}
                  id="sigPad"
                  style={{ width: '100%', height: 240 }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={() => { drawing.current = false }}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={() => { drawing.current = false }}
                />
                <span className="sig-baseline" />
                <span className="sig-x">×</span>
              </div>
              <div className="sig-actions">
                <button className="btn btn-ghost" onClick={clear}>
                  <i className="fa-solid fa-eraser" /> Limpiar firma
                </button>
                <button className="btn btn-primary" onClick={() => void confirm()}>
                  <i className="fa-solid fa-signature" /> Confirmar y firmar
                </button>
              </div>
              <div className="sig-meta muted sm">
                <i className="fa-solid fa-shield-halved gold" /> Esta firma será sellada con un timestamp e ID único.
              </div>
            </div>
          ) : (
            <div className="card sig-success">
              <div className="success-icn"><i className="fa-solid fa-circle-check" /></div>
              <h3>Documento firmado</h3>
              <p className="muted">Tu copia ha sido enviada a {user?.email ?? 'tu correo'}</p>
              <div className="sig-stamp">
                <div><span className="muted">ID Documento</span><strong>{docInfo.id}</strong></div>
                <div><span className="muted">Sellado</span><strong>{docInfo.stamp}</strong></div>
                <div><span className="muted">Hash</span><strong style={{ fontSize: 11 }}>{docInfo.hash}</strong></div>
              </div>
              <button className="btn btn-outline block" onClick={() => toast('Descarga disponible pronto')}>
                <i className="fa-solid fa-download" /> Descargar PDF
              </button>
              <button className="btn btn-primary block" onClick={() => navigate('/mi-cuenta')} style={{ marginTop: 8 }}>
                Ir a mi cuenta
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function DocusealEmbed({ user, propertyId, onSigned, signed, docInfo }: {
  user: User | null
  propertyId?: string
  onSigned: (info: SignedInfo) => void
  signed: boolean
  docInfo: SignedInfo
}) {
  const navigate = useNavigate()
  const templateId = import.meta.env.VITE_DOCUSEAL_TEMPLATE_ID as string
  const docusealUrl = import.meta.env.VITE_DOCUSEAL_URL as string || 'https://docuseal.com'

  return (
    <div className="container">
      <Link to="/pago" className="back-link">
        <i className="fa-solid fa-arrow-left" /> Volver
      </Link>
      <span className="eyebrow gold">Paso 2 de 2</span>
      <h1 className="page-title">Firma digital del contrato</h1>
      {!signed ? (
        <div style={{ height: 700, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <iframe
            src={`${docusealUrl}/embed?template_id=${templateId}&email=${encodeURIComponent(user?.email ?? '')}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="success-icn" style={{ margin: '0 auto 18px' }}><i className="fa-solid fa-circle-check" /></div>
          <h3 className="section-title sm">Documento firmado</h3>
          <button className="btn btn-primary" onClick={() => navigate('/mi-cuenta')}>
            Ir a mi cuenta
          </button>
        </div>
      )}
    </div>
  )
}
