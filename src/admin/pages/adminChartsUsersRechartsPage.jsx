import { useEffect, useState, useMemo } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar,
  ScatterChart, Scatter,
  Treemap,
  ComposedChart,
  Brush,
  ResponsiveContainer
} from 'recharts'

export default function AdminChartsUsersRechartsPage() {
  const title = 'Admin Charts Users Recharts Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [users, setUsers] = useState([])

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  useEffect(() => {
    fetch('/mocks/users.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(setUsers)
  }, [])

  function aggregate(arr, key) {
    const counts = {}
    arr.forEach(u => {
      const val = u[key]
      counts[val] = (counts[val] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }

  function aggregateDate(arr, key) {
    const counts = {}
    arr.forEach(u => {
      const month = u[key].slice(0, 7)
      counts[month] = (counts[month] || 0) + 1
    })
    return Object.entries(counts)
      .map(([month, value]) => ({ month, value }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  const planData = useMemo(() => aggregate(users, 'plan'), [users])
  const statusData = useMemo(() => aggregate(users, 'status'), [users])
  const deviceData = useMemo(() => aggregate(users, 'device'), [users])
  const browserData = useMemo(() => aggregate(users, 'browser'), [users])
  const osData = useMemo(() => aggregate(users, 'os'), [users])
  const cityData = useMemo(() => aggregate(users, 'city').slice(0, 10), [users])
  const signupByMonth = useMemo(() => aggregateDate(users, 'createdAt'), [users])
  const activeByMonth = useMemo(() => aggregateDate(users, 'lastActiveAt'), [users])

  const monthlyData = useMemo(() => {
    const map = {}
    signupByMonth.forEach(({ month, value }) => {
      if (!map[month]) map[month] = { month }
      map[month].signups = value
    })
    activeByMonth.forEach(({ month, value }) => {
      if (!map[month]) map[month] = { month }
      map[month].active = value
    })
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
  }, [signupByMonth, activeByMonth])

  const planStatusData = useMemo(() => {
    const map = {}
    users.forEach(u => {
      if (!map[u.plan]) map[u.plan] = { name: u.plan }
      map[u.plan][u.status] = (map[u.plan][u.status] || 0) + 1
    })
    return Object.values(map)
  }, [users])

  const scatterData = useMemo(() => users.map(u => ({
    x: u.id,
    y: new Date(u.lastActiveAt) - new Date(u.createdAt)
  })), [users])

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', '#ff0000']

  function ChartExample({ title, description, code, children }) {
    return (
      <section style={{ marginBottom: '3rem' }}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
        <textarea readOnly value={code} style={{ width: '100%', height: '200px', marginTop: '1rem' }} />
      </section>
    )
  }

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />

        <ChartExample
          title="1. Bar chart by plan"
        description="Basic bar chart showing users per plan."
        code={`<BarChart data={planData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" fill="#8884d8" />
</BarChart>`}
      >
        <BarChart data={planData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ChartExample>

        <ChartExample
          title="2. Stacked bar chart"
        description="Shows user status within each plan using stacked bars."
        code={`<BarChart data={planStatusData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="active" stackId="a" fill="#8884d8" />
  <Bar dataKey="dormant" stackId="a" fill="#82ca9d" />
  <Bar dataKey="blocked" stackId="a" fill="#ffc658" />
</BarChart>`}
      >
        <BarChart data={planStatusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="active" stackId="a" fill="#8884d8" />
          <Bar dataKey="dormant" stackId="a" fill="#82ca9d" />
          <Bar dataKey="blocked" stackId="a" fill="#ffc658" />
        </BarChart>
      </ChartExample>

        <ChartExample
          title="3. Vertical bar chart"
        description="Displays status counts with vertical layout."
        code={`<BarChart data={statusData} layout="vertical" margin={{ left: 40 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis type="number" />
  <YAxis dataKey="name" type="category" />
  <Tooltip />
  <Bar dataKey="value" fill="#82ca9d" />
</BarChart>`}
      >
        <BarChart data={statusData} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ChartExample>

        <ChartExample
          title="4. Bar chart with brush"
        description="Scrollable bar chart for top cities."
        code={`<BarChart data={cityData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" fill="#8884d8" />
  <Brush dataKey="name" height={30} stroke="#8884d8" />
</BarChart>`}
      >
        <BarChart data={cityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
          <Brush dataKey="name" height={30} stroke="#8884d8" />
        </BarChart>
      </ChartExample>

        <ChartExample
          title="5. Custom tooltip bar chart"
        description="Bar chart of operating systems with custom tooltip."
        code={`<BarChart data={osData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip content={({ payload }) => payload[0] && \`\${payload[0].name}: \${payload[0].value}\`} />
  <Bar dataKey="value" fill="#ffc658" />
</BarChart>`}
      >
        <BarChart data={osData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={({ payload }) => payload[0] && `${payload[0].name}: ${payload[0].value}`} />
          <Bar dataKey="value" fill="#ffc658" />
        </BarChart>
      </ChartExample>

        <ChartExample
          title="6. Line chart of signups"
        description="Basic line chart of user signups by month."
        code={`<LineChart data={signupByMonth}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Line type="linear" dataKey="value" stroke="#8884d8" />
</LineChart>`}
      >
        <LineChart data={signupByMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="linear" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ChartExample>

        <ChartExample
          title="7. Line chart without dots"
        description="Active users per month with dots hidden."
        code={`<LineChart data={activeByMonth}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Line type="linear" dataKey="value" stroke="#82ca9d" dot={false} />
</LineChart>`}
      >
        <LineChart data={activeByMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="linear" dataKey="value" stroke="#82ca9d" dot={false} />
        </LineChart>
      </ChartExample>

        <ChartExample
          title="8. Multi-line chart"
        description="Compares signups and active users per month."
        code={`<LineChart data={monthlyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="signups" stroke="#8884d8" />
  <Line type="monotone" dataKey="active" stroke="#82ca9d" />
</LineChart>`}
      >
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="signups" stroke="#8884d8" />
          <Line type="monotone" dataKey="active" stroke="#82ca9d" />
        </LineChart>
      </ChartExample>

        <ChartExample
          title="9. Monotone line chart"
        description="Active users with monotone curve."
        code={`<LineChart data={activeByMonth}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="value" stroke="#ff7300" />
</LineChart>`}
      >
        <LineChart data={activeByMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#ff7300" />
        </LineChart>
      </ChartExample>

        <ChartExample
          title="10. Area chart"
        description="Area chart of signups per month."
        code={`<AreaChart data={signupByMonth}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Area type="linear" dataKey="value" stroke="#8884d8" fill="#8884d8" />
</AreaChart>`}
      >
        <AreaChart data={signupByMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="linear" dataKey="value" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ChartExample>

        <ChartExample
          title="11. Gradient area chart"
        description="Active users per month with gradient fill."
        code={`<AreaChart data={activeByMonth}>
  <defs>
    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
    </linearGradient>
  </defs>
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="url(#colorActive)" />
</AreaChart>`}
      >
        <AreaChart data={activeByMonth}>
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="url(#colorActive)" />
        </AreaChart>
      </ChartExample>

        <ChartExample
          title="12. Stacked area chart"
        description="Stacked areas comparing signups and active users."
        code={`<AreaChart data={monthlyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="signups" stackId="1" stroke="#8884d8" fill="#8884d8" />
  <Area type="monotone" dataKey="active" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
</AreaChart>`}
      >
        <AreaChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="signups" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="active" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ChartExample>

        <ChartExample
          title="13. Area chart with custom active dot"
        description="Highlights points with a larger active dot."
        code={`<AreaChart data={signupByMonth}>
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="value" stroke="#ff7300" fill="#ff7300" activeDot={{ r: 8 }} />
</AreaChart>`}
      >
        <AreaChart data={signupByMonth}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#ff7300" fill="#ff7300" activeDot={{ r: 8 }} />
        </AreaChart>
      </ChartExample>

        <ChartExample
          title="14. Composed chart"
        description="Combines bar and line in one chart."
        code={`<ComposedChart data={monthlyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="signups" fill="#8884d8" />
  <Line type="monotone" dataKey="active" stroke="#82ca9d" />
</ComposedChart>`}
      >
        <ComposedChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="signups" fill="#8884d8" />
          <Line type="monotone" dataKey="active" stroke="#82ca9d" />
        </ComposedChart>
      </ChartExample>

        <ChartExample
          title="15. Pie chart"
        description="Plan distribution as a pie chart."
        code={`<PieChart>
  <Pie data={planData} dataKey="value" nameKey="name" label>
    {planData.map((entry, index) => (
      <Cell key={entry.name} fill={colors[index % colors.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>`}
      >
        <PieChart>
          <Pie data={planData} dataKey="value" nameKey="name" label>
            {planData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartExample>

        <ChartExample
          title="16. Donut pie chart"
        description="Status distribution with inner radius."
        code={`<PieChart>
  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>
    {statusData.map((entry, index) => (
      <Cell key={entry.name} fill={colors[index % colors.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>`}
      >
        <PieChart>
          <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>
            {statusData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartExample>

        <ChartExample
          title="17. Radar chart"
        description="Compares device usage across categories."
        code={`<RadarChart data={deviceData} outerRadius={80}>
  <PolarGrid />
  <PolarAngleAxis dataKey="name" />
  <PolarRadiusAxis />
  <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
</RadarChart>`}
      >
        <RadarChart data={deviceData} outerRadius={80}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ChartExample>

        <ChartExample
          title="18. Radial bar chart"
        description="Browser distribution with radial bars."
        code={`<RadialBarChart innerRadius="20%" outerRadius="90%" data={browserData} startAngle={180} endAngle={0}>
  <RadialBar background dataKey="value">
    {browserData.map((entry, index) => (
      <Cell key={entry.name} fill={colors[index % colors.length]} />
    ))}
  </RadialBar>
  <Legend />
</RadialBarChart>`}
      >
        <RadialBarChart innerRadius="20%" outerRadius="90%" data={browserData} startAngle={180} endAngle={0}>
          <RadialBar background dataKey="value">
            {browserData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </RadialBar>
          <Legend />
        </RadialBarChart>
      </ChartExample>

        <ChartExample
          title="19. Scatter chart"
        description="Days between signup and last active per user."
        code={`<ScatterChart>
  <CartesianGrid />
  <XAxis dataKey="x" name="User ID" />
  <YAxis dataKey="y" name="Active delay" />
  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
  <Scatter data={scatterData} fill="#8884d8" />
</ScatterChart>`}
      >
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="x" name="User ID" />
          <YAxis dataKey="y" name="Active delay" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={scatterData} fill="#8884d8" />
        </ScatterChart>
      </ChartExample>

        <ChartExample
          title="20. Treemap"
        description="Treemap of users by city (top 10)."
        code={`<Treemap data={cityData} dataKey="value" stroke="#fff" fill="#8884d8" />`}
      >
        <Treemap data={cityData} dataKey="value" stroke="#fff" fill="#8884d8" />
      </ChartExample>
    </div>
  )
}
