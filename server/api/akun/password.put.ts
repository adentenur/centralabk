import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const authUser = await requireAuthUser(event)
  const body = await readBody<{ passwordLama?: unknown, passwordBaru?: unknown }>(event)
  const passwordLama = typeof body?.passwordLama === 'string' ? body.passwordLama : ''
  const passwordBaru = validatePassword(body?.passwordBaru)

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user || !bcrypt.compareSync(passwordLama, user.passwordHash)) {
    throw createError({ statusCode: 400, statusMessage: 'Password lama salah' })
  }
  if (passwordLama === passwordBaru) {
    throw createError({ statusCode: 400, statusMessage: 'Password baru harus berbeda dari password lama' })
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: bcrypt.hashSync(passwordBaru, 10), sessionVersion: { increment: 1 } }
  })

  // Perangkat lain otomatis keluar; sesi di perangkat ini diperbarui supaya tetap masuk.
  const session = await useAuthSession(event)
  await session.update({ userId: updated.id, sessionVersion: updated.sessionVersion })

  return { ok: true }
})
