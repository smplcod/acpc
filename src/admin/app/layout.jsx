import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import useCollapsibleHeadings from './hooks/useCollapsibleHeadings.js'
import BarLeftAdmin from './barLeftAdmin.jsx'
import { isAdminAuth } from './auth.js'
import SubPages from './subPages.jsx'
import './layout.css'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const mainRef = useRef(null)
  const isLogin = location.pathname === '/admin/login'

  useEffect(() => {
    if (!isLogin && !isAdminAuth()) {
      localStorage.setItem('adminPostLoginRedirect', location.pathname + location.search)
      navigate('/admin/login', { replace: true })
    }
  }, [isLogin, navigate, location])

  useCollapsibleHeadings()

  useEffect(() => {
    mainRef.current?.focus()
  }, [location.pathname])

  return (
    <div className="layout">
      <a href="#main" className="skip-link">Skip to main content</a>
      <BarLeftAdmin forceCollapsed={isLogin} disableToggle={isLogin} />
      <main id="main" tabIndex={-1} ref={mainRef}>
        <Outlet />
        <SubPages />
      </main>
    </div>
  )
}
