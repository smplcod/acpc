import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export function Component() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className='admin-layout'>
      <aside>
        <nav>
          <ul>
            <li>
              <NavLink to='/admin'>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to='/admin/users'>Users</NavLink>
            </li>
          </ul>
        </nav>
        <button onClick={logout}>Logout</button>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
