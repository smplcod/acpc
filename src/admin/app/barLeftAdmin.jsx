import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Home, Columns, Calendar, CheckCircle, Cloud } from 'react-feather'
import urlTree from '../../urlTree.js'
import './barLeftAdmin.css'

const flattenTree = nodes =>
  nodes.flatMap(n => [n.path, ...flattenTree(n.children)])

export default function BarLeftAdmin({ forceCollapsed = false, disableToggle = false }) {
  const [collapsed, setCollapsed] = useState(true)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (forceCollapsed) {
      setCollapsed(true)
      return
    }
    const saved = localStorage.getItem('barLeftAdminCollapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    }
  }, [forceCollapsed])

  useEffect(() => {
    function handleBlur() {
      if (collapsed) setHovered(false)
    }
    window.addEventListener('blur', handleBlur)
    return () => window.removeEventListener('blur', handleBlur)
  }, [collapsed])

  const isCollapsed = collapsed && !hovered

  const toggle = () => {
    if (disableToggle || forceCollapsed) return
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('barLeftAdminCollapsed', String(next))
  }

  const onIconEnter = () => {
    if (collapsed && !disableToggle && !forceCollapsed) setHovered(true)
  }

  const onMouseLeave = () => {
    if (collapsed) setHovered(false)
  }

  const flatUrls = useMemo(() => flattenTree(urlTree), [])

  return (
    <aside className={`sidebar-left ${isCollapsed ? 'collapsed' : ''}`} onMouseLeave={onMouseLeave}>
      <div className="sidebar-header">
        <div
          className={`icon-button${disableToggle ? ' disabled' : ''}`}
          onMouseEnter={disableToggle ? undefined : onIconEnter}
          onClick={disableToggle ? undefined : toggle}
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
          <ul>
            {flatUrls.map(path => (
              <li key={path}>
                <Link to={path}>{path}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  )
}
