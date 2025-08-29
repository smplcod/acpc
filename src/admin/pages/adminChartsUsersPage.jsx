import { useEffect } from 'react'
import { Outlet, useOutlet } from 'react-router-dom'
import AuthMessage from '../app/authMessage.jsx'

export default function AdminChartsUsersPage() {
  const title = 'Admin Charts Users Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const outlet = useOutlet()
  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])
  if (outlet) return outlet
  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
    </div>
  )
}
