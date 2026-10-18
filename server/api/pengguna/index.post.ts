import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  await requireSuperadmin(event)
  const body = await readBody<Record<string, unknown>>(event)
  const username = parseUsername(body?.username)
  const nama = parseNama(body?.nama)
  const role = parseLevel(body?.role)
  const password = validatePassword(body?.password)

  try {
    const created = await prisma.user.create({
      data: { username, nama, role, passwordHash: bcrypt.hashSync(password, 10) },
      select: penggunaSelect
    })
    setResponseStatus(event, 201)
    return created
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: `Username "${username}" sudah dipakai` })
    }
    throw err
  }
})
