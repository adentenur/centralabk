import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const input = parseSatuanInput(body ?? {})

  try {
    const created = await prisma.satuan.create({
      data: { ...input, createdAt: new Date().toISOString() }
    })
    setResponseStatus(event, 201)
    return mapSatuan(created)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Satuan dengan nama itu sudah ada' })
    }
    throw err
  }
})
