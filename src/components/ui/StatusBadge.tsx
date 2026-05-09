export default function StatusBadge({ status }: { status: string }) {
  let cls = ''
  let label = status
  
  if (['active', 'confirmed', 'completed'].includes(status)) { 
      cls = 'ok' 
      label = status === 'active' ? 'Activo' : (status === 'confirmed' ? 'Confirmado' : 'Completado')
  } else if (status === 'pending') { 
      cls = 'warn'
      label = 'Pendiente'
  } else if (['inactive', 'cancelled', 'sold', 'rented'].includes(status)) { 
      cls = 'err'
      if (status === 'inactive') label = 'Inactivo'
      if (status === 'cancelled') label = 'Cancelado'
      if (status === 'sold') label = 'Vendido'
      if (status === 'rented') label = 'Alquilado'
  }
  
  return <span className={`badge ${cls}`}>{label}</span>
}
