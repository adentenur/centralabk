export default defineEventHandler(async (event) => {
  await requireSuperadmin(event)
  const body = await readBody<{ adminLihatHarga?: unknown }>(event)
  if (typeof body?.adminLihatHarga !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'Nilai fitur tidak valid' })
  }

  const value = String(body.adminLihatHarga)
  const updatedAt = new Date().toISOString()
  await prisma.setting.upsert({
    where: { key: 'adminLihatHarga' },
    create: { key: 'adminLihatHarga', value, updatedAt },
    update: { value, updatedAt }
  })

  return getFitur()
})
