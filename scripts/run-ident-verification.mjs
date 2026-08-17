import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const identUrl = process.env.IDENT_URL || 'http://127.0.0.1:4173/'
const externalServer = Boolean(process.env.IDENT_URL)
const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))

async function waitForServer(url, attempts = 60) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Vite preview no respondió en ${url}`)
}

const preview = externalServer
  ? null
  : spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1'], {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      stdio: 'ignore',
    })

try {
  if (preview) await waitForServer(identUrl)
  await import('./verify-ident.mjs')
} finally {
  preview?.kill()
}
