import { useEffect } from 'react'

export default function AdminGraphPage() {
  const title = 'Admin Graph Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])
  return (
    <div>
      <h1>{title}</h1>
      <p>Choose a metric category.</p>
    </div>
  )
}
