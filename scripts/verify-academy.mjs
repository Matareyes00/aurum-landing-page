import os from 'node:os'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const baseUrl = process.env.ACADEMY_URL || 'http://127.0.0.1:4173/academy/app/'
const executablePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outputDir = os.tmpdir()
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
const errors = []

page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('Failed to load resource') && !message.text().includes('favicon')) errors.push(message.text())
})
page.on('response', (response) => {
  if (response.status() >= 400 && !response.url().includes('favicon')) errors.push(`${response.status()} ${response.url()}`)
})
page.on('requestfailed', (request) => {
  const reason = request.failure()?.errorText || 'unknown failure'
  if (reason !== 'net::ERR_ABORTED') errors.push(`${reason} ${request.url()}`)
})

async function setUser(userId) {
  await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  await page.evaluate((id) => localStorage.setItem('aurum-academy-session:v1', id), userId)
  await page.reload({ waitUntil: 'networkidle0' })
}

async function metrics(label) {
  return page.evaluate((name) => ({
    label: name,
    viewport: { width: innerWidth, height: innerHeight },
    body: { width: document.body.scrollWidth, height: document.body.scrollHeight },
    overflowX: document.body.scrollWidth > innerWidth + 1,
    route: location.hash,
  }), label)
}

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 900))
}

const report = { screenshots: [], views: [], counts: {}, errors }

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await setUser('u_ana')
await page.goto(`${baseUrl}#/workflows`, { waitUntil: 'networkidle0' })
await page.waitForSelector('.workflow-queue')
await settle()
report.counts.studentTasks = await page.$$eval('.task-row', (rows) => rows.length)
let screenshot = path.join(outputDir, 'aurum-academy-workflows-desktop.png')
await page.screenshot({ path: screenshot, fullPage: true })
report.screenshots.push(screenshot)
report.views.push(await metrics('student-workflows-desktop'))

await page.click('.task-row')
await page.waitForSelector('.workflow-workspace')
await settle()
screenshot = path.join(outputDir, 'aurum-academy-workspace-desktop.png')
await page.screenshot({ path: screenshot })
report.screenshots.push(screenshot)
report.views.push(await metrics('student-workspace-desktop'))
report.counts.videoPanes = await page.$$eval('.video-pane', (items) => items.length)
report.counts.codexTags = await page.$$eval('.workflow-codex .codex-tag', (items) => items.length)
report.video = await page.$$eval('video', (videos) => videos.map((video) => ({
  readyState: video.readyState,
  width: video.videoWidth,
  height: video.videoHeight,
})))

await page.click('.video-add-issue')
await page.waitForSelector('.issue-modal')
await page.click('.issue-codex .codex-tag')
const bboxStage = await page.$('.bbox-stage')
if (bboxStage) {
  const box = await bboxStage.boundingBox()
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.25)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.7, { steps: 5 })
  await page.mouse.up()
}
report.counts.bboxSelections = await page.$$eval('.bbox-selection', (items) => items.length)
report.bboxReadout = await page.$eval('.bbox-readout', (element) => element.textContent.trim())
await page.click('.wf-modal-actions .wf-btn--gold')
await page.waitForSelector('.issue-modal', { hidden: true })
report.counts.savedIssues = await page.$$eval('.issue-row', (items) => items.length)

await setUser('u_admin')
await page.goto(`${baseUrl}#/admin/tasks`, { waitUntil: 'networkidle0' })
await page.waitForSelector('.admin-task-list')
await settle()
screenshot = path.join(outputDir, 'aurum-academy-admin-desktop.png')
await page.screenshot({ path: screenshot, fullPage: true })
report.screenshots.push(screenshot)
report.views.push(await metrics('admin-tasks-desktop'))
report.counts.adminTasks = await page.$$eval('.admin-task-row', (items) => items.length)

await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 1 })
await setUser('u_ana')
await page.goto(`${baseUrl}#/workflow/task-preference_evaluation`, { waitUntil: 'networkidle0' })
await page.waitForSelector('.workflow-workspace')
await settle()
screenshot = path.join(outputDir, 'aurum-academy-workspace-tablet.png')
await page.screenshot({ path: screenshot, fullPage: true })
report.screenshots.push(screenshot)
report.views.push(await metrics('student-workspace-tablet'))

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
await setUser('u_ana')
await page.goto(`${baseUrl}#/workflow/task-preference_evaluation`, { waitUntil: 'networkidle0' })
await page.waitForSelector('.workflow-workspace')
await settle()
screenshot = path.join(outputDir, 'aurum-academy-workspace-mobile.png')
await page.screenshot({ path: screenshot, fullPage: true })
report.screenshots.push(screenshot)
report.views.push(await metrics('student-workspace-mobile'))

await browser.close()
console.log(JSON.stringify(report, null, 2))

if (errors.length || report.views.some((view) => view.overflowX) || report.counts.studentTasks !== 10 || report.counts.adminTasks !== 10 || report.counts.bboxSelections !== 1 || report.counts.savedIssues !== 1) {
  process.exitCode = 1
}
