export default defineNitroPlugin(async () => {
  await ensureSeeded()
  await ensurePkbmSeeded()
})
