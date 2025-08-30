import { useEffect, useState, useMemo } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import AuthMessage from '../app/authMessage.jsx'
import { prepareEventMetrics, prepareActivityMetrics, cumulativeUsers, subscriptionSegments, dateExtent } from '../lib/analytics.js'

ChartJS.register(...registerables)

export default function AdminGraphRevenuePage() {
  const title = 'Revenue metrics'
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
  const cumUsers = useMemo(() => cumulativeUsers(users), [users])
  const segments = useMemo(() => {
    const subs = events.filter(e => e.type === 'subscribe')
    return subscriptionSegments(subs, users)
  }, [events, users])

  const funnelData = useMemo(() => ({
    labels: Object.keys(eventMetrics.funnel),
    datasets: [
      { label: 'Count', data: Object.values(eventMetrics.funnel), backgroundColor: '#8884d8' }
    ]
  }), [eventMetrics])

  const signupsSubsData = useMemo(() => {
    const labels = activityMetrics.daily.map(d => d.date)
    return {
      labels,
      datasets: [
        { type: 'bar', label: 'Signups', data: activityMetrics.daily.map(d => d.signups), backgroundColor: '#8884d8' },
        { type: 'line', label: 'Subscriptions', data: labels.map(l => eventMetrics.subsPerDay[l] || 0), borderColor: '#ff7300', yAxisID: 'y1', tension: 0.4 }
      ]
    }
  }, [activityMetrics, eventMetrics])

  const cumulativeUsersData = useMemo(() => ({
    labels: cumUsers.map(c => c.date),
    datasets: [
      { label: 'Users', data: cumUsers.map(c => c.value), borderColor: '#82ca9d', tension: 0.4 }
    ]
  }), [cumUsers])

  const segmentData = useMemo(() => {
    const groups = ['Plan', 'UTM', 'Country']
    const datasets = []
    ;['plan', 'utm', 'country'].forEach((key, idx) => {
      segments[key].forEach(seg => {
        let ds = datasets.find(d => d.label === seg.name)
        if (!ds) {
          ds = { label: seg.name, data: Array(3).fill(0), backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][datasets.length % 4] }
          datasets.push(ds)
        }
        ds.data[idx] = seg.value
      })
    })
    return { labels: groups, datasets }
  }, [segments])

  const periodActivity = dateExtent(activityMetrics.daily.map(d => d.date))
  const periodUsers = dateExtent(cumUsers.map(c => c.date))

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <section style={{ marginBottom: '3rem' }}>
        <h3>Funnel totals</h3>
        <div style={{ height: 300 }}>
          <Bar data={funnelData} />
        </div>
        <p>Goal: drop per step; Source: events.json; Method: count by step; Period: {periodActivity}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Subscription segments</h3>
        <div style={{ height: 300 }}>
          <Bar data={segmentData} options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }} />
        </div>
        <p>Goal: segment shares; Source: events+users; Method: subscription distribution; Period: {periodActivity}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Signups vs Subscribes</h3>
        <div style={{ height: 300 }}>
          <Bar data={signupsSubsData} options={{ scales: { y1: { position: 'right', beginAtZero: true } } }} />
        </div>
        <p>Goal: inflow vs paid conversions; Source: activity+events; Method: signups vs subscribe per day; Period: {periodActivity}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Cumulative users</h3>
        <div style={{ height: 300 }}>
          <Line data={cumulativeUsersData} />
        </div>
        <p>Goal: user base growth; Source: users.json; Method: cumulative count; Period: {periodUsers}</p>
      </section>
    </div>
  )
}

