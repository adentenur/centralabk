export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID surat jalan tidak valid' })
  }

  const existing = await prisma.suratJalan.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Surat jalan tidak ditemukan' })
  }

  const body = await readBody(event)
  const input = parseSuratJalanInput(body ?? {})
  const { items, ...header } = input

  const surat = await prisma.suratJalan.update({
    where: { id },
    data: {
      ...header,
      updatedAt: new Date().toISOString(),
      items: {
        deleteMany: {},
        create: items.map((item, index) => ({ ...item, urutan: index }))
      }
    },
    include: { items: true }
  })

  return mapSuratJalan(surat)
})
