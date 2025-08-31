import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthMessage from '../app/authMessage.jsx'
import { isAdminAuth, logoutAdmin } from '../app/auth.js'

export default function AdminLogoutPage() {
  const navigate = useNavigate()
  useEffect(() => {
    if (isAdminAuth()) {
      logoutAdmin()
    }
    navigate('/admin/login', { replace: true })
  }, [navigate])

  return (
    <>
      <h1>Logout</h1>
      <AuthMessage />
    </>
  )
}
