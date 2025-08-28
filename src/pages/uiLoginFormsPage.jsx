import { useEffect } from 'react'
import './uiLoginFormsPage.css'

export default function UiLoginFormsPage() {
  const title = 'Login form variants | ACPC'
  useEffect(() => {
    document.title = title
  }, [title])

  const variants = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div>
      <h1>Login form variants</h1>
      {variants.map((num, idx) => (
        <div key={num}>
          <h2>{num}</h2>
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
