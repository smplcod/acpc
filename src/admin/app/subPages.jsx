import { Link, useLocation } from 'react-router-dom'
import urlTree from '../../urlTree.json'

function findNode(path, nodes) {
  for (const node of nodes) {
    if (node.path === path) return node
    const found = findNode(path, node.children)
    if (found) return found
  }
  return null
}

function renderTree(nodes) {
  return (
    <ul>
      {nodes.map(n => (
        <li key={n.path}>
          <Link to={n.path}>{n.path}</Link>
          {n.children.length > 0 && renderTree(n.children)}
        </li>
      ))}
    </ul>
  )
}

export default function SubPages() {
  const { pathname } = useLocation()
  const node = findNode(pathname, urlTree)
  const children = node ? node.children : []
  if (children.length === 0) return null
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Subpages</h2>
      {renderTree(children)}
    </div>
  )
}
