export default defineEventHandler(async (event) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { connected: true }
  } catch {
    setResponseStatus(event, 503)
    return { connected: false }
  }
})
