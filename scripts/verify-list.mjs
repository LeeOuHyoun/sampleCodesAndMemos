import { readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { DOCS, linkOf, plain, slug, splitRow, walk } from './docs-utils.mjs'

const OUTPUT = join(DOCS, 'guide', 'verify-list.md')
const BADGE = /\s*<Badge type="danger" text="검증 필요" \/>/
const TOPICS = [
  ['schema', '데이터 모델 / MQL'],
  ['ui-components', 'UI 구성 요소'],
  ['jpo', 'JPO'],
  ['trigger', '트리거'],
  ['properties', 'properties'],
  ['server-java', '서버 Java'],
  ['deploy', '서버 반영'],
  ['amd', 'AMD 로딩'],
  ['widget', '위젯과 플랫폼'],
  ['uwa', 'UWA'],
  ['controls', '화면 컨트롤'],
  ['events', '이벤트, 선택, 끌어 놓기'],
  ['rest-api', '3DSpace REST API'],
  ['datagridview', 'DataGridView'],
  ['tweakers', 'Tweakers']
]

const isBalanced = (text) =>
  (text.match(/`/g) ?? []).length % 2 === 0 &&
  (text.match(/<code>/g) ?? []).length === (text.match(/<\/code>/g) ?? []).length

const lastSentence = (text) => {
  const body = text.replace(/[\s*]+$/, '')
  const cut = Math.max(body.lastIndexOf('. ', body.length - 2), body.lastIndexOf(': ', body.length - 2))
  const sentence = cut < 0 ? body : body.slice(cut + 2)
  return isBalanced(sentence) ? sentence : body
}

const excerpt = (line) => {
  const isRow = line.trim().startsWith('|')
  const cells = isRow ? splitRow(line) : [line]
  const cell = cells.find((item) => BADGE.test(item))
  const sentence = lastSentence(cell.split(BADGE)[0].replace(/^[-*>\s]+/, '')).replace(/\*\*/g, '')
  return isRow && cell !== cells[0] ? `${cells[0]} : ${sentence}` : sentence
}

const scan = (file) => {
  const link = linkOf(file)
  const page = { link, title: '', items: [] }
  let anchor = ''
  let section = ''
  let inCode = false
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('```')) inCode = !inCode
    if (inCode) continue
    const heading = line.match(/^(#{1,6}) (.*)$/)
    if (heading && heading[1].length === 1) page.title = plain(heading[2])
    if (heading && heading[1].length > 1) {
      section = plain(heading[2])
      anchor = '#' + slug(heading[2])
    }
    if (BADGE.test(line) && !heading) page.items.push(`- [${section || page.title}](${link}${anchor}) : ${excerpt(line)}`)
  }
  return page
}

const pages = walk(DOCS)
  .filter((file) => !relative(DOCS, file).startsWith('guide'))
  .map(scan)
  .filter((page) => page.items.length)
const total = pages.reduce((sum, page) => sum + page.items.length, 0)

const sections = TOPICS.flatMap(([folder, name]) => {
  const own = pages.filter((page) => page.link.startsWith(`/${folder}/`))
  if (!own.length) return []
  const count = own.reduce((sum, page) => sum + page.items.length, 0)
  return [`## ${name} (${count})`, ...own.flatMap((page) => [`### ${page.title} (${page.items.length})`, page.items.join('\n')])]
})

const header = [
  '# 검증 대기 목록',
  `본문에 <Badge type="danger" text="검증 필요" /> 배지가 붙은 추정 사양 ${total} 곳을 모은 목록입니다. 실무에 쓰기 전에 서버에서 확인합니다.`,
  [
    '- 각 줄 앞의 링크는 그 문장이 있는 절로 갑니다.',
    '- 확인했으면 원래 페이지에서 배지를 지우고 문장을 단정형으로 고칩니다. 다르게 동작하면 내용을 고칩니다.',
    '- 이 페이지는 `npm run docs:verify-list` 로 다시 만듭니다. 직접 고치지 않습니다.'
  ].join('\n')
]

writeFileSync(OUTPUT, [...header, ...sections].join('\n\n') + '\n')
console.log(`${total} items, ${pages.length} pages -> ${relative(process.cwd(), OUTPUT)}`)
