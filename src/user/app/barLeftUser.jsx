import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Home, Columns, Calendar, CheckCircle, Cloud } from 'react-feather'
import './barLeftUser.css'

export default function BarLeftUser() {
  const [collapsed, setCollapsed] = useState(true)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('barLeftUserCollapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    }
  }, [])

  useEffect(() => {
    function handleBlur() {
      if (collapsed) setHovered(false)
    }
    window.addEventListener('blur', handleBlur)
    return () => window.removeEventListener('blur', handleBlur)
  }, [collapsed])

  const isCollapsed = collapsed && !hovered

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('barLeftUserCollapsed', String(next))
  }

  const onIconEnter = () => {
    if (collapsed) setHovered(true)
  }

  const onMouseLeave = () => {
    if (collapsed) setHovered(false)
  }

  return (
    <aside className={`sidebar-left ${isCollapsed ? 'collapsed' : ''}`} onMouseLeave={onMouseLeave}>
      <div className="sidebar-header">
        <div
          className="icon-button"
          onMouseEnter={onIconEnter}
          onClick={toggle}
          title="Toggle sidebar"
        >
          <Sidebar size={16} />
        </div>
        {!isCollapsed && (
          <>
            <Link to="/" className="icon-button" title="Home">
              <Home size={16} />
            </Link>
            <div className="icon-button" title="Columns">
              <Columns size={16} />
            </div>
            <div className="icon-button" title="Calendar">
              <Calendar size={16} />
            </div>
            <div className="icon-button" title="Check circle">
              <CheckCircle size={16} />
            </div>
            <div className="icon-button" title="Cloud">
              <Cloud size={16} />
            </div>
          </>
        )}
      </div>
      {!isCollapsed && (
        <nav className="sidebar-content">
          <Link to="/">/</Link>
          <Link to="/release-notes">/release-notes</Link>
        </nav>
      )}
    </aside>
  )
}
