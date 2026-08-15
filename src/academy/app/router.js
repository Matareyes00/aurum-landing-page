import { useSyncExternalStore } from 'react'

const listeners = new Set()

function currentHash() {
  if (typeof window === 'undefined') return '/'
  return window.location.hash.replace(/^#/, '') || '/'
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => listeners.forEach((fn) => fn()))
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Parse a hash path into a route descriptor. */
function parse(hash) {
  const clean = hash.split('?')[0]
  const parts = clean.split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'home', id: null }
  const [head, second = null, third = null] = parts
  switch (head) {
    case 'cursos':
      return { name: 'cursos', id: null }
    case 'curso':
      return { name: 'curso', id: second }
    case 'workflows':
      return { name: 'workflows', id: null }
    case 'workflow':
      return { name: 'workflow', id: second }
    case 'codex':
      return { name: 'codex', id: null }
    case 'perfil':
      return { name: 'perfil', id: null }
    case 'admin':
      return { name: 'admin', section: second || 'people', id: third }
    default:
      return { name: 'home', id: null }
  }
}

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, currentHash, () => '/')
  return parse(hash)
}

export function navigate(path) {
  if (typeof window === 'undefined') return
  window.scrollTo(0, 0)
  const next = path.startsWith('#') ? path : `#${path}`
  if (window.location.hash === next) {
    listeners.forEach((fn) => fn())
    return
  }
  window.location.hash = next
}
