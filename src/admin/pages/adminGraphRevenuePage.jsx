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

export default function AdminGraphRevenuePage() {
  const title = 'Revenue Graphs'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const metrics = useMetrics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!metrics) return null

  const funnelLabels = ['visit', 'signup', 'verify', 'login', 'first_action', 'subscribe']
  const subsSegKeys = Array.from(
    new Set([
      ...Object.keys(metrics.subsSegments.plan),
      ...Object.keys(metrics.subsSegments.utmSource),
      ...Object.keys(metrics.subsSegments.country)
    ])
  )

  function segData(attr) {
    const obj = metrics.subsSegments[attr]
    const total = Object.values(obj).reduce((a, b) => a + b, 0) || 1
    return Object.entries(obj).map(([k, v]) => ({ k, v: (v / total) * 100 }))
  }

  const planP = segData('plan')
  const utmP = segData('utmSource')
  const countryP = segData('country')

  const datasetsSeg = subsSegKeys.map(k => ({
    label: k,
    data: [
      planP.find(x => x.k === k)?.v || 0,
      utmP.find(x => x.k === k)?.v || 0,
      countryP.find(x => x.k === k)?.v || 0
    ],
    stack: 's'
  }))

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <section>
        <Bar
          data={{ labels: funnelLabels, datasets: [{ label: 'count', data: funnelLabels.map(l => metrics.funnelTotals[l]), backgroundColor: 'purple' }] }}
        />
        <Caption
          title="Funnel totals"
          goal="drop at each step"
          source="events"
          formula="count of funnel events"
        />
      </section>
      <section>
        <Bar
          data={{ labels: ['plan', 'utmSource', 'country'], datasets: datasetsSeg }}
          options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }}
        />
        <Caption
          title="Subscription segments"
          goal="distribution"
          source="events+users"
          formula="share per plan/utm/country"
        />
      </section>
      <section>
        <Bar
          data={{
            labels: metrics.days,
            datasets: [
              { type: 'bar', label: 'Signups', data: metrics.signupsPerDay, backgroundColor: 'rgba(0,0,255,0.3)', yAxisID: 'y' },
              { type: 'line', label: 'Subscribes', data: metrics.subsPerDay, borderColor: 'green', yAxisID: 'y1' }
            ]
          }}
          options={{ scales: { y: { beginAtZero: true }, y1: { position: 'right', beginAtZero: true } } }}
        />
        <Caption
          title="Signups vs Subscribes"
          goal="free vs paid"
          source="activity+events"
          formula="daily counts"
        />
      </section>
      <section>
        <Line
          data={{ labels: metrics.cumulativeUsers.days, datasets: [{ label: 'Users', data: metrics.cumulativeUsers.counts, borderColor: 'blue', fill: false }] }}
        />
        <Caption
          title="Cumulative users"
          goal="user base growth"
          source="users"
          formula="cumulative signups"
        />
      </section>
    </div>
  )
}

