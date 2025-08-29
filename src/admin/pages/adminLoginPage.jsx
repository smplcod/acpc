import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './adminUiPage.css'

export default function AdminLoginPage() {
  const title = 'Login | ACPC'
  useEffect(() => {
    document.title = title
  }, [title])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    if (!username || !password) return
    const envLogin = import.meta.env.VITE_ADMIN_LOGIN
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD
    if (username === envLogin && password === envPassword) {
      navigate('/admin')
    } else {
      setError('Invalid username or password')
    }
  }

  const disabled = !username || !password

  return (
    <div>
      <h1>Admin Login</h1>
      <form className="login-form variant-30" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login"
          value={username}
          onChange={e => {
            setUsername(e.target.value)
            if (error) setError('')
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            if (error) setError('')
          }}
        />
        <button type="submit" disabled={disabled}>Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
