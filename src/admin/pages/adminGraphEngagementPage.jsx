import { useEffect, useState, useMemo } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import '../app/chartSetup.js'
import {
  loadAll,
  groupEventsByDate,
  activityMapByDate,
  dateRange,
  computeDAU,
  computeWindowAU,
  conversionCalc,
  sessionsPerDay,
  retentionCohorts,
  platformDistribution
} from '../data/analytics.js'

export default function AdminGraphEngagementPage() {
  const title = 'Engagement Metrics'
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
    const dau = computeDAU(dates, eventMap)
    const mau = computeWindowAU(dates, eventMap, 30)
    const stickiness = dau.map((v, i) => (mau[i] ? v / mau[i] : 0))
    const conv = conversionCalc(dates, activityMap)
    const sessions = sessionsPerDay(dates, activityMap)
    const cohorts = retentionCohorts(users)
    const platforms = platformDistribution(users)
    return { dates, stickiness, conv, sessions, cohorts, platforms, period: `${dates[0]} to ${dates[dates.length-1]}` }
  }, [data])

  if (!metrics) return <p>Loading...</p>

  const cohortDatasets = ['d7', 'd14', 'd28'].map((k, idx) => ({
    label: k,
    data: metrics.cohorts.data.map(c => (c[k] / c.total) * 100),
    backgroundColor: ['#8884d8', '#82ca9d', '#ffc658'][idx]
  }))

  const plat = metrics.platforms
  const totalDevice = Object.values(plat.device).reduce((a, b) => a + b, 0)
  const totalOs = Object.values(plat.os).reduce((a, b) => a + b, 0)
  const totalBrowser = Object.values(plat.browser).reduce((a, b) => a + b, 0)
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', '#ff0000']
  const platformDatasets = [
    ...Object.entries(plat.device).map(([k, v], i) => ({ label: k, data: [(v / totalDevice) * 100, 0, 0], stack: 'device', backgroundColor: colors[i % colors.length] })),
    ...Object.entries(plat.os).map(([k, v], i) => ({ label: k, data: [0, (v / totalOs) * 100, 0], stack: 'os', backgroundColor: colors[(i + 2) % colors.length] })),
    ...Object.entries(plat.browser).map(([k, v], i) => ({ label: k, data: [0, 0, (v / totalBrowser) * 100], stack: 'browser', backgroundColor: colors[(i + 4) % colors.length] }))
  ]

  return (
    <div>
      <h1>{title}</h1>

      <section>
        <Bar
          data={{
            labels: metrics.dates,
            datasets: [
              { label: 'Sessions', data: metrics.sessions, backgroundColor: '#8884d8' },
              { label: 'Conversion', data: metrics.conv.map(v => v * 100), type: 'line', borderColor: '#ff7300', yAxisID: 'y1' }
            ]
          }}
          options={{ scales: { y: { beginAtZero: true }, y1: { beginAtZero: true, position: 'right' } } }}
        />
        <p>Goal: load vs conversion; Formula: signups/visits; Source: activity.json; Period: {metrics.period}</p>
      </section>

      <section>
        <Line
          data={{
            labels: metrics.dates,
            datasets: [
              { label: 'Stickiness', data: metrics.stickiness, borderColor: '#82ca9d' },
              { label: '0.3', data: metrics.dates.map(() => 0.3), borderColor: '#ff0000', borderDash: [5, 5] },
              { label: '0.5', data: metrics.dates.map(() => 0.5), borderColor: '#0000ff', borderDash: [5, 5] }
            ]
          }}
          options={{ scales: { y: { beginAtZero: true, max: 1 } } }}
        />
        <p>Goal: product stickiness; Formula: DAU/MAU; Source: events.json; Reference lines at 0.3 and 0.5; Period: {metrics.period}</p>
      </section>

      <section>
        <Bar
          data={{ labels: metrics.cohorts.weeks, datasets: cohortDatasets }}
          options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }}
        />
        <p>Goal: retention by cohorts; Method: lastActiveAt vs createdAt; Source: users.json</p>
      </section>

      <section>
        <Bar
          data={{ labels: ['Device', 'OS', 'Browser'], datasets: platformDatasets }}
          options={{ scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }}
        />
        <p>Goal: platform profile of active users; Source: users.json; Metric: share of device/os/browser</p>
      </section>
    </div>
  )
}

