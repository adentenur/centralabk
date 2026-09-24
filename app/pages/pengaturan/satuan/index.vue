<script setup lang="ts">
import type { Satuan } from '~/types/satuan'

const requestFetch = useRequestFetch()
const { data: satuanList, refresh } = await useAsyncData('satuan-list', () => requestFetch<Satuan[]>('/api/satuan'))

const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const activeSatuan = ref<Satuan | null>(null)
const deletingId = ref<number | null>(null)

const { loadSatuanOptions } = useSatuanOptions()

function openCreate() {
  modalMode.value = 'create'
  activeSatuan.value = null
  modalOpen.value = true
}

function openEdit(satuan: Satuan) {
  modalMode.value = 'edit'
  activeSatuan.value = satuan
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function handleSaved() {
  modalOpen.value = false
  await refresh()
  await loadSatuanOptions(true)
}

async function handleDelete(satuan: Satuan) {
  if (deletingId.value) return
  const confirmed = confirm(`Hapus satuan "${satuan.nama}"?`)
  if (!confirmed) return
  deletingId.value = satuan.id
  try {
    await $fetch(`/api/satuan/${satuan.id}`, { method: 'DELETE' })
    await refresh()
    await loadSatuanOptions(true)
  } finally {
    deletingId.value = null
  }
}

const user = useCurrentUser()
</script>

<template>
  <main class="main">
    <div class="topbar">
      <div>
        <h2>Satuan</h2>
        <p class="sub">Kelola daftar satuan yang dipakai di form Inventaris dan Surat Jalan.</p>
      </div>
      <div class="user-chip">
        <div class="avatar">{{ (user?.username || 'AA').slice(0, 2).toUpperCase() }}</div>
        <div class="who"><b>{{ user?.username }}</b><span>{{ user?.nama || 'Administrator' }}</span></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>Daftar Satuan</h3>
        <div class="panel-actions">
          <button class="btn-solid" type="button" @click="openCreate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
            Tambah Satuan
          </button>
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Satuan</th>
              <th class="actions-head">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(satuan, index) in satuanList" :key="satuan.id">
              <td class="figures">{{ index + 1 }}</td>
              <td>{{ satuan.nama }}</td>
              <td class="actions-cell">
                <button type="button" class="icon-btn" aria-label="Ubah" @click="openEdit(satuan)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></svg>
                </button>
                <button
                  type="button"
                  class="icon-btn danger"
                  aria-label="Hapus"
                  :disabled="deletingId === satuan.id"
                  @click="handleDelete(satuan)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" /></svg>
                </button>
              </td>
            </tr>
            <tr v-if="!satuanList?.length">
              <td colspan="3" class="empty-row">Belum ada satuan. Klik "Tambah Satuan" untuk menambahkan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <SatuanFormModal
      :open="modalOpen"
      :mode="modalMode"
      :satuan="activeSatuan"
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
  max-width: 480px;
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
  border-collapse: collapse;
  font-size: 13.5px;
}

thead th {
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  background: var(--surface-sunken);
  padding: 10px 20px;
  font-weight: 700;
}

.actions-head {
  text-align: right;
}

tbody td {
  padding: 10px 20px;
  border-top: 1px solid var(--border);
  vertical-align: middle;
}

tbody tr:hover {
  background: var(--surface-sunken);
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
}

@media (max-width: 720px) {
  .main {
    padding: 16px 14px 28px;
  }

  .panel {
    max-width: none;
  }

  .panel-head {
    flex-wrap: wrap;
    gap: 12px;
  }

  .panel-actions,
  .btn-solid {
    width: 100%;
    justify-content: center;
  }

  thead th,
  tbody td {
    padding: 10px 12px;
  }
}
</style>
