import { useEffect } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import './adminUiSpoilersPage.css'

export default function AdminUiSpoilersPage() {
  const title = 'Admin UI Spoilers Page'
  const heading = `${title} | Admin Control Panel`
  const fullTitle = `${heading} | ACPC`

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  const variants = Array.from({ length: 20 }, (_, i) => i + 1)

  return (
    <>
      <h1>{heading}</h1>
      <AuthMessage />
      {variants.map(num => (
        <details key={num} className={`spoiler variant-${num}`}>
          <summary>
            <h2>
              {num}. Spoiler heading
            </h2>
          </summary>
          <h3>Nested heading</h3>
          <p>Content for variant {num}.</p>
        </details>
      ))}
    </>
  )
}

