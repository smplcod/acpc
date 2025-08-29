import { useEffect } from 'react'
import './adminUiPage.css'

export default function AdminUiPage() {
  const title = 'UI | ACPC'
  useEffect(() => {
    document.title = title
  }, [title])

  const loginVariants = Array.from({ length: 10 }, (_, i) => i + 1)
  const tagVariants = Array.from({ length: 10 }, (_, i) => i + 1)
  const tags = ['#alpha', '#beta', '#gamma']

  return (
    <div>
      <h1>UI</h1>

      <h2>Login form variants</h2>
      {loginVariants.map((num, idx) => (
        <div key={`login-${num}`}>
          <h3>{num}</h3>
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
          <h3>{num}</h3>
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
