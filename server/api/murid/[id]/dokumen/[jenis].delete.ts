export default defineEventHandler(async (event) => {
  const muridId = await requireMuridId(event)
  const jenis = parseJenisDokumen(event)
  await prisma.muridDokumen.deleteMany({ where: { muridId, jenis } })
  return { ok: true }
})
