export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID barang tidak valid' })
  }

  const existing = await prisma.item.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Barang tidak ditemukan' })
  }

  const body = await readBody(event)
  const input = parseItemInput(body ?? {})

  const item = await prisma.item.update({
    where: { id },
    data: { ...input, updatedAt: new Date().toISOString() }
  })

  return mapItem(item)
})
