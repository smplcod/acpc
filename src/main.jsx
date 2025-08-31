import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import UserLayout from './user/app/layout.jsx'
import AdminLayout from './admin/app/layout.jsx'
import MainPage from './user/pages/mainPage.jsx'
import ReleaseNotesPage from './user/pages/releaseNotesPage.jsx'
import NotFoundPage from './notFoundPage.jsx'
import adminRoutes from './admin/app/routes.jsx'

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
    children: adminRoutes,
  },
  { path: "*", element: <NotFoundPage /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
