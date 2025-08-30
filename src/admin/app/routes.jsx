import AdminPage from '../pages/adminPage.jsx'
import AdminChartsPage from '../pages/adminChartsPage.jsx'
import AdminChartsUsersPage from '../pages/adminChartsUsersPage.jsx'
import AdminChartsUsersRechartsPage from '../pages/adminChartsUsersRechartsPage.jsx'
import AdminChartsUsersChartjs2Page from '../pages/adminChartsUsersChartjs2Page.jsx'
import AdminChartsUsersExplainPage from '../pages/adminChartsUsersExplainPage.jsx'
import AdminUiPage from '../pages/adminUiPage.jsx'
import AdminLoginPage from '../pages/adminLoginPage.jsx'
import AdminLogoutPage from '../pages/adminLogoutPage.jsx'
import AdminDashboardPage from '../pages/adminDashboardPage.jsx'
import AdminGraphPage from '../pages/adminGraphPage.jsx'
import AdminGraphGrowthPage from '../pages/adminGraphGrowthPage.jsx'
import AdminGraphEngagementPage from '../pages/adminGraphEngagementPage.jsx'
import AdminGraphReliabilityPage from '../pages/adminGraphReliabilityPage.jsx'
import AdminGraphRevenuePage from '../pages/adminGraphRevenuePage.jsx'

const adminRoutes = [
  { path: 'login', element: <AdminLoginPage />, label: 'Login' },
  { path: 'logout', element: <AdminLogoutPage />, label: 'Logout' },
  { path: 'dashboard', element: <AdminDashboardPage />, label: 'Dashboard' },
  { index: true, element: <AdminPage />, label: 'Home' },
  {
    path: 'charts',
    element: <AdminChartsPage />,
    label: 'Charts',
    children: [
      {
        path: 'users',
        element: <AdminChartsUsersPage />,
        label: 'Users',
        children: [
          { path: 'recharts', element: <AdminChartsUsersRechartsPage />, label: 'Recharts' },
          { path: 'chartjs2', element: <AdminChartsUsersChartjs2Page />, label: 'Chartjs2' },
          { path: 'explain', element: <AdminChartsUsersExplainPage />, label: 'Explain' }
        ]
      }
    ]
  },
  {
    path: 'graph',
    element: <AdminGraphPage />,
    label: 'Graph',
    children: [
      { path: 'growth', element: <AdminGraphGrowthPage />, label: 'Growth' },
      { path: 'engagement', element: <AdminGraphEngagementPage />, label: 'Engagement' },
      { path: 'reliability', element: <AdminGraphReliabilityPage />, label: 'Reliability' },
      { path: 'revenue', element: <AdminGraphRevenuePage />, label: 'Revenue' }
    ]
  },
  { path: 'ui', element: <AdminUiPage />, label: 'UI' },
]

export default adminRoutes
