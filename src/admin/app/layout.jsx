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
  const isLogin = location.pathname === '/admin/login'
  const mainRef = useRef(null)

  useEffect(() => {
    if (!isLogin && !isAdminAuth()) {
      localStorage.setItem('adminPostLoginRedirect', location.pathname + location.search)
      navigate('/admin/login', { replace: true })
    }
  }, [isLogin, navigate, location])

  useEffect(() => {
    mainRef.current?.focus()
  }, [location])

  useCollapsibleHeadings()

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <div className="layout">
        <BarLeftAdmin forceCollapsed={isLogin} disableToggle={isLogin} />
        <main id="main" tabIndex={-1} ref={mainRef}>
          <Outlet />
          {location.pathname !== '/admin' && <SubPages />}
        </main>
      </div>
    </>
  )
}
