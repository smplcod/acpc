import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import UserLayout from './user/app/layout.jsx'
import AdminLayout from './admin/app/layout.jsx'
import MainPage from './user/pages/mainPage.jsx'
import ReleaseNotesPage from './user/pages/releaseNotesPage.jsx'
import AdminPage from './admin/pages/adminPage.jsx'
import AdminChartsPage from './admin/pages/adminChartsPage.jsx'
import AdminUiPage from './admin/pages/adminUiPage.jsx'
import AdminLoginPage from './admin/pages/adminLoginPage.jsx'
import AdminLogoutPage from './admin/pages/adminLogoutPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'release-notes', element: <ReleaseNotesPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'login', element: <AdminLoginPage /> },
      { path: 'logout', element: <AdminLogoutPage /> },
      { index: true, element: <AdminPage /> },
      { path: 'charts', element: <AdminChartsPage /> },
      { path: 'ui', element: <AdminUiPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
