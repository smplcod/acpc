import { useNavigate } from 'react-router-dom'

export function Component() {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem('token', 'demo')
    navigate('/admin')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type='email' name='email' placeholder='Email' />
      </div>
      <div>
        <input type='password' name='password' placeholder='Password' />
      </div>
      <button type='submit'>Login</button>
    </form>
  )
}
