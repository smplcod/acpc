import { useEffect, useState, useMemo } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import AuthMessage from '../app/authMessage.jsx'
import { prepareEventMetrics, prepareActivityMetrics, dateExtent } from '../lib/analytics.js'

ChartJS.register(...registerables)

export default function AdminGraphReliabilityPage() {
  const title = 'Reliability metrics'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [events, setEvents] = useState([])
  const [activity, setActivity] = useState([])

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  useEffect(() => {
    fetch('/mocks/events.json').then(r => r.json()).then(setEvents)
    fetch('/mocks/activity.json').then(r => r.json()).then(setActivity)
  }, [])

  const eventMetrics = useMemo(() => prepareEventMetrics(events), [events])
  const activityMetrics = useMemo(() => prepareActivityMetrics(activity), [activity])

  const errorRateData = useMemo(() => ({
    labels: activityMetrics.daily.map(d => d.date),
    datasets: [
      { label: 'Error rate', data: activityMetrics.daily.map(d => d.errorRate * 100), borderColor: '#ff7300', tension: 0.4 }
    ]
  }), [activityMetrics])

  const codes = useMemo(() => {
    const set = new Set()
    activityMetrics.daily.forEach(d => Object.keys(d.errorsByCode).forEach(c => set.add(c)))
    return Array.from(set).sort()
  }, [activityMetrics])

  const errorsByCodeData = useMemo(() => ({
    labels: activityMetrics.daily.map(d => d.date),
    datasets: codes.map((c, i) => ({
      label: c,
      data: activityMetrics.daily.map(d => d.errorsByCode[c] || 0),
      borderColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][i % 4],
      backgroundColor: ['rgba(136,132,216,0.5)','rgba(130,202,157,0.5)','rgba(255,198,88,0.5)','rgba(255,115,0,0.5)'][i % 4],
      fill: true,
      stack: 'codes',
      tension: 0.4
    }))
  }), [activityMetrics, codes])

  const paretoData = useMemo(() => {
    const entries = Object.entries(activityMetrics.errorCodes).sort((a, b) => b[1] - a[1])
    let cumulative = 0
    const total = entries.reduce((a, b) => a + b[1], 0)
    const labels = entries.map(e => e[0])
    const counts = entries.map(e => e[1])
    const cumulativePct = entries.map(e => {
      cumulative += e[1]
      return (cumulative / total) * 100
    })
    return {
      labels,
      datasets: [
        { type: 'bar', label: 'Errors', data: counts, backgroundColor: '#8884d8' },
        { type: 'line', label: 'Cumulative %', data: cumulativePct, borderColor: '#ff0000', yAxisID: 'y1', tension: 0.4 }
      ]
    }
  }, [activityMetrics])

  const errorsByPageData = useMemo(() => ({
    labels: eventMetrics.errorsByPage.map(e => e.page),
    datasets: [
      { label: 'Errors', data: eventMetrics.errorsByPage.map(e => e.value), backgroundColor: '#82ca9d' }
    ]
  }), [eventMetrics])

  const periodActivity = dateExtent(activityMetrics.daily.map(d => d.date))

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <section style={{ marginBottom: '3rem' }}>
        <h3>Error rate</h3>
        <div style={{ height: 300 }}>
          <Line data={errorRateData} />
        </div>
        <p>Goal: stability per session; Source: activity.json; Formula: errors/sessions; Period: {periodActivity}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Errors by code</h3>
        <div style={{ height: 300 }}>
          <Line data={errorsByCodeData} options={{ scales: { y: { stacked: true } } }} />
        </div>
        <p>Goal: incident structure; Source: activity.json; Method: errors grouped by code; Period: {periodActivity}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Pareto of error codes</h3>
        <div style={{ height: 300 }}>
          <Bar data={paretoData} options={{ scales: { y1: { position: 'right', beginAtZero: true, max: 100 } } }} />
        </div>
        <p>Goal: 80/20 of problems; Source: activity.json; Method: cumulative percent; Period: {periodActivity}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Errors by page</h3>
        <div style={{ height: 300 }}>
          <Bar data={errorsByPageData} options={{ indexAxis: 'y' }} />
        </div>
        <p>Goal: problematic pages; Source: events.json; Metric: error events per page; Period: {periodActivity}</p>
      </section>
    </div>
  )
}

