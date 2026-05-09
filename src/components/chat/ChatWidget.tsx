import { useState, useRef, useEffect } from 'react'
import { useChat } from '../../hooks/useChat'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, sending, sendMessage, isOwnMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function handleSend() {
    if (!input.trim()) return
    const msg = input
    setInput('')
    await sendMessage(msg)
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(o => !o)} title="Chat con asesor">
        <i className={`fa-solid fa-${open ? 'xmark' : 'comments'}`} />
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <h4>Chat con asesor</h4>
              <p className="muted sm">Carlos Mendoza · Premier Estates</p>
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-msg ${isOwnMessage(msg) ? 'mine' : 'theirs'}`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input
              placeholder="Escribe un mensaje…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') void handleSend() }}
              disabled={sending}
            />
            <button className="btn btn-primary" onClick={() => void handleSend()} disabled={sending}>
              <i className="fa-solid fa-paper-plane" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
