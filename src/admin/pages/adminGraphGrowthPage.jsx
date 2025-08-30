import { useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import AuthMessage from '../app/authMessage.jsx'
import { useMetrics } from '../app/metrics.js'

ChartJS.register(...registerables)

function Caption({ title, goal, source, formula }) {
  return (
    <p style={{ fontSize: '0.9rem' }}>
      <strong>{title}</strong><br />Goal: {goal}<br />Source: {source}<br />Formula: {formula}<br />Period: full
    </p>
  )
}

export default function AdminGraphGrowthPage() {
  const title = 'Growth Graphs'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const metrics = useMetrics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!metrics) return null

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <section>
        <Line
          data={{
            labels: metrics.days,
            datasets: [
              { label: 'DAU', data: metrics.dau, borderColor: 'blue', backgroundColor: 'rgba(0,0,255,0.2)', fill: true, stack: 'a' },
              { label: 'WAU', data: metrics.wau, borderColor: 'green', backgroundColor: 'rgba(0,255,0,0.2)', fill: true, stack: 'a' },
              { label: 'MAU', data: metrics.mau, borderColor: 'orange', backgroundColor: 'rgba(255,165,0,0.2)', fill: true, stack: 'a' },
              { label: 'SMA7', data: metrics.dauSMA7, borderColor: 'black', fill: false }
            ]
          }}
        />
        <Caption
          title="Active users"
          goal="compare DAU, WAU, MAU"
          source="events"
          formula="distinct users per window"
        />
      </section>
      <section>
        <Line
          data={{
            labels: metrics.days,
            datasets: [
              { label: 'New', data: metrics.newReturning.map(d => d.new), borderColor: 'purple', backgroundColor: 'rgba(128,0,128,0.2)', fill: true, stack: 'b' },
              { label: 'Returning', data: metrics.newReturning.map(d => d.returning), borderColor: 'gray', backgroundColor: 'rgba(128,128,128,0.2)', fill: true, stack: 'b' }
            ]
          }}
        />
        <Caption
          title="New vs Returning"
          goal="share of first-time users"
          source="events"
          formula="first event date"
        />
      </section>
      <section>
        <Line
          data={{
            labels: metrics.days,
            datasets: [
              { label: 'Visits', data: metrics.visits, borderColor: 'blue', fill: false },
              { label: 'Signups', data: metrics.signups, borderColor: 'green', fill: false },
              { label: 'Logins', data: metrics.logins, borderColor: 'orange', fill: false }
            ]
          }}
        />
        <Caption
          title="Funnel daily"
          goal="track visits→signups→logins"
          source="activity"
          formula="counts per day"
        />
      </section>
      <section>
        <Bar
          data={{
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
              { label: 'Logins', data: metrics.loginsByWeekday, backgroundColor: 'teal' }
            ]
          }}
        />
        <Caption
          title="Logins by weekday"
          goal="seasonality"
          source="events"
          formula="count logins per weekday"
        />
      </section>
    </div>
  )
}

