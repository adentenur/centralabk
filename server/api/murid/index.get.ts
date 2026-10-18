export default defineEventHandler(async () => {
  const murid = await prisma.murid.findMany({
    orderBy: { id: 'desc' },
    omit: { asesmen: true }
  })
  return murid.map(mapMuridSummary)
})
