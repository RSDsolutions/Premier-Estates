import { useState, useRef, useEffect } from 'react'

interface ChatMsg {
  id: number
  from: 'user' | 'agent'
  text: string
  time: string
}

const now = () => new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })

const INITIAL: ChatMsg[] = [
  { id: 0, from: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?', time: now() },
]

const AUTO_REPLIES = [
  'Gracias por tu mensaje. Un asesor te responderá en breve.',
  'Con gusto te ayudo. ¿Tienes alguna preferencia de zona o tipo de propiedad?',
  'Puedo coordinar una visita en cualquier momento. ¿Cuándo te viene bien?',
]
let replyIdx = 0

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<ChatMsg[]>(INITIAL)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [msgs, typing])

  // Focus input when opened; clear unread
  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  function send() {
    const text = input.trim()
    if (!text || sending) return

    const userMsg: ChatMsg = { id: Date.now(), from: 'user', text, time: now() }
    setMsgs(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    setTyping(true)

    setTimeout(() => {
      const reply: ChatMsg = {
        id: Date.now() + 1,
        from: 'agent',
        text: AUTO_REPLIES[replyIdx % AUTO_REPLIES.length],
        time: now(),
      }
      replyIdx++
      setTyping(false)
      setMsgs(prev => [...prev, reply])
      setSending(false)
      if (!open) setUnread(n => n + 1)
    }, 1400)
  }

  return (
    <>
      {/* FAB */}
      <button
        className="chat-fab"
        onClick={() => setOpen(o => !o)}
        title={open ? 'Cerrar chat' : 'Chat con asesor'}
        style={{ position: 'relative' }}
      >
        <i className={`fa-solid fa-${open ? 'xmark' : 'comments'}`} />
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--err)', border: '2px solid var(--bg)',
          }} />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#E8C97A,#A07830)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#1a1300', fontWeight: 700, fontSize: 15,
                  fontFamily: 'var(--serif)',
                }}>C</div>
                <span style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 9, height: 9, borderRadius: '50%',
                  background: 'var(--ok)', border: '2px solid var(--bg-card)',
                }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14 }}>Carlos Mendoza</h4>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-2)' }}>
                  Asesor · <span style={{ color: 'var(--ok)' }}>● En línea</span>
                </p>
              </div>
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)} title="Cerrar">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" ref={listRef}>
            {msgs.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div className={`chat-msg ${msg.from === 'user' ? 'mine' : 'theirs'}`}>
                  {msg.text}
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-3)', margin: '2px 4px 0' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {typing && (
              <div className="chat-msg theirs" style={{ padding: '10px 14px' }}>
                <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--text-3)',
                      display: 'inline-block',
                      animation: `blink 1.2s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <input
              ref={inputRef}
              placeholder="Escribe un mensaje…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              disabled={sending}
              maxLength={500}
            />
            <button
              className="btn btn-primary"
              onClick={send}
              disabled={sending || !input.trim()}
              style={{ padding: '10px 14px', minWidth: 0 }}
            >
              {sending
                ? <i className="fa-solid fa-circle-notch fa-spin" />
                : <i className="fa-solid fa-paper-plane" />
              }
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: .25; transform: translateY(0) }
          40% { opacity: 1; transform: translateY(-3px) }
        }
      `}</style>
    </>
  )
}
