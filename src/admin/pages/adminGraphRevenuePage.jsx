import { useEffect, useState } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import useMetrics from '../app/hooks/useMetrics.js'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, LineChart
} from 'recharts'

export default function AdminGraphRevenuePage() {
  const title = 'Revenue Metrics'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const { data, loading, error } = useMetrics()
  const [segment, setSegment] = useState('plan')

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (loading) return <div><h1>{fullTitle}</h1><AuthMessage /><p>Loading...</p></div>
  if (error || !data) return <div><h1>{fullTitle}</h1><AuthMessage /><p>No data</p></div>

  const { funnel, segmentData, signupsSubscribes, cumulative } = data
  const seg = segmentData[segment]
  const stackData = [seg.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {})]
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#a4de6c']

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <FunnelChart>
            <Tooltip />
            <Funnel dataKey="value" data={funnel} fill="#8884d8">
              <LabelList position="right" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={signupsSubscribes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="signups" fill="#8884d8" />
            <Line type="monotone" dataKey="subscribes" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <LineChart width={600} height={300} data={cumulative}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <button onClick={() => setSegment('plan')}>Plan</button>
          <button onClick={() => setSegment('utmSource')}>UTM</button>
          <button onClick={() => setSegment('country')}>Country</button>
        </div>
        <ResponsiveContainer>
          <BarChart data={stackData} layout="vertical" stackOffset="expand">
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
            {seg.map((d, i) => (
              <Bar key={d.name} dataKey={d.name} stackId="a" fill={colors[i % colors.length]} barSize={20} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
