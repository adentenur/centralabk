export default defineEventHandler(async (event) => {
  const muridId = await requireMuridId(event)
  const jenis = parseJenisDokumen(event)
  const dokumen = await prisma.muridDokumen.findUnique({ where: { muridId_jenis: { muridId, jenis } } })
  if (!dokumen) throw createError({ statusCode: 404, statusMessage: 'Dokumen belum diunggah' })

  setResponseHeaders(event, {
    'Content-Type': dokumen.mimeType,
    'Content-Length': String(dokumen.ukuran),
    'Content-Disposition': `inline; filename="${dokumen.namaFile}"`,
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff'
  })
  return Buffer.from(dokumen.data)
})
