import { useEffect } from 'react'

export default function AdminChartsPage() {
  const title = 'Admin Charts Page'
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
