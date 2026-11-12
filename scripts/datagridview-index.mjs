import { readFileSync, writeFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import { DOCS, linkOf, plain, slug, splitRow, walk } from './docs-utils.mjs'

const API = join(DOCS, 'datagridview', 'api')
const OUTPUT = join(API, 'key-index.md')
const SKIPPED = ['key-index.md', 'type-representation.md', 'filter.md']
const CODE = /<code>(.*?)<\/code>/g
const CALL = /\([^()]*\)$/
const PATH = /^[\w$.\s=]+$/
const NAME = /([A-Za-z_$][\w$]*)$/

const nameOf = (part) => {
  const head = part.trim().replace(CALL, '').replace(/\(\)/g, '')
  return PATH.test(head) ? head.match(NAME)?.[1] : undefined
}

const namesOf = (cell) =>
  [...cell.matchAll(CODE)].flatMap(([, code]) => code.split(' / ').flatMap((part) => nameOf(part) ?? []))

const scan = (file) => {
  const link = linkOf(file)
  const entries = []
  let title = ''
  let section = ''
  let anchor = ''
  let inCode = false
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('```')) inCode = !inCode
    if (inCode) continue
    const heading = line.match(/^(#{1,6}) (.*)$/)
    if (heading && heading[1].length === 1) title = plain(heading[2])
    if (heading && heading[1].length > 1) {
      section = plain(heading[2])
      anchor = '#' + slug(heading[2])
    }
    if (heading || !line.trim().startsWith('|')) continue
    const cells = splitRow(line)
    const place = section ? `${title} › ${section}` : title
    namesOf(cells[0]).forEach((name) => entries.push({ name, place: `[${place}](${link}${anchor})`, text: cells.at(-1) }))
  }
  return entries
}

const entries = walk(API)
  .filter((file) => !SKIPPED.includes(basename(file)))
  .flatMap(scan)
  .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.place.localeCompare(b.place))

const letters = [...new Set(entries.map((entry) => entry.name[0].toUpperCase()))]

const sections = letters.flatMap((letter) => [
  `## ${letter}`,
  [
    '| 이름 | 있는 곳 | 설명 |',
    '| --- | --- | --- |',
    ...entries
      .filter((entry) => entry.name[0].toUpperCase() === letter)
      .map((entry) => `| <code>${entry.name}</code> | ${entry.place} | ${entry.text} |`)
  ].join('\n')
])

const header = [
  '---\ntitle: 이름 색인 (A-Z)\n---',
  '# 이름 색인 (A-Z)',
  `DataGridView 레퍼런스에 나오는 옵션, 함수, 이벤트 이름 ${entries.length}개를 알파벳 순으로 모았습니다. 이름은 아는데 어느 페이지에 있는지 모를 때 씁니다.`,
  [
    '- "있는 곳" 은 그 이름이 설명된 페이지와 절입니다. 넣는 자리(그리드 옵션, `layoutOptions`, 컬럼 옵션)도 여기서 알 수 있습니다.',
    '- 이름의 일부만 기억나면 상단 검색(<kbd>Ctrl</kbd> + <kbd>K</kbd>)에 `HeaderHeight` 처럼 넣습니다.',
    '- 하고 싶은 일로 찾으려면 [개요의 "하고 싶은 일로 찾기"](/datagridview/#하고-싶은-일로-찾기) 를 봅니다.',
    '- 이 페이지는 `npm run docs:dgv-index` 로 다시 만듭니다. 직접 고치지 않습니다.'
  ].join('\n')
]

writeFileSync(OUTPUT, [...header, ...sections].join('\n\n') + '\n')
console.log(`${entries.length} names -> ${relative(process.cwd(), OUTPUT)}`)
