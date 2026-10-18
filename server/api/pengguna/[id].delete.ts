export default defineEventHandler(async (event) => {
  const me = await requireSuperadmin(event)
  const target = await requireTargetPengguna(event)
  if (target.id === me.id) {
    throw createError({ statusCode: 400, statusMessage: 'Anda tidak dapat menghapus akun Anda sendiri' })
  }

  await prisma.user.delete({ where: { id: target.id } })
  return { ok: true }
})
