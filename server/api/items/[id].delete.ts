export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID barang tidak valid' })
  }

  const info = db.prepare('DELETE FROM items WHERE id = ?').run(id)
  if (info.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Barang tidak ditemukan' })
  }

  setResponseStatus(event, 200)
  return { ok: true }
})
