export default defineEventHandler(async (event) => {
  const lihatHarga = await bisaLihatHarga(await requireAuthUser(event))
  const body = await readBody(event)
  const { hargaSatuan, ...input } = parseItemInput(body ?? {})
  const now = new Date().toISOString()

  const created = await prisma.item.create({
    data: {
      ...input,
      ...(lihatHarga ? { hargaSatuan } : {}),
      kode: `TEMP-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    }
  })

  const kode = `INV-${String(created.id).padStart(4, '0')}`
  const item = await prisma.item.update({ where: { id: created.id }, data: { kode } })

  setResponseStatus(event, 201)
  return mapItem(item, lihatHarga)
})
