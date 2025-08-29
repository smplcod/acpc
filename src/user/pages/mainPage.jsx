import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function MainPage() {
  useEffect(() => {
    document.title = 'ACPC'
  }, [])
  return (
    <>
      <h1>
        <img
          src="/icon.svg"
          alt="ACPC icon"
          style={{ height: '1em', verticalAlign: 'middle', marginRight: '0.2em' }}
        />
        ACPC
      </h1>
      <p>Welcome to site with AdminCP with Charts!</p>
      <p>
        Go to <Link to="/admin">/admin</Link> to see.
      </p>
    </>
  )
}
