export default defineEventHandler(async () => {
  const list = await prisma.pkbm.findMany({ orderBy: { id: 'asc' }, include: { relawan: true } })
  return list.map(mapPkbm)
})
