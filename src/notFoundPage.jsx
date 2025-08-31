import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>
        The page you're looking for does not exist. Go back to <Link to="/">the home page</Link>.
      </p>
    </div>
  )
}
