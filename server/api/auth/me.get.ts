export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event)
  return {
    username: user.username,
    nama: user.nama,
    role: user.role,
    bisaLihatHarga: await bisaLihatHarga(user)
  }
})
