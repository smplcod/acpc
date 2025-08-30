import { useEffect, useState, useMemo } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'
import AuthMessage from '../app/authMessage.jsx'
import { prepareEventMetrics, prepareActivityMetrics, dateExtent } from '../lib/analytics.js'

ChartJS.register(...registerables)

export default function AdminGraphGrowthPage() {
  const title = 'Growth metrics'
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

  const labels = eventMetrics.daily.map(d => d.date)

  const dauWauMauData = useMemo(() => ({
    labels,
    datasets: [
      { label: 'DAU', data: eventMetrics.daily.map(d => d.dau), borderColor: '#8884d8', backgroundColor: 'rgba(136,132,216,0.3)', fill: true, stack: 'users', tension: 0.4 },
      { label: 'WAU', data: eventMetrics.daily.map(d => d.wau), borderColor: '#82ca9d', backgroundColor: 'rgba(130,202,157,0.3)', fill: true, stack: 'users', tension: 0.4 },
      { label: 'MAU', data: eventMetrics.daily.map(d => d.mau), borderColor: '#ffc658', backgroundColor: 'rgba(255,198,88,0.3)', fill: true, stack: 'users', tension: 0.4 },
      { label: 'SMA7 DAU', data: eventMetrics.daily.map(d => d.sma7), borderColor: '#ff0000', fill: false, tension: 0.4 }
    ]
  }), [eventMetrics, labels])

  const newReturningData = useMemo(() => ({
    labels,
    datasets: [
      { label: 'New', data: eventMetrics.daily.map(d => d.newUsers), borderColor: '#82ca9d', backgroundColor: 'rgba(130,202,157,0.5)', fill: true, stack: 'nr', tension: 0.4 },
      { label: 'Returning', data: eventMetrics.daily.map(d => d.returning), borderColor: '#8884d8', backgroundColor: 'rgba(136,132,216,0.5)', fill: true, stack: 'nr', tension: 0.4 }
    ]
  }), [eventMetrics, labels])

  const funnelLineData = useMemo(() => ({
    labels: activityMetrics.daily.map(d => d.date),
    datasets: [
      { label: 'Visits', data: activityMetrics.daily.map(d => d.visits), borderColor: '#8884d8', tension: 0.4 },
      { label: 'Signups', data: activityMetrics.daily.map(d => d.signups), borderColor: '#82ca9d', tension: 0.4 },
      { label: 'Logins', data: activityMetrics.daily.map(d => d.logins), borderColor: '#ffc658', tension: 0.4 }
    ]
  }), [activityMetrics])

  const periodEvents = dateExtent(labels)
  const periodActivity = dateExtent(activityMetrics.daily.map(d => d.date))

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <section style={{ marginBottom: '3rem' }}>
        <h3>DAU vs WAU vs MAU with SMA7</h3>
        <div style={{ height: 300 }}>
          <Line data={dauWauMauData} options={{ scales: { y: { stacked: true } } }} />
        </div>
        <p>Goal: compare active user scales; Source: events.json; Formulas: DAU/WAU/MAU, SMA7; Period: {periodEvents}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>New vs Returning users</h3>
        <div style={{ height: 300 }}>
          <Line data={newReturningData} options={{ scales: { y: { stacked: true } } }} />
        </div>
        <p>Goal: share of new and returning; Source: events.json; Method: first event defines "new"; Period: {periodEvents}</p>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h3>Visits, Signups, Logins</h3>
        <div style={{ height: 300 }}>
          <Line data={funnelLineData} />
        </div>
        <p>Goal: funnel dynamics; Source: activity.json; Metrics: daily visits/signups/logins; Period: {periodActivity}</p>
      </section>
    </div>
  )
}

