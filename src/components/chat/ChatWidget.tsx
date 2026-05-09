import { useState, useRef, useEffect } from 'react'
import { useChat } from '../../hooks/useChat'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const { messages, sending, sendMessage, isOwnMessage } = useChat()
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom whenever messages change or panel opens
  useEffect(() => {
    if (open && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, open])

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  // Show typing indicator while waiting for mock reply
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last && (last as { isMock?: boolean }).isMock && last.sender_id === 'user') {
      setTyping(true)
      const t = setTimeout(() => setTyping(false), 1300)
      return () => clearTimeout(t)
    }
    setTyping(false)
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    await sendMessage(text)
  }

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(o => !o)}
        title="Chat con asesor"
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
      >
        <i className={`fa-solid fa-${open ? 'xmark' : 'comments'}`} />
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', flex: 'none' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#E8C97A,#A07830)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#1a1300', fontSize: 14, fontWeight: 700,
                  fontFamily: 'var(--serif)',
                }}>C</div>
                <span style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 9, height: 9, borderRadius: '50%',
                  background: 'var(--ok)', border: '2px solid var(--bg-card)',
                }} />
              </div>
              <div>
                <h4>Carlos Mendoza</h4>
                <p className="muted sm" style={{ margin: 0, fontSize: 11 }}>
                  Asesor · Premier Estates &nbsp;
                  <span style={{ color: 'var(--ok)' }}>● En línea</span>
                </p>
              </div>
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)} title="Cerrar">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="chat-messages" ref={messagesRef}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isOwnMessage(msg) ? 'flex-end' : 'flex-start' }}>
                <div className={`chat-msg ${isOwnMessage(msg) ? 'mine' : 'theirs'}`}>
                  {msg.content}
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3, marginLeft: 2, marginRight: 2 }}>
                  {new Date(msg.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {typing && (
              <div className="chat-msg theirs" style={{ display: 'inline-flex', gap: 4, padding: '10px 14px' }}>
                {[0, 150, 300].map(d => (
                  <span key={d} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--text-3)',
                    animation: 'typingDot 1s infinite',
                    animationDelay: `${d}ms`,
                  }} />
                ))}
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              ref={inputRef}
              placeholder="Escribe un mensaje…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend() } }}
              disabled={sending}
              maxLength={500}
            />
            <button
              className="btn btn-primary"
              onClick={() => void handleSend()}
              disabled={sending || !input.trim()}
              style={{ padding: '10px 14px', minWidth: 0 }}
              title="Enviar"
            >
              <i className={`fa-solid fa-${sending ? 'circle-notch fa-spin' : 'paper-plane'}`} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: .25; transform: translateY(0) }
          30% { opacity: 1; transform: translateY(-3px) }
        }
      `}</style>
    </>
  )
}
