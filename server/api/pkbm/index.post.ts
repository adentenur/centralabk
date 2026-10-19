export default defineEventHandler(async (event) => {
  const { header, relawan } = parsePkbmInput((await readBody(event)) ?? {})
  const now = new Date().toISOString()
  const created = await prisma.pkbm.create({
    data: { ...header, createdAt: now, updatedAt: now, relawan: { create: relawan } },
    include: { relawan: true }
  })
  setResponseStatus(event, 201)
  return mapPkbm(created)
})
