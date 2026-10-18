import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const me = await requireSuperadmin(event)
  const target = await requireTargetPengguna(event)
  if (target.id === me.id) {
    throw createError({ statusCode: 400, statusMessage: 'Untuk akun Anda sendiri, gunakan menu Akun Saya' })
  }

  const body = await readBody<{ passwordBaru?: unknown }>(event)
  const passwordBaru = validatePassword(body?.passwordBaru)

  // Reset password juga mengeluarkan pengguna tersebut dari semua perangkat.
  await prisma.user.update({
    where: { id: target.id },
    data: { passwordHash: bcrypt.hashSync(passwordBaru, 10), sessionVersion: { increment: 1 } }
  })

  return { ok: true }
})
