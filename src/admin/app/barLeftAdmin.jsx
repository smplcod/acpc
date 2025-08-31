import { useEffect, useState, useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sidebar, Home, Columns, Calendar, CheckCircle, Cloud } from 'react-feather'
import urlTree from '../../urlTree.json'
import './barLeftAdmin.css'

const flattenTree = nodes =>
  nodes.flatMap(n => [{ path: n.path, name: n.name }, ...flattenTree(n.children)])

export default function BarLeftAdmin({ forceCollapsed = false, disableToggle = false }) {
  const [collapsed, setCollapsed] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [showNames, setShowNames] = useState(false)

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

  useEffect(() => {
    const saved = localStorage.getItem('barLeftAdminShowNames')
    if (saved !== null) setShowNames(saved === 'true')
  }, [])

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

  const flatNodes = useMemo(() => flattenTree(urlTree), [])

  const toggleNames = () => {
    const next = !showNames
    setShowNames(next)
    localStorage.setItem('barLeftAdminShowNames', String(next))
  }

  return (
    <aside className={`sidebar-left ${isCollapsed ? 'collapsed' : ''}`} onMouseLeave={onMouseLeave}>
      <div className="sidebar-header">
        <button
          type="button"
          className={`icon-button${disableToggle ? ' disabled' : ''}`}
          onMouseEnter={disableToggle ? undefined : onIconEnter}
          onClick={disableToggle ? undefined : toggle}
          aria-label="Toggle sidebar"
          disabled={disableToggle}
        >
          <Sidebar size={16} />
        </button>
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
        <>
          <nav className="sidebar-content" aria-label="Main navigation">
            <ul>
              {flatNodes.map(node => (
                <li key={node.path}>
                  <NavLink
                    to={node.path}
                    end
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                  >
                    {showNames ? node.name : node.path}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sidebar-footer">
            <label>
              <input type="checkbox" checked={showNames} onChange={toggleNames} />
              {showNames ? 'Name' : 'URL'}
            </label>
          </div>
        </>
      )}
    </aside>
  )
}
