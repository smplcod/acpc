import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import BarLeftAdmin from './barLeftAdmin.jsx'
import { isAdminAuth } from './auth.js'
import SubPages from './subPages.jsx'
import './layout.css'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = location.pathname === '/admin/login'

  useEffect(() => {
    if (!isLogin && !isAdminAuth()) {
      localStorage.setItem('adminPostLoginRedirect', location.pathname + location.search)
      navigate('/admin/login', { replace: true })
    }
  }, [isLogin, navigate, location])

  return (
    <div className="layout">
      <BarLeftAdmin forceCollapsed={isLogin} disableToggle={isLogin} />
      <main>
        <Outlet />
        <SubPages />
      </main>
    </div>
  )
}
