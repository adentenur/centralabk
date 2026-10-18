<script setup lang="ts">
import type { Pengguna } from '~/components/PenggunaFormModal.vue'

const requestFetch = useRequestFetch()
const { data: penggunaList, refresh } = await useAsyncData('pengguna-list', () => requestFetch<Pengguna[]>('/api/pengguna'))

const user = useCurrentUser()
const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const activePengguna = ref<Pengguna | null>(null)
const deletingId = ref<number | null>(null)
const errorMsg = ref('')

function isSelf(pengguna: Pengguna | null) {
  return !!pengguna && pengguna.username === user.value?.username
}

function openCreate() {
  modalMode.value = 'create'
  activePengguna.value = null
  modalOpen.value = true
}

function openEdit(pengguna: Pengguna) {
  modalMode.value = 'edit'
  activePengguna.value = pengguna
  modalOpen.value = true
}

async function handleSaved() {
  modalOpen.value = false
  await Promise.all([refresh(), fetchCurrentUser()])
}

async function handleDelete(pengguna: Pengguna) {
  if (deletingId.value) return
  if (!confirm(`Hapus pengguna "${pengguna.username}"? Pengguna ini tidak akan bisa masuk lagi.`)) return
  errorMsg.value = ''
  deletingId.value = pengguna.id
  try {
    await $fetch(`/api/pengguna/${pengguna.id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal menghapus pengguna.'
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <main class="main">
    <div class="topbar">
      <div>
        <h2>Pengguna</h2>
        <p class="sub">Kelola akun yang dapat masuk ke aplikasi beserta levelnya.</p>
      </div>
    </div>

    <p v-if="errorMsg" class="status err" role="alert">{{ errorMsg }}</p>

    <div class="panel">
      <div class="panel-head">
        <h3>Daftar Pengguna <span class="count">{{ penggunaList?.length ?? 0 }}</span></h3>
        <button class="btn-solid" type="button" @click="openCreate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
          Tambah Pengguna
        </button>
      </div>

      <ul class="user-list">
        <li v-for="pengguna in penggunaList" :key="pengguna.id" class="user-row">
          <div class="avatar">{{ pengguna.nama.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() }}</div>
          <div class="user-info">
            <p class="user-name">
              {{ pengguna.nama }}
              <span v-if="isSelf(pengguna)" class="self-tag">Anda</span>
            </p>
            <p class="user-meta">@{{ pengguna.username }}</p>
          </div>
          <span class="role-pill" :class="pengguna.role">{{ roleLabel(pengguna.role) }}</span>
          <div class="row-actions">
            <button type="button" class="icon-btn" :aria-label="`Ubah ${pengguna.username}`" @click="openEdit(pengguna)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></svg>
            </button>
            <button
              type="button"
              class="icon-btn danger"
              :aria-label="`Hapus ${pengguna.username}`"
              :disabled="isSelf(pengguna) || deletingId === pengguna.id"
              :title="isSelf(pengguna) ? 'Anda tidak dapat menghapus akun sendiri' : ''"
              @click="handleDelete(pengguna)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" /></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <PenggunaFormModal
      :open="modalOpen"
      :mode="modalMode"
      :pengguna="activePengguna"
      :is-self="isSelf(activePengguna)"
      @close="modalOpen = false"
      @saved="handleSaved"
    />
  </main>
</template>

<style scoped>
.main {
  padding: 26px 30px 36px;
}

.topbar {
  margin-bottom: 22px;
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

.status.err {
  max-width: 720px;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 8px;
  margin: 0 0 14px;
  color: var(--crit);
  background: var(--crit-bg);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  max-width: 720px;
  overflow: hidden;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
}

.panel-head h3 {
  font-size: 15.5px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
  font-family: -apple-system, 'Segoe UI', ui-sans-serif, system-ui, sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--accent-strong);
  background: var(--accent-tint);
  border-radius: 999px;
  padding: 2px 8px;
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

.user-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  border-top: 1px solid var(--border);
}

.user-row:first-child {
  border-top: none;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent-tint);
  color: var(--accent-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  font-family: Georgia, serif;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.self-tag {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 1px 7px;
}

.user-meta {
  font-size: 12.5px;
  color: var(--text-muted);
  margin: 2px 0 0;
}

.role-pill {
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 999px;
  padding: 3px 10px;
  color: var(--text-muted);
  background: var(--surface-sunken);
  flex-shrink: 0;
}

.role-pill.superadmin {
  color: var(--accent-strong);
  background: var(--accent-tint);
}

.row-actions {
  display: flex;
  gap: 6px;
}

.icon-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 7px;
  width: 30px;
  height: 30px;
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

.icon-btn:hover:not(:disabled) {
  color: var(--text);
  background: var(--surface-sunken);
}

.icon-btn.danger:hover:not(:disabled) {
  color: var(--crit);
  border-color: var(--crit);
}

.icon-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .main {
    padding: 16px 14px 28px;
  }

  .user-row {
    flex-wrap: wrap;
    padding: 12px 14px;
  }

  .row-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
