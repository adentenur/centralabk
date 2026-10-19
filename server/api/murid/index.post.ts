export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const input = await parseMuridInput(body ?? {})
  const now = new Date().toISOString()

  const created = await prisma.murid.create({
    data: { ...input, createdAt: now, updatedAt: now },
    include: { pkbm: { select: { nama: true } } }
  })

  setResponseStatus(event, 201)
  return mapMurid(created)
})
