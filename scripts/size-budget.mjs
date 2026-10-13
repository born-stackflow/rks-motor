// Sums the brotli size of the JavaScript the public pages load and fails above the budget.
// Usage: npm run build && node scripts/size-budget.mjs [budgetKB]
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { brotliCompressSync, constants } from 'node:zlib'

const BUDGET_KB = Number(process.argv[2] ?? process.env.JS_BUDGET_KB ?? 260)
const root = '.next'
const serverApp = join(root, 'server', 'app')
const brotli = (file) =>
  brotliCompressSync(readFileSync(file), { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length

const sizes = new Map()
const sizeOf = (asset) => {
  if (!sizes.has(asset)) {
    const file = join(root, asset.replace(/^\/?_next\//, ''))
    sizes.set(asset, existsSync(file) ? brotli(file) : 0)
  }
  return sizes.get(asset)
}

const shared = JSON.parse(readFileSync(join(root, 'build-manifest.json'), 'utf8')).rootMainFiles ?? []

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path, out)
    else if (entry.name === 'page_client-reference-manifest.js') out.push(path)
  }
  return out
}

const rows = []
for (const manifest of walk(serverApp)) {
  const route = manifest.slice(serverApp.length).replace(/\\/g, '/').replace('/page_client-reference-manifest.js', '') || '/'
  if (route.startsWith('/studio') || route.startsWith('/_')) continue
  const source = readFileSync(manifest, 'utf8')
  const chunks = new Set([...shared, ...(source.match(/static\/chunks\/[^"']+\.js/g) ?? []).map((c) => `_next/${c}`)])
  const total = [...chunks].reduce((sum, chunk) => sum + sizeOf(chunk), 0)
  rows.push({ route, kb: Math.round(total / 1024) })
}

rows.sort((a, b) => b.kb - a.kb)
for (const { route, kb } of rows) console.log(`${String(kb).padStart(5)} KB  ${route}`)
const worst = rows[0]
if (worst && worst.kb > BUDGET_KB) {
  console.error(`\nJS budget exceeded: ${worst.route} loads ${worst.kb} KB brotli (budget ${BUDGET_KB} KB)`)
  process.exit(1)
}
console.log(`\nAll public routes within ${BUDGET_KB} KB brotli.`)
