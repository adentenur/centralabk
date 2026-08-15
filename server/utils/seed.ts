import bcrypt from 'bcryptjs'

export async function ensureSeeded() {
  const adminUsername = 'adminabk'
  const existingAdmin = await prisma.user.findUnique({ where: { username: adminUsername } })
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('deliserdang2026', 10)
    await prisma.user.create({
      data: { username: adminUsername, passwordHash, nama: 'Administrator' }
    })
  }

  const itemCount = await prisma.item.count()
  if (itemCount === 0) {
    const now = new Date().toISOString()
    const seed = [
      { namaBarang: 'Laptop Lenovo ThinkPad', kategori: 'Elektronik', namaToko: 'Toko Komputer Medan Jaya', jumlah: 5, hargaSatuan: 8500000, lokasi: 'Ruang Kepala Kantor', kondisi: 'Baik' },
      { namaBarang: 'Meja Kerja Kayu', kategori: 'Furnitur', namaToko: 'Toko Mebel Sejahtera', jumlah: 18, hargaSatuan: 750000, lokasi: 'Ruang Staf', kondisi: 'Baik' },
      { namaBarang: 'Printer Epson L3210', kategori: 'Elektronik', namaToko: 'Toko Komputer Medan Jaya', jumlah: 3, hargaSatuan: 2750000, lokasi: 'Ruang Administrasi', kondisi: 'Perbaikan' },
      { namaBarang: 'Kursi Rapat', kategori: 'Furnitur', namaToko: 'Toko Mebel Sejahtera', jumlah: 24, hargaSatuan: 425000, lokasi: 'Ruang Rapat', kondisi: 'Baik' },
      { namaBarang: 'AC Split 1 PK', kategori: 'Elektronik', namaToko: 'Toko Elektronik Berkah', jumlah: 7, hargaSatuan: 3200000, lokasi: 'Seluruh Ruangan', kondisi: 'Rusak' },
      { namaBarang: 'Lemari Arsip Besi', kategori: 'Furnitur', namaToko: 'Toko Mebel Sejahtera', jumlah: 9, hargaSatuan: 1150000, lokasi: 'Ruang Arsip', kondisi: 'Baik' },
      { namaBarang: 'Proyektor Epson', kategori: 'Elektronik', namaToko: 'Toko Elektronik Berkah', jumlah: 2, hargaSatuan: 6900000, lokasi: 'Ruang Rapat', kondisi: 'Perbaikan' }
    ]

    let index = 0
    for (const row of seed) {
      index += 1
      await prisma.item.create({
        data: { ...row, kode: `INV-${String(index).padStart(4, '0')}`, createdAt: now, updatedAt: now }
      })
    }
  }
}
