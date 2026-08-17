import os from 'node:os'
import path from 'node:path'
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const baseUrl = process.env.ACADEMY_URL || 'http://127.0.0.1:4173/academy/app/'
const browserCandidates = process.platform === 'win32'
  ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ]
  : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
const executablePath = process.env.CHROME_PATH || browserCandidates.find(existsSync)
if (!executablePath) {
  throw new Error('No se encontró Chrome/Edge. Definí CHROME_PATH con la ruta del navegador.')
}
const outputDir = os.tmpdir()
const workflowIds = [
  'preference_evaluation',
  'single_video_qc',
  'event_temporal_annotation',
  'prompt_adherence',
  'continuity_coherence',
  'style_consistency',
  'audio_visual_sync',
  'physics_behavior',
  'safety_compliance',
  'adversarial_red_team',
]
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
const errors = []

page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('Failed to load resource') && !message.text().includes('favicon')) errors.push(message.text())
})
page.on('response', (response) => {
  if (response.status() >= 400 && !response.url().includes('favicon') && !response.url().includes('fonts.gstatic.com')) errors.push(`${response.status()} ${response.url()}`)
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

const report = { screenshots: [], views: [], counts: {}, mobileWorkflows: [], errors }

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

await page.click('.stage-stepper li:nth-child(2) .stage-step')
await page.click('.frame-zoom button:last-child')
await page.click('.frame-zoom button:last-child')
await page.click('.frame-rates button:nth-child(3)')
await page.click('.frame-marks button:nth-child(1)')
await page.$eval('.timeline input', (input) => {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setValue.call(input, '0.45')
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
})
await page.$eval('.timeline input', (input) => {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setValue.call(input, '0.95')
  input.dispatchEvent(new Event('input', { bubbles: true }))
})
await page.click('.frame-marks button:nth-child(2)')
await page.click('.output-switcher button:nth-child(2)')
report.independentControlsBeforeBChange = await page.$$eval('.video-pane video', (videos) => videos.map((video) => ({ transform: video.style.transform, rate: video.playbackRate, currentSec: Number(video.currentTime.toFixed(2)) })))
await page.click('.frame-zoom button:last-child')
report.independentControlsAfterBChange = await page.$$eval('.video-pane video', (videos) => videos.map((video) => ({ transform: video.style.transform, rate: video.playbackRate, currentSec: Number(video.currentTime.toFixed(2)) })))
await page.click('.output-switcher button:nth-child(1)')
await page.click('.video-pane.is-output-active .video-add-issue')
await page.waitForSelector('.issue-modal')
report.issueRange = await page.$$eval('.issue-fields .wf-field-row input', (inputs) => inputs.map((input) => Number(input.value)))
report.issueModalScroll = await page.$eval('.issue-fields', (fields) => ({
  scrollable: fields.scrollHeight > fields.clientHeight,
  overflowY: getComputedStyle(fields).overflowY,
}))
screenshot = path.join(outputDir, 'aurum-academy-issue-modal-desktop.png')
await page.screenshot({ path: screenshot })
report.screenshots.push(screenshot)
await page.click('.issue-codex .codex-tag')
const choiceGroups = await page.$$('.issue-fields .segmented')
await (await choiceGroups[0].$('button')).click()
await (await choiceGroups[1].$('button')).click()
const bboxStage = await page.$('.bbox-stage')
if (bboxStage) {
  await bboxStage.evaluate((element) => element.scrollIntoView({ block: 'center' }))
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
await page.click('.output-switcher button:nth-child(2)')
report.counts.outputBIssueMarkers = await page.$$eval('.timeline-marker', (items) => items.length)
await page.click('.output-switcher button:nth-child(1)')
report.counts.outputAIssueMarkers = await page.$$eval('.timeline-marker', (items) => items.length)

await page.click('.video-pane.is-output-active .video-add-issue')
await page.waitForSelector('.issue-modal')
await page.keyboard.press('Escape')
await page.waitForSelector('.issue-modal', { hidden: true })
report.issueDialogFocusReturned = await page.evaluate(() => document.activeElement?.classList.contains('video-add-issue'))

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
for (const workflowId of workflowIds) {
  await page.goto(`${baseUrl}#/workflow/task-${workflowId}`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.workflow-workspace')
  await settle()
  report.mobileWorkflows.push(await page.evaluate((id) => ({
    workflowId: id,
    overflowX: document.body.scrollWidth > innerWidth + 1,
    hasWorkbench: Boolean(document.querySelector('.video-workbench')),
    hasForm: Boolean(document.querySelector('.evaluation-form')),
  }), workflowId))
}

await page.goto(`${baseUrl}#/workflow/task-preference_evaluation`, { waitUntil: 'networkidle0' })
await page.waitForSelector('.workflow-workspace')
await settle()
await page.click('.stage-stepper li:nth-child(2) .stage-step')
await new Promise((resolve) => setTimeout(resolve, 200))
report.mobileControls = await page.evaluate(() => ({
  outputTabs: document.querySelectorAll('.output-switcher button').length,
  visiblePanes: Array.from(document.querySelectorAll('.video-pane')).filter((pane) => getComputedStyle(pane).display !== 'none').length,
  activeLabel: document.querySelector('.frame-active-output strong')?.textContent,
  hasTimeline: Boolean(document.querySelector('.active-output-controls .timeline')),
  scrollHeight: document.scrollingElement.scrollHeight,
  clientHeight: document.scrollingElement.clientHeight,
  mainBottom: Math.round(document.querySelector('.workflow-main').getBoundingClientRect().bottom + scrollY),
}))
await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight))
await new Promise((resolve) => setTimeout(resolve, 250))
report.mobileControls.actionsClearOfBottomBar = await page.evaluate(() => {
  const controls = document.querySelector('.active-output-controls')?.getBoundingClientRect()
  const bottomBar = document.querySelector('.evaluation-bottom-bar')?.getBoundingClientRect()
  return Boolean(controls && bottomBar && controls.bottom <= bottomBar.top + 1)
})
screenshot = path.join(outputDir, 'aurum-academy-workbench-mobile.png')
await page.screenshot({ path: screenshot, fullPage: true })
report.screenshots.push(screenshot)
await page.$eval('.evaluation-bottom-bar .ebb-codex', (button) => button.click())
await new Promise((resolve) => setTimeout(resolve, 200))
report.codexAfterOpen = Boolean(await page.$('.workflow-codex'))
if (!report.codexAfterOpen) throw new Error(`El Codex mobile no abrió: ${JSON.stringify({ report, route: await page.url() })}`)
report.codexKeepsActionsVisible = await page.evaluate(() => {
  const codex = document.querySelector('.workflow-codex')?.getBoundingClientRect()
  const actions = document.querySelector('.evaluation-bottom-bar')?.getBoundingClientRect()
  return Boolean(codex && actions && codex.bottom <= actions.top + 1)
})
await page.$eval('.workflow-codex-backdrop', (backdrop) => backdrop.click())
await page.waitForSelector('.workflow-codex', { hidden: true })
report.codexClosesFromBackdrop = true
screenshot = path.join(outputDir, 'aurum-academy-workspace-mobile.png')
await page.screenshot({ path: screenshot, fullPage: true })
report.screenshots.push(screenshot)
report.views.push(await metrics('student-workspace-mobile'))

await browser.close()
console.log(JSON.stringify(report, null, 2))

const invalidMobileWorkflow = report.mobileWorkflows.some((workflow) => workflow.overflowX || !workflow.hasWorkbench || !workflow.hasForm)
const [aBefore, bBefore] = report.independentControlsBeforeBChange || []
const [aAfter, bAfter] = report.independentControlsAfterBChange || []
const independentControlsFailed = aBefore?.transform !== 'scale(2)' || bBefore?.transform !== 'scale(1)' || aBefore?.rate !== 0.5 || bBefore?.rate !== 1 || aAfter?.transform !== 'scale(2)' || bAfter?.transform !== 'scale(1.5)'
const issueRangeFailed = Math.abs(report.issueRange?.[0] - 0.45) > 0.01 || Math.abs(report.issueRange?.[1] - 0.95) > 0.01
const mobileControlsFailed = report.mobileControls?.outputTabs !== 2 || report.mobileControls?.visiblePanes !== 1 || !report.mobileControls?.activeLabel || !report.mobileControls?.hasTimeline || report.mobileControls?.scrollHeight <= report.mobileControls?.clientHeight || report.mobileControls?.scrollHeight < report.mobileControls?.mainBottom || !report.mobileControls?.actionsClearOfBottomBar
if (errors.length || report.views.some((view) => view.overflowX) || invalidMobileWorkflow || independentControlsFailed || issueRangeFailed || mobileControlsFailed || !report.issueModalScroll?.scrollable || !['auto', 'scroll'].includes(report.issueModalScroll?.overflowY) || !report.issueDialogFocusReturned || !report.codexKeepsActionsVisible || !report.codexClosesFromBackdrop || report.counts.studentTasks !== 10 || report.counts.adminTasks !== 10 || report.counts.bboxSelections !== 1 || report.counts.savedIssues !== 1 || report.counts.outputAIssueMarkers !== 1 || report.counts.outputBIssueMarkers !== 0) {
  process.exitCode = 1
}
