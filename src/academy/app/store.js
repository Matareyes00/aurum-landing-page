import { useSyncExternalStore } from 'react'
import { DB_V2_KEY, loadAcademyDb, normalizeDb, writeAcademyDb } from './storage'

const initial = typeof window === 'undefined'
  ? { db: normalizeDb(null), error: null, migrated: false }
  : loadAcademyDb()

let db = initial.db
let storageStatus = {
  state: initial.error ? 'error' : 'saved',
  error: initial.error,
  savedAt: initial.error ? null : Date.now(),
  migrated: initial.migrated,
}

const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getDb() {
  return db
}

export function getStorageStatus() {
  return storageStatus
}

export function useDb() {
  return useSyncExternalStore(subscribe, getDb, getDb)
}

export function useStorageStatus() {
  return useSyncExternalStore(subscribe, getStorageStatus, getStorageStatus)
}

export function transact(updater) {
  const next = typeof updater === 'function' ? updater(db) : updater
  db = normalizeDb(next)
  storageStatus = { ...storageStatus, state: 'saving', error: null }
  emit()
  const result = typeof window === 'undefined' ? { ok: true, error: null } : writeAcademyDb(db)
  storageStatus = {
    ...storageStatus,
    state: result.ok ? 'saved' : 'error',
    error: result.error,
    savedAt: result.ok ? Date.now() : storageStatus.savedAt,
  }
  emit()
  return result
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== DB_V2_KEY || !event.newValue) return
    try {
      db = normalizeDb(JSON.parse(event.newValue))
      storageStatus = { ...storageStatus, state: 'saved', error: null, savedAt: Date.now() }
      emit()
    } catch (error) {
      storageStatus = { ...storageStatus, state: 'error', error: `No se pudo sincronizar: ${error.message}` }
      emit()
    }
  })
}
