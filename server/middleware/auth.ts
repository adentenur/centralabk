export default defineEventHandler(async (event) => {
  const path = event.path || event.node.req.url || ''
  const protectedPrefixes = ['/api/items', '/api/surat-jalan', '/api/satuan', '/api/murid', '/api/pkbm','/api/pengaturan', '/api/pengguna', '/api/akun']
  if (!protectedPrefixes.some((prefix) => path.startsWith(prefix))) return

  await requireAuthUser(event)
})
