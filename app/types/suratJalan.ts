export interface SuratJalanItemData {
  namaBarang: string
  jumlah: number
  satuan: string
}

export interface SuratJalan {
  id: number
  nomorSurat: string
  tanggal: string
  namaPengirim: string
  asalBarang: string
  namaPenerima: string
  keterangan: string
  items: SuratJalanItemData[]
  createdAt: string
  updatedAt: string
}

export interface SuratJalanItemFormState {
  namaBarang: string
  jumlah: number | null
  satuan: string
}

export interface SuratJalanFormState {
  tanggal: string
  namaPengirim: string
  asalBarang: string
  namaPenerima: string
  keterangan: string
  items: SuratJalanItemFormState[]
}

export function emptySuratJalanItem(): SuratJalanItemFormState {
  return { namaBarang: '', jumlah: null, satuan: '' }
}

export function emptySuratJalanForm(): SuratJalanFormState {
  return {
    tanggal: new Date().toISOString().slice(0, 10),
    namaPengirim: '',
    asalBarang: '',
    namaPenerima: '',
    keterangan: '',
    items: [emptySuratJalanItem()]
  }
}
