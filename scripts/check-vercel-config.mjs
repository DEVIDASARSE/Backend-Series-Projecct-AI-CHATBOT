import fs from 'fs'

const raw = fs.readFileSync('vercel.json', 'utf8')
const cfg = JSON.parse(raw)

const required = ['version', 'buildCommand', 'outputDirectory', 'installCommand', 'framework']
const missing = required.filter((k) => !(k in cfg))

if (missing.length) {
  console.error(`Missing vercel.json keys: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('vercel.json is valid for Vite static deployment')
