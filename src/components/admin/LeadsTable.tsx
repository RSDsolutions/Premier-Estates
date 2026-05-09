import type { Lead } from '../../types/lead'
import StatusBadge from '../ui/StatusBadge'

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Prospecto</th>
            <th>Propiedad / Interés</th>
            <th>Fuente</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th className="ta-r">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>
                <div style={{ fontWeight: 600 }}>{lead.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{lead.email}</div>
              </td>
              <td>{lead.property_id || 'General'}</td>
              <td><span className="badge">{lead.source}</span></td>
              <td><StatusBadge status={lead.status} /></td>
              <td>{new Date(lead.created_at).toLocaleDateString()}</td>
              <td className="ta-r">
                <div className="row-actions">
                  <button title="Ver ficha"><i className="fa-solid fa-eye" /></button>
                  <button title="Archivar" className="del"><i className="fa-solid fa-box-archive" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
