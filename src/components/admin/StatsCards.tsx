export default function StatsCards({ stats }: { stats: any[] }) {
  return (
    <div className="kpi-grid">
      {stats.map((s, i) => (
        <div key={i} className="kpi">
          <div className="kpi-icn"><i className={`fa-solid fa-${s.icon}`} /></div>
          <div className="kpi-num">{s.num}</div>
          <div className="kpi-lbl">{s.label}</div>
          {s.delta && (
            <div className={`kpi-delta ${s.up ? 'up' : 'down'}`}>
              <i className={`fa-solid fa-arrow-trend-${s.up ? 'up' : 'down'}`} /> {s.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
