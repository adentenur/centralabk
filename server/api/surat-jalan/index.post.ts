export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const input = parseSuratJalanInput(body ?? {})
  const now = new Date().toISOString()
  const { items, ...header } = input
  const nomorSurat = await generateNomorSurat(header.tanggal)

  const created = await prisma.suratJalan.create({
    data: {
      ...header,
      nomorSurat,
      createdAt: now,
      updatedAt: now,
      items: {
        create: items.map((item, index) => ({ ...item, urutan: index }))
      }
    },
    include: { items: true }
  })

  setResponseStatus(event, 201)
  return mapSuratJalan(created)
})
