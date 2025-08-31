import { useEffect, useState } from 'react'
import { Link, useOutlet } from 'react-router-dom'
import { Line, Bar } from 'react-chartjs-2'
import '../app/chartSetup.js'
import { loadMetrics } from '../app/metrics.js'
import './adminDashboardPage.css'

export default function AdminDashboardPage() {
  const title = 'Dashboard'
  const heading = `${title} | Admin Control Panel`
  const fullTitle = `${heading} | ACPC`
  const outlet = useOutlet()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!outlet) document.title = fullTitle
  }, [fullTitle, outlet])

  useEffect(() => {
    if (!outlet) loadMetrics().then(setData)
  }, [outlet])

  if (outlet) return outlet
  if (!data) return <div className="loading">Loading...</div>

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
    <section className="dashboard-page">
      <h1>{heading}</h1>
      <section className="dashboard-grid">
        <Link to="/admin/growth" className="dashboard-card">
          <Line data={dauData} options={commonLineOpts} />
          <p>Goal: growth | Source: events | Period: {period}</p>
        </Link>
        <Link to="/admin/engagement" className="dashboard-card">
          <Line data={convData} options={commonLineOpts} />
          <p>Goal: conversion | Source: activity | Period: {period}</p>
        </Link>
        <Link to="/admin/reliability" className="dashboard-card">
          <Line data={errData} options={commonLineOpts} />
          <p>Goal: stability | Source: activity | Period: {period}</p>
        </Link>
        <Link to="/admin/revenue" className="dashboard-card">
          <Bar data={subsData} options={commonBarOpts} />
          <p>Goal: revenue | Source: events | Period: {period}</p>
        </Link>
      </section>
    </section>
  )
}
