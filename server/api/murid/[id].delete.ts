export default defineEventHandler(async (event) => {
  const id = parseMuridId(event)
  const existing = await prisma.murid.findUnique({ where: { id }, select: { id: true } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Data murid tidak ditemukan' })

  await prisma.murid.delete({ where: { id } })
  return { ok: true }
})
