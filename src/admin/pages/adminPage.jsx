import { useEffect } from 'react'

export default function AdminPage() {
  const title = 'Admin Page | ACPC'
  useEffect(() => {
    document.title = title
  }, [title])
  return <h1>{title}</h1>
}
