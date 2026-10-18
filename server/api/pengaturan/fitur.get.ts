export default defineEventHandler(async (event) => {
  await requireSuperadmin(event)
  return getFitur()
})
