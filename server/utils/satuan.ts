import type { Satuan } from '@prisma/client'

export function mapSatuan(satuan: Satuan) {
  return {
    id: satuan.id,
    nama: satuan.nama,
    createdAt: satuan.createdAt
  }
}

export function parseSatuanInput(body: Record<string, unknown>) {
  const nama = String(body.nama ?? '').trim()
  if (!nama) throw createError({ statusCode: 400, statusMessage: 'Nama satuan wajib diisi' })
  return { nama }
}
