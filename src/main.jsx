import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './app/router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Show a simple string while lazy routes load */}
    <RouterProvider router={router} fallbackElement='Loading…' />
  </StrictMode>,
)
