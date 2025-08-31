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
  { path: 'revenue', element: <AdminGraphRevenuePage />, label: 'Revenue' }
]

export default adminRoutes
