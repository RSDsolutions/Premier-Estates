import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProperties } from '../../hooks/useProperties'
import { photoUrl } from '../../lib/mockData'
import AddPropertyModal from './AddPropertyModal'
import EditPropertyModal from './EditPropertyModal'
import type { Property } from '../../types'

export default function PropertiesTable() {
  const navigate = useNavigate()
  const { properties, deleteProperty } = useProperties()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Property | null>(null)

  const filtered = properties.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.zone.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <header className="apanel-head">
        <div>
          <h2 className="section-title sm">Propiedades</h2>
          <p className="muted"><span>{filtered.length}</span> registros</p>
        </div>
        <div className="apanel-tools">
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
              <th>Foto</th><th>Título</th><th>Zona</th><th>Precio</th><th>Tipo</th><th>Estado</th><th className="ta-r">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><img className="row-thumb" src={photoUrl(p.id, 120, 80)} alt={p.title} /></td>
                <td><strong>{p.title}</strong></td>
                <td>{p.zone}</td>
                <td>$ {p.price.toLocaleString('es-EC')}</td>
                <td>{p.type}</td>
                <td>
                  <SwitchToggle defaultOn={p.status !== 'inactive'} />
                </td>
                <td className="ta-r">
                  <div className="row-actions">
                    <button title="Ver" onClick={() => navigate(`/propiedad/${p.id}`)}>
                      <i className="fa-regular fa-eye" />
                    </button>
                    <button title="Editar" onClick={() => setEditTarget(p)}><i className="fa-solid fa-pen" /></button>
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

function SwitchToggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <span
      className={`switch${on ? ' on' : ''}`}
      onClick={() => setOn(v => !v)}
    />
  )
}
