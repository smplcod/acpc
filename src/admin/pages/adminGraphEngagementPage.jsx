import { useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import AuthMessage from '../app/authMessage.jsx'
import { useMetrics } from '../app/metrics.js'

ChartJS.register(...registerables)

function Caption({ title, goal, source, formula }) {
  return (
    <p style={{ fontSize: '0.9rem' }}>
      <strong>{title}</strong><br />Goal: {goal}<br />Source: {source}<br />Formula: {formula}<br />Period: full
    </p>
  )
}

export default function AdminGraphEngagementPage() {
  const title = 'Engagement Graphs'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const metrics = useMetrics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!metrics) return null

  const platformKeys = Array.from(
    new Set([
      ...Object.keys(metrics.platform.device),
      ...Object.keys(metrics.platform.os),
      ...Object.keys(metrics.platform.browser)
    ])
  )

  function platformData(attr) {
    const obj = metrics.platform[attr]
    const total = Object.values(obj).reduce((a, b) => a + b, 0) || 1
    return Object.entries(obj).map(([k, v]) => ({ k, v: (v / total) * 100 }))
  }

  const deviceP = platformData('device')
  const osP = platformData('os')
  const browserP = platformData('browser')

  const datasetsPlatform = platformKeys.map(k => ({
    label: k,
    data: [
      deviceP.find(x => x.k === k)?.v || 0,
      osP.find(x => x.k === k)?.v || 0,
      browserP.find(x => x.k === k)?.v || 0
    ],
    stack: 's'
  }))

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <section>
        <Bar
          data={{
            labels: metrics.days,
            datasets: [
              { type: 'bar', label: 'Sessions', data: metrics.sessions, backgroundColor: 'rgba(0,0,255,0.3)', yAxisID: 'y' },
              { type: 'line', label: 'Conversion', data: metrics.conversion, borderColor: 'green', yAxisID: 'y1' }
            ]
          }}
          options={{ scales: { y: { beginAtZero: true, stacked: false }, y1: { beginAtZero: true, position: 'right', min: 0, max: 1 } } }}
        />
        <Caption
          title="Sessions vs Conversion"
          goal="load vs signup rate"
          source="activity"
          formula="signups/visits"
        />
      </section>
      <section>
        <Line
          data={{
            labels: metrics.days,
            datasets: [
              { label: 'Stickiness', data: metrics.stickiness, borderColor: 'purple', fill: false },
              { label: '0.3', data: Array(metrics.days.length).fill(0.3), borderColor: 'red', borderDash: [5, 5], fill: false },
              { label: '0.5', data: Array(metrics.days.length).fill(0.5), borderColor: 'green', borderDash: [5, 5], fill: false }
            ]
          }}
          options={{ scales: { y: { min: 0, max: 1 } } }}
        />
        <Caption
          title="Stickiness"
          goal="daily use vs monthly base"
          source="events"
          formula="DAU/MAU"
        />
      </section>
      <section>
        <Bar
          data={{
            labels: metrics.retention.map(r => r.week),
            datasets: [
              { label: 'd+7', data: metrics.retention.map(r => r.d7 * 100) },
              { label: 'd+14', data: metrics.retention.map(r => r.d14 * 100) },
              { label: 'd+28', data: metrics.retention.map(r => r.d28 * 100) }
            ]
          }}
          options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }}
        />
        <Caption
          title="Retention cohorts"
          goal="weekly user retention"
          source="users"
          formula="share active after N days"
        />
      </section>
      <section>
        <Bar
          data={{ labels: ['device', 'os', 'browser'], datasets: datasetsPlatform }}
          options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }}
        />
        <Caption
          title="Platform profile"
          goal="technology mix"
          source="users"
          formula="share of devices/os/browsers"
        />
      </section>
    </div>
  )
}

