import { useEffect } from 'react'
import AuthMessage from '../app/authMessage.jsx'

export default function AdminChartsUsersPage() {
  const title = 'Admin Charts Users Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])
  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
    </div>
  )
}
