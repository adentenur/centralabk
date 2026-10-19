<script setup lang="ts">
import type { Pkbm } from '~/types/pkbm'

const route = useRoute()
const pkbmId = Number(route.params.id)
const requestFetch = useRequestFetch()
const { data: pkbm, error } = await useAsyncData(`pkbm-${pkbmId}`, () => requestFetch<Pkbm>(`/api/pkbm/${pkbmId}`))
</script>

<template>
  <main class="main">
    <div class="page-head">
      <NuxtLink to="/pkbm" class="back-link">← Daftar PKBM</NuxtLink>
      <h2>{{ pkbm ? pkbm.nama : 'Data PKBM' }}</h2>
      <p v-if="pkbm" class="sub">{{ pkbm.kecamatan ? `Kecamatan ${pkbm.kecamatan} · ` : '' }}{{ pkbm.relawan.length }} relawan</p>
    </div>
    <p v-if="error || !pkbm" class="not-found">
      PKBM tidak ditemukan. Mungkin sudah dihapus. <NuxtLink to="/pkbm">Kembali ke daftar PKBM</NuxtLink>
    </p>
    <PkbmForm v-else mode="edit" :pkbm="pkbm" />
  </main>
</template>

<style scoped>
.main { padding: 26px 30px 0; }
.page-head { margin-bottom: 20px; }
.back-link { font-size: 12.5px; color: var(--accent); text-decoration: none; font-weight: 600; }
.page-head h2 { font-size: 21px; margin: 6px 0 3px; }
.sub { font-size: 13px; color: var(--text-muted); margin: 0; }
.not-found { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; color: var(--text-muted); }
.not-found a { color: var(--accent); font-weight: 600; }
@media (max-width: 720px) { .main { padding: 16px 14px 0; } }
</style>
