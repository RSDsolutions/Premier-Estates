import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'
import { useAuth } from '../../hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Nombre requerido'),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen } = useAppStore()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  if (!authModalOpen) return null

  async function handleLogin(data: LoginForm) {
    setLoading(true)
    const { error } = await signIn(data.email, data.password)
    setLoading(false)
    if (!error) navigate('/admin')
  }

  async function handleRegister(data: RegisterForm) {
    setLoading(true)
    await signUp(data.email, data.password, data.fullName)
    setLoading(false)
  }

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) setAuthModalOpen(false) }}>
      <div className="modal-overlay" onClick={() => setAuthModalOpen(false)} />
      <div className="modal-card">
        <button className="modal-close" onClick={() => setAuthModalOpen(false)}>
          <i className="fa-solid fa-xmark" />
        </button>

        <span className="eyebrow gold">Acceso seguro</span>
        <h2>{tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>

        <div className="auth-tabs" style={{ marginTop: 16 }}>
          <button
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            onClick={() => setTab('login')}
          >
            Iniciar sesión
          </button>
          <button
            className={`auth-tab${tab === 'register' ? ' active' : ''}`}
            onClick={() => setTab('register')}
          >
            Registrarse
          </button>
        </div>

        <button className="google-btn" onClick={() => void signInWithGoogle()}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar con Google
        </button>

        <div className="auth-divider">o</div>

        {tab === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label className="field full">
              <span>Correo electrónico</span>
              <input className="input" type="email" placeholder="tu@correo.com" {...loginForm.register('email')} />
              {loginForm.formState.errors.email && <small style={{ color: 'var(--err)' }}>{loginForm.formState.errors.email.message}</small>}
            </label>
            <label className="field full">
              <span>Contraseña</span>
              <input className="input" type="password" placeholder="••••••••" {...loginForm.register('password')} />
              {loginForm.formState.errors.password && <small style={{ color: 'var(--err)' }}>{loginForm.formState.errors.password.message}</small>}
            </label>
            <button className="btn btn-primary block" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label className="field full">
              <span>Nombre completo</span>
              <input className="input" placeholder="María González" {...registerForm.register('fullName')} />
              {registerForm.formState.errors.fullName && <small style={{ color: 'var(--err)' }}>{registerForm.formState.errors.fullName.message}</small>}
            </label>
            <label className="field full">
              <span>Correo electrónico</span>
              <input className="input" type="email" placeholder="tu@correo.com" {...registerForm.register('email')} />
              {registerForm.formState.errors.email && <small style={{ color: 'var(--err)' }}>{registerForm.formState.errors.email.message}</small>}
            </label>
            <label className="field full">
              <span>Contraseña</span>
              <input className="input" type="password" placeholder="Mínimo 6 caracteres" {...registerForm.register('password')} />
              {registerForm.formState.errors.password && <small style={{ color: 'var(--err)' }}>{registerForm.formState.errors.password.message}</small>}
            </label>
            <button className="btn btn-primary block" type="submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
