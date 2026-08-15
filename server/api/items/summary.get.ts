export default defineEventHandler(async () => {
  const [totalBarangAgg, baikAgg, semuaAgg, kategoriGroup] = await Promise.all([
    prisma.item.aggregate({ _sum: { jumlah: true } }),
    prisma.item.aggregate({ _sum: { jumlah: true }, where: { kondisi: 'Baik' } }),
    prisma.item.aggregate({ _sum: { jumlah: true } }),
    prisma.item.groupBy({
      by: ['kategori'],
      _sum: { jumlah: true },
      orderBy: { _sum: { jumlah: 'desc' } }
    })
  ])

  const totalBarang = totalBarangAgg._sum.jumlah ?? 0
  const kondisiBaik = baikAgg._sum.jumlah ?? 0
  const perluPerhatian = (semuaAgg._sum.jumlah ?? 0) - kondisiBaik
  const totalKategori = kategoriGroup.length
  const kategoriTerbanyak = kategoriGroup[0]?.kategori || '-'

  return { totalBarang, totalKategori, kondisiBaik, perluPerhatian, kategoriTerbanyak }
})
