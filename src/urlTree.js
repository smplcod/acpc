const urlTree = [
  { path: '/', children: [] },
  { path: '/release-notes', children: [] },
  {
    path: '/admin',
    children: [
      { path: '/admin/login', children: [] },
      { path: '/admin/logout', children: [] },
      { path: '/admin/charts', children: [] },
      {
        path: '/admin/dev',
        children: [
          {
            path: '/admin/dev/charts',
            children: [
              {
                path: '/admin/dev/charts/users',
                children: [
                  { path: '/admin/dev/charts/users/recharts', children: [] },
                  { path: '/admin/dev/charts/users/chartjs2', children: [] }
                ]
              }
            ]
          }
        ]
      },
      { path: '/admin/ui', children: [] }
    ]
  }
]

export default urlTree
