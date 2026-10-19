<template>
  <main class="main">
    <div class="page-head">
      <NuxtLink to="/pkbm" class="back-link">← Daftar PKBM</NuxtLink>
      <h2>Tambah PKBM</h2>
      <p class="sub">Hanya nama PKBM yang wajib diisi. Nilai bisa dikosongkan jika belum dinilai.</p>
    </div>
    <PkbmForm mode="create" />
  </main>
</template>

<style scoped>
.main { padding: 26px 30px 0; }
.page-head { margin-bottom: 20px; }
.back-link { font-size: 12.5px; color: var(--accent); text-decoration: none; font-weight: 600; }
.page-head h2 { font-size: 21px; margin: 6px 0 3px; }
.sub { font-size: 13px; color: var(--text-muted); margin: 0; }
@media (max-width: 720px) { .main { padding: 16px 14px 0; } }
</style>
