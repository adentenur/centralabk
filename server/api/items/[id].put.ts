export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID barang tidak valid' })
  }

  const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(id) as ItemRow | undefined
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Barang tidak ditemukan' })
  }

  const body = await readBody(event)
  const input = parseItemInput(body ?? {})

  db.prepare(`
    UPDATE items SET
      nama_barang = @namaBarang,
      kategori = @kategori,
      nama_toko = @namaToko,
      jumlah = @jumlah,
      harga_satuan = @hargaSatuan,
      lokasi = @lokasi,
      kondisi = @kondisi,
      updated_at = datetime('now')
    WHERE id = @id
  `).run({ ...input, id })

  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id) as ItemRow
  return mapItem(row)
})
