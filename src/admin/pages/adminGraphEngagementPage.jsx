import { useEffect, useState } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import useMetrics from '../app/hooks/useMetrics.js'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, LineChart, ReferenceLine, Legend, BarChart
} from 'recharts'

export default function AdminGraphEngagementPage() {
  const title = 'Engagement Metrics'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const { data, loading, error } = useMetrics()
  const [segment, setSegment] = useState('device')

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (loading) return <div><h1>{fullTitle}</h1><AuthMessage /><p>Loading...</p></div>
  if (error || !data) return <div><h1>{fullTitle}</h1><AuthMessage /><p>No data</p></div>

  const { conversion, stickiness, cohortData, deviceDist, osDist, browserDist } = data
  const segmentMap = { device: deviceDist, os: osDist, browser: browserDist }
  const segmentData = segmentMap[segment]
  const stackData = [segmentData.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {})]
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#a4de6c']

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={conversion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
            <Tooltip formatter={(v, n) => n === 'conversion' ? `${(v * 100).toFixed(1)}%` : v} />
            <Bar yAxisId="left" dataKey="sessions" fill="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={stickiness}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
            <Tooltip formatter={v => `${(v * 100).toFixed(1)}%`} />
            <ReferenceLine y={0.3} stroke="red" strokeDasharray="3 3" />
            <ReferenceLine y={0.5} stroke="green" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={cohortData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cohort" />
            <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
            <Tooltip formatter={v => `${(v * 100).toFixed(1)}%`} />
            <Legend />
            <Bar dataKey="d7" stackId="a" fill="#8884d8" />
            <Bar dataKey="d14" stackId="a" fill="#82ca9d" />
            <Bar dataKey="d28" stackId="a" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <button onClick={() => setSegment('device')}>Device</button>
          <button onClick={() => setSegment('os')}>OS</button>
          <button onClick={() => setSegment('browser')}>Browser</button>
        </div>
        <ResponsiveContainer>
          <BarChart data={stackData}>
            <XAxis hide dataKey="name" />
            <YAxis hide />
            <Tooltip />
            {segmentData.map((d, i) => (
              <Bar key={d.name} dataKey={d.name} stackId="a" fill={colors[i % colors.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
