export interface CurrentUser {
  username: string
  nama: string
  role: 'superadmin' | 'admin'
  bisaLihatHarga: boolean
}

export function useCurrentUser() {
  return useState<CurrentUser | null>('current-user', () => null)
}

export async function fetchCurrentUser() {
  const user = useCurrentUser()
  const requestFetch = useRequestFetch()
  try {
    user.value = await requestFetch<CurrentUser>('/api/auth/me')
  } catch {
    user.value = null
  }
  return user.value
}

export function roleLabel(role: string | undefined) {
  return role === 'superadmin' ? 'Superadmin' : 'Admin'
}
