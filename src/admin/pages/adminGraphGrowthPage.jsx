import { useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useAnalytics } from '../utils/analytics.js'

ChartJS.register(...registerables)

export default function AdminGraphGrowthPage() {
  const title = 'Admin Graph Growth Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const data = useAnalytics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!data) return <p>Loading...</p>
  const period = `${data.dates[0]} – ${data.dates[data.dates.length - 1]}`

  const areaStack = {
    labels: data.dates,
    datasets: [
      { label: 'DAU', data: data.dau, borderColor: '#8884d8', backgroundColor: '#8884d8', fill: true, stack: 'a' },
      { label: 'WAU', data: data.wau, borderColor: '#82ca9d', backgroundColor: '#82ca9d', fill: true, stack: 'a' },
      { label: 'MAU', data: data.mau, borderColor: '#ffc658', backgroundColor: '#ffc658', fill: true, stack: 'a' },
      { label: 'SMA7', data: data.sma7, borderColor: '#ff7300', fill: false }
    ]
  }
  const newReturn = {
    labels: data.dates,
    datasets: [
      { label: 'New', data: data.newUsers, borderColor: '#413ea0', backgroundColor: '#413ea0', fill: true, stack: 'b' },
      { label: 'Returning', data: data.returningUsers, borderColor: '#82ca9d', backgroundColor: '#82ca9d', fill: true, stack: 'b' }
    ]
  }
  const funnelLines = {
    labels: data.dates,
    datasets: [
      { label: 'Visits', data: data.visits, borderColor: '#8884d8', fill: false },
      { label: 'Signups', data: data.signups, borderColor: '#82ca9d', fill: false },
      { label: 'Logins', data: data.logins, borderColor: '#ff7300', fill: false }
    ]
  }
  const loginsByWeekday = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Logins', data: data.loginsByWeekday, backgroundColor: '#8884d8' }
    ]
  }

  return (
    <div>
      <h1>{title}</h1>
      <div>
        <Line data={areaStack} options={{ plugins: { title: { display: false } } }} />
        <p><strong>DAU/WAU/MAU:</strong> Compare active user base sizes; Source: events.json; Method: distinct user counts with 7/30-day windows and SMA7; Period: {period}</p>
      </div>
      <div>
        <Line data={newReturn} options={{ plugins: { title: { display: false } }, scales: { y: { stacked: true } } }} />
        <p><strong>New vs Returning:</strong> Share of first-time vs repeat users; Source: events.json; Method: classify by first event; Period: {period}</p>
      </div>
      <div>
        <Line data={funnelLines} />
        <p><strong>Visits/Signups/Logins:</strong> Daily funnel progression; Source: activity.json; Method: direct counts per day; Period: {period}</p>
      </div>
      <div>
        <Bar data={loginsByWeekday} />
        <p><strong>Logins by Weekday:</strong> Seasonality pattern; Source: events.json; Method: count logins grouped by weekday; Period: {period}</p>
      </div>
    </div>
  )
}
