import { useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useAnalytics } from '../utils/analytics.js'

ChartJS.register(...registerables)

export default function AdminGraphRevenuePage() {
  const title = 'Admin Graph Revenue Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const data = useAnalytics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!data) return <p>Loading...</p>
  const period = `${data.dates[0]} – ${data.dates[data.dates.length - 1]}`

  const funnel = {
    labels: Object.keys(data.funnelTotals),
    datasets: [
      { label: 'Count', data: Object.values(data.funnelTotals), backgroundColor: '#8884d8' }
    ]
  }
  const segChart = () => {
    const labels = ['Plan', 'UTM', 'Country']
    const datasets = []
    Object.entries(data.seg.plan).forEach(([k, v]) => datasets.push({ label: k, data: [v, 0, 0], backgroundColor: '#8884d8', stack: 'plan' }))
    Object.entries(data.seg.utmSource).forEach(([k, v]) => datasets.push({ label: k, data: [0, v, 0], backgroundColor: '#82ca9d', stack: 'utm' }))
    Object.entries(data.seg.country).forEach(([k, v]) => datasets.push({ label: k, data: [0, 0, v], backgroundColor: '#ffc658', stack: 'country' }))
    return { labels, datasets }
  }
  const signupSub = {
    labels: data.dates,
    datasets: [
      { type: 'bar', label: 'Signups', data: data.signups, backgroundColor: '#8884d8', yAxisID: 'y' },
      { type: 'line', label: 'Subscriptions', data: data.subsPerDay, borderColor: '#ff7300', fill: false, yAxisID: 'y1' }
    ]
  }
  const cumulative = {
    labels: data.cumulativeUsers.map(c => c.date),
    datasets: [
      { label: 'Users', data: data.cumulativeUsers.map(c => c.count), borderColor: '#82ca9d', fill: false }
    ]
  }

  return (
    <div>
      <h1>{title}</h1>
      <div>
        <Bar data={funnel} />
        <p><strong>Funnel totals:</strong> Drop-off per step; Source: events.json; Method: count events by type; Period: {period}</p>
      </div>
      <div>
        <Bar data={segChart()} options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }} />
        <p><strong>Subscription segments:</strong> Shares by plan/utm/country; Source: events+users.json; Method: join subscribe→users; Period: {period}</p>
      </div>
      <div>
        <Bar data={signupSub} options={{ scales: { y: { position: 'left' }, y1: { position: 'right' } } }} />
        <p><strong>Signups vs Subs:</strong> Free vs paid flow; Source: activity/events; Method: daily signups and subscriptions; Period: {period}</p>
      </div>
      <div>
        <Line data={cumulative} />
        <p><strong>Cumulative users:</strong> Base growth; Source: users.json; Method: cumulative sum by createdAt; Period: full user history</p>
      </div>
    </div>
  )
}
