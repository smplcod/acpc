import { useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useAnalytics } from '../utils/analytics.js'

const refLines = {
  id: 'refLines',
  afterDraw: chart => {
    const lines = chart.options.refLines || []
    const { ctx, chartArea: { left, right }, scales: { y } } = chart
    lines.forEach(l => {
      const yPos = y.getPixelForValue(l.value)
      ctx.save()
      ctx.strokeStyle = l.color || 'red'
      ctx.beginPath()
      ctx.moveTo(left, yPos)
      ctx.lineTo(right, yPos)
      ctx.stroke()
      ctx.restore()
    })
  }
}

ChartJS.register(...registerables, refLines)

export default function AdminGraphEngagementPage() {
  const title = 'Admin Graph Engagement Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const data = useAnalytics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!data) return <p>Loading...</p>
  const period = `${data.dates[0]} – ${data.dates[data.dates.length - 1]}`

  const mixedSessionsConversion = {
    labels: data.dates,
    datasets: [
      { type: 'bar', label: 'Sessions', data: data.sessions, backgroundColor: '#8884d8', yAxisID: 'y' },
      { type: 'line', label: 'Conversion %', data: data.conversion, borderColor: '#ff7300', yAxisID: 'y1', fill: false }
    ]
  }
  const stickinessLine = {
    labels: data.dates,
    datasets: [
      { label: 'Stickiness', data: data.stickiness, borderColor: '#82ca9d', fill: false }
    ]
  }
  const cohorts = {
    labels: data.cohorts.map(c => c.week),
    datasets: [
      { label: 'd+7', data: data.cohorts.map(c => c.d7), backgroundColor: '#8884d8' },
      { label: 'd+14', data: data.cohorts.map(c => c.d14), backgroundColor: '#82ca9d' },
      { label: 'd+28', data: data.cohorts.map(c => c.d28), backgroundColor: '#ffc658' }
    ]
  }
  const platformStacks = () => {
    const labels = ['Device', 'OS', 'Browser']
    const datasets = []
    Object.entries(data.platforms.device).forEach(([k, v]) => {
      datasets.push({ label: k, data: [v, 0, 0], backgroundColor: '#8884d8', stack: 'device' })
    })
    Object.entries(data.platforms.os).forEach(([k, v]) => {
      datasets.push({ label: k, data: [0, v, 0], backgroundColor: '#82ca9d', stack: 'os' })
    })
    Object.entries(data.platforms.browser).forEach(([k, v]) => {
      datasets.push({ label: k, data: [0, 0, v], backgroundColor: '#ffc658', stack: 'browser' })
    })
    return { labels, datasets }
  }

  return (
    <div>
      <h1>{title}</h1>
      <div>
        <Bar data={mixedSessionsConversion} options={{ scales: { y: { position: 'left' }, y1: { position: 'right', ticks: { callback: v => v + '%' } } } }} />
        <p><strong>Sessions vs Conversion:</strong> Load vs conversion ratio; Source: activity.json; Formula: signups/visits; Period: {period}</p>
      </div>
      <div>
        <Line data={stickinessLine} options={{ refLines: [{ value: 0.3, color: 'red' }, { value: 0.5, color: 'orange' }], plugins: { legend: { display: true } }, scales: { y: { min: 0, max: 1 } } }} />
        <p><strong>Stickiness:</strong> DAU/MAU showing engagement; Source: events.json; Formula: DAU/MAU; Period: {period}</p>
      </div>
      <div>
        <Bar data={cohorts} options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }} />
        <p><strong>Retention cohorts:</strong> d+7/d+14/d+28 retention by signup week; Source: users.json; Method: lastActive - createdAt; Period: all users</p>
      </div>
      <div>
        <Bar data={platformStacks()} options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }} />
        <p><strong>Platform profile:</strong> Device/OS/Browser shares; Source: users.json; Method: distribution of active users; Period: all users</p>
      </div>
    </div>
  )
}
