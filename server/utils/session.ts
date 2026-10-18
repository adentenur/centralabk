import type { H3Event } from 'h3'
import { useSession } from 'h3'

export interface AuthSessionData {
  userId?: number
  sessionVersion?: number
}

export function useAuthSession(event: H3Event) {
  const { sessionPassword, sessionSecureCookie } = useRuntimeConfig()
  return useSession<AuthSessionData>(event, {
    name: 'inventaris-session',
    password: sessionPassword,
    cookie: { sameSite: 'lax', secure: sessionSecureCookie }
  })
}
