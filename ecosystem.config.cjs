const fs = require('node:fs')
const path = require('node:path')

// Build produksi Nuxt (.output) tidak membaca .env sendiri, jadi .env dimuat di sini
// dan diteruskan ke proses sebagai environment variable. Secret tetap hanya ada di .env.
function loadEnv(file) {
  if (!fs.existsSync(file)) {
    console.warn(`[ecosystem] ${file} tidak ditemukan; DATABASE_URL dkk. tidak akan tersedia.`)
    return {}
  }
  const env = {}
  for (const rawLine of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

module.exports = {
  apps: [
    {
      name: 'centralabk',
      script: '.output/server/index.mjs',
      cwd: __dirname,
      env: {
        ...loadEnv(path.join(__dirname, '.env')),
        NODE_ENV: 'production',
        PORT: 3003,
        HOST: '0.0.0.0'
      },
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      time: true
    }
  ]
}
