import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text)',
          border: '1px solid var(--gold)',
          borderRadius: '999px',
          fontSize: '14px',
          padding: '12px 22px',
        },
        iconTheme: { primary: '#C9A84C', secondary: '#1a1300' },
      }}
    />
  </StrictMode>
)
