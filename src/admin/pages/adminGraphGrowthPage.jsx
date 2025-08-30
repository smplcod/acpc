import { useEffect } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import useMetrics from '../app/hooks/useMetrics.js'
import {
  AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

export default function AdminGraphGrowthPage() {
  const title = 'Growth Metrics'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const { data, loading, error } = useMetrics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (loading) return <div><h1>{fullTitle}</h1><AuthMessage /><p>Loading...</p></div>
  if (error || !data) return <div><h1>{fullTitle}</h1><AuthMessage /><p>No data</p></div>

  const { growth, newReturning, visitsSignupsLogins } = data

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={growth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="dau" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="wau" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            <Area type="monotone" dataKey="mau" stackId="1" stroke="#ffc658" fill="#ffc658" />
            <Line type="monotone" dataKey="dauSMA7" stroke="#ff7300" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={newReturning}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="new" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="returning" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={visitsSignupsLogins}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visits" stroke="#8884d8" />
            <Line type="monotone" dataKey="signups" stroke="#82ca9d" />
            <Line type="monotone" dataKey="logins" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
