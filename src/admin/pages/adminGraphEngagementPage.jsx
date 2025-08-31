import { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import { loadMetrics } from '../app/metrics.js'
import './adminGraphEngagementPage.css'

export default function AdminGraphEngagementPage() {
  const title = 'Engagement Metrics'
  const heading = `${title} | Admin Control Panel`
  const fullTitle = `${heading} | ACPC`
  const [data, setData] = useState(null)

  useEffect(() => { document.title = fullTitle }, [fullTitle])
  useEffect(() => { loadMetrics().then(setData) }, [])

  if (!data) return <div className="loading">Loading...</div>
  const { daily, retention, profileDist } = data
  const labels = daily.map(d => d.date)

  const sessionsConvData = {
    labels,
    datasets: [
      { type: 'bar', label: 'sessions', data: daily.map(d => d.sessions), backgroundColor: '#36a2eb', yAxisID: 'y' },
      { type: 'line', label: 'conversion%', data: daily.map(d => d.conversion_calc * 100), borderColor: '#ff6384', yAxisID: 'y1' },
      { type: 'line', label: 'conversion', data: daily.map(d => d.conversion * 100), borderColor: '#4bc0c0', yAxisID: 'y1', borderDash: [5,5] }
    ]
  }

  const stickinessData = {
    labels,
    datasets: [
      { label: 'stickiness', data: daily.map(d => (d.mau ? d.dau / d.mau : 0)), borderColor: '#36a2eb' },
      { label: '0.3', data: labels.map(() => 0.3), borderColor: '#ff0000', borderDash: [5,5], pointRadius: 0 },
      { label: '0.5', data: labels.map(() => 0.5), borderColor: '#00aa00', borderDash: [5,5], pointRadius: 0 }
    ]
  }

  function color(val) {
    return `rgba(54,162,235,${val})`
  }

  const profileData = (() => {
    const labels = ['Device', 'OS', 'Browser']
    const datasets = []
    const blocks = [profileDist.device, profileDist.os, profileDist.browser]
    blocks.forEach((dist, idx) => {
      const total = Object.values(dist).reduce((a,b) => a + b, 0)
      Object.entries(dist).forEach(([k, v]) => {
        const arr = [0,0,0]
        arr[idx] = total ? (v / total) * 100 : 0
        datasets.push({ label: k, data: arr, stack: 's' + idx })
      })
    })
    return { labels, datasets }
  })()

  return (
    <section className="engagement-page">
      <h1>{heading}</h1>
      <section className="engagement-page__content">
        <h2>Sessions vs conversion</h2>
        <div>
          <Bar data={sessionsConvData} options={{ scales: { y: { position: 'left' }, y1: { position: 'right', ticks: { callback: v => v + '%' } } } }} />
          <p>Goal: load vs conversion | Source: activity | Formula: signups/visits Δ to conversion | Period: all dates</p>
        </div>
        <h2>Stickiness</h2>
        <div>
          <Line data={stickinessData} />
          <p>Goal: product stickiness | Source: events | Formula: DAU/MAU | Period: all dates</p>
        </div>
        <h2>Cohort retention</h2>
        <div>
          <table className="engagement-page__table">
            <thead><tr><th>Week</th><th>d+7</th><th>d+14</th><th>d+28</th></tr></thead>
            <tbody>
              {retention.map(r => (
                <tr key={r.cohort}>
                  <td>{r.cohort}</td>
                  <td style={{ background: color(r.d7) }}>{(r.d7 * 100).toFixed(0)}%</td>
                  <td style={{ background: color(r.d14) }}>{(r.d14 * 100).toFixed(0)}%</td>
                  <td style={{ background: color(r.d28) }}>{(r.d28 * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Goal: cohort retention | Source: users | Formula: activity at d+N | Period: all cohorts</p>
        </div>
        <h2>Platform profile</h2>
        <div>
          <Bar data={profileData} options={{ scales: { x: { stacked: true, max: 100 }, y: { stacked: true } } }} />
          <p>Goal: platform profile | Source: users | Period: last 30 days</p>
        </div>
      </section>
    </section>
  )
}
