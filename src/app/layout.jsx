import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <nav>
        <Link to="/">Main</Link> | <Link to="/admin">Admin</Link> |{' '}
        <Link to="/admin/charts">Admin Charts</Link>
      </nav>
      <Outlet />
    </>
  )
}
