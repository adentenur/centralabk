import type { H3Event } from 'h3'

const JENIS_DOKUMEN: string[] = ['foto', 'kk', 'bpjs']

export const MAKS_UKURAN_DOKUMEN = 5 * 1024 * 1024

export function parseJenisDokumen(event: H3Event): string {
  const jenis = getRouterParam(event, 'jenis') ?? ''
  if (!JENIS_DOKUMEN.includes(jenis)) {
    throw createError({ statusCode: 400, statusMessage: 'Jenis dokumen tidak valid' })
  }
  return jenis
}

export async function requireMuridId(event: H3Event): Promise<number> {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'ID murid tidak valid' })
  const murid = await prisma.murid.findUnique({ where: { id }, select: { id: true } })
  if (!murid) throw createError({ statusCode: 404, statusMessage: 'Data murid tidak ditemukan' })
  return id
}

// Tipe file ditentukan dari isi file (magic bytes), bukan dari nama atau tipe yang dikirim browser.
export function deteksiTipeDokumen(data: Uint8Array): string | null {
  const b = data
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png'
  if (b.length >= 12 && String.fromCharCode(b[0]!, b[1]!, b[2]!, b[3]!) === 'RIFF'
    && String.fromCharCode(b[8]!, b[9]!, b[10]!, b[11]!) === 'WEBP') return 'image/webp'
  if (b.length >= 5 && String.fromCharCode(b[0]!, b[1]!, b[2]!, b[3]!, b[4]!) === '%PDF-') return 'application/pdf'
  return null
}

export function bersihkanNamaFile(nama: string | undefined, mimeType: string): string {
  const ext = mimeType === 'application/pdf' ? 'pdf' : mimeType.split('/')[1] ?? 'bin'
  const dasar = (nama ?? '').replace(/\.[^.]*$/, '').replace(/[^\w\- ]+/g, '').trim().slice(0, 80)
  return `${dasar || 'dokumen'}.${ext}`
}
