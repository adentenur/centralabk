import type { Murid, Prisma } from '@prisma/client'

type MuridSummary = Omit<Murid, 'asesmen'>

function str(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function mapMuridSummary(murid: MuridSummary) {
  return {
    id: murid.id,
    nomorRekamMedis: murid.nomorRekamMedis,
    tanggalAsesmen: murid.tanggalAsesmen,
    namaAnak: murid.namaAnak,
    namaPanggilan: murid.namaPanggilan,
    tanggalLahir: murid.tanggalLahir,
    jenisKelamin: murid.jenisKelamin,
    namaOrangTua: murid.namaOrangTua,
    nomorTelepon: murid.nomorTelepon,
    sekolah: murid.sekolah,
    kelas: murid.kelas,
    createdAt: murid.createdAt,
    updatedAt: murid.updatedAt
  }
}

export function mapMurid(murid: Murid) {
  return { ...mapMuridSummary(murid), data: murid.asesmen }
}

export function parseMuridInput(body: Record<string, unknown>) {
  const data = body.data
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw createError({ statusCode: 400, statusMessage: 'Data formulir tidak valid' })
  }
  const form = data as Record<string, unknown>
  const namaAnak = str(form.namaAnak)
  if (!namaAnak) throw createError({ statusCode: 400, statusMessage: 'Nama anak wajib diisi' })

  return {
    nomorRekamMedis: str(form.nomorRekamMedis),
    tanggalAsesmen: str(form.tanggalAsesmen),
    namaAnak,
    namaPanggilan: str(form.namaPanggilan),
    tanggalLahir: str(form.tanggalLahir),
    jenisKelamin: str(form.jenisKelamin),
    namaOrangTua: str(form.namaOrangTua),
    nomorTelepon: str(form.nomorTelepon),
    sekolah: str(form.sekolah),
    kelas: str(form.kelas),
    asesmen: form as Prisma.InputJsonObject
  }
}

export function parseMuridId(event: Parameters<typeof getRouterParam>[0]) {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'ID murid tidak valid' })
  return id
}
