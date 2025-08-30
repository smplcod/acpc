import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthMessage from '../app/authMessage.jsx'
import useMetrics from '../app/hooks/useMetrics.js'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer } from 'recharts'
import './adminDashboardPage.css'

function Tile({ title, link, children }) {
  return (
    <Link to={link} className="dash-tile">
      <h3>{title}</h3>
      <div className="dash-mini-chart">
        {children}
      </div>
    </Link>
  )
}

export default function AdminDashboardPage() {
  const title = 'Admin Dashboard'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const { data, loading, error } = useMetrics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (loading) return <div><h1>{fullTitle}</h1><AuthMessage /><p>Loading...</p></div>
  if (error || !data) return <div><h1>{fullTitle}</h1><AuthMessage /><p>No data</p></div>

  const { growth, conversion, errorRate, signupsSubscribes } = data

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      <div className="dash-grid">
        <Tile title="Growth" link="/admin/graph/growth">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth}>
              <Line type="monotone" dataKey="dau" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Tile>
        <Tile title="Engagement" link="/admin/graph/engagement">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={conversion}>
              <Line type="monotone" dataKey="conversion" stroke="#82ca9d" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Tile>
        <Tile title="Reliability" link="/admin/graph/reliability">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={errorRate}>
              <Line type="monotone" dataKey="value" stroke="#ff7300" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Tile>
        <Tile title="Revenue" link="/admin/graph/revenue">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={signupsSubscribes}>
              <Bar dataKey="subscribes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Tile>
      </div>
    </div>
  )
}
