export default defineEventHandler(async (event) => {
  const session = await useAuthSession(event)
    console.log('AUTH SESSION:', session.data)
  console.log('AUTH COOKIE:', getRequestHeader(event, 'cookie'))
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Belum masuk' })
  }
  return { username: session.data.username, nama: session.data.nama }
})
