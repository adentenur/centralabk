<script setup lang="ts">
import { nilaiClass } from '~/types/pkbm'
import type { Pkbm } from '~/types/pkbm'

const requestFetch = useRequestFetch()
const { data: pkbmList, refresh } = await useAsyncData('pkbm-list', () => requestFetch<Pkbm[]>('/api/pkbm'))

const user = useCurrentUser()
const searchQuery = ref('')
const deletingId = ref<number | null>(null)

const filteredPkbm = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return pkbmList.value ?? []
  return (pkbmList.value ?? []).filter((p) =>
    [p.nama, p.kecamatan, p.kepalaSekolah, ...p.relawan.map((r) => r.nama)].some((f) => f.toLowerCase().includes(query))
  )
})

const ringkasan = computed(() => {
  const list = pkbmList.value ?? []
  return {
    total: list.length,
    relawan: list.reduce((n, p) => n + p.relawan.length, 0),
    dalamProses: list.filter((p) => p.statusIzin === 'Dalam proses').length,
    fasilitasKurang: list.filter((p) => p.fasilitas.some((f) => f.nilai === 'Kurang')).length
  }
})

function hitungNilai(items: { nilai: string }[]) {
  return {
    Baik: items.filter((i) => i.nilai === 'Baik').length,
    Cukup: items.filter((i) => i.nilai === 'Cukup').length,
    Kurang: items.filter((i) => i.nilai === 'Kurang').length
  }
}

async function handleDelete(pkbm: Pkbm) {
  if (deletingId.value) return
  if (!confirm(`Hapus "${pkbm.nama}" beserta ${pkbm.relawan.length} data relawannya?`)) return
  deletingId.value = pkbm.id
  try {
    await $fetch(`/api/pkbm/${pkbm.id}`, { method: 'DELETE' })
    await refresh()
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <main class="main">
    <div class="topbar">
      <div>
        <h2>PKBM</h2>
        <p class="sub">Rekapitulasi penilaian PKBM penyandang disabilitas di Kabupaten Deli Serdang 2026.</p>
      </div>
      <div class="user-chip">
        <div class="avatar">{{ (user?.username || 'AA').slice(0, 2).toUpperCase() }}</div>
        <div class="who"><b>{{ user?.username }}</b><span>{{ roleLabel(user?.role) }}</span></div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card"><p class="label">Total PKBM</p><p class="value figures">{{ ringkasan.total }}</p></div>
      <div class="stat-card"><p class="label">Total relawan</p><p class="value figures">{{ ringkasan.relawan }}</p></div>
      <div class="stat-card"><p class="label">Izin dalam proses</p><p class="value figures">{{ ringkasan.dalamProses }}</p></div>
      <div class="stat-card"><p class="label">Ada fasilitas kurang</p><p class="value figures crit-text">{{ ringkasan.fasilitasKurang }}</p></div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <div class="head-left">
          <h3>Daftar PKBM</h3>
          <div class="legend" aria-label="Keterangan warna">
            <span class="pill good">Baik</span><span class="pill warn">Cukup</span><span class="pill crit">Kurang</span>
          </div>
        </div>
        <div class="panel-actions">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
            <input v-model="searchQuery" type="text" placeholder="Cari PKBM, kecamatan, kepala sekolah, relawan..." aria-label="Cari PKBM">
          </div>
          <NuxtLink to="/pkbm/tambah" class="btn-solid">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
            Tambah PKBM
          </NuxtLink>
        </div>
      </div>

      <table>
        <colgroup>
          <col style="width: 4%"><col style="width: 17%"><col style="width: 11%"><col style="width: 14%">
          <col style="width: 14%"><col style="width: 21%"><col style="width: 11%"><col style="width: 8%">
        </colgroup>
        <thead>
          <tr>
            <th>No.</th><th>Nama PKBM</th><th>Kecamatan</th><th>Jam Operasional</th>
            <th>Kepala Sekolah</th><th>Fasilitas</th><th>Relawan</th><th class="actions-head">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pkbm, index) in filteredPkbm" :key="pkbm.id">
            <td class="figures row-no" data-label="No.">{{ index + 1 }}</td>
            <td data-label="Nama PKBM">
              <NuxtLink :to="`/pkbm/${pkbm.id}`" class="item-name">{{ pkbm.nama }}</NuxtLink>
              <div><span class="izin" :class="pkbm.statusIzin === 'Berizin' ? 'good' : 'warn'">{{ pkbm.statusIzin === 'Berizin' ? 'Berizin' : 'Izin dalam proses' }}</span></div>
            </td>
            <td data-label="Kecamatan">{{ pkbm.kecamatan || '-' }}</td>
            <td data-label="Jam Operasional">
              <span v-if="pkbm.jamOperasional" class="rated" :class="nilaiClass(pkbm.nilaiJam)">{{ pkbm.jamOperasional }}</span>
              <span v-else class="muted">-</span>
            </td>
            <td data-label="Kepala Sekolah">
              <span v-if="pkbm.kepalaSekolah" class="rated" :class="nilaiClass(pkbm.nilaiKepalaSekolah)">{{ pkbm.kepalaSekolah }}</span>
              <span v-else class="muted">-</span>
            </td>
            <td data-label="Fasilitas">
              <div class="fasilitas">
                <span
                  v-for="f in pkbm.fasilitas"
                  :key="f.aspek"
                  class="pill"
                  :class="nilaiClass(f.nilai)"
                  :title="`${f.aspek}: ${f.nilai || 'belum dinilai'}${f.catatan ? ' — ' + f.catatan : ''}`"
                >{{ f.aspek }}<template v-if="f.catatan"> · {{ f.catatan }}</template></span>
              </div>
            </td>
            <td data-label="Relawan">
              <div class="figures"><b>{{ pkbm.relawan.length }}</b> orang</div>
              <div class="counts">
                <span v-for="(jumlah, nilai) in hitungNilai(pkbm.relawan)" v-show="jumlah" :key="nilai" class="count-dot" :class="nilaiClass(nilai)" :title="`${jumlah} ${nilai}`">{{ jumlah }}</span>
              </div>
            </td>
            <td class="actions-cell">
              <NuxtLink :to="`/pkbm/${pkbm.id}`" class="icon-btn" :aria-label="`Lihat dan ubah ${pkbm.nama}`">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></svg>
                <span class="mobile-only">Buka</span>
              </NuxtLink>
              <button type="button" class="icon-btn danger" :aria-label="`Hapus ${pkbm.nama}`" :disabled="deletingId === pkbm.id" @click="handleDelete(pkbm)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13" /></svg>
                <span class="mobile-only">Hapus</span>
              </button>
            </td>
          </tr>
          <tr v-if="pkbmList?.length && !filteredPkbm.length">
            <td colspan="8" class="empty-row">Tidak ada PKBM yang cocok dengan pencarian "{{ searchQuery }}".</td>
          </tr>
          <tr v-else-if="!pkbmList?.length">
            <td colspan="8" class="empty-row">Belum ada data PKBM. Klik "Tambah PKBM" untuk menambahkan.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.main { padding: 26px 30px 36px; }

.topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 16px; flex-wrap: wrap; }
.topbar h2 { font-size: 21px; margin: 0 0 3px; }
.topbar .sub { font-size: 13px; color: var(--text-muted); margin: 0; }

.user-chip { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; padding: 6px 14px 6px 6px; box-shadow: var(--shadow); }
.avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--accent-tint); color: var(--accent-strong); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12.5px; font-family: Georgia, serif; }
.user-chip .who { line-height: 1.25; }
.user-chip .who b { display: block; font-size: 13px; }
.user-chip .who span { font-size: 11px; color: var(--text-muted); }

.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; box-shadow: var(--shadow); }
.stat-card .label { font-size: 12px; color: var(--text-muted); margin: 0 0 6px; }
.stat-card .value { font-family: Georgia, serif; font-size: 24px; margin: 0; }
.crit-text { color: var(--crit); }

.panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow); overflow: hidden; }
.panel-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); gap: 14px; flex-wrap: wrap; }
.head-left { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.panel-head h3 { font-size: 15.5px; margin: 0; }
.legend { display: flex; gap: 5px; }
.panel-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.search-box { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); background: var(--surface-sunken); border-radius: 8px; padding: 0 10px; width: 280px; }
.search-box svg { width: 15px; height: 15px; color: var(--text-muted); flex-shrink: 0; }
.search-box input { border: none; background: transparent; outline: none; font-size: 13px; font-family: inherit; color: var(--text); padding: 8px 0; width: 100%; }

.btn-solid { font-family: inherit; font-size: 12.5px; font-weight: 600; border-radius: 7px; padding: 8px 14px; border: 1px solid var(--accent); background: var(--accent); color: #f5fbf8; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
.btn-solid:hover { background: var(--accent-strong); }
.btn-solid svg { width: 14px; height: 14px; }

table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 13px; }
thead th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); background: var(--surface-sunken); padding: 9px 10px; font-weight: 700; }
.actions-head { text-align: right; }
tbody td { padding: 10px; border-top: 1px solid var(--border); vertical-align: top; word-break: break-word; }
tbody tr:hover { background: var(--surface-sunken); }

.item-name { font-weight: 600; color: var(--text); text-decoration: none; }
.item-name:hover { color: var(--accent); text-decoration: underline; }
.muted { color: var(--text-muted); }

.izin { display: inline-block; margin-top: 4px; font-size: 11px; font-weight: 700; border-radius: 999px; padding: 1px 8px; }
.izin.good { color: var(--good); background: var(--good-bg); }
.izin.warn { color: var(--warn); background: var(--warn-bg); }

.rated { display: inline; padding: 1px 5px; border-radius: 4px; box-decoration-break: clone; -webkit-box-decoration-break: clone; line-height: 1.65; }
.rated.good { background: var(--good-bg); color: var(--good); }
.rated.warn { background: var(--warn-bg); color: var(--warn); }
.rated.crit { background: var(--crit-bg); color: var(--crit); }

.fasilitas { display: flex; flex-wrap: wrap; gap: 4px; }
.pill { font-size: 11px; font-weight: 700; border-radius: 999px; padding: 2px 8px; background: var(--surface-sunken); color: var(--text-muted); white-space: nowrap; }
.pill.good { color: var(--good); background: var(--good-bg); }
.pill.warn { color: var(--warn); background: var(--warn-bg); }
.pill.crit { color: var(--crit); background: var(--crit-bg); }

.counts { display: flex; gap: 4px; margin-top: 4px; }
.count-dot { min-width: 22px; text-align: center; font-size: 11px; font-weight: 700; border-radius: 999px; padding: 1px 6px; font-variant-numeric: tabular-nums; }
.count-dot.good { color: var(--good); background: var(--good-bg); }
.count-dot.warn { color: var(--warn); background: var(--warn-bg); }
.count-dot.crit { color: var(--crit); background: var(--crit-bg); }

.actions-cell { display: flex; gap: 6px; justify-content: flex-end; }
.icon-btn { border: 1px solid var(--border); background: var(--surface); border-radius: 7px; width: 30px; height: 30px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; gap: 6px; color: var(--text-muted); cursor: pointer; text-decoration: none; }
.icon-btn svg { width: 14px; height: 14px; }
.icon-btn:hover { color: var(--text); background: var(--surface-sunken); }
.icon-btn.danger:hover { color: var(--crit); border-color: var(--crit); }
.icon-btn:disabled { opacity: 0.5; cursor: default; }

.empty-row { text-align: center; color: var(--text-muted); padding: 32px 20px; }
.mobile-only { display: none; }

@media (max-width: 1100px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 720px) {
  .main { padding: 16px 14px 28px; }
  .search-box, .panel-actions { width: 100%; }
  .search-box input { font-size: 16px; }
  .btn-solid { flex: 1; justify-content: center; }
  table, thead, tbody, tr, td { display: block; width: 100%; }
  thead, colgroup { display: none; }
  tbody tr { border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; margin: 12px; width: auto; }
  tbody tr:hover { background: var(--surface); }
  tbody td { border: none; padding: 6px 0; }
  tbody td[data-label]::before { content: attr(data-label); display: block; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); font-weight: 700; margin-bottom: 3px; }
  td.row-no { display: none; }
  td.actions-cell { display: flex; padding-top: 10px; margin-top: 4px; border-top: 1px solid var(--border); }
  .icon-btn { width: auto; padding: 7px 12px; }
  .mobile-only { display: inline; font-size: 12.5px; font-weight: 600; }
}
</style>
