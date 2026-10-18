export default defineEventHandler(async (event) => {
  await requireSuperadmin(event)
  return prisma.user.findMany({ select: penggunaSelect, orderBy: [{ role: 'desc' }, { username: 'asc' }] })
})
