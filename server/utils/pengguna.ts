import type { H3Event } from 'h3'

export const penggunaSelect = { id: true, username: true, nama: true, role: true } as const

const ROLES: string[] = ['superadmin', 'admin']

export function parseLevel(value: unknown): string {
  if (typeof value !== 'string' || !ROLES.includes(value)) {
    throw createError({ statusCode: 400, statusMessage: 'Level pengguna tidak valid' })
  }
  return value
}

export function parseNama(value: unknown) {
  const nama = typeof value === 'string' ? value.trim() : ''
  if (!nama) throw createError({ statusCode: 400, statusMessage: 'Nama wajib diisi' })
  return nama
}

export function parseUsername(value: unknown) {
  const username = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (!new RegExp('^[a-z0-9._-]{3,32}$').test(username)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username 3–32 karakter, hanya huruf kecil, angka, titik, garis bawah, atau tanda hubung'
    })
  }
  return username
}

export async function requireTargetPengguna(event: H3Event) {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'ID pengguna tidak valid' })
  const target = await prisma.user.findUnique({ where: { id }, select: penggunaSelect })
  if (!target) throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan' })
  return target
}
