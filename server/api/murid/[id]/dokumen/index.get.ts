export default defineEventHandler(async (event) => {
  const muridId = await requireMuridId(event)
  return prisma.muridDokumen.findMany({
    where: { muridId },
    select: { jenis: true, namaFile: true, mimeType: true, ukuran: true, createdAt: true }
  })
})
