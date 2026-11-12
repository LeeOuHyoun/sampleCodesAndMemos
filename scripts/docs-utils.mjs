import { readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const DOCS = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs')

export const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return name.endsWith('.md') ? [path] : []
  })

export const plain = (text) => text.replace(/<Badge[^>]*\/>/g, '').replace(/<[^>]+>/g, '').trim()

export const slug = (heading) =>
  plain(heading)
    .replace(/`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()

export const splitRow = (line) => line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((cell) => cell.trim())

export const linkOf = (file) => '/' + relative(DOCS, file).split(sep).join('/').replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
