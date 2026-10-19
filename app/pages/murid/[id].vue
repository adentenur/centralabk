<script setup lang="ts">
interface MuridDetail {
  id: number
  namaAnak: string
  nomorRekamMedis: string
  pkbmId: number | null
  pkbmNama: string
  data: Record<string, any>
}

const route = useRoute()
const muridId = Number(route.params.id)
const requestFetch = useRequestFetch()

const { data: murid, error } = await useAsyncData(`murid-${muridId}`, () => requestFetch<MuridDetail>(`/api/murid/${muridId}`))
</script>

<template>
  <main class="main">
    <div class="page-head">
      <NuxtLink to="/murid" class="back-link">← Daftar murid</NuxtLink>
      <h2>{{ murid ? `Ubah Data: ${murid.namaAnak}` : 'Data Murid' }}</h2>
      <p v-if="murid" class="sub">
        {{ murid.nomorRekamMedis ? `No. RM ${murid.nomorRekamMedis} · ` : '' }}{{ murid.pkbmNama ? `${murid.pkbmNama} · ` : '' }}Formulir Informal Asesmen Awal Anak Berkebutuhan Khusus (ABK)
      </p>
    </div>

    <p v-if="error || !murid" class="not-found">
      Data murid tidak ditemukan. Mungkin sudah dihapus. <NuxtLink to="/murid">Kembali ke daftar murid</NuxtLink>
    </p>
    <MuridForm v-else mode="edit" :murid-id="murid.id" :initial-data="murid.data" :initial-pkbm-id="murid.pkbmId" />
  </main>
</template>

<style scoped>
.main {
  padding: 26px 30px 0;
}

.page-head {
  margin-bottom: 20px;
}

.back-link {
  font-size: 12.5px;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.page-head h2 {
  font-size: 21px;
  margin: 6px 0 3px;
}

.sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.not-found {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  color: var(--text-muted);
}

.not-found a {
  color: var(--accent);
  font-weight: 600;
}

@media (max-width: 720px) {
  .main {
    padding: 16px 14px 0;
  }
}
</style>
