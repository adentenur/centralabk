export default defineEventHandler(async () => {
  const items = await prisma.item.findMany({ orderBy: { id: 'asc' } })
  return items.map(mapItem)
})
