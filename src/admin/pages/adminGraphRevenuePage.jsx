import { useEffect, useState, useMemo } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import '../app/chartSetup.js'
import {
  loadAll,
  groupEventsByDate,
  activityMapByDate,
  dateRange,
  signupsPerDay,
  subsPerDay,
  funnelTotals,
  subscriptionSegments,
  cumulativeUsers
} from '../data/analytics.js'

export default function AdminGraphRevenuePage() {
  const title = 'Revenue Metrics'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [data, setData] = useState(null)

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  useEffect(() => {
    loadAll().then(setData)
  }, [])

  const metrics = useMemo(() => {
    if (!data) return null
    const { events, activity, users } = data
    const { map: eventMap } = groupEventsByDate(events)
    const activityMap = activityMapByDate(activity)
    const dates = dateRange(activity[0].date, activity[activity.length - 1].date)
    const signups = signupsPerDay(dates, activityMap)
    const subs = subsPerDay(dates, eventMap)
    const funnel = funnelTotals(eventMap)
    const segments = subscriptionSegments(events, users)
    const cumulative = cumulativeUsers(users)
    return { dates, signups, subs, funnel, segments, cumulative, period: `${dates[0]} to ${dates[dates.length-1]}` }
  }, [data])

  if (!metrics) return <p>Loading...</p>

  const funnelLabels = ['visit', 'signup', 'verify', 'login', 'first_action', 'subscribe']
  const segments = metrics.segments
  const segTotals = {
    plan: Object.values(segments.plan).reduce((a, b) => a + b, 0),
    utmSource: Object.values(segments.utmSource).reduce((a, b) => a + b, 0),
    country: Object.values(segments.country).reduce((a, b) => a + b, 0)
  }
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', '#ff0000']
  const segmentDatasets = [
    ...Object.entries(segments.plan).map(([k, v], i) => ({ label: k, data: [(v / segTotals.plan) * 100, 0, 0], stack: 'plan', backgroundColor: colors[i % colors.length] })),
    ...Object.entries(segments.utmSource).map(([k, v], i) => ({ label: k, data: [0, (v / segTotals.utmSource) * 100, 0], stack: 'utm', backgroundColor: colors[(i + 2) % colors.length] })),
    ...Object.entries(segments.country).map(([k, v], i) => ({ label: k, data: [0, 0, (v / segTotals.country) * 100], stack: 'country', backgroundColor: colors[(i + 4) % colors.length] }))
  ]

  return (
    <div>
      <h1>{title}</h1>

      <section>
        <Bar
          data={{ labels: funnelLabels, datasets: [{ label: 'Events', data: funnelLabels.map(l => metrics.funnel[l]), backgroundColor: '#8884d8' }] }}
        />
        <p>Goal: drop-off across funnel steps; Source: events.json</p>
      </section>

      <section>
        <Bar
          data={{ labels: ['Plan', 'UTM', 'Country'], datasets: segmentDatasets }}
          options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }}
        />
        <p>Goal: subscription segments; Source: events.json + users.json</p>
      </section>

      <section>
        <Bar
          data={{
            labels: metrics.dates,
            datasets: [
              { label: 'Signups', data: metrics.signups, backgroundColor: '#82ca9d' },
              { label: 'Subscribes', data: metrics.subs, type: 'line', borderColor: '#ff7300', yAxisID: 'y1' }
            ]
          }}
          options={{ scales: { y: { beginAtZero: true }, y1: { beginAtZero: true, position: 'right' } } }}
        />
        <p>Goal: inflow vs paid conversions; Sources: activity.json & events.json; Period: {metrics.period}</p>
      </section>

      <section>
        <Line
          data={{ labels: metrics.cumulative.dates, datasets: [{ label: 'Cumulative users', data: metrics.cumulative.values, borderColor: '#413ea0' }] }}
        />
        <p>Goal: user base growth; Source: users.json</p>
      </section>
    </div>
  )
}

