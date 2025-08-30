import { useEffect, useState, useMemo } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import { Chart as ChartJS, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap'
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Chart } from 'react-chartjs-2'

ChartJS.register(...registerables, zoomPlugin, TreemapController, TreemapElement)

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', '#ff0000']

export default function AdminChartsUsersChartjs2Page() {
  const title = 'Admin Charts Users Chartjs2 Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [users, setUsers] = useState([])

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  useEffect(() => {
    fetch('/mocks/users.json').then(r => r.json()).then(setUsers)
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

  const scatterRaw = useMemo(
    () =>
      users.map(u => ({
        x: u.id,
        y: (new Date(u.lastActiveAt) - new Date(u.createdAt)) / 86400000
      })),
    [users]
  )

  const planBarData = useMemo(
    () => ({
      labels: planData.map(d => d.name),
      datasets: [
        { label: 'Users', data: planData.map(d => d.value), backgroundColor: colors[0] }
      ]
    }),
    [planData]
  )

  const planStatusStackedData = useMemo(
    () => ({
      labels: planStatusData.map(d => d.name),
      datasets: [
        {
          label: 'active',
          data: planStatusData.map(d => d.active || 0),
          backgroundColor: colors[0]
        },
        {
          label: 'dormant',
          data: planStatusData.map(d => d.dormant || 0),
          backgroundColor: colors[1]
        },
        {
          label: 'blocked',
          data: planStatusData.map(d => d.blocked || 0),
          backgroundColor: colors[2]
        }
      ]
    }),
    [planStatusData]
  )

  const statusHorizontalData = useMemo(
    () => ({
      labels: statusData.map(d => d.name),
      datasets: [
        {
          label: 'Users',
          data: statusData.map(d => d.value),
          backgroundColor: colors[1]
        }
      ]
    }),
    [statusData]
  )

  const cityBarData = useMemo(
    () => ({
      labels: cityData.map(d => d.name),
      datasets: [
        { label: 'Users', data: cityData.map(d => d.value), backgroundColor: colors[0] }
      ]
    }),
    [cityData]
  )

  const osBarData = useMemo(
    () => ({
      labels: osData.map(d => d.name),
      datasets: [
        { label: 'Users', data: osData.map(d => d.value), backgroundColor: colors[0] }
      ]
    }),
    [osData]
  )

  const signupLineData = useMemo(
    () => ({
      labels: signupByMonth.map(d => d.month),
      datasets: [
        {
          label: 'Signups',
          data: signupByMonth.map(d => d.value),
          borderColor: colors[0],
          backgroundColor: colors[0],
          tension: 0
        }
      ]
    }),
    [signupByMonth]
  )

  const activeLineData = useMemo(
    () => ({
      labels: activeByMonth.map(d => d.month),
      datasets: [
        {
          label: 'Active',
          data: activeByMonth.map(d => d.value),
          borderColor: colors[1],
          backgroundColor: colors[1],
          tension: 0
        }
      ]
    }),
    [activeByMonth]
  )

  const multiLineData = useMemo(
    () => ({
      labels: monthlyData.map(d => d.month),
      datasets: [
        {
          label: 'Signups',
          data: monthlyData.map(d => d.signups || 0),
          borderColor: colors[0],
          backgroundColor: colors[0],
          tension: 0
        },
        {
          label: 'Active',
          data: monthlyData.map(d => d.active || 0),
          borderColor: colors[1],
          backgroundColor: colors[1],
          tension: 0
        }
      ]
    }),
    [monthlyData]
  )

  const areaSignupData = useMemo(
    () => ({
      labels: signupByMonth.map(d => d.month),
      datasets: [
        {
          label: 'Signups',
          data: signupByMonth.map(d => d.value),
          borderColor: colors[0],
          backgroundColor: colors[0],
          fill: true
        }
      ]
    }),
    [signupByMonth]
  )

  const gradientAreaData = useMemo(
    () => ({
      labels: signupByMonth.map(d => d.month),
      datasets: [
        {
          label: 'Signups',
          data: signupByMonth.map(d => d.value),
          borderColor: colors[0],
          fill: true,
          backgroundColor: ctx => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
            gradient.addColorStop(0, 'rgba(136,132,216,0.5)')
            gradient.addColorStop(1, 'rgba(136,132,216,0)')
            return gradient
          }
        }
      ]
    }),
    [signupByMonth]
  )

  const areaStackedData = useMemo(
    () => ({
      labels: monthlyData.map(d => d.month),
      datasets: [
        {
          label: 'Signups',
          data: monthlyData.map(d => d.signups || 0),
          borderColor: colors[0],
          backgroundColor: colors[0],
          fill: true,
          stack: 's'
        },
        {
          label: 'Active',
          data: monthlyData.map(d => d.active || 0),
          borderColor: colors[1],
          backgroundColor: colors[1],
          fill: true,
          stack: 's'
        }
      ]
    }),
    [monthlyData]
  )

  const devicePieData = useMemo(
    () => ({
      labels: deviceData.map(d => d.name),
      datasets: [
        { data: deviceData.map(d => d.value), backgroundColor: colors }
      ]
    }),
    [deviceData]
  )

  const browserDoughnutData = useMemo(
    () => ({
      labels: browserData.map(d => d.name),
      datasets: [
        { data: browserData.map(d => d.value), backgroundColor: colors }
      ]
    }),
    [browserData]
  )

  const planRadarData = useMemo(
    () => ({
      labels: planData.map(d => d.name),
      datasets: [
        {
          label: 'Plan',
          data: planData.map(d => d.value),
          backgroundColor: 'rgba(136,132,216,0.2)',
          borderColor: colors[0]
        }
      ]
    }),
    [planData]
  )

  const osPolarData = useMemo(
    () => ({
      labels: osData.map(d => d.name),
      datasets: [
        { data: osData.map(d => d.value), backgroundColor: colors }
      ]
    }),
    [osData]
  )

  const scatterData = useMemo(
    () => ({
      datasets: [
        {
          label: 'Active gap',
          data: scatterRaw,
          backgroundColor: colors[0]
        }
      ]
    }),
    [scatterRaw]
  )

  const mixedMonthlyData = useMemo(
    () => ({
      labels: monthlyData.map(d => d.month),
      datasets: [
        {
          type: 'bar',
          label: 'Signups',
          data: monthlyData.map(d => d.signups || 0),
          backgroundColor: colors[0]
        },
        {
          type: 'line',
          label: 'Active',
          data: monthlyData.map(d => d.active || 0),
          borderColor: colors[1],
          backgroundColor: colors[1]
        }
      ]
    }),
    [monthlyData]
  )

  const treemapData = useMemo(
    () => ({
      datasets: [
        {
          label: 'Browsers',
          tree: browserData.map(d => ({ name: d.name, value: d.value })),
          key: 'value',
          groups: ['name'],
          backgroundColor: colors
        }
      ]
    }),
    [browserData]
  )

  const chartExamples = [
    {
      title: '1. Bar chart by plan',
      description: 'Basic bar chart showing users per plan.',
      render: () => <Bar data={planBarData} options={{ responsive: true }} />,
      code: `<Bar data={planBarData} options={{ responsive: true }} />`
    },
    {
      title: '2. Stacked bar chart',
      description: 'Shows user status within each plan using stacked bars.',
      render: () => (
        <Bar
          data={planStatusStackedData}
          options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }}
        />
      ),
      code: `<Bar data={planStatusStackedData} options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }} />`
    },
    {
      title: '3. Vertical bar chart',
      description: 'Displays status counts with vertical layout.',
      render: () => <Bar data={statusHorizontalData} options={{ indexAxis: 'y', responsive: true }} />,
      code: `<Bar data={statusHorizontalData} options={{ indexAxis: 'y', responsive: true }} />`
    },
    {
      title: '4. Bar chart with zoom',
      description: 'Scrollable bar chart for top cities using zoom plugin.',
      render: () => (
        <Bar
          data={cityBarData}
          options={{
            responsive: true,
            plugins: { zoom: { zoom: { wheel: { enabled: true } }, pan: { enabled: true } } }
          }}
        />
      ),
      code: `<Bar data={cityBarData} options={{ responsive: true, plugins: { zoom: { zoom: { wheel: { enabled: true } }, pan: { enabled: true } } } }} />`
    },
    {
      title: '5. Custom tooltip bar chart',
      description: 'Bar chart of operating systems with custom tooltip.',
      render: () => (
        <Bar
          data={osBarData}
          options={{ plugins: { tooltip: { callbacks: { label: ctx => ctx.parsed.y + ' users' } } } }}
        />
      ),
      code: `<Bar data={osBarData} options={{ plugins: { tooltip: { callbacks: { label: ctx => ctx.parsed.y + ' users' } } } }} />`
    },
    {
      title: '6. Line chart of signups',
      description: 'Monthly signups over time.',
      render: () => <Line data={signupLineData} options={{ responsive: true }} />,
      code: `<Line data={signupLineData} options={{ responsive: true }} />`
    },
    {
      title: '7. Line chart without dots',
      description: 'Active users per month without point markers.',
      render: () => (
        <Line data={activeLineData} options={{ elements: { point: { radius: 0 } }, responsive: true }} />
      ),
      code: `<Line data={activeLineData} options={{ elements: { point: { radius: 0 } }, responsive: true }} />`
    },
    {
      title: '8. Multi-line chart',
      description: 'Compare signups and active users.',
      render: () => <Line data={multiLineData} options={{ responsive: true }} />,
      code: `<Line data={multiLineData} options={{ responsive: true }} />`
    },
    {
      title: '9. Monotone line chart',
      description: 'Smooth line for signups.',
      render: () => (
        <Line
          data={{ ...signupLineData, datasets: signupLineData.datasets.map(ds => ({ ...ds, tension: 0.4 })) }}
          options={{ responsive: true }}
        />
      ),
      code: `<Line data={{ ...signupLineData, datasets: signupLineData.datasets.map(ds => ({ ...ds, tension: 0.4 })) }} options={{ responsive: true }} />`
    },
    {
      title: '10. Area chart',
      description: 'Signups area chart.',
      render: () => <Line data={areaSignupData} options={{ responsive: true }} />,
      code: `<Line data={areaSignupData} options={{ responsive: true }} />`
    },
    {
      title: '11. Gradient area chart',
      description: 'Area with gradient fill.',
      render: () => <Line data={gradientAreaData} options={{ responsive: true }} />,
      code: `<Line data={gradientAreaData} options={{ responsive: true }} />`
    },
    {
      title: '12. Stacked area chart',
      description: 'Stacked signups vs active.',
      render: () => (
        <Line data={areaStackedData} options={{ responsive: true, scales: { y: { stacked: true } } }} />
      ),
      code: `<Line data={areaStackedData} options={{ responsive: true, scales: { y: { stacked: true } } }} />`
    },
    {
      title: '13. Area chart with custom active dot',
      description: 'Area chart highlighting points.',
      render: () => (
        <Line
          data={areaSignupData}
          options={{ elements: { point: { radius: 6, hoverRadius: 8 } }, responsive: true }}
        />
      ),
      code: `<Line data={areaSignupData} options={{ elements: { point: { radius: 6, hoverRadius: 8 } }, responsive: true }} />`
    },
    {
      title: '14. Composed chart',
      description: 'Bar and line combined.',
      render: () => <Bar data={mixedMonthlyData} options={{ responsive: true }} />,
      code: `<Bar data={mixedMonthlyData} options={{ responsive: true }} />`
    },
    {
      title: '15. Pie chart',
      description: 'Device distribution.',
      render: () => <Pie data={devicePieData} />,
      code: `<Pie data={devicePieData} />`
    },
    {
      title: '16. Donut pie chart',
      description: 'Browser distribution.',
      render: () => <Doughnut data={browserDoughnutData} />,
      code: `<Doughnut data={browserDoughnutData} />`
    },
    {
      title: '17. Radar chart',
      description: 'Plan distribution.',
      render: () => <Radar data={planRadarData} options={{ responsive: true }} />,
      code: `<Radar data={planRadarData} options={{ responsive: true }} />`
    },
    {
      title: '18. Radial bar chart',
      description: 'OS distribution in polar area style.',
      render: () => <PolarArea data={osPolarData} />,
      code: `<PolarArea data={osPolarData} />`
    },
    {
      title: '19. Scatter chart',
      description: 'Time between signup and last active.',
      render: () => <Scatter data={scatterData} options={{ responsive: true }} />,
      code: `<Scatter data={scatterData} options={{ responsive: true }} />`
    },
    {
      title: '20. Treemap',
      description: 'Browser usage treemap.',
      render: () => <Chart type='treemap' data={treemapData} options={{ responsive: true }} />,
      code: `<Chart type='treemap' data={treemapData} options={{ responsive: true }} />`
    },
    {
      title: '21. Zoomable line chart',
      description: 'Extra feature: zoom and pan.',
      render: () => (
        <Line
          data={signupLineData}
          options={{
            responsive: true,
            plugins: {
              zoom: {
                zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
                pan: { enabled: true, mode: 'x' }
              }
            }
          }}
        />
      ),
      code: `<Line data={signupLineData} options={{ responsive: true, plugins: { zoom: { zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }, pan: { enabled: true, mode: 'x' } } } }} />`
    }
  ]

  function ChartExample({ title, description, code, children }) {
    return (
      <section style={{ marginBottom: '3rem' }}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div style={{ width: '100%', height: 300 }}>
          {children}
        </div>
        <textarea
          readOnly
          value={code}
          style={{ width: '100%', height: '200px', marginTop: '1rem' }}
        />
      </section>
    )
  }

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      {chartExamples.map(({ title, description, render, code }) => (
        <ChartExample key={title} title={title} description={description} code={code}>
          {render()}
        </ChartExample>
      ))}
    </div>
  )
}

