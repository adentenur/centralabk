import type { Item } from '@prisma/client'

export const KONDISI_VALUES = ['Baik', 'Perbaikan', 'Rusak'] as const
export type Kondisi = (typeof KONDISI_VALUES)[number]

export function mapItem(item: Item) {
  return {
    id: item.id,
    kode: item.kode,
    namaBarang: item.namaBarang,
    kategori: item.kategori,
    namaToko: item.namaToko,
    jumlah: item.jumlah,
    hargaSatuan: item.hargaSatuan,
    total: item.jumlah * item.hargaSatuan,
    lokasi: item.lokasi,
    kondisi: item.kondisi,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
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
