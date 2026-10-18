export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID barang tidak valid' })
  }

  const existing = await prisma.item.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Barang tidak ditemukan' })
  }

  const lihatHarga = await bisaLihatHarga(await requireAuthUser(event))
  const body = await readBody(event)
  const { hargaSatuan, ...input } = parseItemInput(body ?? {})

  // Pengguna yang tidak boleh melihat harga juga tidak boleh mengubahnya; harga lama dipertahankan.
  const item = await prisma.item.update({
    where: { id },
    data: { ...input, ...(lihatHarga ? { hargaSatuan } : {}), updatedAt: new Date().toISOString() }
  })

  return mapItem(item, lihatHarga)
})
