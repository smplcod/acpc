import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import { loadMetrics } from '../app/metrics.js'

export default function AdminDashboardPage() {
  const title = 'Charts Dashboard'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [data, setData] = useState(null)

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  useEffect(() => {
    loadMetrics().then(setData)
  }, [])

  if (!data) return <div>Loading...</div>

  const { daily } = data
  const labels = daily.map(d => d.date)

  const dauData = { labels, datasets: [{ label: 'DAU', data: daily.map(d => d.dau), borderColor: '#36a2eb' }] }
  const convData = { labels, datasets: [{ label: 'Conversion', data: daily.map(d => d.conversion_calc * 100), borderColor: '#ff6384' }] }
  const errData = { labels, datasets: [{ label: 'Error Rate', data: daily.map(d => d.error_rate), borderColor: '#ff9f40' }] }
  const subsData = { labels, datasets: [{ label: 'Subs', data: daily.map(d => d.subs), backgroundColor: '#4bc0c0' }] }

  const commonLineOpts = { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
  const commonBarOpts = { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }

  const period = `${labels[0]} to ${labels[labels.length - 1]}`

  return (
    <div>
      <h1>{fullTitle}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Link to="/admin/charts/growth" style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          <Line data={dauData} options={commonLineOpts} />
          <p>Goal: growth | Source: events | Period: {period}</p>
          <p>Shows daily active user trends.</p>
        </Link>
        <Link to="/admin/charts/engagement" style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          <Line data={convData} options={commonLineOpts} />
          <p>Goal: conversion | Source: activity | Period: {period}</p>
          <p>Shows conversion rate dynamics.</p>
        </Link>
        <Link to="/admin/charts/reliability" style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          <Line data={errData} options={commonLineOpts} />
          <p>Goal: stability | Source: activity | Period: {period}</p>
          <p>Shows error rate over time.</p>
        </Link>
        <Link to="/admin/charts/revenue" style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
          <Bar data={subsData} options={commonBarOpts} />
          <p>Goal: revenue | Source: events | Period: {period}</p>
          <p>Shows subscription volume.</p>
        </Link>
      </div>
    </div>
  )
}
