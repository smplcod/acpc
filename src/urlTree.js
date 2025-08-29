const urlTree = [
  { path: '/', children: [] },
  { path: '/release-notes', children: [] },
  {
    path: '/admin',
    children: [
      { path: '/admin/login', children: [] },
      { path: '/admin/logout', children: [] },
      {
        path: '/admin/charts',
        children: [
          {
            path: '/admin/charts/users',
            children: [
              { path: '/admin/charts/users/recharts', children: [] },
              { path: '/admin/charts/users/chartjs2', children: [] },
              { path: '/admin/charts/users/explain', children: [] }
            ]
          }
        ]
      },
      { path: '/admin/ui', children: [] }
    ]
  }
]

export default urlTree
