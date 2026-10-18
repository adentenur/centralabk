export default defineEventHandler(async (event) => {
  const lihatHarga = await bisaLihatHarga(await requireAuthUser(event))
  const items = await prisma.item.findMany({ orderBy: { id: 'asc' } })
  return items.map((item) => mapItem(item, lihatHarga))
})
