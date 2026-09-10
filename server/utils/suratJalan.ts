import type { SuratJalan, SuratJalanItem } from '@prisma/client'

type SuratJalanWithItems = SuratJalan & { items: SuratJalanItem[] }

export function mapSuratJalan(surat: SuratJalanWithItems) {
  return {
    id: surat.id,
    nomorSurat: surat.nomorSurat,
    tanggal: surat.tanggal,
    namaPengirim: surat.namaPengirim,
    asalBarang: surat.asalBarang,
    namaPenerima: surat.namaPenerima,
    keterangan: surat.keterangan,
    createdAt: surat.createdAt,
    updatedAt: surat.updatedAt,
    items: surat.items
      .slice()
      .sort((a, b) => a.urutan - b.urutan)
      .map((item) => ({
        namaBarang: item.namaBarang,
        jumlah: item.jumlah,
        satuan: item.satuan
      }))
  }
}

export interface SuratJalanItemInput {
  namaBarang: string
  jumlah: number
  satuan: string
}

export interface SuratJalanInput {
  tanggal: string
  namaPengirim: string
  asalBarang: string
  namaPenerima: string
  keterangan: string
  items: SuratJalanItemInput[]
}

export function parseSuratJalanInput(body: Record<string, unknown>): SuratJalanInput {
  const tanggal = String(body.tanggal ?? '').trim()
  const namaPengirim = String(body.namaPengirim ?? '').trim()
  const asalBarang = String(body.asalBarang ?? '').trim()
  const namaPenerima = String(body.namaPenerima ?? '').trim()
  const keterangan = String(body.keterangan ?? '').trim()
  const rawItems = Array.isArray(body.items) ? body.items : []

  if (!tanggal) throw createError({ statusCode: 400, statusMessage: 'Tanggal wajib diisi' })

  const items: SuratJalanItemInput[] = []
  for (const raw of rawItems) {
    if (typeof raw !== 'object' || raw === null) continue
    const entry = raw as Record<string, unknown>
    const namaBarang = String(entry.namaBarang ?? '').trim()
    if (!namaBarang) continue
    const satuan = String(entry.satuan ?? '').trim()
    const jumlahRaw = entry.jumlah
    const jumlah = jumlahRaw === '' || jumlahRaw === null || jumlahRaw === undefined ? 0 : Number(jumlahRaw)
    if (!Number.isFinite(jumlah) || jumlah < 0) {
      throw createError({ statusCode: 400, statusMessage: `Jumlah untuk barang "${namaBarang}" harus berupa angka positif` })
    }
    items.push({ namaBarang, jumlah, satuan })
  }

  if (items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Minimal satu barang wajib diisi' })
  }

  return { tanggal, namaPengirim, asalBarang, namaPenerima, keterangan, items }
}

export async function generateNomorSurat(tanggal: string): Promise<string> {
  const digitsOnly = tanggal.replace(/-/g, '')
  const prefix = `SJCA-${digitsOnly}-`

  const count = await prisma.suratJalan.count({
    where: { nomorSurat: { startsWith: prefix } }
  })

  return `${prefix}${String(count + 1).padStart(3, '0')}`
}
