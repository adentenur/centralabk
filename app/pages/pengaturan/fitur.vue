<script setup lang="ts">
interface Fitur {
  adminLihatHarga: boolean
}

const requestFetch = useRequestFetch()
const { data: fitur } = await useAsyncData('fitur', () => requestFetch<Fitur>('/api/pengaturan/fitur'))

const saving = ref(false)
const statusMsg = ref('')
const errorMsg = ref('')

async function toggleLihatHarga() {
  if (saving.value || !fitur.value) return
  const nextValue = !fitur.value.adminLihatHarga
  saving.value = true
  statusMsg.value = ''
  errorMsg.value = ''
  try {
    fitur.value = await $fetch<Fitur>('/api/pengaturan/fitur', {
      method: 'PUT',
      body: { adminLihatHarga: nextValue }
    })
    statusMsg.value = nextValue
      ? 'Disimpan. Admin sekarang dapat melihat harga satuan dan total.'
      : 'Disimpan. Harga satuan dan total kini tersembunyi untuk admin.'
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal menyimpan pengaturan.'
  } finally {
    saving.value = false
  }
}

const user = useCurrentUser()
</script>

<template>
  <main class="main">
    <div class="topbar">
      <div>
        <h2>Fitur</h2>
        <p class="sub">Atur apa saja yang boleh diakses oleh akun dengan level Admin.</p>
      </div>
      <div class="user-chip">
        <div class="avatar">{{ (user?.username || 'AA').slice(0, 2).toUpperCase() }}</div>
        <div class="who"><b>{{ user?.username }}</b><span>{{ roleLabel(user?.role) }}</span></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>Akses Admin</h3>
        <span class="badge">Hanya superadmin</span>
      </div>

      <div class="setting-row">
        <div class="setting-text">
          <p class="setting-title" id="lihat-harga-label">Tampilkan harga di Inventaris</p>
          <p class="setting-desc">
            Jika aktif, admin dapat melihat dan mengisi <b>Harga Satuan</b> dan <b>Total</b> di menu Inventaris.
            Jika nonaktif, kolom harga disembunyikan dan admin tidak dapat mengubah harga barang.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          class="switch"
          :class="{ on: fitur?.adminLihatHarga }"
          :aria-checked="fitur?.adminLihatHarga ?? false"
          aria-labelledby="lihat-harga-label"
          :disabled="saving || !fitur"
          @click="toggleLihatHarga"
        >
          <span class="knob" />
        </button>
      </div>

      <p v-if="statusMsg" class="status ok" role="status">{{ statusMsg }}</p>
      <p v-if="errorMsg" class="status err" role="alert">{{ errorMsg }}</p>
    </div>

    <p class="footnote">Superadmin selalu dapat melihat harga, apa pun pengaturannya.</p>
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
  max-width: 640px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.panel-head h3 {
  font-size: 15.5px;
  margin: 0;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-strong);
  background: var(--accent-tint);
  border-radius: 999px;
  padding: 3px 9px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
}

.setting-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
}

.setting-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.55;
  max-width: 60ch;
}

.switch {
  position: relative;
  flex-shrink: 0;
  width: 46px;
  height: 26px;
  border-radius: 999px;
  border: none;
  background: var(--border);
  cursor: pointer;
  transition: background 0.15s ease;
}

.switch .knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;
}

.switch.on {
  background: var(--accent);
}

.switch.on .knob {
  transform: translateX(20px);
}

.switch:disabled {
  opacity: 0.6;
  cursor: default;
}

.switch:focus-visible {
  outline: 2px solid var(--accent-strong);
  outline-offset: 2px;
}

.status {
  margin: 0 20px 18px;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 12px;
  border-radius: 8px;
}

.status.ok {
  color: var(--good);
  background: var(--good-bg);
}

.status.err {
  color: var(--crit);
  background: var(--crit-bg);
}

.footnote {
  font-size: 12.5px;
  color: var(--text-muted);
  margin: 12px 2px 0;
}

@media (prefers-reduced-motion: reduce) {
  .switch,
  .switch .knob {
    transition: none;
  }
}

@media (max-width: 720px) {
  .main {
    padding: 16px 14px 28px;
  }

  .setting-row {
    align-items: flex-start;
  }
}
</style>
