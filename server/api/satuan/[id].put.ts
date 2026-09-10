import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID satuan tidak valid' })
  }

  const existing = await prisma.satuan.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Satuan tidak ditemukan' })
  }

  const body = await readBody(event)
  const input = parseSatuanInput(body ?? {})

  try {
    const satuan = await prisma.satuan.update({ where: { id }, data: input })
    return mapSatuan(satuan)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Satuan dengan nama itu sudah ada' })
    }
    throw err
  }
})
