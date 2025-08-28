import { Link } from 'react-router-dom'
import { routes } from '../app/router.jsx'
import { listPaths } from '../utils/paths.js'

export function Component() {
  const paths = [...new Set(listPaths(routes))]
  return (
    <ul>
      {paths.map((p) => (
        <li key={p}>
          <Link to={p}>{p}</Link>
        </li>
      ))}
    </ul>
  )
}
