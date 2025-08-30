import { useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useAnalytics } from '../utils/analytics.js'

const refLines = {
  id: 'refLines',
  afterDraw: chart => {
    const lines = chart.options.refLines || []
    const { ctx, chartArea: { left, right }, scales: { y } } = chart
    lines.forEach(l => {
      const yPos = y.getPixelForValue(l.value)
      ctx.save()
      ctx.strokeStyle = l.color || 'red'
      ctx.beginPath()
      ctx.moveTo(left, yPos)
      ctx.lineTo(right, yPos)
      ctx.stroke()
      ctx.restore()
    })
  }
}

ChartJS.register(...registerables, refLines)

export default function AdminGraphReliabilityPage() {
  const title = 'Admin Graph Reliability Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const data = useAnalytics()

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  if (!data) return <p>Loading...</p>
  const period = `${data.dates[0]} – ${data.dates[data.dates.length - 1]}`

  const errorRateLine = {
    labels: data.dates,
    datasets: [
      { label: 'Error Rate', data: data.errorRate, borderColor: '#ff7300', fill: false }
    ]
  }
  const errorsArea = {
    labels: data.dates,
    datasets: [
      { label: '401', data: data.errorsByCode['401'], borderColor: '#8884d8', backgroundColor: '#8884d8', fill: true, stack: 'c' },
      { label: '408', data: data.errorsByCode['408'], borderColor: '#82ca9d', backgroundColor: '#82ca9d', fill: true, stack: 'c' },
      { label: '500', data: data.errorsByCode['500'], borderColor: '#ffc658', backgroundColor: '#ffc658', fill: true, stack: 'c' },
      { label: 'JS:TypeError', data: data.errorsByCode['JS:TypeError'], borderColor: '#413ea0', backgroundColor: '#413ea0', fill: true, stack: 'c' }
    ]
  }
  const pareto = {
    labels: data.pareto.map(p => p.code),
    datasets: [
      { type: 'bar', label: 'Errors', data: data.pareto.map(p => p.count), backgroundColor: '#8884d8', yAxisID: 'y' },
      { type: 'line', label: 'Cumulative %', data: data.pareto.map(p => p.cumPct), borderColor: '#ff7300', yAxisID: 'y1', fill: false }
    ]
  }
  const pageErrors = {
    labels: data.errorPageTop.map(([p]) => p),
    datasets: [
      { label: 'Errors', data: data.errorPageTop.map(([, c]) => c), backgroundColor: '#ff7300' }
    ]
  }

  return (
    <div>
      <h1>{title}</h1>
      <div>
        <Line data={errorRateLine} options={{ refLines: [{ value: 0.02, color: 'red' }], scales: { y: { beginAtZero: true } } }} />
        <p><strong>Error rate:</strong> Stability per session; Source: activity.json; Formula: errors/sessions; Period: {period}</p>
      </div>
      <div>
        <Line data={errorsArea} options={{ scales: { y: { stacked: true } } }} />
        <p><strong>Error codes:</strong> Structure of incidents; Source: activity.json; Method: errors grouped by code; Period: {period}</p>
      </div>
      <div>
        <Bar data={pareto} options={{ scales: { y: { position: 'left' }, y1: { position: 'right', ticks: { callback: v => v + '%' }, beginAtZero: true, max: 100 } } }} />
        <p><strong>Pareto:</strong> Top error contributors; Source: activity.json; Method: cumulative 80/20; Period: {period}</p>
      </div>
      <div>
        <Bar data={pageErrors} options={{ indexAxis: 'y' }} />
        <p><strong>Error pages:</strong> Problematic pages; Source: events.json; Method: count error events per page; Period: {period}</p>
      </div>
    </div>
  )
}
