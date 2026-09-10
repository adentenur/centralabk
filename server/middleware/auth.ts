export default defineEventHandler(async (event) => {
  const path = event.path || event.node.req.url || ''
  const isProtected = path.startsWith('/api/items') || path.startsWith('/api/surat-jalan') || path.startsWith('/api/satuan')
  if (!isProtected) return

  const session = await useAuthSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Belum masuk' })
  }
})
