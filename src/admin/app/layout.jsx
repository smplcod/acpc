import { Outlet } from 'react-router-dom'
import BarLeftAdmin from './barLeftAdmin.jsx'
import './layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <BarLeftAdmin />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
