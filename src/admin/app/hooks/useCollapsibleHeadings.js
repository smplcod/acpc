import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useCollapsibleHeadings() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    const storageKey = `adminCollapse:${pathname}${search}`
    let state = {}
    try {
      state = JSON.parse(localStorage.getItem(storageKey) || '{}')
    } catch {
      state = {}
    }

    let sections = []
    let saveTimer

    const saveState = () => {
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        localStorage.setItem(storageKey, JSON.stringify(state))
      }, 100)
    }

    const cleanup = () => {
      sections.forEach(({ button, targets, handler, keyHandler }) => {
        button.removeEventListener('click', handler)
        button.removeEventListener('keydown', keyHandler)
        button.remove()
        targets.forEach(t => t.classList.remove('acph-collapsed'))
      })
      sections = []
      clearTimeout(saveTimer)
      try {
        localStorage.setItem(storageKey, JSON.stringify(state))
      } catch {
        /* ignore */
      }
    }

    const build = () => {
      cleanup()
      const headings = Array.from(main.querySelectorAll('h2, h3'))
      headings.forEach(heading => {
        const key = heading.textContent.trim()
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'acph-toggle'
        let collapsed = state[key] === '1'
        button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
        button.textContent = collapsed ? '▶' : '▼'
        const targets = []
        let next = heading.nextElementSibling
        while (next && !/^H[1-6]$/.test(next.tagName)) {
          targets.push(next)
          next = next.nextElementSibling
        }
        if (collapsed) targets.forEach(t => t.classList.add('acph-collapsed'))
        const handler = () => {
          collapsed = !collapsed
          button.textContent = collapsed ? '▶' : '▼'
          button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
          targets.forEach(t => t.classList.toggle('acph-collapsed', collapsed))
          state[key] = collapsed ? '1' : '0'
          saveState()
        }
        const keyHandler = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handler()
          }
        }
        button.addEventListener('click', handler)
        button.addEventListener('keydown', keyHandler)
        heading.insertBefore(button, heading.firstChild)
        sections.push({ button, targets, handler, keyHandler })
      })
    }

    build()

    let observer
    if (window.MutationObserver) {
      observer = new MutationObserver(() => {
        observer.disconnect()
        build()
        observer.observe(main, { childList: true, subtree: true })
      })
      observer.observe(main, { childList: true, subtree: true })
    }

    return () => {
      if (observer) observer.disconnect()
      cleanup()
    }
  }, [pathname, search])
}

