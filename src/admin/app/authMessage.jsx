import { Link } from 'react-router-dom'
import { isAdminAuth } from './auth.js'

export default function AuthMessage() {
  const login = import.meta.env.VITE_ADMIN_LOGIN
  if (!isAdminAuth()) return null
  return (
    <p>
      {login} is authenticated, <Link to="/admin/logout">log out</Link>
    </p>
  )
}
