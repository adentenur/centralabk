export default defineEventHandler(async (event) => {
  const id = parsePkbmId(event)
  const pkbm = await prisma.pkbm.findUnique({ where: { id }, include: { relawan: true } })
  if (!pkbm) throw createError({ statusCode: 404, statusMessage: 'PKBM tidak ditemukan' })
  return mapPkbm(pkbm)
})
