import { Outlet } from 'react-router-dom'
import BarLeftUser from './barLeftUser.jsx'
import './layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <BarLeftUser />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
