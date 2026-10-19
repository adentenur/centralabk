// Data awal dari "Rekapitulasi Penilaian PKBM Penyandang Disabilitas di Kecamatan Kabupaten Deli Serdang 2026".
// Warna di dokumen: hijau = Baik, kuning = Cukup, merah = Kurang, tanpa warna = belum dinilai.
// Hanya dimasukkan saat tabel pkbm masih kosong.

type N = 'B' | 'C' | 'K' | ''

interface SeedPkbm {
  nama: string
  kecamatan: string
  izin: 'Berizin' | 'Dalam proses'
  jam: string
  nilaiJam: N
  kepsek: string
  nilaiKepsek: N
  fasilitas: [N, N, N, N, N]
  catatan?: Partial<Record<'Lokasi' | 'Kamar mandi' | 'Ruangan' | 'Alat peraga' | 'Kebersihan', string>>
  relawan: [string, N][]
}

const SEED_PKBM: SeedPkbm[] = [
  {
    nama: 'PKBM Al Hidayah', kecamatan: 'Labuhan Deli', izin: 'Berizin',
    jam: 'Senin–Jumat, 09.00–12.00 WIB', nilaiJam: 'C', kepsek: 'Rubiatun', nilaiKepsek: 'C',
    fasilitas: ['K', 'K', 'K', 'C', 'C'],
    catatan: { 'Lokasi': 'Perlu relokasi', 'Kamar mandi': 'Tidak ada', 'Ruangan': '1 ruangan' },
    relawan: [['Rubiatun', 'K'], ['Nurhalimah', 'K'], ['Nana Agustina Fadhillah', 'C'], ['Bunga Camelia Putri Tarigan, S.Keb', 'C'], ['Dian Surya Ningsih', 'C'], ['Ita Laksari Hasibuan, S.Sos', 'C']]
  },
  {
    nama: 'PKBM Nurul Qolbi', kecamatan: 'Pagar Merbau', izin: 'Dalam proses',
    jam: 'Senin–Jumat, 08.00–12.00 WIB', nilaiJam: 'B', kepsek: 'Novita Ari Ani, A.Md.Com (D3)', nilaiKepsek: 'C',
    fasilitas: ['B', 'C', 'B', 'B', 'B'],
    catatan: { 'Kamar mandi': 'Tetap dijaga' },
    relawan: [['Novita Ari Ani, A.Md.Com (D3)', 'C'], ['Inti Muliyani (SMA)', 'K'], ['Setiyani (SMA)', 'K'], ['Maulidda Annisa (SMA)', 'K']]
  },
  {
    nama: 'PKBM Farhan An-Nur', kecamatan: 'Batang Kuis', izin: 'Berizin',
    jam: 'Senin–Jumat, 10.30–12.30 WIB', nilaiJam: 'C', kepsek: 'Joko Riyanto, S.Pd', nilaiKepsek: 'B',
    fasilitas: ['B', 'B', 'B', 'B', 'B'],
    relawan: [['Joko Riyanto, S.Pd', 'B'], ['Novi Armita Sari (sedang kuliah S1)', 'B'], ['Luthfi Aini (sedang kuliah S1)', 'B'], ['Putri Zahwa (sedang kuliah S1)', 'B'], ['Azaria Anggun (sedang kuliah S1)', 'B'], ['Nuriana (SMA)', 'B'], ['Sachbrina Dwi Tiara (sedang kuliah S1)', 'B'], ['Nuriana (SMA)', 'B'], ['Gayatri Eka Sundari, SE', 'B']]
  },
  {
    nama: 'PKBM Arnhemiah', kecamatan: 'Pancur Baru', izin: 'Berizin',
    jam: 'Selasa–Kamis, 13.00–15.00 WIB', nilaiJam: 'K', kepsek: 'Sri Hariyatni (SMA)', nilaiKepsek: 'K',
    fasilitas: ['K', 'K', 'K', 'K', 'K'],
    catatan: { 'Lokasi': 'Perlu relokasi', 'Kamar mandi': 'Tidak ada', 'Ruangan': '1 ruangan', 'Alat peraga': 'Kurang lengkap' },
    relawan: [['Nelly Yunita (SMA)', 'K'], ['Parit Tri Utami, S.Pd', 'K'], ['Rehulina Br. Sembiring, A.Md', 'K'], ['Lelawati Siregar (SMA)', 'K'], ['Sri Hariyatni (SMA)', 'K']]
  },
  {
    nama: 'PKBM Harapan Baru', kecamatan: 'Kutalimbaru', izin: 'Berizin',
    jam: 'Senin–Jumat, 09.00–12.00 WIB', nilaiJam: 'C', kepsek: 'Zulkhairani', nilaiKepsek: 'C',
    fasilitas: ['', 'C', 'C', 'C', 'C'],
    relawan: [['Reni Yanti Br Perangin Angin, S.Pd', 'K'], ['Marcelina Uli Br Sembiring (SMA)', 'K'], ['Cintawati (D3)', 'K'], ['Aflahus Syakirah (SMA)', 'K'], ['Siti Rahmah (SMA)', 'K']]
  },
  {
    nama: 'PKBM Cahaya Mentari', kecamatan: 'Biru-Biru', izin: 'Berizin',
    jam: 'Selasa–Sabtu, 08.00–12.00 WIB', nilaiJam: 'B', kepsek: 'Nurhailani, A.Md.Kep', nilaiKepsek: 'B',
    fasilitas: ['B', 'B', 'B', 'B', 'C'],
    relawan: [['Richa Yufvi Octaviani Br Tarigan Sebero, S.Pd', 'C'], ['Novianry Sitanggang, S.Pd', 'C'], ['Ruliana Tasya (sedang kuliah)', 'C'], ['Rehlitta Surya Dena (sedang kuliah)', 'C']]
  },
  {
    nama: 'PKBM Wira Kasih', kecamatan: 'Delitua', izin: 'Berizin',
    jam: 'Senin–Jumat, 09.00–12.00 WIB', nilaiJam: 'C', kepsek: 'Romaidah (sedang kuliah)', nilaiKepsek: 'K',
    fasilitas: ['B', 'C', 'B', 'B', 'C'],
    relawan: [['Romaidah (sedang kuliah)', 'K'], ['Triningsih (SMA)', 'K'], ['Nur Luthfiah, S.Pd', 'C'], ['Nadya Najmi Putri, S.Sos (sedang kuliah S2)', 'C'], ['Nabila Syahrani, S.H', 'C'], ['Junita Syahfitri (sedang kuliah)', 'K']]
  },
  {
    nama: 'PKBM Bernas', kecamatan: 'Sunggal', izin: 'Berizin',
    jam: 'Senin–Kamis, 09.00–12.00 WIB; Jumat, 10.00–11.00 WIB', nilaiJam: 'C', kepsek: 'Susianti (SMA)', nilaiKepsek: 'C',
    fasilitas: ['B', 'B', 'B', 'B', 'B'],
    relawan: [['Susianti (SMA)', 'C'], ['Gatot (SMA)', 'K'], ['Afril Sabsio Fani Diara (SMK)', 'C'], ['Sartika, S.Pd', 'C'], ['Tata Pristia, S.Ak', 'C'], ['Bella Ardila, S.Pd', 'C'], ['Agus Priyanti (SMA)', 'C']]
  },
  {
    nama: 'PKBM An Nursakinah', kecamatan: 'Galang', izin: 'Berizin',
    jam: 'Senin–Kamis, 10.00–1.00 WIB; Jumat, 09.30–12.00 WIB', nilaiJam: 'B', kepsek: 'Astuti Syafrida, S.Pd', nilaiKepsek: 'B',
    fasilitas: ['C', 'C', 'C', 'C', 'C'],
    relawan: [['Astuti Syafrida, S.Pd', 'C'], ['Nuraini Matondang (sedang mengambil S1)', 'K'], ['Wiwik Sri Hartati, S.Pd', 'K'], ['Rosida Sipayung, S.Pd', 'K'], ['Harnum Sri Utami (sedang mengambil S1)', 'C'], ['Ovvellia Trimadhona (sedang mengambil S1)', 'C'], ['Endang Utari, S.Kom', 'C'], ['Suriani', 'C']]
  },
  {
    nama: 'PKBM Mandiri Cerdas Muslimat', kecamatan: 'Beringin', izin: 'Berizin',
    jam: 'Senin–Jumat, 08.00–14.00 WIB', nilaiJam: 'B', kepsek: 'Sri Wahyuni, S.Pd.I', nilaiKepsek: 'C',
    fasilitas: ['B', 'C', 'B', 'C', 'C'],
    relawan: [['Sri Wahyuni, S.Pd.I', 'K'], ['Nada Januari Sumantri, S.Pd', 'C'], ['Listi Astia, S.Pd', 'C'], ['Intan Pratama Sari (sedang kuliah)', 'C'], ['Rini Winarni (sedang kuliah)', 'C'], ['Sri Astuti (SMK)', 'K'], ['Yatiniaty (SMA)', 'K']]
  },
  {
    nama: 'PKBM Ikhlas Bersama', kecamatan: 'Tanjung Morawa', izin: 'Berizin',
    jam: 'Senin–Kamis, 09.00–14.00 WIB; Jumat, 09.00–12.00 WIB', nilaiJam: 'B', kepsek: 'Jumiati (sedang kuliah)', nilaiKepsek: 'K',
    fasilitas: ['K', 'C', 'K', 'B', 'C'],
    catatan: { 'Lokasi': 'Numpang' },
    relawan: [['Jumiati (sedang kuliah)', 'K'], ['Henny Agustriani, ST', 'C'], ['Sri Marheni, SH', 'C'], ['Ani Suliani (S1 PAUD)', 'C'], ['Aan Yunita (S1)', 'C'], ['Sri Wahyuni (sedang kuliah)', 'K'], ['Widiyawati (SMA)', 'K'], ['Yenisetiawati (SMA)', 'K'], ['Juniarti (SMA)', 'K'], ['Erika Novita (SMA)', 'K'], ['Siti Fatimah (SMA)', 'K']]
  },
  {
    nama: 'PKBM Adiba', kecamatan: 'Lubuk Pakam', izin: 'Berizin',
    jam: 'Senin–Kamis, 10.00–13.00 WIB; Jumat, 10.00–12.00 WIB', nilaiJam: 'C', kepsek: 'Nurul Ananda, S.Psi', nilaiKepsek: 'C',
    fasilitas: ['B', 'C', 'C', 'C', 'C'],
    relawan: [['Nurul Ananda, S.Psi', 'C'], ['Kariati Sitorus (SMA)', 'K'], ['Juliana, AMK (D3)', 'K'], ['Dwi Prasasvita, S.Pd', 'C'], ['Rizky Adelia, S.P', 'C'], ['Syahro Raihan Tika Nasution, S.Pd', 'C']]
  },
  {
    nama: 'PKBM Pusaka Hati Bunda', kecamatan: 'Batang Kuis', izin: 'Berizin',
    jam: 'Senin–Jumat, 10.00–12.00 WIB', nilaiJam: 'K', kepsek: 'Yayuk Annisa, S.H', nilaiKepsek: 'C',
    fasilitas: ['B', 'C', 'C', 'C', 'C'],
    relawan: [['Eva Susanti', 'K'], ['Yayuk Annisa, S.H', 'K'], ['Apriani', 'K'], ['Yuhana', 'K']]
  },
  {
    nama: 'PKBM Air Langit', kecamatan: 'Namorambe', izin: 'Berizin',
    jam: 'Senin–Jumat, 09.00–12.00 WIB', nilaiJam: 'C', kepsek: 'Lumianna Br Damanik (sedang kuliah)', nilaiKepsek: 'B',
    fasilitas: ['C', 'K', 'C', 'C', 'C'],
    catatan: { 'Kamar mandi': 'Tidak ada' },
    relawan: [['Lumianna Br Damanik (sedang kuliah)', 'B'], ['Livia Syahidatul Nadila (SMK)', 'B'], ['Lenni Marlina, A.Md.Kom', 'B']]
  },
  {
    nama: 'PKBM Bunayya', kecamatan: 'Pantai Labu', izin: 'Berizin',
    jam: 'Senin–Jumat, 09.00–12.00 WIB', nilaiJam: 'C', kepsek: 'Ratih (sedang kuliah S1)', nilaiKepsek: 'C',
    fasilitas: ['B', 'C', 'C', 'B', 'C'],
    relawan: [['Ratih (sedang kuliah S1)', 'C'], ['Nurlela Susanti (sedang kuliah S1)', 'C'], ['Siti Fatimah (sedang kuliah S1)', 'C'], ['Mifta Fathul Salsabila (sedang kuliah S1)', 'C'], ['Saimah (SMA)', 'C'], ['Karmawati (S1 PAUD)', 'C'], ['Muayanah, SE', 'C']]
  },
  {
    nama: 'PKBM Sehat Ceria', kecamatan: 'Patumbak', izin: 'Dalam proses',
    jam: '', nilaiJam: '', kepsek: 'Siti Aisyah (SMK)', nilaiKepsek: 'K',
    fasilitas: ['B', 'C', 'B', 'C', 'B'],
    relawan: [['Siti Aisyah (SMK)', 'K'], ['Wida Aprilia (S1 Teknik Elektro)', 'K'], ['Dosmega Lestari (S1 Sastra)', 'K'], ['Mena Medyawati (PGSD)', 'K'], ['Mariani, S.Pd', 'K']]
  },
  {
    nama: 'PKBM Nahdlah', kecamatan: 'Tanjung Morawa', izin: 'Berizin',
    jam: 'Senin–Jumat, 08.00–15.00 WIB', nilaiJam: 'B', kepsek: 'Sri Wahyuni, SE', nilaiKepsek: 'B',
    fasilitas: ['B', 'C', 'C', 'B', 'C'],
    relawan: [['Sri Wahyuni, SE', 'B'], ['Tuti Handayani, S.Pd.I', 'B'], ['Nining Anggriyani, S.Kep, S.Pd', 'B'], ['Dafa Damayanti, SS', 'B'], ['Putri Muhalijah, S.Pd', 'B'], ['Ade Novi Wirana, S.Pd', 'B'], ['Lutfia Azmi Ritonga, S.Psi', 'B'], ['Novi Anggriyani, S.Pd', 'B'], ['Dwi Patmasari (kuliah semester 7)', 'B'], ['Ilmi Astuti Rambe (kuliah semester 5)', 'B']]
  },
  {
    nama: 'Rizki Ananda', kecamatan: 'Percut Sei Tuan', izin: 'Berizin',
    jam: 'Senin–Jumat, 08.00–12.00 WIB', nilaiJam: 'B', kepsek: 'Warsini, SH', nilaiKepsek: 'B',
    fasilitas: ['B', 'B', 'B', 'B', 'B'],
    relawan: [['Tanti Wardani, S.Kom', 'B'], ['Ricca Fikrianingrum, S.Pd', 'B'], ['Devi Riani, S.Psi', 'B'], ['Olivia Ivanka, S.Pd', 'B'], ['Sri Murniaty Rezeki (SMA)', 'B']]
  },
  {
    nama: 'Yakita (UNUSU)', kecamatan: 'UNUSU Medan', izin: 'Berizin',
    jam: 'Senin–Kamis, 10.00–12.00 WIB', nilaiJam: 'K', kepsek: '', nilaiKepsek: '',
    fasilitas: ['B', 'K', 'C', 'C', 'C'],
    relawan: [['Suci Rahmaya Sari, S.Kom', 'C']]
  },
  {
    nama: 'PKBM Rizqy Ananda', kecamatan: 'Hamparan Perak', izin: 'Berizin',
    jam: 'Senin–Jumat, 08.00–12.00 WIB', nilaiJam: 'C', kepsek: 'Khairul Bariah, S.Pd', nilaiKepsek: 'B',
    fasilitas: ['B', 'K', 'B', 'B', 'C'],
    relawan: [['Entin, S.Pd', 'B'], ['Ahmad Luthfi, S.Kom', 'C'], ['Siti Zulaikha, S.Pd', 'B'], ['Hemi Haris (SLTA)', 'B'], ['Vahda Aufi Nabila, S.Fil', 'C'], ['Retna Dwi Resti (SLTA)', 'C'], ['Bambang Ismanto (SLTA)', 'C'], ['Tutut Hardiyanti Dalimunte, A.Md.T', 'K']]
  },
  {
    nama: 'PKBM Ar-Ridho Ummah', kecamatan: 'Bangun Purba', izin: 'Berizin',
    jam: 'Senin–Jumat, 09.00–11.00 WIB', nilaiJam: 'C', kepsek: 'Periawati, S.Pd', nilaiKepsek: 'B',
    fasilitas: ['B', 'B', 'B', 'B', 'C'],
    relawan: [['Periawati, S.Pd', 'C'], ['Nabila Yuriska, S.Pd', 'B'], ['Windi Rahayu (SMA)', 'C'], ['Anggita (sedang kuliah)', 'C'], ['Riska Pandea Salsabila, S.Pd', 'C'], ['Maulana Ferdian (sedang kuliah)', 'B'], ['Mia Audina (SMA)', 'C'], ['Salsa Nabilla, S.K.M', 'C'], ['Annisa Annur Raudha (sedang kuliah)', 'C'], ['Tita Tria Ananda (sedang kuliah)', 'C']]
  },
  {
    nama: 'PKBM Karya Insani', kecamatan: 'STM Hilir', izin: 'Berizin',
    jam: 'Senin–Jumat, 08.00–11.00 WIB', nilaiJam: 'C', kepsek: 'Ramina Br Sitepu, S.Pd', nilaiKepsek: 'K',
    fasilitas: ['K', 'K', 'K', 'K', 'K'],
    relawan: [['Octa Ferda Rabiniati Tarigan, S.Bns', 'K'], ['Selvi Heronika Tarigan, S.Pd', 'K'], ['Ahsyanul Nadya (SMA)', 'K'], ['Rivany Adellia Br. Tarigan (kuliah semester 5)', 'K']]
  }
]

const NILAI_MAP: Record<N, string> = { B: 'Baik', C: 'Cukup', K: 'Kurang', '': '' }
const ASPEK = ['Lokasi', 'Kamar mandi', 'Ruangan', 'Alat peraga', 'Kebersihan'] as const

export async function ensurePkbmSeeded() {
  if ((await prisma.pkbm.count()) > 0) return
  const now = new Date().toISOString()
  for (const p of SEED_PKBM) {
    await prisma.pkbm.create({
      data: {
        nama: p.nama,
        kecamatan: p.kecamatan,
        statusIzin: p.izin,
        jamOperasional: p.jam,
        nilaiJam: NILAI_MAP[p.nilaiJam],
        kepalaSekolah: p.kepsek,
        nilaiKepalaSekolah: NILAI_MAP[p.nilaiKepsek],
        fasilitas: ASPEK.map((aspek, i) => ({ aspek, nilai: NILAI_MAP[p.fasilitas[i]!], catatan: p.catatan?.[aspek] ?? '' })),
        createdAt: now,
        updatedAt: now,
        relawan: { create: p.relawan.map(([nama, nilai], urutan) => ({ nama, nilai: NILAI_MAP[nilai], urutan })) }
      }
    })
  }
}
