import type { Lead } from '../../types/lead'
import StatusBadge from '../ui/StatusBadge'

export default function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="client-card" style={{ flexWrap: 'wrap' }}>
      <img src={`https://ui-avatars.com/api/?name=${lead.name}&background=1F1F1F&color=C9A84C`} alt={lead.name} />
      <div style={{ flex: 1 }}>
        <div className="cl-name">{lead.name}</div>
        <div className="cl-meta">
          <i className="fa-regular fa-envelope" /> {lead.email}
          {lead.phone && <span style={{ marginLeft: 8 }}><i className="fa-solid fa-phone" /> {lead.phone}</span>}
        </div>
      </div>
      <div>
        <StatusBadge status={lead.status} />
      </div>
      {lead.message && (
        <div style={{ width: '100%', fontSize: 13, background: 'var(--bg-elev)', padding: 10, borderRadius: 6, marginTop: 8 }}>
          <em className="muted">"{lead.message}"</em>
        </div>
      )}
    </div>
  )
}
