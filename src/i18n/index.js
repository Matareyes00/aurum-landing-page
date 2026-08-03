import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'aurum-lang'
const SUPPORTED = ['es', 'en']

function detectInitial() {
  if (typeof window === 'undefined') return 'es'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED.includes(saved)) return saved
  } catch {
    /* localStorage may be unavailable */
  }
  const nav =
    (navigator.languages && navigator.languages[0]) || navigator.language || 'es'
  return nav.slice(0, 2).toLowerCase() === 'es' ? 'es' : 'en'
}

let current = detectInitial()
const listeners = new Set()

if (typeof document !== 'undefined') document.documentElement.lang = current

export function getLang() {
  return current
}

export function setLang(next) {
  if (!SUPPORTED.includes(next) || next === current) return
  current = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* ignore */
  }
  if (typeof document !== 'undefined') document.documentElement.lang = next
  listeners.forEach((fn) => fn())
}

export function toggleLang() {
  setLang(current === 'es' ? 'en' : 'es')
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useLang() {
  return useSyncExternalStore(subscribe, getLang, () => 'es')
}

/**
 * Pick a value from a `{ es, en }` map for the active language.
 * Falls back to Spanish (the source language) when a translation is missing.
 */
export function useCopy(map) {
  const lang = useLang()
  return map[lang] ?? map.es
}

export { SUPPORTED }
