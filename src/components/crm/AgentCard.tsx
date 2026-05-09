export default function AgentCard({ agent }: { agent: any }) {
  if (!agent) return null
  return (
    <div className="agent-card">
      <div className="agent-head">
        <img src={agent.photo_url || `https://ui-avatars.com/api/?name=${agent.full_name}&background=C9A84C&color=1a1300`} alt={agent.full_name} />
        <div>
          <h4 className="agent-name">{agent.full_name}</h4>
          <div className="agent-rating">
            <i className="fa-solid fa-star" /> <i className="fa-solid fa-star" /> <i className="fa-solid fa-star" /> <i className="fa-solid fa-star" /> <i className="fa-solid fa-star" />
          </div>
        </div>
      </div>
      
      <div className="agent-contact">
        <a href={`tel:${agent.phone}`} className="contact-row">
          <i className="fa-solid fa-phone" /> {agent.phone || 'No especificado'}
        </a>
        <a href={`mailto:${agent.email}`} className="contact-row">
          <i className="fa-regular fa-envelope" /> {agent.email || 'No especificado'}
        </a>
      </div>
      
      {agent.whatsapp && (
        <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp block">
          <i className="fa-brands fa-whatsapp" /> Contactar por WhatsApp
        </a>
      )}
      
      <div className="trust-row">
        <span><i className="fa-solid fa-shield-halved gold" /> Agente verificado</span>
        <span>MLS: {agent.license_number || 'N/A'}</span>
      </div>
    </div>
  )
}
