export default defineEventHandler(async (event) => {
  const id = parsePkbmId(event)
  const existing = await prisma.pkbm.findUnique({ where: { id }, select: { id: true } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'PKBM tidak ditemukan' })

  const { header, relawan } = parsePkbmInput((await readBody(event)) ?? {})
  const updated = await prisma.pkbm.update({
    where: { id },
    data: {
      ...header,
      updatedAt: new Date().toISOString(),
      relawan: { deleteMany: {}, create: relawan }
    },
    include: { relawan: true }
  })
  return mapPkbm(updated)
})
