export interface ItemRow {
  id: number
  kode: string
  nama_barang: string
  kategori: string
  nama_toko: string
  jumlah: number
  harga_satuan: number
  lokasi: string
  kondisi: string
  created_at: string
  updated_at: string
}

export const KONDISI_VALUES = ['Baik', 'Perbaikan', 'Rusak'] as const
export type Kondisi = (typeof KONDISI_VALUES)[number]

export function mapItem(row: ItemRow) {
  return {
    id: row.id,
    kode: row.kode,
    namaBarang: row.nama_barang,
    kategori: row.kategori,
    namaToko: row.nama_toko,
    jumlah: row.jumlah,
    hargaSatuan: row.harga_satuan,
    total: row.jumlah * row.harga_satuan,
    lokasi: row.lokasi,
    kondisi: row.kondisi,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export interface ItemInput {
  namaBarang: string
  kategori: string
  namaToko: string
  jumlah: number
  hargaSatuan: number
  lokasi: string
  kondisi: string
}

export function parseItemInput(body: Record<string, unknown>): ItemInput {
  const namaBarang = String(body.namaBarang ?? '').trim()
  const kategori = String(body.kategori ?? '').trim()
  const namaToko = String(body.namaToko ?? '').trim()
  const lokasi = String(body.lokasi ?? '').trim()
  const kondisi = String(body.kondisi ?? '').trim()
  const jumlahRaw = body.jumlah
  const hargaSatuanRaw = body.hargaSatuan
  const jumlah = jumlahRaw === '' || jumlahRaw === null || jumlahRaw === undefined ? 0 : Number(jumlahRaw)
  const hargaSatuan = hargaSatuanRaw === '' || hargaSatuanRaw === null || hargaSatuanRaw === undefined ? 0 : Number(hargaSatuanRaw)

  if (!namaBarang) throw createError({ statusCode: 400, statusMessage: 'Nama barang wajib diisi' })
  if (!KONDISI_VALUES.includes(kondisi as Kondisi)) throw createError({ statusCode: 400, statusMessage: 'Kondisi barang wajib diisi' })
  if (!Number.isFinite(jumlah) || jumlah < 0) throw createError({ statusCode: 400, statusMessage: 'Jumlah harus berupa angka positif' })
  if (!Number.isFinite(hargaSatuan) || hargaSatuan < 0) throw createError({ statusCode: 400, statusMessage: 'Harga satuan harus berupa angka positif' })

  return { namaBarang, kategori, namaToko, jumlah, hargaSatuan, lokasi, kondisi }
}
