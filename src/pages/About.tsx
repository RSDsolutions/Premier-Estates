export default function About() {
  const team = [
    { name: 'Carlos Mendoza', role: 'Director General', seed: 'carlos' },
    { name: 'Ana Villacrés', role: 'Directora Comercial', seed: 'ana' },
    { name: 'Luis Proaño', role: 'Agente Senior', seed: 'luis' },
    { name: 'Sofía Mantilla', role: 'Agente Luxury', seed: 'sofia' },
  ]

  const values = [
    { icon: 'fa-gem', title: 'Excelencia', desc: 'Curación rigurosa de cada propiedad bajo estándares internacionales de lujo.' },
    { icon: 'fa-handshake', title: 'Confianza', desc: 'Transparencia total en cada transacción. Nuestros clientes nos recomiendan.' },
    { icon: 'fa-location-dot', title: 'Conocimiento local', desc: 'Más de 12 años en el mercado inmobiliario de Quito y el Valle.' },
    { icon: 'fa-wand-magic-sparkles', title: 'Innovación', desc: 'Tecnología IA y firma digital para una experiencia de compra sin fricciones.' },
  ]

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* HERO */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 64px' }}>
        <span className="eyebrow gold">Sobre nosotros</span>
        <h1 className="page-title" style={{ marginBottom: 16 }}>
          El estándar <em>Premier</em> en bienes raíces
        </h1>
        <p className="muted" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
          Desde 2014, Premier Estates ha sido la agencia de referencia para quienes buscan propiedades exclusivas en las mejores zonas de Quito. Combinamos experiencia humana con tecnología de vanguardia para conectar compradores e inversores con el hogar ideal.
        </p>
      </div>

      {/* COVER IMAGE */}
      <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 80, height: 420 }}>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=420&fit=crop&auto=format&q=80"
          alt="Premier Estates oficina"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* VALUES */}
      <section style={{ marginBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 40 }}>
          <div>
            <span className="eyebrow gold">Nuestros pilares</span>
            <h2 className="section-title">Lo que nos <em>define</em></h2>
          </div>
        </div>
        <div className="grid-cards" style={{ '--cols': 4 } as React.CSSProperties}>
          {values.map(v => (
            <div key={v.title} className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ fontSize: 32, marginBottom: 16, color: 'var(--gold)' }}>
                <i className={`fa-solid ${v.icon}`} />
              </div>
              <h3 style={{ marginBottom: 8, fontSize: '1.1rem' }}>{v.title}</h3>
              <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-bar" style={{ borderRadius: 16, marginBottom: 80 }}>
        {[
          { n: '1.200+', label: 'Propiedades listadas' },
          { n: '850+', label: 'Clientes satisfechos' },
          { n: '12', label: 'Años de experiencia' },
          { n: '$2.8B', label: 'En transacciones' },
        ].map((s, i, arr) => (
          <div key={s.label} style={{ display: 'contents' }}>
            <div className="stat">
              <div className="stat-num gold">{s.n}</div>
              <div className="stat-label">{s.label}</div>
            </div>
            {i < arr.length - 1 && <div className="stat-divider" />}
          </div>
        ))}
      </section>

      {/* TEAM */}
      <section>
        <div className="section-head" style={{ marginBottom: 40 }}>
          <div>
            <span className="eyebrow gold">Nuestro equipo</span>
            <h2 className="section-title">Los <em>expertos</em> detrás de Premier</h2>
          </div>
        </div>
        <div className="grid-cards" style={{ '--cols': 4 } as React.CSSProperties}>
          {team.map(m => (
            <div key={m.name} className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <img
                src={`https://i.pravatar.cc/120?u=${m.seed}`}
                alt={m.name}
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: '2px solid var(--gold)' }}
              />
              <h3 style={{ marginBottom: 4, fontSize: '1rem' }}>{m.name}</h3>
              <p className="muted" style={{ fontSize: '0.85rem' }}>{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
