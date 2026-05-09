import { useEffect, lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AuthModal from './components/auth/AuthModal'
import ChatWidget from './components/chat/ChatWidget'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { useAppStore } from './store'

const Home = lazy(() => import('./pages/Home'))
const Listings = lazy(() => import('./pages/Listings'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const Admin = lazy(() => import('./pages/Admin'))
const Profile = lazy(() => import('./pages/Profile'))
const Payment = lazy(() => import('./pages/Payment'))
const Signature = lazy(() => import('./pages/Signature'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))


function Layout() {
  return (
    <>
      <Header />
      <ScrollRestoration />
      <main>
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-circle-notch fa-spin gold" style={{ fontSize: 32 }} /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <AuthModal />
      <ChatWidget />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <>
        <ScrollRestoration />
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-circle-notch fa-spin gold" style={{ fontSize: 32 }} /></div>}>
          <Admin />
        </Suspense>
        <AuthModal />
      </>
    ),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'propiedades', element: <Listings /> },
      { path: 'propiedad/:id', element: <PropertyDetail /> },
      { path: 'mi-cuenta', element: <Profile /> },
      { path: 'pago', element: <Payment /> },
      { path: 'firma', element: <Signature /> },
      { path: 'nosotros', element: <About /> },
      { path: 'contacto', element: <Contact /> },
    ],
  },
])

export default function App() {
  const { setUser, setProfile } = useAppStore()

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }

  return <RouterProvider router={router} />
}
