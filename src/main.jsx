import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import Layout from './app/layout.jsx'
import MainPage from './pages/mainPage.jsx'
import AdminPage from './pages/adminPage.jsx'
import AdminChartsPage from './pages/adminChartsPage.jsx'
import ReleaseNotesPage from './pages/releaseNotesPage.jsx'
import UiLoginFormsPage from './pages/uiLoginFormsPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'admin/charts', element: <AdminChartsPage /> },
      { path: 'release-notes', element: <ReleaseNotesPage /> },
      { path: 'ui-login-forms', element: <UiLoginFormsPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
