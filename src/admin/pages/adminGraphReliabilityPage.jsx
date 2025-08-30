import { useEffect, useState, useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import {
  loadAll,
  groupEventsByDate,
  activityMapByDate,
  dateRange,
  errorRate,
  errorsByCodePerDay,
  errorTotalsByCode,
  errorEventsByPage
} from '../data/analytics.js'

export default function AdminGraphReliabilityPage() {
  const title = 'Reliability Metrics'
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
    const { events, activity } = data
    const { map: eventMap } = groupEventsByDate(events)
    const activityMap = activityMapByDate(activity)
    const dates = dateRange(activity[0].date, activity[activity.length - 1].date)
    const errRate = errorRate(dates, activityMap)
    const codePerDay = errorsByCodePerDay(dates, activityMap)
    const totals = errorTotalsByCode(activity)
    const byPage = errorEventsByPage(eventMap)
    return { dates, errRate, codePerDay, totals, byPage, period: `${dates[0]} to ${dates[dates.length-1]}` }
  }, [data])

  if (!metrics) return <p>Loading...</p>

  const slo = 0.02

  return (
    <div>
      <h1>{title}</h1>

      <section>
        <Line
          data={{
            labels: metrics.dates,
            datasets: [
              { label: 'Error rate', data: metrics.errRate, borderColor: '#ff7300' },
              { label: 'SLO', data: metrics.dates.map(() => slo), borderColor: '#000', borderDash: [5, 5] }
            ]
          }}
          options={{ scales: { y: { beginAtZero: true } } }}
        />
        <p>Goal: stability per session; Formula: errors/sessions; Source: activity.json; Period: {metrics.period}</p>
      </section>

      <section>
        <Line
          data={{
            labels: metrics.dates,
            datasets: metrics.codePerDay.codes.map((c, i) => ({
              label: c,
              data: metrics.codePerDay.data[c],
              borderColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][i],
              backgroundColor: ['rgba(136,132,216,0.3)', 'rgba(130,202,157,0.3)', 'rgba(255,198,88,0.3)', 'rgba(255,115,0,0.3)'][i],
              fill: true,
              stack: 'codes'
            }))
          }}
        />
        <p>Goal: error structure by code; Source: activity.json</p>
      </section>

      <section>
        <Bar
          data={{
            labels: metrics.totals.entries.map(e => e[0]),
            datasets: [
              { label: 'Errors', data: metrics.totals.entries.map(e => e[1]), backgroundColor: '#8884d8' },
              { label: 'Cum %', data: metrics.totals.cumPct.map(c => c.pct), type: 'line', borderColor: '#ff0000', yAxisID: 'y1' }
            ]
          }}
          options={{ scales: { y: { beginAtZero: true }, y1: { beginAtZero: true, max: 100, position: 'right' } } }}
        />
        <p>Goal: Pareto of error codes; Source: activity.json</p>
      </section>

      <section>
        <Bar
          data={{
            labels: metrics.byPage.map(p => p[0]),
            datasets: [
              { label: 'Errors', data: metrics.byPage.map(p => p[1]), backgroundColor: '#82ca9d' }
            ]
          }}
          options={{ indexAxis: 'y' }}
        />
        <p>Goal: problematic pages; Source: events.json; Method: error events per page (top 10)</p>
      </section>
    </div>
  )
}

