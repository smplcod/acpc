import { createBrowserRouter, redirect } from 'react-router-dom'

export const routes = [
  { path: '/', lazy: () => import('../pages/Home.jsx') },
  { path: '/login', lazy: () => import('../pages/Login.jsx') },
  {
    path: '/admin',
    loader: () => (localStorage.getItem('token') ? null : redirect('/login')),
    lazy: () => import('../pages/Admin.jsx'),
    children: [
      { index: true, lazy: () => import('../pages/Dashboard.jsx') },
      { path: 'users', lazy: () => import('../pages/Users.jsx') },
    ],
  },
  { path: '/sitemap', lazy: () => import('../pages/Sitemap.jsx') },
  { path: '*', lazy: () => import('../pages/NotFound.jsx') },
]

export const router = createBrowserRouter(routes)
