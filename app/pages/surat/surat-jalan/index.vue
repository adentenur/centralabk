<script setup lang="ts">
import type { SuratJalan } from '~/types/suratJalan'

const requestFetch = useRequestFetch()
const { data: suratJalanList, refresh } = await useAsyncData('surat-jalan-list', () => requestFetch<SuratJalan[]>('/api/surat-jalan'))

const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const activeSurat = ref<SuratJalan | null>(null)
const deletingId = ref<number | null>(null)

function openCreate() {
  modalMode.value = 'create'
  activeSurat.value = null
  modalOpen.value = true
}

function openEdit(surat: SuratJalan) {
  modalMode.value = 'edit'
  activeSurat.value = surat
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function handleSaved() {
  modalOpen.value = false
  await refresh()
}

async function handleDelete(surat: SuratJalan) {
  if (deletingId.value) return
  const confirmed = confirm(`Hapus surat jalan "${surat.nomorSurat}"?`)
  if (!confirmed) return
  deletingId.value = surat.id
  try {
    await $fetch(`/api/surat-jalan/${surat.id}`, { method: 'DELETE' })
    await refresh()
  } finally {
    deletingId.value = null
  }
}

function formatTanggal(value: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const searchQuery = ref('')

const filteredSuratJalan = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return suratJalanList.value ?? []
  return (suratJalanList.value ?? []).filter((surat) => {
    const headerMatch = [surat.nomorSurat, surat.namaPengirim, surat.asalBarang, surat.namaPenerima]
      .some((field) => field.toLowerCase().includes(query))
    const itemMatch = surat.items.some((item) => item.namaBarang.toLowerCase().includes(query))
    return headerMatch || itemMatch
  })
})

const user = useCurrentUser()
</script>

<template>
  <main class="main">
    <div class="topbar">
      <div>
        <h2>Surat Jalan</h2>
        <p class="sub">Catatan setiap barang yang masuk ke Sentral ABK.</p>
      </div>
      <div class="user-chip">
        <div class="avatar">{{ (user?.username || 'AA').slice(0, 2).toUpperCase() }}</div>
        <div class="who"><b>{{ user?.username }}</b><span>{{ user?.nama || 'Administrator' }}</span></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>Daftar Surat Jalan</h3>
        <div class="panel-actions">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
            <input v-model="searchQuery" type="text" placeholder="Cari nomor surat, pengirim, barang...">
          </div>
          <button class="btn-solid" type="button" @click="openCreate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
            Tambah Surat Jalan
          </button>
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <colgroup>
            <col style="width: 4%">
            <col style="width: 13%">
            <col style="width: 10%">
            <col style="width: 29%">
            <col style="width: 16%">
            <col style="width: 16%">
            <col style="width: 12%">
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nomor Surat</th>
              <th>Tanggal</th>
              <th>Daftar Barang</th>
              <th>Pengirim / Asal</th>
              <th>Diterima Oleh</th>
              <th class="actions-head">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(surat, index) in filteredSuratJalan" :key="surat.id">
              <td class="figures row-no" data-label="No.">{{ index + 1 }}</td>
              <td class="mono" data-label="Nomor Surat">{{ surat.nomorSurat }}</td>
              <td class="figures" data-label="Tanggal">{{ formatTanggal(surat.tanggal) }}</td>
              <td data-label="Daftar Barang">
                <div v-for="(item, itemIndex) in surat.items" :key="itemIndex" class="barang-line">
                  {{ item.namaBarang }}
                  <span class="item-code">{{ item.jumlah }} {{ item.satuan }}</span>
                </div>
              </td>
              <td data-label="Pengirim / Asal">
                <div v-if="surat.namaPengirim">{{ surat.namaPengirim }}</div>
                <div v-if="surat.asalBarang" class="item-code">{{ surat.asalBarang }}</div>
                <span v-if="!surat.namaPengirim && !surat.asalBarang">-</span>
              </td>
              <td data-label="Diterima Oleh">{{ surat.namaPenerima || '-' }}</td>
              <td class="actions-cell">
                <button type="button" class="icon-btn" aria-label="Ubah" @click="openEdit(surat)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></svg>
                  <span class="mobile-only">Ubah</span>
                </button>
                <button
                  type="button"
                  class="icon-btn danger"
                  aria-label="Hapus"
                  :disabled="deletingId === surat.id"
                  @click="handleDelete(surat)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" /></svg>
                  <span class="mobile-only">Hapus</span>
                </button>
              </td>
            </tr>
            <tr v-if="suratJalanList?.length && !filteredSuratJalan.length">
              <td colspan="9" class="empty-row">Tidak ada surat jalan yang cocok dengan pencarian "{{ searchQuery }}".</td>
            </tr>
            <tr v-else-if="!suratJalanList?.length">
              <td colspan="9" class="empty-row">Belum ada surat jalan tercatat. Klik "Tambah Surat Jalan" untuk mulai mencatat barang masuk.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <SuratJalanFormModal
      :open="modalOpen"
      :mode="modalMode"
      :surat="activeSurat"
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
  gap: 14px;
  flex-wrap: wrap;
}

.panel-head h3 {
  font-size: 15.5px;
  margin: 0;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  border-radius: 8px;
  padding: 0 10px;
  width: 240px;
}

.search-box svg {
  width: 15px;
  height: 15px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  font-family: inherit;
  color: var(--text);
  padding: 8px 0;
  width: 100%;
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

.mono {
  font-variant-numeric: tabular-nums;
}

.item-code {
  color: var(--text-muted);
  font-size: 12px;
}

.barang-line {
  margin-bottom: 4px;
}

.barang-line:last-child {
  margin-bottom: 0;
}

.barang-line .item-code {
  margin-left: 4px;
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

.mobile-only {
  display: none;
}

@media (max-width: 720px) {
  .main {
    padding: 16px 14px 28px;
  }

  .search-box {
    width: 100%;
  }

  .panel-actions {
    width: 100%;
  }

  .btn-solid {
    flex: 1;
    justify-content: center;
  }

  table,
  thead,
  tbody,
  tr,
  td {
    display: block;
    width: 100%;
  }

  thead {
    display: none;
  }

  tbody tr {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    margin: 12px;
  }

  tbody tr:hover {
    background: var(--surface);
  }

  tbody td {
    border: none;
    padding: 6px 0;
  }

  tbody td[data-label]::before {
    content: attr(data-label);
    display: block;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    font-weight: 700;
    margin-bottom: 2px;
  }

  td.row-no {
    display: none;
  }

  td.actions-cell {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 10px;
    margin-top: 4px;
    border-top: 1px solid var(--border);
  }

  .icon-btn {
    width: auto;
    padding: 7px 12px;
  }

  .mobile-only {
    display: inline;
    font-size: 12.5px;
    font-weight: 600;
  }

  .empty-row {
    padding: 24px 14px;
  }
}
</style>
