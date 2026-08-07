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
  const [head, id = null] = parts
  switch (head) {
    case 'cursos':
      return { name: 'cursos', id: null }
    case 'curso':
      return { name: 'curso', id }
    case 'perfil':
      return { name: 'perfil', id: null }
    case 'admin':
      return { name: 'admin', id: null }
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
  const next = path.startsWith('#') ? path : `#${path}`
  if (window.location.hash === next) {
    listeners.forEach((fn) => fn())
    return
  }
  window.location.hash = next
}
