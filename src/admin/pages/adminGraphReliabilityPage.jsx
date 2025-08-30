import { useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
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

export default function AdminGraphReliabilityPage() {
  const title = 'Reliability Graphs'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const metrics = useMetrics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!metrics) return null

  const codes = Object.keys(metrics.codeTotals)

  const pareto = (() => {
    const entries = Object.entries(metrics.codeTotals).sort((a, b) => b[1] - a[1])
    let cum = 0
    const total = entries.reduce((a, b) => a + b[1], 0) || 1
    const bars = entries.map(([, v]) => v)
    const line = entries.map(([, v]) => {
      cum += v
      return (cum / total) * 100
    })
    const labels = entries.map(([code]) => code)
    return { labels, bars, line }
  })()

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <section>
        <Line
          data={{
            labels: metrics.days,
            datasets: [
              { label: 'Error rate', data: metrics.errorRate, borderColor: 'red', fill: false },
              { label: 'SLO', data: Array(metrics.days.length).fill(0.05), borderColor: 'green', borderDash: [5, 5], fill: false }
            ]
          }}
        />
        <Caption
          title="Error rate"
          goal="stability per session"
          source="activity"
          formula="errors/sessions"
        />
      </section>
      <section>
        <Line
          data={{
            labels: metrics.days,
            datasets: codes.map(code => ({
              label: code,
              data: metrics.days.map(d => metrics.errorsByCodePerDay[d][code] || 0),
              fill: true
            }))
          }}
          options={{ scales: { x: { stacked: true }, y: { stacked: true } } }}
        />
        <Caption
          title="Errors by code"
          goal="incident structure"
          source="activity"
          formula="daily counts per code"
        />
      </section>
      <section>
        <Bar
          data={{
            labels: pareto.labels,
            datasets: [
              { type: 'bar', label: 'Errors', data: pareto.bars, backgroundColor: 'orange', yAxisID: 'y' },
              { type: 'line', label: 'Cum %', data: pareto.line, borderColor: 'blue', yAxisID: 'y1' }
            ]
          }}
          options={{ scales: { y: { beginAtZero: true }, y1: { position: 'right', min: 0, max: 100 } } }}
        />
        <Caption
          title="Pareto codes"
          goal="80/20 problems"
          source="activity"
          formula="cumulative share"
        />
      </section>
      <section>
        <Bar
          data={{
            labels: metrics.errorPagesTop.map(p => p[0]),
            datasets: [
              { label: 'Errors', data: metrics.errorPagesTop.map(p => p[1]), backgroundColor: 'teal' }
            ]
          }}
          options={{ indexAxis: 'y' }}
        />
        <Caption
          title="Errors by page"
          goal="problem pages"
          source="events"
          formula="top 10 error pages"
        />
      </section>
    </div>
  )
}

