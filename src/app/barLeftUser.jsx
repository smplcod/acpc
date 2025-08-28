import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Columns, Calendar, CheckCircle, Cloud } from 'react-feather'
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
        <div className="icon-button" onMouseEnter={onIconEnter} onClick={toggle}>
          <Sidebar size={16} />
        </div>
        {!isCollapsed && (
          <>
            <div className="icon-button"><Columns size={16} /></div>
            <div className="icon-button"><Calendar size={16} /></div>
            <div className="icon-button"><CheckCircle size={16} /></div>
            <div className="icon-button"><Cloud size={16} /></div>
          </>
        )}
      </div>
      {!isCollapsed && (
        <nav className="sidebar-content">
          <Link to="/">/</Link>
          <Link to="/admin">/admin</Link>
          <Link to="/admin/charts">/admin/charts</Link>
          <Link to="/release-notes">/release-notes</Link>
        </nav>
      )}
    </aside>
  )
}
