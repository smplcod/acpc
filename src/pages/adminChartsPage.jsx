import { useEffect } from 'react'

export default function AdminChartsPage() {
  const title = 'Admin Charts Page | ACPC'
  useEffect(() => {
    document.title = title
  }, [title])
  return <h1>{title}</h1>
}
