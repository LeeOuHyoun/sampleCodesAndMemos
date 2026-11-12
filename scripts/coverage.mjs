import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const WEBAPPS = resolve(process.argv[2] ?? join(ROOT, '..', 'enovia2025', '3dspace', 'webapps'))
const SOURCE = join(WEBAPPS, 'DataGridView', 'DataGridView.js')
const PARENT_SOURCE = join(WEBAPPS, 'CollectionView', 'CollectionView.js')
const DOCS = join(ROOT, 'docs', 'datagridview')
const MODULE_ID = 'DS/DataGridView/DataGridView'
const LOCALE_FILE = /_[a-z]{2}(-[A-Z]{2})?\.js$/
const INTERNAL = [/^_/, /Default$/, /^supports/, /^(initialize|buildView|name|publishedProperties)$/]

const walk = (dir, accept) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path, accept)
    return accept(name) ? [path] : []
  })

const indentOf = (line) => line.length - line.trimStart().length

const keysOfBlock = (lines, open) => {
  const depth = indentOf(lines[open]) + 2
  const keys = []
  for (let i = open + 1; i < lines.length && (lines[i].trim() === '' || indentOf(lines[i]) >= depth); i++) {
    const [, key] = lines[i].match(/^\s*([A-Za-z_$][\w$]*)\s*:/) ?? []
    if (key && indentOf(lines[i]) === depth) keys.push(key)
  }
  return keys
}

const classMembers = (lines, className) => {
  const anchor = lines.findIndex((line) => line.trim() === `name: "${className}",`)
  if (anchor < 0) return { properties: [], methods: [] }
  const depth = indentOf(lines[anchor])
  const body = []
  for (let i = anchor + 1; i < lines.length && (lines[i].trim() === '' || indentOf(lines[i]) >= depth); i++) body.push(i)
  const members = body.filter((i) => indentOf(lines[i]) === depth)
  const published = members.find((i) => /^publishedProperties: \{$/.test(lines[i].trim()))
  return {
    properties: published === undefined ? [] : keysOfBlock(lines, published),
    methods: members.flatMap((i) => lines[i].trim().match(/^([A-Za-z_$][\w$]*): (?:async )?function/)?.[1] ?? [])
  }
}

const columnDefaults = (lines) => {
  const open = lines.findIndex((line) => /_defaultColumnDef = \w+ \|\| \{$/.test(line))
  return open < 0 ? [] : keysOfBlock(lines, open)
}

const columnOptionReads = (text) => [...text.matchAll(/getColumnOptionValue\(\s*[\w.$]+,\s*"(\w+)"/g)].map((match) => match[1])

const unique = (names) => [...new Set(names)].filter((name) => !INTERNAL.some((pattern) => pattern.test(name)))

const wordPattern = (name) => new RegExp(`(?<![\\w$])${name.replace(/\$/g, '\\$')}(?![\\w$])`)

if (!existsSync(SOURCE)) {
  console.error(`원본을 찾을 수 없습니다: ${SOURCE}`)
  console.error('사용법: npm run docs:coverage -- <webapps 폴더 경로>')
  process.exit(1)
}

const sourceText = readFileSync(SOURCE, 'utf8')
const sourceLines = sourceText.split(/\r?\n/)
const grid = classMembers(sourceLines, 'dataGridView')
const layout = classMembers(sourceLines, 'CollectionViewDataGridLayout')
const parent = existsSync(PARENT_SOURCE)
  ? classMembers(readFileSync(PARENT_SOURCE, 'utf8').split(/\r?\n/), 'CollectionView')
  : { properties: [], methods: [] }
const docsText = walk(DOCS, (name) => name.endsWith('.md')).map((path) => readFileSync(path, 'utf8')).join('\n')
const appTexts = walk(WEBAPPS, (name) => name.endsWith('.js') && !LOCALE_FILE.test(name))
  .filter((path) => path !== SOURCE)
  .map((path) => readFileSync(path, 'utf8'))
  .filter((text) => text.includes(MODULE_ID))

const usageOf = (name) => {
  const pattern = wordPattern(name)
  return appTexts.filter((text) => pattern.test(text)).length
}

const report = (title, names) => {
  const all = unique(names)
  const missing = all
    .filter((name) => !wordPattern(name).test(docsText))
    .map((name) => ({ name, usage: usageOf(name) }))
    .sort((a, b) => b.usage - a.usage || a.name.localeCompare(b.name))
  console.log(`\n## ${title}: 원본 ${all.length}개 중 문서에 없는 이름 ${missing.length}개`)
  missing.forEach(({ name, usage }) => console.log(`${String(usage).padStart(4)}  ${name}`))
}

console.log(`원본: ${SOURCE}`)
console.log(`문서: ${DOCS}`)
console.log(`DataGridView 를 쓰는 앱 파일: ${appTexts.length}개 (아래 숫자 = 그 이름이 나오는 앱 파일 수)`)
report('그리드 옵션 (DataGridView publishedProperties)', grid.properties)
report('그리드 메서드 (DataGridView)', grid.methods)
report('상속 옵션 (CollectionView publishedProperties)', parent.properties)
report('상속 메서드 (CollectionView)', parent.methods)
report('layoutOptions (DataGridViewLayout publishedProperties)', layout.properties)
report('레이아웃 메서드 (DataGridViewLayout)', layout.methods)
report('컬럼 옵션, 컬럼 함수 (_defaultColumnDef, getColumnOptionValue)', [...columnDefaults(sourceLines), ...columnOptionReads(sourceText)])
