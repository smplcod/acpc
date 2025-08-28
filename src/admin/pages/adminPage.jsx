import { useEffect } from 'react'

export default function AdminPage() {
  const title = 'Admin Page'
  const fullTitle = `${title} | Admin | ACPC`
  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])
  return (
    <div>
      <h1>{fullTitle}</h1>
    </div>
  )
}
