import type { Pkbm, PkbmRelawan, Prisma } from '@prisma/client'

const NILAI: string[] = ['Baik', 'Cukup', 'Kurang', '']
const STATUS_IZIN: string[] = ['Berizin', 'Dalam proses']
const ASPEK_FASILITAS: string[] = ['Lokasi', 'Kamar mandi', 'Ruangan', 'Alat peraga', 'Kebersihan']

interface FasilitasItem {
  aspek: string
  nilai: string
  catatan: string
}

function teks(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function nilaiValid(value: unknown, label: string) {
  const nilai = teks(value)
  if (!NILAI.includes(nilai)) throw createError({ statusCode: 400, statusMessage: `Nilai ${label} tidak valid` })
  return nilai
}

export function normalisasiFasilitas(raw: unknown): FasilitasItem[] {
  const list = Array.isArray(raw) ? raw as Record<string, unknown>[] : []
  return ASPEK_FASILITAS.map((aspek) => {
    const found = list.find((item) => item && item.aspek === aspek)
    return { aspek, nilai: found ? nilaiValid(found.nilai, aspek) : '', catatan: found ? teks(found.catatan) : '' }
  })
}

export function mapPkbm(pkbm: Pkbm & { relawan: PkbmRelawan[] }) {
  return {
    id: pkbm.id,
    nama: pkbm.nama,
    kecamatan: pkbm.kecamatan,
    statusIzin: pkbm.statusIzin,
    jamOperasional: pkbm.jamOperasional,
    nilaiJam: pkbm.nilaiJam,
    kepalaSekolah: pkbm.kepalaSekolah,
    nilaiKepalaSekolah: pkbm.nilaiKepalaSekolah,
    fasilitas: normalisasiFasilitas(pkbm.fasilitas),
    relawan: pkbm.relawan
      .slice()
      .sort((a, b) => a.urutan - b.urutan)
      .map((r) => ({ nama: r.nama, nilai: r.nilai })),
    createdAt: pkbm.createdAt,
    updatedAt: pkbm.updatedAt
  }
}

export function parsePkbmInput(body: Record<string, unknown>) {
  const nama = teks(body.nama)
  if (!nama) throw createError({ statusCode: 400, statusMessage: 'Nama PKBM wajib diisi' })

  const statusIzin = teks(body.statusIzin) || 'Berizin'
  if (!STATUS_IZIN.includes(statusIzin)) throw createError({ statusCode: 400, statusMessage: 'Status izin tidak valid' })

  const relawanRaw = Array.isArray(body.relawan) ? body.relawan as Record<string, unknown>[] : []
  const relawan = relawanRaw
    .filter((r) => r && teks(r.nama))
    .map((r, urutan) => ({ nama: teks(r.nama), nilai: nilaiValid(r.nilai, `relawan "${teks(r.nama)}"`), urutan }))

  return {
    header: {
      nama,
      kecamatan: teks(body.kecamatan),
      statusIzin,
      jamOperasional: teks(body.jamOperasional),
      nilaiJam: nilaiValid(body.nilaiJam, 'jam operasional'),
      kepalaSekolah: teks(body.kepalaSekolah),
      nilaiKepalaSekolah: nilaiValid(body.nilaiKepalaSekolah, 'kepala sekolah'),
      fasilitas: normalisasiFasilitas(body.fasilitas) as unknown as Prisma.InputJsonArray
    },
    relawan
  }
}

export function parsePkbmId(event: Parameters<typeof getRouterParam>[0]): number {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'ID PKBM tidak valid' })
  return id
}
