export default defineEventHandler(async (event) => {
  const path = event.path || event.node.req.url || ''
  if (!path.startsWith('/api/items')) return

  const session = await useAuthSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Belum masuk' })
  }
})
