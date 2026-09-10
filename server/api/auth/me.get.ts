export default defineEventHandler(async (event) => {
  const session = await useAuthSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Belum masuk' })
  }
  return { username: session.data.username, nama: session.data.nama }
})
