import { Link, useLocation } from 'react-router-dom'
import adminRoutes from './routes.jsx'

function findRouteChildren(pathname, routes, base = '/admin') {
  let relative = pathname.startsWith(base) ? pathname.slice(base.length) : pathname
  if (relative.startsWith('/')) relative = relative.slice(1)
  const segments = relative.split('/').filter(Boolean)
  let currentRoutes = routes
  let currentBase = base
  for (const segment of segments) {
    const match = currentRoutes.find(r => r.path === segment)
    if (!match) return { base: currentBase, routes: [] }
    currentRoutes = match.children || []
    currentBase += `/${segment}`
  }
  return { base: currentBase, routes: currentRoutes }
}

export default function SubPages() {
  const { pathname } = useLocation()
  const { base, routes } = findRouteChildren(pathname, adminRoutes)
  const subpages = routes.filter(r => !r.index)
  if (subpages.length === 0) return null
  return (
    <div style={{ marginTop: '2rem' }}>
      <ul>
        {subpages.map(r => {
          const to = `${base}/${r.path || ''}`.replace(/\/+/g, '/').replace(/\/$/, '')
          const label = r.label || r.path
          return (
            <li key={to}>
              <Link to={to}>{label}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
