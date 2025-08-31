import { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import { loadMetrics } from '../app/metrics.js'
import './adminGraphGrowthPage.css'

export default function AdminGraphGrowthPage() {
  const title = 'Growth Metrics'
  const heading = `${title} | Admin Control Panel`
  const fullTitle = `${heading} | ACPC`
  const [data, setData] = useState(null)

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  useEffect(() => {
    loadMetrics().then(setData)
  }, [])

  if (!data) return <div className="loading">Loading...</div>
  const { daily, loginsByWeekday } = data
  const labels = daily.map(d => d.date)

  const areaData = {
    labels,
    datasets: [
      {
        label: 'DAU',
        data: daily.map(d => d.dau),
        type: 'line',
        fill: true,
        stack: 'aud',
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)'
      },
      {
        label: 'WAU',
        data: daily.map(d => d.wau),
        type: 'line',
        fill: true,
        stack: 'aud',
        backgroundColor: 'rgba(255,206,86,0.4)',
        borderColor: 'rgba(255,206,86,1)'
      },
      {
        label: 'MAU',
        data: daily.map(d => d.mau),
        type: 'line',
        fill: true,
        stack: 'aud',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)'
      },
      {
        label: 'SMA7',
        data: daily.map(d => d.sma7),
        type: 'line',
        fill: false,
        borderColor: '#000'
      }
    ]
  }

  const newReturningData = {
    labels,
    datasets: [
      {
        label: 'New',
        data: daily.map(d => d.newUsers),
        type: 'line',
        fill: true,
        stack: 'nr',
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)'
      },
      {
        label: 'Returning',
        data: daily.map(d => d.returningUsers),
        type: 'line',
        fill: true,
        stack: 'nr',
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)'
      }
    ]
  }

  const funnelTopData = {
    labels,
    datasets: [
      { label: 'visits', data: daily.map(d => d.visits), borderColor: '#36a2eb' },
      { label: 'signups', data: daily.map(d => d.signups), borderColor: '#ff6384' },
      { label: 'logins', data: daily.map(d => d.logins), borderColor: '#4bc0c0' }
    ]
  }

  const weekdayData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Logins', data: loginsByWeekday, backgroundColor: '#ffcd56' }
    ]
  }

  return (
    <section className="growth-page">
      <h1>{heading}</h1>
      <section className="growth-page__content">
        <h3>Active audience</h3>
        <div>
          <Line data={areaData} options={{ stacked: true }} />
          <p>Goal: compare active audiences | Source: events | Formula: DAU/WAU/MAU/SMA7 | Period: all dates</p>
        </div>
        <h3>New vs returning</h3>
        <div>
          <Line data={newReturningData} options={{ stacked: true }} />
          <p>Goal: share of new vs returning | Source: events | Formula: rule "new" | Period: all dates</p>
        </div>
        <h3>Top of funnel</h3>
        <div>
          <Line data={funnelTopData} />
          <p>Goal: upper funnel dynamics | Source: activity | Period: all dates</p>
        </div>
        <h3>Logins by weekday</h3>
        <div>
          <Bar data={weekdayData} />
          <p>Goal: seasonality | Source: events | Formula: aggregate by weekday | Period: all dates</p>
        </div>
      </section>
    </section>
  )
}
