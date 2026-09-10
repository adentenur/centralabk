export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID satuan tidak valid' })
  }

  const existing = await prisma.satuan.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Satuan tidak ditemukan' })
  }

  await prisma.satuan.delete({ where: { id } })

  setResponseStatus(event, 200)
  return { ok: true }
})
