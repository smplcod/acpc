import { useEffect, useState, useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Sidebar,
  Home,
  TrendingUp,
  Users,
  Shield,
  DollarSign
} from 'react-feather'
import pkg from '../../../package.json'
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
  const hidden = new Set([
    '/',
    '/admin/login',
    '/admin/ui',
    '/admin/ui/charts'
  ])
  const navNodes = flatNodes.filter(
    node => !hidden.has(node.path) && node.path !== '/admin/logout'
  )
  const logoutNode = flatNodes.find(node => node.path === '/admin/logout')

  const toggleNames = () => {
    const next = !showNames
    setShowNames(next)
    localStorage.setItem('barLeftAdminShowNames', String(next))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 310)
    return () => clearTimeout(timer)
  }, [isCollapsed])

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
            <Link to="/admin/growth" className="icon-button" title="Growth">
              <TrendingUp size={16} />
            </Link>
            <Link
              to="/admin/engagement"
              className="icon-button"
              title="Engagement"
            >
              <Users size={16} />
            </Link>
            <Link
              to="/admin/reliability"
              className="icon-button"
              title="Reliability"
            >
              <Shield size={16} />
            </Link>
            <Link to="/admin/revenue" className="icon-button" title="Revenue">
              <DollarSign size={16} />
            </Link>
          </>
        )}
      </div>
      {!isCollapsed && (
        <>
          <nav className="sidebar-content" aria-label="Main navigation">
            <ul>
              {navNodes.map(node => (
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
          {logoutNode && (
            <div className="sidebar-footer">
              <NavLink
                to={logoutNode.path}
                end
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {showNames ? logoutNode.name : logoutNode.path}
              </NavLink>
            </div>
          )}
          <div className="sidebar-footer sidebar-version">v{pkg.version}</div>
        </>
      )}
    </aside>
  )
}
