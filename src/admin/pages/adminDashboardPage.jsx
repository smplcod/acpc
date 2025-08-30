import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import AuthMessage from '../app/authMessage.jsx'
import { useMetrics } from '../app/metrics.js'

ChartJS.register(...registerables)

function Tile({ to, chart, caption }) {
  return (
    <div style={{ width: '200px', margin: '1rem' }}>
      <Link to={to}>{chart}</Link>
      <p style={{ fontSize: '0.8rem' }}>{caption}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const title = 'Admin Dashboard'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const metrics = useMetrics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!metrics) return null

  const dataDays = metrics.days

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Tile
          to="/admin/graph/growth"
          chart={<Line data={{ labels: dataDays, datasets: [{ label: 'DAU', data: metrics.dau, borderColor: 'blue', fill: false }] }} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, elements: { point: { radius: 0 } } }} />}
          caption="Source: events, Formula: distinct userId per day, Period: full"
        />
        <Tile
          to="/admin/graph/engagement"
          chart={<Line data={{ labels: dataDays, datasets: [{ label: 'Conversion', data: metrics.conversion, borderColor: 'green', fill: false }] }} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, elements: { point: { radius: 0 } } }} />}
          caption="Source: activity, Formula: signups/visits, Period: full"
        />
        <Tile
          to="/admin/graph/reliability"
          chart={<Line data={{ labels: dataDays, datasets: [{ label: 'Error rate', data: metrics.errorRate, borderColor: 'red', fill: false }] }} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, elements: { point: { radius: 0 } } }} />}
          caption="Source: activity, Formula: errors/sessions, Period: full"
        />
        <Tile
          to="/admin/graph/revenue"
          chart={<Bar data={{ labels: dataDays, datasets: [{ label: 'Subs', data: metrics.subsPerDay, backgroundColor: 'orange' }] }} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />}
          caption="Source: events, Formula: count subscribe, Period: full"
        />
      </div>
    </div>
  )
}

