export default defineEventHandler(async (event) => {
  const me = await requireSuperadmin(event)
  const target = await requireTargetPengguna(event)
  const body = await readBody<Record<string, unknown>>(event)
  const nama = parseNama(body?.nama)
  const role = parseLevel(body?.role)

  if (target.id === me.id && role !== target.role) {
    throw createError({ statusCode: 400, statusMessage: 'Anda tidak dapat mengubah level akun Anda sendiri' })
  }

  return prisma.user.update({ where: { id: target.id }, data: { nama, role }, select: penggunaSelect })
})
