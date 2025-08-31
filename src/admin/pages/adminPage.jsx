import { useEffect } from 'react'
import AuthMessage from '../app/authMessage.jsx'

export default function AdminPage() {
  const title = 'Admin Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])
  return (
    <>
      <h1>{fullTitle}</h1>
      <AuthMessage />
    </>
  )
}
