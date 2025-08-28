export function listPaths(routes, base = '') {
  const acc = []

  for (const route of routes) {
    const hasPath = route.path && route.path !== '*' && !route.path.includes('/:')
    const nextBase = hasPath
      ? '/' + [base.replace(/^\//, ''), route.path].filter(Boolean).join('/')
      : base

    if (route.index) {
      acc.push(base || '/')
    } else if (hasPath) {
      acc.push(nextBase)
    }

    if (route.children) {
      acc.push(...listPaths(route.children, nextBase))
    }
  }

  return Array.from(new Set(acc))
}
