import { readFileSync } from 'fs'

const appName = 'Curva'
const author = 'DAN'
const version = JSON.parse(readFileSync(process.env.npm_package_json as string, 'utf8')).version

console.log('Version:', version)

export {
  author,
  appName,
  version,
}
