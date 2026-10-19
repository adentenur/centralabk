export default defineEventHandler(async (event) => {
  const id = parsePkbmId(event)
  const existing = await prisma.pkbm.findUnique({ where: { id }, select: { id: true } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'PKBM tidak ditemukan' })
  await prisma.pkbm.delete({ where: { id } })
  return { ok: true }
})
