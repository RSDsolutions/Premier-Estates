import { useEffect, useState } from 'react'

interface Props {
  mode: 'app' | 'login'
  onDone: () => void
}

export default function SplashScreen({ mode, onDone }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const tIn = setTimeout(() => setPhase('hold'), 300)
    const tOut = setTimeout(() => setPhase('out'), 1700)
    const tDone = setTimeout(() => onDone(), 2200)
    return () => { clearTimeout(tIn); clearTimeout(tOut); clearTimeout(tDone) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#0D0D0D',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      opacity: phase === 'out' ? 0 : 1,
      transition: phase === 'in' ? 'opacity .3s ease' : 'opacity .5s ease',
    }}>

      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Brand mark */}
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 14,
        background: 'linear-gradient(135deg, #E8C97A, #A07830)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 40px rgba(201,168,76,.35)',
        fontSize: 28,
        color: '#1a1300',
        transform: phase === 'in' ? 'scale(.85)' : 'scale(1)',
        transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)',
      }}>
        <i className="fa-solid fa-gem" />
      </div>

      {/* Name */}
      <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: '-.01em',
          color: '#F5F5F5',
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity .35s ease .1s, transform .35s ease .1s',
        }}>
          Premier <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>State</em>
        </div>
        <div style={{
          fontSize: 12,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: '#666',
          marginTop: 6,
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity .35s ease .2s',
        }}>
          {mode === 'login' ? 'Iniciando sesión…' : 'Inmobiliaria de lujo'}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 120,
        height: 2,
        background: 'rgba(201,168,76,.15)',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 8,
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #C9A84C, #E8C97A)',
          borderRadius: 2,
          width: phase === 'in' ? '0%' : phase === 'hold' ? '85%' : '100%',
          transition: phase === 'in'
            ? 'width .3s ease'
            : phase === 'hold'
            ? 'width 1.3s cubic-bezier(.4,0,.2,1)'
            : 'width .3s ease',
          boxShadow: '0 0 8px rgba(201,168,76,.6)',
        }} />
      </div>

    </div>
  )
}
