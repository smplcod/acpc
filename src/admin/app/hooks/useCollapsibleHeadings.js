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
      sections.forEach(({ button, section, handler, keyHandler }) => {
        button.removeEventListener('click', handler)
        button.removeEventListener('keydown', keyHandler)
        button.remove()
        while (section.firstChild) {
          section.parentNode.insertBefore(section.firstChild, section)
        }
        section.remove()
      })
      sections = []
      clearTimeout(saveTimer)
    }

    const build = () => {
      cleanup()
      const headings = Array.from(main.querySelectorAll('h2, h3, h4'))
      headings.forEach((heading, index) => {
        const level = Number(heading.tagName.slice(1))
        const sectionId = `acph-sec-${index}`
        let next = heading.nextElementSibling
        const collected = []
        while (
          next &&
          !(/H[2-4]/.test(next.tagName) && Number(next.tagName.slice(1)) <= level)
        ) {
          const temp = next.nextElementSibling
          collected.push(next)
          next = temp
        }
        const section = document.createElement('div')
        section.id = sectionId
        section.className = 'acph-section'
        collected.forEach((el) => section.appendChild(el))
        heading.after(section)

        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'acph-toggle'
        button.setAttribute('role', 'button')
        button.setAttribute('aria-controls', sectionId)
        let collapsed = state[index] === '1'
        button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
        button.textContent = collapsed ? '▶' : '▼'
        if (collapsed) section.classList.add('is-collapsed')
        heading.insertBefore(button, heading.firstChild)

        const handler = () => {
          collapsed = !collapsed
          if (collapsed) {
            section.classList.add('is-collapsed')
            button.textContent = '▶'
            button.setAttribute('aria-expanded', 'false')
            state[index] = '1'
          } else {
            section.classList.remove('is-collapsed')
            button.textContent = '▼'
            button.setAttribute('aria-expanded', 'true')
            state[index] = '0'
          }
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

        sections.push({ button, section, handler, keyHandler })
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

