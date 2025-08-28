import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function MainPage() {
  useEffect(() => {
    document.title = 'ACPC'
  }, [])
  return (
    <>
      <h1>ACPC</h1>
      <p>Welcome</p>
      <p>
        Go to <Link to="/admin">/admin</Link>
      </p>
    </>
  )
}
