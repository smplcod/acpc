import { useEffect, useState, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sidebar, Home } from 'react-feather'
import urlTree from '../../urlTree.json'
import './barLeftUser.css'

export default function BarLeftUser() {
  const [collapsed, setCollapsed] = useState(true)
  const [hovered, setHovered] = useState(false)
  const sidebarRef = useRef(null)
  const toggleRef = useRef(null)

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

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('sidebar--open', !isCollapsed)
    root.classList.toggle('sidebar--closed', isCollapsed)
    return () => {
      root.classList.remove('sidebar--open', 'sidebar--closed')
    }
  }, [isCollapsed])

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('barLeftUserCollapsed', String(next))
      return next
    })
  }

  const onIconEnter = () => {
    if (collapsed) setHovered(true)
  }

  const onMouseLeave = () => {
    if (collapsed) setHovered(false)
  }

  useEffect(() => {
    if (!isCollapsed) {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const handleClick = e => {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target) &&
          toggleRef.current &&
          !toggleRef.current.contains(e.target)
        ) {
          setCollapsed(true)
          setHovered(false)
          localStorage.setItem('barLeftUserCollapsed', 'true')
        }
      }
      const handleKey = e => {
        if (e.key === 'Escape') {
          setCollapsed(true)
          setHovered(false)
          localStorage.setItem('barLeftUserCollapsed', 'true')
        }
      }
      if (isMobile) document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleKey)
      return () => {
        if (isMobile) document.removeEventListener('click', handleClick)
        document.removeEventListener('keydown', handleKey)
      }
    }
  }, [isCollapsed])

  useEffect(() => {
    if (!collapsed) {
      const first = sidebarRef.current?.querySelector(
        'a, button, input, select, textarea'
      )
      first?.focus()
    } else {
      toggleRef.current?.focus()
    }
  }, [collapsed])

  const renderTree = nodes => (
    <ul>
      {nodes.map(n => (
        <li key={n.path}>
          <NavLink
            to={n.path}
            end
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {n.name}
          </NavLink>
          {n.children.length > 0 && renderTree(n.children)}
        </li>
      ))}
    </ul>
  )

  const publicTree = urlTree.filter(n => !n.path.startsWith('/admin'))

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar-left ${isCollapsed ? 'collapsed' : ''}`}
      onMouseLeave={onMouseLeave}
      onClick={e => e.stopPropagation()}
    >
      <div className="sidebar-header">
        <button
          type="button"
          className="icon-button"
          onMouseEnter={onIconEnter}
          onClick={e => {
            e.stopPropagation()
            toggle()
          }}
          aria-label="Toggle sidebar"
          aria-expanded={!isCollapsed}
          ref={toggleRef}
        >
          <Sidebar size={16} />
        </button>
        {!isCollapsed && (
          <Link to="/" className="icon-button" title="Home">
            <Home size={16} />
          </Link>
        )}
      </div>
      {!isCollapsed && (
        <nav className="sidebar-content" aria-label="Main navigation">
          {renderTree(publicTree)}
        </nav>
      )}
    </aside>
  )
}
