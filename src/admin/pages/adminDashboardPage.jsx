import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import AuthMessage from '../app/authMessage.jsx'
import { prepareEventMetrics, prepareActivityMetrics, dateExtent } from '../lib/analytics.js'

ChartJS.register(...registerables)

export default function AdminDashboardPage() {
  const title = 'Admin Dashboard'
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

  const dauData = useMemo(() => ({
    labels: eventMetrics.daily.map(d => d.date),
    datasets: [
      {
        label: 'DAU',
        data: eventMetrics.daily.map(d => d.dau),
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136,132,216,0.3)',
        fill: true,
        tension: 0.4
      }
    ]
  }), [eventMetrics])

  const conversionData = useMemo(() => ({
    labels: activityMetrics.daily.map(d => d.date),
    datasets: [
      {
        label: 'Conversion',
        data: activityMetrics.daily.map(d => d.conversion * 100),
        borderColor: '#82ca9d',
        tension: 0.4
      }
    ]
  }), [activityMetrics])

  const errorRateData = useMemo(() => ({
    labels: activityMetrics.daily.map(d => d.date),
    datasets: [
      {
        label: 'Error rate',
        data: activityMetrics.daily.map(d => d.errorRate * 100),
        borderColor: '#ff7300',
        tension: 0.4
      }
    ]
  }), [activityMetrics])

  const subsData = useMemo(() => {
    const labels = Object.keys(eventMetrics.subsPerDay).sort()
    return {
      labels,
      datasets: [
        { label: 'Subscriptions', data: labels.map(l => eventMetrics.subsPerDay[l]), backgroundColor: '#ffc658' }
      ]
    }
  }, [eventMetrics])

  const periodEvents = dateExtent(eventMetrics.daily.map(d => d.date))
  const periodActivity = dateExtent(activityMetrics.daily.map(d => d.date))

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <div>
          <Link to="/admin/graph/growth">
            <Line data={dauData} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} height={100} />
          </Link>
          <p>Source: events.json; Formula: daily unique users; Period: {periodEvents}</p>
        </div>
        <div>
          <Link to="/admin/graph/engagement">
            <Line data={conversionData} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} height={100} />
          </Link>
          <p>Source: activity.json; Formula: signups/visits; Period: {periodActivity}</p>
        </div>
        <div>
          <Link to="/admin/graph/reliability">
            <Line data={errorRateData} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} height={100} />
          </Link>
          <p>Source: activity.json; Formula: errors/sessions; Period: {periodActivity}</p>
        </div>
        <div>
          <Link to="/admin/graph/revenue">
            <Bar data={subsData} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} height={100} />
          </Link>
          <p>Source: events.json; Formula: count(subscribe); Period: {periodEvents}</p>
        </div>
      </div>
    </div>
  )
}

