<script setup lang="ts">
interface MuridSummary {
  id: number
  nomorRekamMedis: string
  tanggalAsesmen: string
  namaAnak: string
  namaPanggilan: string
  tanggalLahir: string
  jenisKelamin: string
  namaOrangTua: string
  nomorTelepon: string
  sekolah: string
  kelas: string
}

const requestFetch = useRequestFetch()
const { data: muridList, refresh } = await useAsyncData('murid-list', () => requestFetch<MuridSummary[]>('/api/murid'))

const deletingId = ref<number | null>(null)
const searchQuery = ref('')

const filteredMurid = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return muridList.value ?? []
  return (muridList.value ?? []).filter((murid) =>
    [murid.namaAnak, murid.namaPanggilan, murid.nomorRekamMedis, murid.namaOrangTua, murid.sekolah, murid.nomorTelepon]
      .some((field) => field.toLowerCase().includes(query))
  )
})

function formatUsia(tanggalLahir: string) {
  const usia = hitungUsia(tanggalLahir)
  if (!usia) return '-'
  return usia.tahun > 0 ? `${usia.tahun} th ${usia.bulan} bln` : `${usia.bulan} bln`
}

function formatTanggal(value: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

async function handleDelete(murid: MuridSummary) {
  if (deletingId.value) return
  if (!confirm(`Hapus data murid "${murid.namaAnak}" beserta seluruh hasil asesmennya?`)) return
  deletingId.value = murid.id
  try {
    await $fetch(`/api/murid/${murid.id}`, { method: 'DELETE' })
    await refresh()
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
        <h2>Murid</h2>
        <p class="sub">Data murid beserta formulir asesmen awal anak berkebutuhan khusus.</p>
      </div>
      <div class="user-chip">
        <div class="avatar">{{ (user?.username || 'AA').slice(0, 2).toUpperCase() }}</div>
        <div class="who"><b>{{ user?.username }}</b><span>{{ roleLabel(user?.role) }}</span></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>Daftar Murid <span class="count">{{ muridList?.length ?? 0 }}</span></h3>
        <div class="panel-actions">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
            <input v-model="searchQuery" type="text" placeholder="Cari nama, No. RM, orang tua, sekolah..." aria-label="Cari murid">
          </div>
          <NuxtLink to="/murid/tambah" class="btn-solid">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
            Tambah Murid
          </NuxtLink>
        </div>
      </div>
      <div class="table-scroll">
        <table>
          <colgroup>
            <col style="width: 4%">
            <col style="width: 10%">
            <col style="width: 19%">
            <col style="width: 10%">
            <col style="width: 9%">
            <col style="width: 17%">
            <col style="width: 13%">
            <col style="width: 9%">
            <col style="width: 9%">
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>No. RM</th>
              <th>Nama Anak</th>
              <th>Jenis Kelamin</th>
              <th>Usia</th>
              <th>Orang Tua / Wali</th>
              <th>Sekolah</th>
              <th>Tgl Asesmen</th>
              <th class="actions-head">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(murid, index) in filteredMurid" :key="murid.id">
              <td class="figures row-no" data-label="No.">{{ index + 1 }}</td>
              <td class="figures" data-label="No. RM">{{ murid.nomorRekamMedis || '-' }}</td>
              <td data-label="Nama Anak">
                <NuxtLink :to="`/murid/${murid.id}`" class="item-name">{{ murid.namaAnak }}</NuxtLink>
                <div v-if="murid.namaPanggilan" class="item-code">Panggilan: {{ murid.namaPanggilan }}</div>
              </td>
              <td data-label="Jenis Kelamin">{{ murid.jenisKelamin || '-' }}</td>
              <td class="figures" data-label="Usia">{{ formatUsia(murid.tanggalLahir) }}</td>
              <td data-label="Orang Tua / Wali">
                <div>{{ murid.namaOrangTua || '-' }}</div>
                <div v-if="murid.nomorTelepon" class="item-code figures">{{ murid.nomorTelepon }}</div>
              </td>
              <td data-label="Sekolah">
                <div>{{ murid.sekolah || '-' }}</div>
                <div v-if="murid.kelas" class="item-code">Kelas {{ murid.kelas }}</div>
              </td>
              <td class="figures" data-label="Tgl Asesmen">{{ formatTanggal(murid.tanggalAsesmen) }}</td>
              <td class="actions-cell">
                <NuxtLink :to="`/murid/${murid.id}`" class="icon-btn" aria-label="Lihat dan ubah">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></svg>
                  <span class="mobile-only">Buka</span>
                </NuxtLink>
                <button
                  type="button"
                  class="icon-btn danger"
                  aria-label="Hapus"
                  :disabled="deletingId === murid.id"
                  @click="handleDelete(murid)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" /></svg>
                  <span class="mobile-only">Hapus</span>
                </button>
              </td>
            </tr>
            <tr v-if="muridList?.length && !filteredMurid.length">
              <td colspan="9" class="empty-row">Tidak ada murid yang cocok dengan pencarian "{{ searchQuery }}".</td>
            </tr>
            <tr v-else-if="!muridList?.length">
              <td colspan="9" class="empty-row">Belum ada data murid. Klik "Tambah Murid" untuk mengisi formulir asesmen pertama.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
  font-variant-numeric: tabular-nums;
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
  width: 260px;
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
  text-decoration: none;
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
  color: var(--text);
  text-decoration: none;
}

.item-name:hover {
  color: var(--accent);
  text-decoration: underline;
}

.item-code {
  color: var(--text-muted);
  font-size: 12px;
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
  gap: 6px;
  color: var(--text-muted);
  cursor: pointer;
  text-decoration: none;
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

  .search-box,
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
    width: auto;
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

  .search-box input {
    font-size: 16px;
  }

  .empty-row {
    padding: 24px 14px;
  }
}
</style>
