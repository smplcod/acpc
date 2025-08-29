import AdminPage from '../pages/adminPage.jsx'
import AdminChartsPage from '../pages/adminChartsPage.jsx'
import AdminUiPage from '../pages/adminUiPage.jsx'
import AdminLoginPage from '../pages/adminLoginPage.jsx'
import AdminLogoutPage from '../pages/adminLogoutPage.jsx'

const adminRoutes = [
  { path: 'login', element: <AdminLoginPage />, label: 'Login' },
  { path: 'logout', element: <AdminLogoutPage />, label: 'Logout' },
  { index: true, element: <AdminPage />, label: 'Home' },
  { path: 'charts', element: <AdminChartsPage />, label: 'Charts' },
  { path: 'ui', element: <AdminUiPage />, label: 'UI' },
]

export default adminRoutes
