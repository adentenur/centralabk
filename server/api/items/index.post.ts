export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const input = parseItemInput(body ?? {})

  const insert = db.prepare(`
    INSERT INTO items (kode, nama_barang, kategori, nama_toko, jumlah, harga_satuan, lokasi, kondisi)
    VALUES (@kode, @namaBarang, @kategori, @namaToko, @jumlah, @hargaSatuan, @lokasi, @kondisi)
  `)
  const info = insert.run({ ...input, kode: `INV-${String(Date.now()).slice(-6)}` })
  const id = Number(info.lastInsertRowid)

  const kode = `INV-${String(id).padStart(4, '0')}`
  db.prepare('UPDATE items SET kode = ? WHERE id = ?').run(kode, id)

  const row = db.prepare('SELECT * FROM items WHERE id = ?').get(id) as ItemRow
  setResponseStatus(event, 201)
  return mapItem(row)
})
