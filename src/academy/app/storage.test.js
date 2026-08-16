import { beforeEach, describe, expect, it } from 'vitest'
import { DB_V1_KEY, DB_V2_KEY, createSeedDb, loadAcademyDb, migrateV1, normalizeDb, writeAcademyDb } from './storage'
import { getDb, transact } from './store'

function memoryStorage(entries = {}) {
  const values = new Map(Object.entries(entries))
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    dump: () => Object.fromEntries(values),
  }
}

describe('Academy storage v2', () => {
  beforeEach(() => window.localStorage.clear())

  it('migrates v1 users, assignments and progress without deleting v1', () => {
    const legacy = {
      users: [{ id: 'legacy-user', username: 'legacy', role: 'student' }],
      assignments: { 'legacy-user': ['c_codex'] },
      progress: { 'legacy-user': { c_codex: { currentIndex: 1 } } },
    }
    const storage = memoryStorage({ [DB_V1_KEY]: JSON.stringify(legacy) })
    const result = loadAcademyDb(storage)

    expect(result.migrated).toBe(true)
    expect(result.db.version).toBe(2)
    expect(result.db.users[0].id).toBe('legacy-user')
    expect(result.db.courseAssignments['legacy-user']).toEqual(['c_codex'])
    expect(storage.dump()[DB_V1_KEY]).toBe(JSON.stringify(legacy))
    expect(JSON.parse(storage.dump()[DB_V2_KEY]).version).toBe(2)
  })

  it('recovers with a usable seed when v2 JSON is corrupt', () => {
    const result = loadAcademyDb(memoryStorage({ [DB_V2_KEY]: '{broken' }))
    expect(result.error).toContain('No se pudo leer Academy v2')
    expect(result.db.tasks).toHaveLength(10)
    expect(result.db.codex.tags.length).toBeGreaterThan(10)
  })

  it('normalizes missing collections and preserves all workflow configs', () => {
    const db = normalizeDb({ version: 2, users: [] })
    expect(db.users).toEqual([])
    expect(Object.keys(db.workflowConfigs)).toHaveLength(10)
    expect(db.evaluations).toEqual({})
  })

  it('creates a seed with URL metadata instead of inline media', () => {
    const db = createSeedDb()
    expect(db.tasks).toHaveLength(10)
    expect(db.tasks.flatMap((task) => task.outputs).every((output) => !output.src.startsWith('data:'))).toBe(true)
    expect(migrateV1({}).version).toBe(2)
  })

  it('gives every seed task its own brief and comparable outputs', () => {
    const db = createSeedDb()
    // Cada workflow trae su propia consigna: un prompt genérico compartido no
    // permite evaluar adherencia ni continuidad.
    expect(new Set(db.tasks.map((task) => task.objective)).size).toBe(10)

    const preference = db.tasks.find((task) => task.workflowId === 'preference_evaluation')
    expect(preference.outputs).toHaveLength(2)
    expect(preference.outputs[0].src).not.toBe(preference.outputs[1].src)

    const continuity = db.tasks.find((task) => task.workflowId === 'continuity_coherence')
    expect(continuity.outputs).toHaveLength(3)
    expect(new Set(continuity.outputs.map((output) => output.src)).size).toBe(2)

    // El host viejo de MDN está descontinuado y ya no garantiza CORS.
    for (const output of db.tasks.flatMap((task) => task.outputs)) {
      expect(output.src).not.toContain('interactive-examples.mdn.mozilla.net')
    }
  })

  it('synchronizes a valid v2 snapshot received from another tab', () => {
    transact(createSeedDb())
    const remoteDb = createSeedDb()
    remoteDb.users[0] = { ...remoteDb.users[0], name: 'Admin remoto' }

    window.dispatchEvent(new StorageEvent('storage', {
      key: DB_V2_KEY,
      newValue: JSON.stringify(remoteDb),
    }))

    expect(getDb().users[0].name).toBe('Admin remoto')
  })

  it('reports quota or persistence errors without throwing', () => {
    const storage = { setItem: () => { throw new DOMException('Quota exceeded', 'QuotaExceededError') } }
    const result = writeAcademyDb(createSeedDb(), storage)

    expect(result.ok).toBe(false)
    expect(result.error).toContain('Quota exceeded')
  })
})
