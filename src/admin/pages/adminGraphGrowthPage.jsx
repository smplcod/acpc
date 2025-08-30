import { useEffect, useState, useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import {
  loadAll,
  groupEventsByDate,
  activityMapByDate,
  dateRange,
  computeDAU,
  computeWindowAU,
  computeSMA,
  computeNewReturning,
  visitsPerDay,
  signupsPerDay,
  loginsPerDay,
  loginsByWeekday
} from '../data/analytics.js'

export default function AdminGraphGrowthPage() {
  const title = 'Growth Metrics'
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
    const { map: eventMap, firstSeen } = groupEventsByDate(events)
    const activityMap = activityMapByDate(activity)
    const dates = dateRange(activity[0].date, activity[activity.length - 1].date)
    const dau = computeDAU(dates, eventMap)
    const wau = computeWindowAU(dates, eventMap, 7)
    const mau = computeWindowAU(dates, eventMap, 30)
    const dauSMA = computeSMA(dau, 7)
    const newRet = computeNewReturning(dates, events, firstSeen)
    const visits = visitsPerDay(dates, activityMap)
    const signups = signupsPerDay(dates, activityMap)
    const logins = loginsPerDay(dates, activityMap)
    const loginsWeekday = loginsByWeekday(events)
    return { dates, dau, wau, mau, dauSMA, newRet, visits, signups, logins, loginsWeekday, period: `${dates[0]} to ${dates[dates.length-1]}` }
  }, [data])

  if (!metrics) return <p>Loading...</p>

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div>
      <h1>{title}</h1>
      <section>
        <Line
          data={{
            labels: metrics.dates,
            datasets: [
              { label: 'DAU', data: metrics.dau, borderColor: '#8884d8', backgroundColor: 'rgba(136,132,216,0.3)', fill: true, stack: 'a' },
              { label: 'WAU', data: metrics.wau, borderColor: '#82ca9d', backgroundColor: 'rgba(130,202,157,0.3)', fill: true, stack: 'a' },
              { label: 'MAU', data: metrics.mau, borderColor: '#ffc658', backgroundColor: 'rgba(255,198,88,0.3)', fill: true, stack: 'a' },
              { label: 'DAU SMA7', data: metrics.dauSMA, borderColor: '#ff7300', fill: false }
            ]
          }}
        />
        <p>Goal: compare active user scales; Source: events.json; Formulas: DAU/WAU/MAU, SMA7 on DAU; Period: {metrics.period}</p>
      </section>

      <section>
        <Line
          data={{
            labels: metrics.dates,
            datasets: [
              { label: 'New', data: metrics.newRet.map(d => d.new), borderColor: '#413ea0', backgroundColor: 'rgba(65,62,160,0.3)', fill: true, stack: 'b' },
              { label: 'Returning', data: metrics.newRet.map(d => d.returning), borderColor: '#ff0000', backgroundColor: 'rgba(255,0,0,0.3)', fill: true, stack: 'b' }
            ]
          }}
        />
        <p>Goal: share of new vs returning users; Rule: user is new if no prior events; Source: events.json; Period: {metrics.period}</p>
      </section>

      <section>
        <Line
          data={{
            labels: metrics.dates,
            datasets: [
              { label: 'Visits', data: metrics.visits, borderColor: '#8884d8' },
              { label: 'Signups', data: metrics.signups, borderColor: '#82ca9d' },
              { label: 'Logins', data: metrics.logins, borderColor: '#ff7300' }
            ]
          }}
        />
        <p>Goal: daily funnel dynamics; Source: activity.json; Metrics: visits, signups, logins; Period: {metrics.period}</p>
      </section>

      <section>
        <Bar
          data={{
            labels: weekLabels,
            datasets: [{ label: 'Logins', data: metrics.loginsWeekday, backgroundColor: '#82ca9d' }]
          }}
        />
        <p>Goal: weekday seasonality of logins; Source: events.json; Method: count logins per weekday</p>
      </section>
    </div>
  )
}

