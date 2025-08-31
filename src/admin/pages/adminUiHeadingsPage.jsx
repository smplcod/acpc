import { useEffect } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import './adminUiHeadingsPage.css'

export default function AdminUiHeadingsPage() {
  const title = 'UI Headings'
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
        <section key={num} className={`heading-demo variant-${num}`}>
          <h2>Variant {num} h2</h2>
          <p>Example content under h2 variant {num}.</p>
          <h3>Variant {num} h3</h3>
          <p>Example content under h3 variant {num}.</p>
        </section>
      ))}
    </>
  )
}
