import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import {
  loadAll,
  groupEventsByDate,
  activityMapByDate,
  dateRange,
  computeDAU,
  conversionCalc,
  errorRate,
  subsPerDay
} from '../data/analytics.js'

export default function AdminDashboardPage() {
  const title = 'Admin Dashboard'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [data, setData] = useState(null)

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  useEffect(() => {
    loadAll().then(setData)
  }, [])

  const { dates, dau, conv, errRate, subs, period } = useMemo(() => {
    if (!data) return {}
    const { events, activity } = data
    const { map: eventMap } = groupEventsByDate(events)
    const activityMap = activityMapByDate(activity)
    const start = Math.min(
      ...[Object.keys(eventMap)[0], activity[0].date].map(d => new Date(d))
    )
    const end = Math.max(
      ...[Object.keys(eventMap).slice(-1)[0], activity[activity.length - 1].date].map(d => new Date(d))
    )
    const startStr = new Date(start).toISOString().slice(0, 10)
    const endStr = new Date(end).toISOString().slice(0, 10)
    const range = dateRange(startStr, endStr)
    return {
      dates: range,
      dau: computeDAU(range, eventMap),
      conv: conversionCalc(range, activityMap),
      errRate: errorRate(range, activityMap),
      subs: subsPerDay(range, eventMap),
      period: `${startStr} to ${endStr}`
    }
  }, [data])

  if (!data) return <p>Loading...</p>

  const baseOptions = { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }

  return (
    <div>
      <h1>{title}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1rem' }}>
        <Link to="/admin/graph/growth" style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          <Line data={{ labels: dates, datasets: [{ data: dau, borderColor: '#8884d8', tension: 0 }] }} options={baseOptions} />
          <p>Source: events.json, Formula: distinct userId per day, Period: {period}</p>
        </Link>
        <Link to="/admin/graph/engagement" style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          <Line data={{ labels: dates, datasets: [{ data: conv, borderColor: '#82ca9d', tension: 0 }] }} options={baseOptions} />
          <p>Source: activity.json, Formula: signups/visits, Period: {period}</p>
        </Link>
        <Link to="/admin/graph/reliability" style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          <Line data={{ labels: dates, datasets: [{ data: errRate, borderColor: '#ff7300', tension: 0 }] }} options={baseOptions} />
          <p>Source: activity.json, Formula: errors/sessions, Period: {period}</p>
        </Link>
        <Link to="/admin/graph/revenue" style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          <Bar data={{ labels: dates, datasets: [{ data: subs, backgroundColor: '#413ea0' }] }} options={baseOptions} />
          <p>Source: events.json, Formula: count subscribe events per day, Period: {period}</p>
        </Link>
      </div>
    </div>
  )
}

