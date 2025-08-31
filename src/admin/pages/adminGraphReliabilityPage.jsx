import { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import { loadMetrics } from '../app/metrics.js'
import './adminGraphReliabilityPage.css'

export default function AdminGraphReliabilityPage() {
  const title = 'Reliability Metrics'
  const heading = `${title} | Admin Control Panel`
  const fullTitle = `${heading} | ACPC`
  const [data, setData] = useState(null)

  useEffect(() => { document.title = fullTitle }, [fullTitle])
  useEffect(() => { loadMetrics().then(setData) }, [])

  if (!data) return <div className="loading">Loading...</div>
  const { daily, errorTotals, errorPagesTop } = data
  const labels = daily.map(d => d.date)

  const errRateData = {
    labels,
    datasets: [
      { label: 'error_rate', data: daily.map(d => d.error_rate), borderColor: '#ff6384' },
      { label: 'SLO 0.03', data: labels.map(() => 0.03), borderColor: '#00aa00', borderDash: [5,5], pointRadius: 0 }
    ]
  }

  const codes = Object.keys(errorTotals)
  const stackedErrorsData = {
    labels,
    datasets: codes.map(c => ({
      label: c,
      data: daily.map(d => d.errorsByCode[c] || 0),
      type: 'line',
      fill: true,
      stack: 'codes'
    }))
  }

  const totalsSorted = Object.entries(errorTotals).sort((a,b) => b[1] - a[1])
  const labelsPareto = totalsSorted.map(([c]) => c)
  const barVals = totalsSorted.map(([,v]) => v)
  const totalSum = barVals.reduce((a,b)=>a+b,0)
  const cum = []
  let run = 0
  barVals.forEach(v => { run += v; cum.push(run / totalSum * 100) })
  const paretoData = {
    labels: labelsPareto,
    datasets: [
      { type: 'bar', label: 'errors', data: barVals, backgroundColor: '#36a2eb', yAxisID: 'y' },
      { type: 'line', label: 'cumulative %', data: cum, borderColor: '#ff6384', yAxisID: 'y1' }
    ]
  }

  const pagesData = {
    labels: errorPagesTop.map(([p]) => p),
    datasets: [ { label: 'errors', data: errorPagesTop.map(([,v]) => v), backgroundColor: '#ffcd56' } ]
  }

  return (
  <section className="reliability-page">
      <h1>{heading}</h1>
      <section className="reliability-page__content">
        <h2>Error rate</h2>
        <div>
          <Line data={errRateData} />
          <p>Goal: stability per session | Source: activity | Formula: errors/sessions | Period: all dates</p>
        </div>
        <h2>Error codes stack</h2>
        <div>
          <Line data={stackedErrorsData} options={{ stacked: true }} />
          <p>Goal: incident structure | Source: activity | Formula: errors by code | Period: all dates</p>
        </div>
        <h2>Pareto of errors</h2>
        <div>
          <Bar data={paretoData} options={{ scales: { y: { position: 'left' }, y1: { position: 'right', ticks: { callback: v => v + '%' } } } }} />
          <p>Goal: 80/20 principle | Source: activity | Period: all dates</p>
        </div>
        <h2>Top error pages</h2>
        <div>
          <Bar data={pagesData} options={{ indexAxis: 'y' }} />
          <p>Goal: problematic pages | Source: events | Formula: type=error aggregated | Period: all dates</p>
        </div>
      </section>
    </section>
  )
}
