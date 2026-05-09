import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProperties } from '../../hooks/useProperties'
import { photoUrl } from '../../lib/mockData'
import AddPropertyModal from './AddPropertyModal'
import EditPropertyModal from './EditPropertyModal'
import type { Property } from '../../types'

const STATUS_LABEL: Record<string, string> = {
  active: 'Activo',
  sold: 'Vendido',
  rented: 'Arrendado',
  inactive: 'Inactivo',
}
const STATUS_CLASS: Record<string, string> = {
  active: 'ok',
  sold: 'gold',
  rented: 'warn',
  inactive: 'err',
}

export default function PropertiesTable() {
  const navigate = useNavigate()
  const { properties, loading, deleteProperty, updateProperty } = useProperties(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Property | null>(null)

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.zone.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <>
      <header className="apanel-head">
        <div>
          <h2 className="section-title sm">Propiedades</h2>
          <p className="muted"><span>{filtered.length}</span> de <span>{properties.length}</span> registros</p>
        </div>
        <div className="apanel-tools">
          <select
            className="select"
            style={{ minWidth: 130 }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="sold">Vendido</option>
            <option value="rented">Arrendado</option>
            <option value="inactive">Inactivo</option>
          </select>
          <div className="search-input">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              placeholder="Buscar…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <i className="fa-solid fa-plus" /> Agregar propiedad
          </button>
        </div>
      </header>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Título</th>
              <th>Zona</th>
              <th>Precio</th>
              <th>Tipo</th>
              <th>Operación</th>
              <th>Estado</th>
              <th className="ta-r">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
                  Cargando…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
                  No se encontraron propiedades
                </td>
              </tr>
            )}
            {!loading && filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <img className="row-thumb" src={photoUrl(p.id, 120, 80)} alt={p.title} />
                </td>
                <td>
                  <strong>{p.title}</strong>
                  {p.featured && (
                    <span style={{ marginLeft: 6, color: 'var(--gold)', fontSize: '0.7rem' }}>
                      <i className="fa-solid fa-star" />
                    </span>
                  )}
                </td>
                <td>{p.zone}</td>
                <td>$ {p.price.toLocaleString('es-EC')}</td>
                <td>{p.type}</td>
                <td>
                  <span className={`badge ${p.operation === 'Venta' ? 'ok' : 'warn'}`} style={{ fontSize: '0.72rem' }}>
                    {p.operation}
                  </span>
                </td>
                <td>
                  <StatusSelect
                    status={p.status ?? 'active'}
                    onChange={newStatus => void updateProperty(p.id, { status: newStatus })}
                  />
                </td>
                <td className="ta-r">
                  <div className="row-actions">
                    <button title="Ver detalle" onClick={() => navigate(`/propiedad/${p.id}`)}>
                      <i className="fa-regular fa-eye" />
                    </button>
                    <button title="Editar" onClick={() => setEditTarget(p)}>
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button className="del" title="Eliminar" onClick={() => void deleteProperty(p.id)}>
                      <i className="fa-regular fa-trash-can" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <AddPropertyModal onClose={() => setModalOpen(false)} />}
      {editTarget && <EditPropertyModal property={editTarget} onClose={() => setEditTarget(null)} />}
    </>
  )
}

function StatusSelect({ status, onChange }: { status: string; onChange: (s: Property['status']) => void }) {
  const [current, setCurrent] = useState(status)
  const cls = STATUS_CLASS[current] ?? 'ok'

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value as NonNullable<Property['status']>
    setCurrent(val)
    onChange(val)
  }

  return (
    <select
      className={`badge ${cls}`}
      value={current}
      onChange={handleChange}
      style={{ border: 'none', cursor: 'pointer', fontSize: '0.78rem', padding: '3px 8px', borderRadius: 4, appearance: 'none' }}
      title="Cambiar estado"
    >
      {Object.entries(STATUS_LABEL).map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  )
}
