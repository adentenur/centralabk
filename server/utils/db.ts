import { mkdirSync } from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'

const dataDir = path.resolve(process.cwd(), '.data')
mkdirSync(dataDir, { recursive: true })

export const db = new Database(path.join(dataDir, 'inventaris.sqlite3'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nama TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kode TEXT NOT NULL UNIQUE,
    nama_barang TEXT NOT NULL,
    kategori TEXT NOT NULL,
    nama_toko TEXT NOT NULL,
    jumlah INTEGER NOT NULL DEFAULT 0,
    harga_satuan INTEGER NOT NULL DEFAULT 0,
    lokasi TEXT NOT NULL,
    kondisi TEXT NOT NULL DEFAULT 'Baik',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

const adminUsername = 'adminabk'
const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get(adminUsername)
if (!existingAdmin) {
  const passwordHash = bcrypt.hashSync('deliserdang2026', 10)
  db.prepare('INSERT INTO users (username, password_hash, nama) VALUES (?, ?, ?)')
    .run(adminUsername, passwordHash, 'Administrator')
}

const itemCount = (db.prepare('SELECT COUNT(*) AS n FROM items').get() as { n: number }).n
if (itemCount === 0) {
  const seed = [
    { nama_barang: 'Laptop Lenovo ThinkPad', kategori: 'Elektronik', nama_toko: 'Toko Komputer Medan Jaya', jumlah: 5, harga_satuan: 8500000, lokasi: 'Ruang Kepala Kantor', kondisi: 'Baik' },
    { nama_barang: 'Meja Kerja Kayu', kategori: 'Furnitur', nama_toko: 'Toko Mebel Sejahtera', jumlah: 18, harga_satuan: 750000, lokasi: 'Ruang Staf', kondisi: 'Baik' },
    { nama_barang: 'Printer Epson L3210', kategori: 'Elektronik', nama_toko: 'Toko Komputer Medan Jaya', jumlah: 3, harga_satuan: 2750000, lokasi: 'Ruang Administrasi', kondisi: 'Perbaikan' },
    { nama_barang: 'Kursi Rapat', kategori: 'Furnitur', nama_toko: 'Toko Mebel Sejahtera', jumlah: 24, harga_satuan: 425000, lokasi: 'Ruang Rapat', kondisi: 'Baik' },
    { nama_barang: 'AC Split 1 PK', kategori: 'Elektronik', nama_toko: 'Toko Elektronik Berkah', jumlah: 7, harga_satuan: 3200000, lokasi: 'Seluruh Ruangan', kondisi: 'Rusak' },
    { nama_barang: 'Lemari Arsip Besi', kategori: 'Furnitur', nama_toko: 'Toko Mebel Sejahtera', jumlah: 9, harga_satuan: 1150000, lokasi: 'Ruang Arsip', kondisi: 'Baik' },
    { nama_barang: 'Proyektor Epson', kategori: 'Elektronik', nama_toko: 'Toko Elektronik Berkah', jumlah: 2, harga_satuan: 6900000, lokasi: 'Ruang Rapat', kondisi: 'Perbaikan' }
  ]
  const insert = db.prepare(`
    INSERT INTO items (kode, nama_barang, kategori, nama_toko, jumlah, harga_satuan, lokasi, kondisi)
    VALUES (@kode, @nama_barang, @kategori, @nama_toko, @jumlah, @harga_satuan, @lokasi, @kondisi)
  `)
  seed.forEach((row, index) => {
    insert.run({ ...row, kode: `INV-${String(index + 1).padStart(4, '0')}` })
  })
}
