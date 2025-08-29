import AdminPage from '../pages/adminPage.jsx'
import AdminChartsPage from '../pages/adminChartsPage.jsx'
import AdminUiPage from '../pages/adminUiPage.jsx'
import AdminLoginPage from '../pages/adminLoginPage.jsx'
import AdminLogoutPage from '../pages/adminLogoutPage.jsx'
import AdminDevPage from '../pages/adminDevPage.jsx'
import AdminDevChartsPage from '../pages/adminDevChartsPage.jsx'
import AdminDevChartsUsersPage from '../pages/adminDevChartsUsersPage.jsx'
import AdminDevChartsUsersRechartsPage from '../pages/adminDevChartsUsersRechartsPage.jsx'
import AdminDevChartsUsersChartjs2Page from '../pages/adminDevChartsUsersChartjs2Page.jsx'

const adminRoutes = [
  { path: 'login', element: <AdminLoginPage />, label: 'Login' },
  { path: 'logout', element: <AdminLogoutPage />, label: 'Logout' },
  { index: true, element: <AdminPage />, label: 'Home' },
  { path: 'charts', element: <AdminChartsPage />, label: 'Charts' },
  {
    path: 'dev',
    element: <AdminDevPage />,
    label: 'Dev',
    children: [
      {
        path: 'charts',
        element: <AdminDevChartsPage />,
        label: 'Charts',
        children: [
          {
            path: 'users',
            element: <AdminDevChartsUsersPage />,
            label: 'Users',
            children: [
              { path: 'recharts', element: <AdminDevChartsUsersRechartsPage />, label: 'Recharts' },
              { path: 'chartjs2', element: <AdminDevChartsUsersChartjs2Page />, label: 'Chartjs2' }
            ]
          }
        ]
      }
    ]
  },
  { path: 'ui', element: <AdminUiPage />, label: 'UI' },
]

export default adminRoutes
