import { useEffect } from 'react'
import AuthMessage from '../app/authMessage.jsx'
import './adminUiPage.css'

export default function AdminUiPage() {
  const title = 'UI | ACPC'
  useEffect(() => {
    document.title = title
  }, [title])

  const loginVariants = Array.from({ length: 30 }, (_, i) => i + 1)
  const tagVariants = Array.from({ length: 30 }, (_, i) => i + 1)
  const loginChoice = 30
  const tagChoice = 20
  const tags = ['#alpha', '#beta', '#gamma']

  return (
    <div>
      <h1>UI</h1>
      <AuthMessage />

      <h2>Login form variants</h2>
      {loginVariants.map((num, idx) => (
        <div key={`login-${num}`}>
          <h3>
            {num}
            {num === loginChoice ? ' current choice' : ''}
          </h3>
          <form className={`login-form variant-${num}`}>
            <input type="text" placeholder="Login" />
            <input type="password" placeholder="Password" />
            <button type="button">Login</button>
          </form>
          {idx < loginVariants.length - 1 && <hr />}
        </div>
      ))}

      <h2>Hashtag variants</h2>
      {tagVariants.map((num, idx) => (
        <div key={`tags-${num}`}>
          <h3>
            {num}
            {num === tagChoice ? ' current choice' : ''}
          </h3>
          <div className={`tags tags-variant-${num}`}>
            {tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {idx < tagVariants.length - 1 && <hr />}
        </div>
      ))}
    </div>
  )
}
