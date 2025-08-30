import { useEffect, useState } from 'react'
import AuthMessage from '../app/authMessage.jsx'

const keyInfo = {
  id: {
    app: 'Unique numeric identifier for a user account',
    charts: 'Enables counting and deduplication of users'
  },
  name: {
    app: 'Full name shown in profiles and communications',
    charts: 'Occasionally used as a label in examples'
  },
  email: {
    app: 'Login and contact address for the user',
    charts: 'Allows grouping by domain for engagement metrics'
  },
  role: {
    app: 'Defines permission level within the application',
    charts: 'Segments charts by user roles'
  },
  plan: {
    app: 'Subscription tier determining available features',
    charts: 'Displays distribution of plan types'
  },
  status: {
    app: 'Current account state such as active or blocked',
    charts: 'Used to chart active vs dormant users'
  },
  createdAt: {
    app: 'Date when the account was created',
    charts: 'Feeds signup trend charts'
  },
  lastActiveAt: {
    app: 'Last recorded activity date',
    charts: 'Helps measure retention and churn'
  },
  country: {
    app: 'Country for localization and compliance',
    charts: 'Used for geographic distribution'
  },
  city: {
    app: 'City for location-specific features',
    charts: 'Allows city-level breakdowns'
  },
  device: {
    app: 'Primary device type used by the user',
    charts: 'Device usage shares'
  },
  os: {
    app: 'Operating system of the user device',
    charts: 'OS popularity charts'
  },
  browser: {
    app: 'Web browser used for access',
    charts: 'Browser usage statistics'
  },
  utmSource: {
    app: 'Marketing source that led the user to sign up',
    charts: 'Attribution performance comparisons'
  },
  emailVerifiedAt: {
    app: 'Timestamp when email address was verified',
    charts: 'Verification rate tracking'
  },
  churnedAt: {
    app: 'Date when the user left the service, if applicable',
    charts: 'Churn timing analysis'
  }
}

export default function AdminChartsUsersExplainPage() {
  const title = 'Admin Charts Users Explain Page'
  const fullTitle = `${title} | Admin Control Panel | ACPC`
  const [example, setExample] = useState(null)

  useEffect(() => {
    document.title = fullTitle
    fetch('/mocks/users.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setExample(data[0])
      })
  }, [fullTitle])

  return (
    <div>
      <h1>{fullTitle}</h1>
      <AuthMessage />
      {example && (
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Example</th>
              <th>Application use</th>
              <th>Charts use</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(example).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{String(value)}</td>
                <td>{keyInfo[key]?.app || ''}</td>
                <td>{keyInfo[key]?.charts || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
