import bcrypt from 'bcryptjs'

interface UserRow {
  id: number
  username: string
  password_hash: string
  nama: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string, password?: string }>(event)
  const username = String(body?.username ?? '').trim()
  const password = String(body?.password ?? '')

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Nama pengguna dan kata sandi wajib diisi' })
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as UserRow | undefined
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    throw createError({ statusCode: 401, statusMessage: 'Nama pengguna atau kata sandi salah' })
  }

  const session = await useAuthSession(event)
  await session.update({ userId: user.id, username: user.username, nama: user.nama })

  return { username: user.username, nama: user.nama }
})
