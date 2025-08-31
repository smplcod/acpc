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
    }

    const build = () => {
      cleanup()
      const headings = Array.from(main.querySelectorAll('h2, h3, h4'))
      headings.forEach((heading, index) => {
        const level = Number(heading.tagName.slice(1))
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'acph-toggle'
        let collapsed = state[index] === '1'
        button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
        button.textContent = collapsed ? '▶' : '▼'
        const targets = []
        let next = heading.nextElementSibling
        while (
          next &&
          !(/H[2-4]/.test(next.tagName) && Number(next.tagName.slice(1)) <= level)
        ) {
          targets.push(next)
          next = next.nextElementSibling
        }
        if (collapsed) targets.forEach(t => t.classList.add('acph-collapsed'))
        const handler = () => {
          collapsed = !collapsed
          button.textContent = collapsed ? '▶' : '▼'
          button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
          targets.forEach(t => t.classList.toggle('acph-collapsed', collapsed))
          state[index] = collapsed ? '1' : '0'
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
      observer = new MutationObserver((mutations) => {
        if (
          mutations.some((m) =>
            Array.from(m.addedNodes).some(
              (n) => n.querySelector && n.querySelector('h2, h3, h4')
            )
          )
        ) {
          observer.disconnect()
          build()
          observer.observe(main, { childList: true, subtree: true })
        }
      })
      observer.observe(main, { childList: true, subtree: true })
    }

    return () => {
      if (observer) observer.disconnect()
      cleanup()
    }
  }, [pathname, search])
}

