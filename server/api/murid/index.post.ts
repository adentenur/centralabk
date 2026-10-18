export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const input = parseMuridInput(body ?? {})
  const now = new Date().toISOString()

  const created = await prisma.murid.create({
    data: { ...input, createdAt: now, updatedAt: now }
  })

  setResponseStatus(event, 201)
  return mapMurid(created)
})
