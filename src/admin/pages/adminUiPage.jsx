import { useEffect } from 'react'
import './adminUiPage.css'

export default function AdminUiPage() {
  const title = 'UI | ACPC'
  useEffect(() => {
    document.title = title
  }, [title])

  const variants = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div>
      <h1>UI</h1>
      <h2>Login form variants</h2>
      {variants.map((num, idx) => (
        <div key={num}>
          <h3>{num}</h3>
          <form className={`login-form variant-${num}`}>
            <input type="text" placeholder="Login" />
            <input type="password" placeholder="Password" />
            <button type="button">Login</button>
          </form>
          {idx < variants.length - 1 && <hr />}
        </div>
      ))}
    </div>
  )
}
