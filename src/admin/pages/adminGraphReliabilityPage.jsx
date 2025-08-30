import { useEffect } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import useMetrics from '../app/hooks/useMetrics.js'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Bar, ReferenceLine, Legend
} from 'recharts'

export default function AdminGraphReliabilityPage() {
  const title = 'Reliability Metrics'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const { data, loading, error } = useMetrics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (loading) return <div><h1>{fullTitle}</h1><AuthMessage /><p>Loading...</p></div>
  if (error || !data) return <div><h1>{fullTitle}</h1><AuthMessage /><p>No data</p></div>

  const { errorRate, errorsByCode, paretoErrors } = data
  const codes = Object.keys(errorsByCode[0] || {}).filter(k => k !== 'date')
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#a4de6c']

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={errorRate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={v => `${(v * 100).toFixed(2)}%`} />
            <Tooltip formatter={v => `${(v * 100).toFixed(2)}%`} />
            <ReferenceLine y={0.02} stroke="red" />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={errorsByCode}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {codes.map((c, i) => (
              <Area
                key={c}
                type="monotone"
                dataKey={c}
                stackId="1"
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={paretoErrors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
            <Tooltip formatter={(v, n) => n === 'cumulative' ? `${(v * 100).toFixed(1)}%` : v} />
            <Bar yAxisId="left" dataKey="count" fill="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
