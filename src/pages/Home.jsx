import { Link } from 'react-router-dom'

export function Component() {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/login'>Login</Link>
        </li>
        <li>
          <Link to='/admin'>Admin</Link>
        </li>
        <li>
          <Link to='/sitemap'>Sitemap</Link>
        </li>
      </ul>
    </nav>
  )
}
