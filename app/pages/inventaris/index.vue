<script setup lang="ts">
import type { Item } from '~/types/item'

interface Summary {
  totalBarang: number
  totalKategori: number
  kondisiBaik: number
  perluPerhatian: number
  kategoriTerbanyak: string
}

const requestFetch = useRequestFetch()
const { data: items, refresh: refreshItems } = await useAsyncData('inventaris-items', () => requestFetch<Item[]>('/api/items'))
const { data: summary, refresh: refreshSummary } = await useAsyncData('inventaris-summary', () => requestFetch<Summary>('/api/items/summary'))

const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const activeItem = ref<Item | null>(null)
const deletingId = ref<number | null>(null)

function openCreate() {
  modalMode.value = 'create'
  activeItem.value = null
  modalOpen.value = true
}

function openEdit(item: Item) {
  modalMode.value = 'edit'
  activeItem.value = item
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function handleSaved() {
  modalOpen.value = false
  await Promise.all([refreshItems(), refreshSummary()])
}

async function handleDelete(item: Item) {
  if (deletingId.value) return
  const confirmed = confirm(`Hapus "${item.namaBarang}" dari daftar inventaris?`)
  if (!confirmed) return
  deletingId.value = item.id
  try {
    await $fetch(`/api/items/${item.id}`, { method: 'DELETE' })
    await Promise.all([refreshItems(), refreshSummary()])
  } finally {
    deletingId.value = null
  }
}

function kondisiPillClass(kondisi: string) {
  if (kondisi === 'Baik') return 'good'
  if (kondisi === 'Perbaikan') return 'warn'
  return 'crit'
}

const user = useCurrentUser()
</script>

<template>
  <main class="main">
    <div class="topbar">
      <div>
        <h2>Inventaris Barang</h2>
        <p class="sub">Daftar seluruh barang milik kantor beserta kondisi dan lokasinya.</p>
      </div>
      <div class="user-chip">
        <div class="avatar">{{ (user?.username || 'AA').slice(0, 2).toUpperCase() }}</div>
        <div class="who"><b>{{ user?.username }}</b><span>{{ user?.nama || 'Administrator' }}</span></div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <p class="label">Total Barang</p>
        <p class="value figures">{{ summary?.totalBarang ?? 0 }}</p>
        <span class="delta good">{{ items?.length ?? 0 }} jenis barang</span>
      </div>
      <div class="stat-card">
        <p class="label">Kategori</p>
        <p class="value figures">{{ summary?.totalKategori ?? 0 }}</p>
        <span class="delta good">{{ summary?.kategoriTerbanyak ?? '-' }} terbanyak</span>
      </div>
      <div class="stat-card">
        <p class="label">Kondisi Baik</p>
        <p class="value figures">{{ summary?.kondisiBaik ?? 0 }}</p>
        <span class="delta good">Siap digunakan</span>
      </div>
      <div class="stat-card">
        <p class="label">Perlu Perhatian</p>
        <p class="value figures">{{ summary?.perluPerhatian ?? 0 }}</p>
        <span class="delta warn">Rusak / perbaikan</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>Daftar Barang</h3>
        <div class="panel-actions">
          <button class="btn-solid" type="button" @click="openCreate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
            Tambah Barang
          </button>
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <colgroup>
            <col style="width: 4%">
            <col style="width: 16%">
            <col style="width: 10%">
            <col style="width: 13%">
            <col style="width: 7%">
            <col style="width: 11%">
            <col style="width: 11%">
            <col style="width: 11%">
            <col style="width: 9%">
            <col style="width: 8%">
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Barang</th>
              <th>Kategori</th>
              <th>Nama Toko</th>
              <th>Jumlah</th>
              <th>Harga Satuan</th>
              <th>Total</th>
              <th>Lokasi</th>
              <th>Kondisi</th>
              <th class="actions-head">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td class="figures">{{ index + 1 }}</td>
              <td>
                <div class="item-name">{{ item.namaBarang }}</div>
                <div class="item-code">{{ item.kode }}</div>
              </td>
              <td>{{ item.kategori }}</td>
              <td>{{ item.namaToko }}</td>
              <td class="figures">{{ item.jumlah }} unit</td>
              <td class="figures">{{ formatRupiah(item.hargaSatuan) }}</td>
              <td class="figures">{{ formatRupiah(item.total) }}</td>
              <td>{{ item.lokasi }}</td>
              <td><span class="pill" :class="kondisiPillClass(item.kondisi)">{{ item.kondisi }}</span></td>
              <td class="actions-cell">
                <button type="button" class="icon-btn" aria-label="Ubah" @click="openEdit(item)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></svg>
                </button>
                <button
                  type="button"
                  class="icon-btn danger"
                  aria-label="Hapus"
                  :disabled="deletingId === item.id"
                  @click="handleDelete(item)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" /></svg>
                </button>
              </td>
            </tr>
            <tr v-if="!items?.length">
              <td colspan="10" class="empty-row">Belum ada barang tercatat. Klik "Tambah Barang" untuk mulai mengisi inventaris.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ItemFormModal
      :open="modalOpen"
      :mode="modalMode"
      :item="activeItem"
      @close="closeModal"
      @saved="handleSaved"
    />
  </main>
</template>

<style scoped>
.main {
  padding: 26px 30px 36px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;
  gap: 16px;
  flex-wrap: wrap;
}

.topbar h2 {
  font-size: 21px;
  margin: 0 0 3px;
}

.topbar .sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 14px 6px 6px;
  box-shadow: var(--shadow);
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent-tint);
  color: var(--accent-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12.5px;
  font-family: Georgia, serif;
}

.user-chip .who {
  line-height: 1.25;
}

.user-chip .who b {
  display: block;
  font-size: 13px;
}

.user-chip .who span {
  font-size: 11px;
  color: var(--text-muted);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 22px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: var(--shadow);
}

.stat-card .label {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0 0 8px;
}

.stat-card .value {
  font-family: Georgia, serif;
  font-size: 26px;
  margin: 0;
}

.stat-card .delta {
  font-size: 11.5px;
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}

.delta.good {
  color: var(--good);
  background: var(--good-bg);
}

.delta.warn {
  color: var(--warn);
  background: var(--warn-bg);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.panel-head h3 {
  font-size: 15.5px;
  margin: 0;
}

.btn-solid {
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 7px;
  padding: 8px 14px;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #f5fbf8;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.btn-solid:hover {
  background: var(--accent-strong);
}

.btn-solid svg {
  width: 14px;
  height: 14px;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 13px;
}

thead th {
  text-align: left;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  background: var(--surface-sunken);
  padding: 9px 10px;
  font-weight: 700;
}

.actions-head {
  text-align: right;
}

tbody td {
  padding: 10px 10px;
  border-top: 1px solid var(--border);
  vertical-align: middle;
  word-break: break-word;
}

tbody tr:hover {
  background: var(--surface-sunken);
}

.item-name {
  font-weight: 600;
}

.item-code {
  color: var(--text-muted);
  font-size: 12px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
}

.pill.good {
  color: var(--good);
  background: var(--good-bg);
}

.pill.warn {
  color: var(--warn);
  background: var(--warn-bg);
}

.pill.crit {
  color: var(--crit);
  background: var(--crit-bg);
}

.pill::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.actions-cell {
  text-align: right;
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.icon-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 7px;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
}

.icon-btn svg {
  width: 14px;
  height: 14px;
}

.icon-btn:hover {
  color: var(--text);
  background: var(--surface-sunken);
}

.icon-btn.danger:hover {
  color: var(--crit);
  border-color: var(--crit);
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.empty-row {
  text-align: center;
  color: var(--text-muted);
  padding: 32px 20px;
  white-space: normal;
}

@media (max-width: 860px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
