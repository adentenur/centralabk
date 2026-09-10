export default defineEventHandler(async () => {
  const satuan = await prisma.satuan.findMany({ orderBy: { nama: 'asc' } })
  return satuan.map(mapSatuan)
})
