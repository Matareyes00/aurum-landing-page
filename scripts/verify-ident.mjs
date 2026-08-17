import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const identUrl = process.env.IDENT_URL || 'http://127.0.0.1:4173/'
const browserCandidates = process.platform === 'win32'
  ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ]
  : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
const executablePath = process.env.CHROME_PATH || browserCandidates.find(existsSync)

if (!executablePath) throw new Error('No se encontró Chrome/Edge. Definí CHROME_PATH con la ruta del navegador.')

const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
const errors = []

page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('favicon')) errors.push(message.text())
})

async function sampleRun() {
  await page.goto(identUrl, { waitUntil: 'domcontentloaded' })
  const numbers = []
  let layersOverlap = false

  for (let sample = 0; sample < 85; sample += 1) {
    const state = await page.evaluate(() => {
      const opacity = (selector) => {
        const element = document.querySelector(selector)
        return element ? Number(getComputedStyle(element).opacity) : 0
      }
      return {
        number: ['3', '2', '1'].find((value) => opacity(`.count-num--${value}`) > 0.5) || null,
        count: opacity('.ident-count'),
        brand: Math.max(opacity('.ident-symbol'), opacity('.ident-word'), opacity('.ident-sub')),
      }
    })

    if (state.number && numbers.at(-1) !== state.number) numbers.push(state.number)
    if (state.count > 0.05 && state.brand > 0.05) layersOverlap = true
    await new Promise((resolve) => setTimeout(resolve, 80))
  }

  return { numbers, layersOverlap }
}

try {
  const firstLoad = await sampleRun()
  const reload = await sampleRun()
  const report = { firstLoad, reload, errors }
  console.log(JSON.stringify(report, null, 2))

  const invalid = [firstLoad, reload].some(({ numbers, layersOverlap }) => (
    numbers.join(',') !== '3,2,1' || layersOverlap
  ))
  if (invalid || errors.length) process.exitCode = 1
} finally {
  await browser.close()
}
