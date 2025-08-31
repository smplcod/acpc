import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import BarLeftUser from './barLeftUser.jsx'
import './layout.css'

export default function Layout() {
  const location = useLocation()
  const mainRef = useRef(null)

  useEffect(() => {
    mainRef.current?.focus()
  }, [location])

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <div className="layout">
        <BarLeftUser />
        <main id="main" tabIndex={-1} ref={mainRef}>
          <Outlet />
        </main>
      </div>
    </>
  )
}
