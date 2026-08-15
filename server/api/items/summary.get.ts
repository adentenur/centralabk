export default defineEventHandler(() => {
  const totalBarang = (db.prepare('SELECT COALESCE(SUM(jumlah), 0) AS n FROM items').get() as { n: number }).n
  const totalKategori = (db.prepare('SELECT COUNT(DISTINCT kategori) AS n FROM items').get() as { n: number }).n
  const kondisiBaik = (db.prepare("SELECT COALESCE(SUM(jumlah), 0) AS n FROM items WHERE kondisi = 'Baik'").get() as { n: number }).n
  const perluPerhatian = (db.prepare("SELECT COALESCE(SUM(jumlah), 0) AS n FROM items WHERE kondisi != 'Baik'").get() as { n: number }).n
  const kategoriTerbanyak = db.prepare(`
    SELECT kategori, SUM(jumlah) AS total
    FROM items
    GROUP BY kategori
    ORDER BY total DESC
    LIMIT 1
  `).get() as { kategori: string, total: number } | undefined

  return {
    totalBarang,
    totalKategori,
    kondisiBaik,
    perluPerhatian,
    kategoriTerbanyak: kategoriTerbanyak?.kategori ?? '-'
  }
})
