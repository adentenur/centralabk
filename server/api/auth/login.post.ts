import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string, password?: string }>(event)
  const username = String(body?.username ?? '').trim()
  const password = String(body?.password ?? '')

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Nama pengguna dan kata sandi wajib diisi' })
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Nama pengguna atau kata sandi salah' })
  }

  const session = await useAuthSession(event)
  await session.update({ userId: user.id, username: user.username, nama: user.nama })

  console.log('LOGIN SESSION:', session.data)
console.log('SET COOKIE:', getResponseHeader(event, 'set-cookie'))

  return { username: user.username, nama: user.nama }
})
