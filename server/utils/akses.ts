import type { H3Event } from 'h3'

export type Role = 'superadmin' | 'admin'

export interface AuthUser {
  id: number
  username: string
  nama: string
  role: string
}

export interface Fitur {
  adminLihatHarga: boolean
}

const FITUR_DEFAULT: Fitur = { adminLihatHarga: false }

export async function getAuthUser(event: H3Event): Promise<AuthUser | null> {
  if (event.context.authUser !== undefined) return event.context.authUser
  const session = await useAuthSession(event)
  const userId = session.data.userId
  const found = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, nama: true, role: true, sessionVersion: true }
      })
    : null

  // Sesi dibuat sebelum password diganti/di-reset dianggap sudah tidak berlaku.
  const valid = found && (session.data.sessionVersion ?? 0) === found.sessionVersion
  const user = valid ? { id: found.id, username: found.username, nama: found.nama, role: found.role } : null
  event.context.authUser = user
  return user
}

export const PASSWORD_MIN_LENGTH = 8

export function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
    throw createError({ statusCode: 400, statusMessage: `Password minimal ${PASSWORD_MIN_LENGTH} karakter` })
  }
  return password
}

export async function requireAuthUser(event: H3Event) {
  const user = await getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Belum masuk' })
  return user
}

export async function requireSuperadmin(event: H3Event) {
  const user = await requireAuthUser(event)
  if (user.role !== 'superadmin') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya superadmin yang dapat mengakses fitur ini' })
  }
  return user
}

export async function getFitur(): Promise<Fitur> {
  const rows = await prisma.setting.findMany({ where: { key: { in: Object.keys(FITUR_DEFAULT) } } })
  const fitur = { ...FITUR_DEFAULT }
  for (const row of rows) {
    if (row.key in fitur) fitur[row.key as keyof Fitur] = row.value === 'true'
  }
  return fitur
}

export async function bisaLihatHarga(user: AuthUser) {
  if (user.role === 'superadmin') return true
  return (await getFitur()).adminLihatHarga
}
