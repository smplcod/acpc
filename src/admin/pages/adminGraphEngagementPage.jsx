import { useEffect, useState, useMemo } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import AuthMessage from '../app/authMessage.jsx'
import { prepareEventMetrics, prepareActivityMetrics, prepareRetention, dateExtent } from '../lib/analytics.js'

ChartJS.register(...registerables)

export default function AdminGraphEngagementPage() {
  const title = 'Engagement metrics'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [events, setEvents] = useState([])
  const [activity, setActivity] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  useEffect(() => {
    fetch('/mocks/events.json').then(r => r.json()).then(setEvents)
    fetch('/mocks/activity.json').then(r => r.json()).then(setActivity)
    fetch('/mocks/users.json').then(r => r.json()).then(setUsers)
  }, [])

  const eventMetrics = useMemo(() => prepareEventMetrics(events), [events])
  const activityMetrics = useMemo(() => prepareActivityMetrics(activity), [activity])
  const retention = useMemo(() => prepareRetention(users), [users])

  const sessionsConversionData = useMemo(() => ({
    labels: activityMetrics.daily.map(d => d.date),
    datasets: [
      { type: 'bar', label: 'Sessions', data: activityMetrics.daily.map(d => d.sessions), backgroundColor: '#8884d8' },
      { type: 'line', label: 'Conversion %', data: activityMetrics.daily.map(d => d.conversion * 100), borderColor: '#ff7300', yAxisID: 'y1', tension: 0.4 }
    ]
  }), [activityMetrics])

  const stickinessData = useMemo(() => ({
    labels: eventMetrics.daily.map(d => d.date),
    datasets: [
      { label: 'Stickiness', data: eventMetrics.daily.map(d => (d.mau ? d.dau / d.mau : 0)), borderColor: '#82ca9d', tension: 0.4 },
      { label: '0.3', data: eventMetrics.daily.map(() => 0.3), borderColor: '#ff0000', borderDash: [5, 5], pointRadius: 0 },
      { label: '0.5', data: eventMetrics.daily.map(() => 0.5), borderColor: '#ff0000', borderDash: [5, 5], pointRadius: 0 }
    ]
  }), [eventMetrics])

  const retentionData = useMemo(() => ({
    labels: retention.map(r => r.week),
    datasets: [
      { label: 'd+7', data: retention.map(r => r.d7), backgroundColor: '#8884d8', stack: 'ret' },
      { label: 'd+14', data: retention.map(r => r.d14), backgroundColor: '#82ca9d', stack: 'ret' },
      { label: 'd+28', data: retention.map(r => r.d28), backgroundColor: '#ffc658', stack: 'ret' }
    ]
  }), [retention])

  const periodActivity = dateExtent(activityMetrics.daily.map(d => d.date))
  const periodEvents = dateExtent(eventMetrics.daily.map(d => d.date))

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <section style={{ marginBottom: '3rem' }}>
        <h3>Sessions vs Conversion</h3>
        <div style={{ height: 300 }}>
          <Bar
            data={sessionsConversionData}
            options={{
              responsive: true,
              scales: { y: { beginAtZero: true }, y1: { position: 'right', beginAtZero: true, ticks: { callback: v => `${v}%` } } }
            }}
          />
        </div>
        <p>Goal: load vs conversion; Source: activity.json; Formula: signups/visits; Period: {periodActivity}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Stickiness (DAU/MAU)</h3>
        <div style={{ height: 300 }}>
          <Line data={stickinessData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 1 } } }} />
        </div>
        <p>Goal: product stickiness; Source: events.json; Formula: DAU/MAU; Period: {periodEvents}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Retention cohorts</h3>
        <div style={{ height: 300 }}>
          <Bar data={retentionData} options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }} />
        </div>
        <p>Goal: cohort retention; Source: users.json; Method: lastActive vs createdAt; Period: all time</p>
      </section>
    </div>
  )
}

