export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const input = parseItemInput(body ?? {})
  const now = new Date().toISOString()

  const created = await prisma.item.create({
    data: { ...input, kode: `TEMP-${Date.now()}`, createdAt: now, updatedAt: now }
  })

  const kode = `INV-${String(created.id).padStart(4, '0')}`
  const item = await prisma.item.update({ where: { id: created.id }, data: { kode } })

  setResponseStatus(event, 201)
  return mapItem(item)
})
