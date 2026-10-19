export default defineEventHandler(async (event) => {
  const muridId = await requireMuridId(event)
  const jenis = parseJenisDokumen(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((part) => part.name === 'file' && part.data?.length)
  if (!file) throw createError({ statusCode: 400, statusMessage: 'File belum dipilih' })
  if (file.data.length > MAKS_UKURAN_DOKUMEN) {
    throw createError({ statusCode: 413, statusMessage: 'Ukuran file maksimal 5 MB' })
  }

  const mimeType = deteksiTipeDokumen(file.data)
  if (!mimeType) {
    throw createError({ statusCode: 415, statusMessage: 'Format file harus JPG, PNG, WEBP, atau PDF' })
  }

  const data = {
    namaFile: bersihkanNamaFile(file.filename, mimeType),
    mimeType,
    ukuran: file.data.length,
    data: new Uint8Array(file.data),
    createdAt: new Date().toISOString()
  }

  return prisma.muridDokumen.upsert({
    where: { muridId_jenis: { muridId, jenis } },
    create: { muridId, jenis, ...data },
    update: data,
    select: { jenis: true, namaFile: true, mimeType: true, ukuran: true, createdAt: true }
  })
})
