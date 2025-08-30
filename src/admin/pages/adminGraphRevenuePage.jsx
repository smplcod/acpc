import { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import { loadMetrics } from '../app/metrics.js'

export default function AdminGraphRevenuePage() {
  const title = 'Revenue Metrics'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [data, setData] = useState(null)

  useEffect(() => { document.title = fullTitle }, [fullTitle])
  useEffect(() => { loadMetrics().then(setData) }, [])

  if (!data) return <div>Loading...</div>
  const { daily, funnel, seg, cumulativeUsers } = data
  const labels = daily.map(d => d.date)

  const funnelLabels = ['visit','signup','verify','login','first_action','subscribe']
  const funnelData = {
    labels: funnelLabels,
    datasets: [ { label: 'count', data: funnelLabels.map(s => funnel[s]), backgroundColor: '#36a2eb' } ]
  }

  const segData = (() => {
    const labels = ['plan','utmSource','country']
    const datasets = []
    const blocks = [seg.plan, seg.utmSource, seg.country]
    blocks.forEach((dist, idx) => {
      const total = Object.values(dist).reduce((a,b)=>a+b,0)
      Object.entries(dist).forEach(([k,v]) => {
        const arr = [0,0,0]
        arr[idx] = total ? (v/total)*100 : 0
        datasets.push({ label: k, data: arr, stack: 's'+idx })
      })
    })
    return { labels, datasets }
  })()

  const signupSubData = {
    labels,
    datasets: [
      { type: 'bar', label: 'signups', data: daily.map(d => d.signups), backgroundColor: '#36a2eb', yAxisID: 'y' },
      { type: 'line', label: 'subscribe', data: daily.map(d => d.subs), borderColor: '#ff6384', yAxisID: 'y1' }
    ]
  }

  const cumulativeData = {
    labels: cumulativeUsers.map(d => d.date),
    datasets: [ { label: 'users', data: cumulativeUsers.map(d => d.value), borderColor: '#4bc0c0' } ]
  }

  return (
    <div>
      <h1>{fullTitle}</h1>
      <div style={{ maxWidth: '800px' }}>
        <h2>Acquisition Funnel</h2>
        <Bar data={funnelData} />
        <p>Goal: step drop-off | Source: events | Formula: funnel totals | Period: all dates</p>
        <p>Shows counts at each step of the funnel.</p>

        <h2>Subscriber Segments</h2>
        <Bar data={segData} options={{ scales: { x: { stacked: true, max: 100 }, y: { stacked: true } } }} />
        <p>Goal: paying segments | Source: events+users | Period: all subs</p>
        <p>Shows distribution by plan, UTM source, and country.</p>

        <h2>Signups vs Subscriptions</h2>
        <Bar data={signupSubData} options={{ scales: { y: { position: 'left' }, y1: { position: 'right' } } }} />
        <p>Goal: inflow vs paid conversions | Source: activity+events | Period: all dates</p>
        <p>Shows daily signups compared to subscriptions.</p>

        <h2>Cumulative Users</h2>
        <Line data={cumulativeData} />
        <p>Goal: user base growth | Source: users | Period: all dates</p>
        <p>Shows total user count over time.</p>
      </div>
    </div>
  )
}
