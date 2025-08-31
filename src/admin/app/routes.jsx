import AdminUiChartsPage from '../pages/adminUiChartsPage.jsx'
import AdminUiSpoilersPage from '../pages/adminUiSpoilersPage.jsx'
import AdminUiPage from '../pages/adminUiPage.jsx'
import AdminLoginPage from '../pages/adminLoginPage.jsx'
import AdminLogoutPage from '../pages/adminLogoutPage.jsx'
import AdminDashboardPage from '../pages/adminDashboardPage.jsx'
import AdminGraphGrowthPage from '../pages/adminGraphGrowthPage.jsx'
import AdminGraphEngagementPage from '../pages/adminGraphEngagementPage.jsx'
import AdminGraphReliabilityPage from '../pages/adminGraphReliabilityPage.jsx'
import AdminGraphRevenuePage from '../pages/adminGraphRevenuePage.jsx'

const adminRoutes = [
  { path: 'login', element: <AdminLoginPage />, label: 'Login' },
  { path: 'logout', element: <AdminLogoutPage />, label: 'Logout' },
  { index: true, element: <AdminDashboardPage />, label: 'Dashboard' },
  { path: 'growth', element: <AdminGraphGrowthPage />, label: 'Growth' },
  { path: 'engagement', element: <AdminGraphEngagementPage />, label: 'Engagement' },
  { path: 'reliability', element: <AdminGraphReliabilityPage />, label: 'Reliability' },
  { path: 'revenue', element: <AdminGraphRevenuePage />, label: 'Revenue' },
  {
    path: 'ui',
    element: <AdminUiPage />,
    label: 'UI',
    children: [
      { path: 'charts', element: <AdminUiChartsPage />, label: 'Charts' },
      { path: 'spoilers', element: <AdminUiSpoilersPage />, label: 'Spoilers' }
    ]
  },
]

export default adminRoutes
