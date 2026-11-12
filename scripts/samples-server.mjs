import { createServer } from 'node:http'
import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const WEBAPPS = resolve(process.argv[2] ?? join(ROOT, '..', 'enovia2025', '3dspace', 'webapps'))
const PORT = Number(process.env.PORT ?? 8080)
const SAMPLE_FOLDERS = readdirSync(ROOT).filter((name) => /Sample$/.test(name) && statSync(join(ROOT, name)).isDirectory())
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
}

if (!existsSync(join(WEBAPPS, 'DataGridView', 'DataGridView.js'))) {
  console.error(`webapps 폴더를 찾을 수 없습니다: ${WEBAPPS}`)
  console.error('사용법: npm run samples -- <webapps 폴더 경로>')
  process.exit(1)
}

const locate = (pathname) => {
  const [, folder, rest = ''] = pathname.match(/^\/webapps\/([^/]+)\/?(.*)$/) ?? []
  if (!folder) return undefined
  const base = SAMPLE_FOLDERS.includes(folder) ? ROOT : WEBAPPS
  const file = normalize(join(base, folder, rest))
  return file.startsWith(normalize(join(base, folder))) ? file : undefined
}

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  const file = locate(pathname)
  const found = file && existsSync(file) && statSync(file).isFile()
  if (!found) {
    response.writeHead(404)
    response.end()
    return
  }
  response.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' })
  createReadStream(file).pipe(response)
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`webapps: ${WEBAPPS}`)
  SAMPLE_FOLDERS.filter((folder) => existsSync(join(ROOT, folder, 'index.html'))).forEach((folder) =>
    console.log(`http://127.0.0.1:${PORT}/webapps/${folder}/index.html`)
  )
  console.log('종료: Ctrl + C')
})
