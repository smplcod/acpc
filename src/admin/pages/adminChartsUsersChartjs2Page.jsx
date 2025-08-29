import { useEffect } from 'react'
import AuthMessage from '../app/authMessage.jsx'

export default function AdminChartsUsersChartjs2Page() {
  const title = 'Admin Charts Users Chartjs2 Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])
  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <p>Chart.js 2 examples are not implemented yet.</p>
    </div>
  )
}
