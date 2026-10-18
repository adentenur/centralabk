export default defineEventHandler(async (event) => {
  const id = parseMuridId(event)
  const murid = await prisma.murid.findUnique({ where: { id } })
  if (!murid) throw createError({ statusCode: 404, statusMessage: 'Data murid tidak ditemukan' })
  return mapMurid(murid)
})
