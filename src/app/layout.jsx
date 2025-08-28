import { Outlet, useLocation } from 'react-router-dom'
import BarLeftUser from './barLeftUser.jsx'
import BarLeftAdmin from './barLeftAdmin.jsx'
import './layout.css'

export default function Layout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  return (
    <div className="layout">
      {isAdminRoute ? <BarLeftAdmin /> : <BarLeftUser />}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
