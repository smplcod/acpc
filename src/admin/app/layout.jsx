import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useCollapsibleHeadings from './hooks/useCollapsibleHeadings.js'
import BarLeftAdmin from './barLeftAdmin.jsx'
import { isAdminAuth } from './auth.js'
import SubPages from './subPages.jsx'
import './layout.css'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = location.pathname === '/admin/login'
  const hideSubPages = location.pathname === '/admin/charts'

  useEffect(() => {
    if (!isLogin && !isAdminAuth()) {
      localStorage.setItem('adminPostLoginRedirect', location.pathname + location.search)
      navigate('/admin/login', { replace: true })
    }
  }, [isLogin, navigate, location])

  useCollapsibleHeadings()

  return (
    <div className="layout">
      <BarLeftAdmin forceCollapsed={isLogin} disableToggle={isLogin} />
      <main>
        <Outlet />
        {!hideSubPages && <SubPages />}
      </main>
    </div>
  )
}
