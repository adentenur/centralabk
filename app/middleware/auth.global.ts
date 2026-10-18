const SUPERADMIN_ONLY = ['/pengaturan/fitur', '/pengaturan/pengguna']

export default defineNuxtRouteMiddleware(async (to) => {
  const user = await fetchCurrentUser()

  if (!user) {
    if (to.path !== '/login') return navigateTo('/login')
    return
  }

  if (to.path === '/login' || to.path === '/') {
    return navigateTo('/inventaris')
  }

  if (user.role !== 'superadmin' && SUPERADMIN_ONLY.some((path) => to.path.startsWith(path))) {
    return navigateTo('/inventaris')
  }
})
