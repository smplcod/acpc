import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useAnalytics } from '../utils/analytics.js'

ChartJS.register(...registerables)

export default function AdminDashboardPage() {
  const title = 'Admin Dashboard Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const data = useAnalytics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!data) return <p>Loading...</p>

  const period = `${data.dates[0]} – ${data.dates[data.dates.length - 1]}`

  const tiles = [
    {
      title: 'Growth',
      chart: <Line height={80} data={{ labels: data.dates, datasets: [{ data: data.dau, borderColor: '#8884d8', fill: false }] }} options={{ plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}} }} />, link: '/admin/graph/growth', caption: 'Source: events.json; Formula: DAU=distinct userId per day; Period: ' + period
    },
    {
      title: 'Engagement',
      chart: <Line height={80} data={{ labels: data.dates, datasets: [{ data: data.conversion, borderColor: '#82ca9d', fill: false }] }} options={{ plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}} }} />, link: '/admin/graph/engagement', caption: 'Source: activity.json; Formula: signups/visits; Period: ' + period
    },
    {
      title: 'Reliability',
      chart: <Line height={80} data={{ labels: data.dates, datasets: [{ data: data.errorRate, borderColor: '#ff7300', fill: false }] }} options={{ plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}} }} />, link: '/admin/graph/reliability', caption: 'Source: activity.json; Formula: errors/sessions; Period: ' + period
    },
    {
      title: 'Revenue',
      chart: <Bar height={80} data={{ labels: data.dates, datasets: [{ data: data.subsPerDay, backgroundColor: '#ffc658' }] }} options={{ plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}} }} />, link: '/admin/graph/revenue', caption: 'Source: events.json; Formula: subscriptions per day; Period: ' + period
    }
  ]

  return (
    <div>
      <h1>{title}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
        {tiles.map(t => (
          <Link key={t.title} to={t.link} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              {t.chart}
              <p style={{ fontSize: '0.8rem' }}>{t.caption}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
