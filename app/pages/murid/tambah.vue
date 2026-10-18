<template>
  <main class="main">
    <div class="page-head">
      <NuxtLink to="/murid" class="back-link">← Daftar murid</NuxtLink>
      <h2>Tambah Murid</h2>
      <p class="sub">Formulir Informal Asesmen Awal Anak Berkebutuhan Khusus (ABK). Hanya nama anak yang wajib diisi.</p>
    </div>
    <MuridForm mode="create" />
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

@media (max-width: 720px) {
  .main {
    padding: 16px 14px 0;
  }
}
</style>
