import { Link } from 'react-router-dom'

export default function BarLeftUser() {
  return (
    <nav>
      <Link to="/">Main</Link> | <Link to="/admin">Admin</Link> | <Link to="/admin/charts">Admin Charts</Link> | <Link to="/release-notes">Release Notes</Link>
    </nav>
  )
}
