export default defineEventHandler(async () => {
  const murid = await prisma.murid.findMany({
    orderBy: { id: 'desc' },
    omit: { asesmen: true },
    include: { pkbm: { select: { nama: true } } }
  })
  return murid.map(mapMuridSummary)
})
