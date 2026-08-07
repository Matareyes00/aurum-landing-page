import { useSyncExternalStore } from 'react'
import { findByCredentials, getUser } from './data'

/* Session store — tracks the logged-in user id in localStorage.
   PROTOTYPE auth (see PENDIENTES.md for real backend auth). */

const SESSION_KEY = 'aurum-academy-session:v1'
const listeners = new Set()

function loadSession() {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(SESSION_KEY) || null
  } catch {
    return null
  }
}

let sessionUserId = loadSession()

function emit() {
  listeners.forEach((fn) => fn())
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Returns the logged-in user object, or null. */
function currentUser() {
  return sessionUserId ? getUser(sessionUserId) : null
}

export function login(username, password) {
  const user = findByCredentials(username, password)
  if (!user) return { ok: false, error: 'Usuario o contraseña incorrectos.' }
  sessionUserId = user.id
  try {
    window.localStorage.setItem(SESSION_KEY, user.id)
  } catch {
    /* ignore */
  }
  emit()
  return { ok: true, user }
}

export function logout() {
  sessionUserId = null
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
  emit()
}

export function useAuth() {
  return useSyncExternalStore(subscribe, currentUser, () => null)
}
