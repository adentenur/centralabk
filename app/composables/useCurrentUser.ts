interface CurrentUser {
  username: string
  nama: string
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
