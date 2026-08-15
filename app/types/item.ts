export interface Item {
  id: number
  kode: string
  namaBarang: string
  kategori: string
  namaToko: string
  jumlah: number
  hargaSatuan: number
  total: number
  lokasi: string
  kondisi: 'Baik' | 'Perbaikan' | 'Rusak'
  createdAt: string
  updatedAt: string
}

export interface ItemFormState {
  namaBarang: string
  kategori: string
  namaToko: string
  jumlah: number | null
  hargaSatuan: number | null
  lokasi: string
  kondisi: 'Baik' | 'Perbaikan' | 'Rusak'
}

export function emptyItemForm(): ItemFormState {
  return {
    namaBarang: '',
    kategori: '',
    namaToko: '',
    jumlah: null,
    hargaSatuan: null,
    lokasi: '',
    kondisi: 'Baik'
  }
}
