export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID surat jalan tidak valid' })
  }

  const existing = await prisma.suratJalan.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Surat jalan tidak ditemukan' })
  }

  await prisma.suratJalan.delete({ where: { id } })

  setResponseStatus(event, 200)
  return { ok: true }
})
