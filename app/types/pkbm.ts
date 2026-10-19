export type Nilai = 'Baik' | 'Cukup' | 'Kurang' | ''

export interface PkbmFasilitas {
  aspek: string
  nilai: Nilai
  catatan: string
}

export interface PkbmRelawan {
  nama: string
  nilai: Nilai
}

export interface Pkbm {
  id: number
  nama: string
  kecamatan: string
  statusIzin: 'Berizin' | 'Dalam proses'
  jamOperasional: string
  nilaiJam: Nilai
  kepalaSekolah: string
  nilaiKepalaSekolah: Nilai
  fasilitas: PkbmFasilitas[]
  relawan: PkbmRelawan[]
  createdAt: string
  updatedAt: string
}

export const NILAI_OPTIONS: Exclude<Nilai, ''>[] = ['Baik', 'Cukup', 'Kurang']
export const ASPEK_FASILITAS = ['Lokasi', 'Kamar mandi', 'Ruangan', 'Alat peraga', 'Kebersihan']

export function nilaiClass(nilai: string) {
  if (nilai === 'Baik') return 'good'
  if (nilai === 'Cukup') return 'warn'
  if (nilai === 'Kurang') return 'crit'
  return 'none'
}
