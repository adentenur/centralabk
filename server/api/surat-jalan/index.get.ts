export default defineEventHandler(async () => {
  const suratJalan = await prisma.suratJalan.findMany({
    orderBy: { id: 'desc' },
    include: { items: true }
  })
  return suratJalan.map(mapSuratJalan)
})
