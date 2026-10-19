export default defineEventHandler(async (event) => {
  const id = parseMuridId(event)
  const existing = await prisma.murid.findUnique({ where: { id }, select: { id: true } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Data murid tidak ditemukan' })

  const body = await readBody(event)
  const input = await parseMuridInput(body ?? {})

  const murid = await prisma.murid.update({
    where: { id },
    data: { ...input, updatedAt: new Date().toISOString() },
    include: { pkbm: { select: { nama: true } } }
  })

  return mapMurid(murid)
})
