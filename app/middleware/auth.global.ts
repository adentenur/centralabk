export default defineNuxtRouteMiddleware(async (to) => {
  const requestFetch = useRequestFetch()
  let authenticated = true
  try {
    await requestFetch('/api/auth/me')
  } catch {
    authenticated = false
  }

  if (!authenticated) {
    if (to.path !== '/login') return navigateTo('/login')
    return
  }

  if (to.path === '/login' || to.path === '/') {
    return navigateTo('/inventaris')
  }
})
