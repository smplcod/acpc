import { Outlet, useLocation } from 'react-router-dom'
import BarLeftUser from './barLeftUser.jsx'
import BarLeftAdmin from './barLeftAdmin.jsx'

export default function Layout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  return (
    <>
      {isAdminRoute ? <BarLeftAdmin /> : <BarLeftUser />}
      <Outlet />
    </>
  )
}
