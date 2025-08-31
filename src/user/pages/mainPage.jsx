import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './mainPage.css'

export default function MainPage() {
  useEffect(() => {
    document.title = 'ACPC'
  }, [])
  return (
    <section className="main-page">
      <h1>
        <img src="/icon.svg" alt="ACPC icon" className="main-page__icon" />
        ACPC
      </h1>
      <p>Welcome to site with AdminCP with Charts!</p>
      <p>
        Go to <Link to="/admin">/admin</Link> to see.
      </p>
    </section>
  )
}
