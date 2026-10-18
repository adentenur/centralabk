export interface AsesmenField {
  type: 'heading' | 'info' | 'text' | 'textarea' | 'date' | 'number' | 'tel' | 'radio' | 'checkbox' | 'grid'
  key?: string
  label?: string
  text?: string
  suffix?: string
  placeholder?: string
  required?: boolean
  full?: boolean
  options?: string[]
  other?: boolean
  columns?: string[]
  rows?: string[]
  note?: boolean
  showIf?: { key: string, equals: string }
}

export interface AsesmenSection {
  id: string
  title: string
  fields: AsesmenField[]
}

export interface GridCell {
  nilai: string
  catatan: string
}

const TIDAK_YA = ['Tidak', 'Ya']
const RIWAYAT_PEMERIKSAAN = ['Normal', 'Ada masalah', 'Belum pernah', 'Tidak diketahui']

export const ASESMEN_SECTIONS: AsesmenSection[] = [
  {
    id: 'info',
    title: 'Informasi Asesmen',
    fields: [
      { type: 'text', key: 'nomorRekamMedis', label: 'Nomor rekam medis' },
      { type: 'date', key: 'tanggalAsesmen', label: 'Tanggal asesmen' },
      { type: 'text', key: 'namaPemeriksa', label: 'Nama pemeriksa' },
      { type: 'text', key: 'profesi', label: 'Profesi' }
    ]
  },
  {
    id: 'a',
    title: 'A. Identitas Pasien',
    fields: [
      { type: 'text', key: 'namaAnak', label: 'Nama anak', required: true },
      { type: 'text', key: 'namaPanggilan', label: 'Nama panggilan' },
      { type: 'date', key: 'tanggalLahir', label: 'Tanggal lahir' },
      { type: 'radio', key: 'jenisKelamin', label: 'Jenis kelamin', options: ['Laki-laki', 'Perempuan'] },
      { type: 'number', key: 'usiaTahun', label: 'Usia (tahun)', suffix: 'tahun' },
      { type: 'number', key: 'usiaBulan', label: 'Usia (bulan)', suffix: 'bulan' },
      { type: 'text', key: 'namaOrangTua', label: 'Nama orang tua/wali' },
      { type: 'tel', key: 'nomorTelepon', label: 'Nomor telepon' },
      { type: 'textarea', key: 'alamat', label: 'Alamat' },
      { type: 'text', key: 'sekolah', label: 'Sekolah' },
      { type: 'text', key: 'kelas', label: 'Kelas' }
    ]
  },
  {
    id: 'b',
    title: 'B. Alasan Pemeriksaan',
    fields: [
      { type: 'textarea', key: 'keluhanUtama', label: 'Keluhan utama' },
      { type: 'text', key: 'keluhanSejak', label: 'Keluhan mulai terlihat sejak', full: true },
      { type: 'radio', key: 'perkembanganKeluhan', label: 'Perkembangan keluhan', options: ['Menetap', 'Bertambah', 'Berkurang', 'Fluktuatif', 'Tidak diketahui'] },
      { type: 'textarea', key: 'tujuanOrangTua', label: 'Tujuan orang tua/wali' }
    ]
  },
  {
    id: 'c',
    title: 'C. Riwayat Perkembangan',
    fields: [
      {
        type: 'grid',
        key: 'riwayatPerkembangan',
        columns: ['Sesuai Usia', 'Perlu Pemantauan', 'Terlambat'],
        rows: ['Motorik kasar', 'Motorik halus', 'Bahasa reseptif', 'Bahasa ekspresif', 'Bicara', 'Sosial', 'Kemandirian', 'Bermain'],
        note: true
      },
      { type: 'radio', key: 'kehilanganKemampuan', label: 'Apakah pernah terjadi kehilangan kemampuan yang sebelumnya sudah dikuasai?', options: TIDAK_YA },
      { type: 'textarea', key: 'kehilanganKemampuanKet', label: 'Jika ya, jelaskan', showIf: { key: 'kehilanganKemampuan', equals: 'Ya' } }
    ]
  },
  {
    id: 'd',
    title: 'D. Riwayat Kehamilan dan Kelahiran',
    fields: [
      { type: 'number', key: 'usiaKehamilan', label: 'Usia kehamilan', suffix: 'minggu' },
      { type: 'radio', key: 'kehamilan', label: 'Kehamilan', options: ['Normal', 'Dengan komplikasi', 'Tidak diketahui'] },
      { type: 'radio', key: 'persalinan', label: 'Persalinan', options: ['Spontan', 'Caesar', 'Tindakan lain', 'Tidak diketahui'] },
      { type: 'number', key: 'beratLahir', label: 'Berat lahir', suffix: 'gram' },
      { type: 'number', key: 'panjangLahir', label: 'Panjang lahir', suffix: 'cm' },
      { type: 'radio', key: 'kondisiSetelahLahir', label: 'Kondisi setelah lahir', options: ['Baik', 'Membutuhkan perawatan khusus', 'NICU/perawatan intensif', 'Tidak diketahui'] },
      { type: 'textarea', key: 'kelahiranKeterangan', label: 'Keterangan' }
    ]
  },
  {
    id: 'e',
    title: 'E. Riwayat Kesehatan',
    fields: [
      { type: 'textarea', key: 'riwayatPenyakit', label: 'Riwayat penyakit' },
      { type: 'radio', key: 'rawatInap', label: 'Riwayat rawat inap', options: TIDAK_YA },
      { type: 'radio', key: 'kejang', label: 'Riwayat kejang', options: TIDAK_YA },
      { type: 'radio', key: 'operasi', label: 'Riwayat operasi', options: TIDAK_YA },
      { type: 'radio', key: 'alergi', label: 'Riwayat alergi', options: TIDAK_YA },
      { type: 'textarea', key: 'obatDigunakan', label: 'Obat yang sedang digunakan' },
      { type: 'radio', key: 'pemeriksaanPendengaran', label: 'Riwayat pemeriksaan pendengaran', options: RIWAYAT_PEMERIKSAAN },
      { type: 'radio', key: 'pemeriksaanPenglihatan', label: 'Riwayat pemeriksaan penglihatan', options: RIWAYAT_PEMERIKSAAN }
    ]
  },
  {
    id: 'f',
    title: 'F. Observasi Umum',
    fields: [
      { type: 'radio', key: 'kesadaranRespons', label: 'Kesadaran/respons', options: ['Baik', 'Perlu stimulasi', 'Fluktuatif'], other: true },
      { type: 'radio', key: 'kontakMata', label: 'Kontak mata', options: ['Baik', 'Sesekali', 'Minimal', 'Tidak tampak'] },
      { type: 'radio', key: 'responsPemeriksa', label: 'Respons terhadap pemeriksa', options: ['Baik', 'Perlu pendekatan', 'Menolak', 'Tidak konsisten'] },
      { type: 'radio', key: 'mengikutiInstruksiObservasi', label: 'Kemampuan mengikuti instruksi', options: ['Baik', 'Instruksi sederhana', 'Dengan bantuan', 'Belum konsisten'] },
      { type: 'radio', key: 'rentangPerhatian', label: 'Rentang perhatian', options: ['Sesuai aktivitas', 'Pendek', 'Sangat pendek', 'Sulit dinilai'] },
      { type: 'radio', key: 'regulasiEmosi', label: 'Kemampuan regulasi emosi', options: ['Baik', 'Perlu bantuan', 'Mudah frustrasi', 'Sulit diregulasi'] },
      { type: 'textarea', key: 'catatanObservasi', label: 'Catatan observasi' }
    ]
  },
  {
    id: 'g',
    title: 'G. Asesmen Komunikasi & Bahasa',
    fields: [
      { type: 'heading', text: '1. Komunikasi' },
      { type: 'checkbox', key: 'caraKomunikasi', label: 'Cara komunikasi utama', options: ['Verbal', 'Gesture', 'Menunjuk', 'Gambar/simbol', 'AAC', 'Vokalisasi'], other: true },
      { type: 'radio', key: 'memintaSesuatu', label: 'Kemampuan meminta sesuatu', options: ['Mandiri', 'Dengan bantuan', 'Belum tampak'] },
      { type: 'radio', key: 'menjawabPertanyaan', label: 'Kemampuan menjawab pertanyaan', options: ['Baik', 'Sebagian', 'Dengan bantuan', 'Belum tampak'] },
      { type: 'radio', key: 'mengikutiInstruksiKomunikasi', label: 'Kemampuan mengikuti instruksi', options: ['1 tahap', '2 tahap', 'Lebih dari 2 tahap', 'Belum konsisten'] },
      { type: 'heading', text: '2. Bahasa' },
      { type: 'textarea', key: 'bahasaReseptif', label: 'Bahasa reseptif' },
      { type: 'textarea', key: 'bahasaEkspresif', label: 'Bahasa ekspresif' },
      { type: 'textarea', key: 'kosakata', label: 'Kosakata' },
      { type: 'textarea', key: 'menyusunKalimat', label: 'Kemampuan menyusun kalimat' },
      { type: 'heading', text: '3. Bicara' },
      { type: 'radio', key: 'kejelasanBicara', label: 'Kejelasan bicara', options: ['Baik', 'Cukup', 'Sulit dipahami'] },
      { type: 'textarea', key: 'artikulasi', label: 'Artikulasi/bunyi bicara' },
      { type: 'radio', key: 'kelancaran', label: 'Kelancaran', options: ['Baik', 'Terdapat disfluensi', 'Perlu pemeriksaan lebih lanjut'] },
      { type: 'textarea', key: 'catatanKomunikasi', label: 'Catatan' }
    ]
  },
  {
    id: 'h',
    title: 'H. Asesmen Motorik',
    fields: [
      { type: 'heading', text: 'Motorik kasar' },
      {
        type: 'grid',
        key: 'motorikKasar',
        columns: ['Mandiri', 'Dengan Bantuan', 'Belum'],
        rows: ['Berguling', 'Duduk', 'Merangkak', 'Berdiri', 'Berjalan', 'Berlari', 'Melompat', 'Naik/turun tangga'],
        note: true
      },
      { type: 'heading', text: 'Motorik halus' },
      {
        type: 'grid',
        key: 'motorikHalus',
        columns: ['Mandiri', 'Dengan Bantuan', 'Belum'],
        rows: ['Meraih benda', 'Memegang benda', 'Memindahkan benda', 'Mencoret/menggambar', 'Menggunakan alat tulis', 'Aktivitas manipulatif'],
        note: true
      },
      { type: 'text', key: 'postur', label: 'Postur' },
      { type: 'text', key: 'keseimbangan', label: 'Keseimbangan' },
      { type: 'text', key: 'koordinasi', label: 'Koordinasi' },
      { type: 'text', key: 'rentangGerak', label: 'Rentang gerak' },
      { type: 'text', key: 'tonusOtot', label: 'Tonus otot' },
      { type: 'textarea', key: 'catatanMotorik', label: 'Catatan' }
    ]
  },
  {
    id: 'i',
    title: 'I. Asesmen Sensorik',
    fields: [
      {
        type: 'grid',
        key: 'sensorik',
        columns: ['Normal', 'Sensitif', 'Mencari stimulus'],
        rows: ['Suara', 'Sentuhan', 'Gerakan', 'Visual', 'Tekstur', 'Bau', 'Oral'],
        note: true
      },
      { type: 'textarea', key: 'catatanSensorik', label: 'Catatan' }
    ]
  },
  {
    id: 'j',
    title: 'J. Perilaku dan Regulasi',
    fields: [
      {
        type: 'checkbox',
        key: 'perilakuAsesmen',
        label: 'Perilaku yang tampak selama asesmen',
        options: ['Kooperatif', 'Aktif', 'Pasif', 'Menghindar', 'Menolak aktivitas', 'Mudah terdistraksi', 'Tantrum', 'Agresif', 'Self-injury', 'Repetitif'],
        other: true
      },
      { type: 'textarea', key: 'pemicuPerilaku', label: 'Pemicu perilaku bila diketahui' },
      { type: 'textarea', key: 'caraMenenangkanDiri', label: 'Cara anak menenangkan diri' },
      { type: 'textarea', key: 'strategiEfektif', label: 'Strategi yang efektif' }
    ]
  },
  {
    id: 'k',
    title: 'K. Kemampuan Sosial & Bermain',
    fields: [
      { type: 'checkbox', key: 'jenisPermainan', label: 'Jenis permainan yang disukai', options: ['Fungsional', 'Simbolik', 'Konstruktif', 'Sensorimotor', 'Permainan sosial'], other: true },
      { type: 'checkbox', key: 'kemampuanBermain', label: 'Kemampuan bermain', options: ['Mandiri', 'Bermain bersama', 'Bermain paralel', 'Perlu diarahkan'] },
      { type: 'radio', key: 'interaksiSosial', label: 'Interaksi dengan orang lain', options: ['Baik', 'Perlu bantuan', 'Terbatas', 'Belum konsisten'] },
      { type: 'textarea', key: 'catatanSosial', label: 'Catatan' }
    ]
  },
  {
    id: 'l',
    title: 'L. Aktivitas Kehidupan Sehari-hari (ADL)',
    fields: [
      {
        type: 'grid',
        key: 'adl',
        columns: ['Mandiri', 'Bantuan Sebagian', 'Bantuan Penuh', 'Belum'],
        rows: ['Makan', 'Minum', 'Berpakaian', 'Mandi', 'Toilet', 'Menyikat gigi', 'Merapikan barang']
      },
      { type: 'textarea', key: 'catatanAdl', label: 'Catatan' }
    ]
  },
  {
    id: 'm',
    title: 'M. Makan dan Minum',
    fields: [
      { type: 'checkbox', key: 'kemampuanMakan', label: 'Kemampuan makan', options: ['Baik', 'Pilih-pilih makanan', 'Kesulitan mengunyah', 'Kesulitan menelan', 'Perlu bantuan'] },
      { type: 'checkbox', key: 'teksturMakanan', label: 'Tekstur makanan yang dapat diterima', options: ['Cair', 'Lunak', 'Padat', 'Campuran'] },
      { type: 'textarea', key: 'masalahMakanLain', label: 'Masalah lain' },
      { type: 'info', text: 'Jika ditemukan dugaan gangguan makan/menelan, lakukan koordinasi atau rujukan kepada profesional yang sesuai.' }
    ]
  },
  {
    id: 'n',
    title: 'N. Riwayat Terapi',
    fields: [
      { type: 'radio', key: 'pernahTerapi', label: 'Apakah anak pernah menjalani terapi?', options: TIDAK_YA },
      {
        type: 'checkbox',
        key: 'jenisTerapi',
        label: 'Jenis terapi',
        options: ['Terapi Wicara', 'Fisioterapi', 'Okupasi Terapi', 'Sensori Integrasi', 'Psikologi'],
        other: true,
        showIf: { key: 'pernahTerapi', equals: 'Ya' }
      },
      { type: 'text', key: 'lamaTerapi', label: 'Lama terapi', full: true, showIf: { key: 'pernahTerapi', equals: 'Ya' } },
      { type: 'textarea', key: 'perkembanganSetelahTerapi', label: 'Perkembangan setelah terapi', showIf: { key: 'pernahTerapi', equals: 'Ya' } }
    ]
  },
  {
    id: 'o',
    title: 'O. Hasil Asesmen',
    fields: [
      { type: 'textarea', key: 'kekuatanAnak', label: 'Kekuatan/kemampuan anak' },
      { type: 'textarea', key: 'areaDukungan', label: 'Area yang membutuhkan dukungan' },
      { type: 'textarea', key: 'masalahUtama', label: 'Masalah utama yang ditemukan' },
      { type: 'textarea', key: 'faktorPendukung', label: 'Faktor yang mendukung perkembangan' },
      { type: 'textarea', key: 'faktorPenghambat', label: 'Faktor yang menjadi hambatan' }
    ]
  },
  {
    id: 'p',
    title: 'P. Kesimpulan Asesmen',
    fields: [
      { type: 'info', text: 'Berdasarkan hasil wawancara, observasi, dan pemeriksaan.' },
      {
        type: 'checkbox',
        key: 'kebutuhanLayanan',
        label: 'Kebutuhan layanan yang dipertimbangkan',
        options: ['Monitoring perkembangan', 'Konsultasi dokter', 'Terapi Wicara', 'Fisioterapi', 'Okupasi Terapi', 'Terapi Sensori Integrasi', 'Psikologi', 'Pemeriksaan pendengaran', 'Pemeriksaan penglihatan'],
        other: true
      }
    ]
  },
  {
    id: 'q',
    title: 'Q. Rencana Intervensi',
    fields: [
      { type: 'textarea', key: 'tujuanUtama', label: 'Tujuan utama' },
      { type: 'textarea', key: 'targetPendek', label: 'Target jangka pendek' },
      { type: 'textarea', key: 'targetPanjang', label: 'Target jangka panjang' },
      { type: 'text', key: 'frekuensiTerapi', label: 'Frekuensi terapi yang direncanakan', full: true },
      { type: 'textarea', key: 'rekomendasiRumah', label: 'Rekomendasi latihan/aktivitas di rumah' },
      { type: 'textarea', key: 'edukasiOrangTua', label: 'Edukasi orang tua/wali' }
    ]
  },
  {
    id: 'r',
    title: 'R. Rencana Tindak Lanjut',
    fields: [
      {
        type: 'checkbox',
        key: 'rencanaTindakLanjut',
        label: 'Rencana tindak lanjut',
        options: ['Kontrol ulang', 'Evaluasi berkala', 'Melanjutkan terapi', 'Modifikasi program terapi', 'Konsultasi dokter', 'Rujuk ke profesional lain', 'Pemeriksaan penunjang'],
        other: true
      },
      { type: 'text', key: 'jadwalTindakLanjut', label: 'Jadwal tindak lanjut', full: true }
    ]
  },
  {
    id: 's',
    title: 'S. Catatan Tambahan',
    fields: [
      { type: 'textarea', key: 'catatanTambahan', label: 'Catatan tambahan' }
    ]
  }
]

export function createEmptyAsesmen(): Record<string, any> {
  const data: Record<string, any> = {}
  for (const section of ASESMEN_SECTIONS) {
    for (const field of section.fields) {
      if (!field.key) continue
      if (field.type === 'checkbox') {
        data[field.key] = []
      } else if (field.type === 'grid') {
        data[field.key] = Object.fromEntries((field.rows ?? []).map((row) => [row, { nilai: '', catatan: '' }]))
      } else {
        data[field.key] = ''
      }
      if (field.other) data[`${field.key}Lainnya`] = ''
    }
  }
  return data
}

export function mergeAsesmen(saved: Record<string, any> | null | undefined): Record<string, any> {
  const data = createEmptyAsesmen()
  if (!saved || typeof saved !== 'object') return data
  for (const [key, value] of Object.entries(saved)) {
    const base = data[key]
    if (base && typeof base === 'object' && !Array.isArray(base) && value && typeof value === 'object') {
      for (const [row, cell] of Object.entries(value as Record<string, GridCell>)) {
        base[row] = { nilai: cell?.nilai ?? '', catatan: cell?.catatan ?? '' }
      }
    } else {
      data[key] = value
    }
  }
  return data
}

export function hitungUsia(tanggalLahir: string, acuan?: string) {
  const lahir = new Date(tanggalLahir)
  const ref = acuan ? new Date(acuan) : new Date()
  if (!tanggalLahir || Number.isNaN(lahir.getTime()) || Number.isNaN(ref.getTime()) || ref < lahir) return null
  let bulan = (ref.getFullYear() - lahir.getFullYear()) * 12 + (ref.getMonth() - lahir.getMonth())
  if (ref.getDate() < lahir.getDate()) bulan -= 1
  return { tahun: Math.floor(bulan / 12), bulan: bulan % 12 }
}
