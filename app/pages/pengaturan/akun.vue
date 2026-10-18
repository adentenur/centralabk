<script setup lang="ts">
const user = useCurrentUser()

const passwordLama = ref('')
const passwordBaru = ref('')
const konfirmasi = ref('')
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleSubmit() {
  if (saving.value) return
  errorMsg.value = ''
  successMsg.value = ''
  if (passwordBaru.value.length < 8) {
    errorMsg.value = 'Password baru minimal 8 karakter.'
    return
  }
  if (passwordBaru.value !== konfirmasi.value) {
    errorMsg.value = 'Konfirmasi password tidak sama dengan password baru.'
    return
  }
  saving.value = true
  try {
    await $fetch('/api/akun/password', {
      method: 'PUT',
      body: { passwordLama: passwordLama.value, passwordBaru: passwordBaru.value }
    })
    passwordLama.value = ''
    passwordBaru.value = ''
    konfirmasi.value = ''
    successMsg.value = 'Password berhasil diganti. Perangkat lain yang memakai akun ini sudah otomatis keluar.'
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal mengganti password.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="main">
    <div class="page-head">
      <h2>Akun Saya</h2>
      <p class="sub">Informasi akun dan penggantian password.</p>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Informasi akun</h3></div>
      <dl class="info-list">
        <div><dt>Username</dt><dd>{{ user?.username }}</dd></div>
        <div><dt>Nama</dt><dd>{{ user?.nama }}</dd></div>
        <div><dt>Level</dt><dd><span class="role-pill" :class="user?.role">{{ roleLabel(user?.role) }}</span></dd></div>
      </dl>
    </div>

    <form class="panel" novalidate @submit.prevent="handleSubmit">
      <div class="panel-head"><h3>Ganti password</h3></div>
      <div class="form-body">
        <p v-if="errorMsg" class="status err" role="alert">{{ errorMsg }}</p>
        <p v-if="successMsg" class="status ok" role="status">{{ successMsg }}</p>

        <div class="field">
          <label for="passwordLama">Password lama</label>
          <input id="passwordLama" v-model="passwordLama" type="password" autocomplete="current-password" required>
        </div>
        <div class="field">
          <label for="passwordBaru">Password baru</label>
          <input id="passwordBaru" v-model="passwordBaru" type="password" autocomplete="new-password" minlength="8" required>
          <span class="hint">Minimal 8 karakter.</span>
        </div>
        <div class="field">
          <label for="konfirmasi">Ulangi password baru</label>
          <input id="konfirmasi" v-model="konfirmasi" type="password" autocomplete="new-password" required>
        </div>

        <button type="submit" class="btn-solid" :disabled="saving || !passwordLama || !passwordBaru || !konfirmasi">
          {{ saving ? 'Menyimpan…' : 'Ganti password' }}
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.main {
  padding: 26px 30px 36px;
  max-width: 560px;
}

.page-head {
  margin-bottom: 22px;
}

.page-head h2 {
  font-size: 21px;
  margin: 0 0 3px;
}

.sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}

.panel-head {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
}

.panel-head h3 {
  font-size: 15px;
  margin: 0;
}

.info-list {
  margin: 0;
  padding: 6px 20px;
}

.info-list div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 9px 0;
  border-top: 1px solid var(--border);
  font-size: 13.5px;
}

.info-list div:first-child {
  border-top: none;
}

.info-list dt {
  color: var(--text-muted);
}

.info-list dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.role-pill {
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 999px;
  padding: 3px 10px;
  color: var(--text-muted);
  background: var(--surface-sunken);
}

.role-pill.superadmin {
  color: var(--accent-strong);
  background: var(--accent-tint);
}

.form-body {
  padding: 16px 20px 20px;
}

.field {
  margin-bottom: 14px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.field input {
  width: 100%;
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text);
  outline: none;
}

.field input:focus {
  background: var(--surface);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.hint {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 5px;
}

.status {
  font-size: 13px;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 8px;
  margin: 0 0 14px;
}

.status.ok {
  color: var(--good);
  background: var(--good-bg);
}

.status.err {
  color: var(--crit);
  background: var(--crit-bg);
}

.btn-solid {
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 18px;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #f5fbf8;
  cursor: pointer;
}

.btn-solid:hover:not(:disabled) {
  background: var(--accent-strong);
}

.btn-solid:disabled {
  opacity: 0.6;
  cursor: default;
}

@media (max-width: 720px) {
  .main {
    padding: 16px 14px 28px;
  }

  .field input {
    font-size: 16px;
  }

  .btn-solid {
    width: 100%;
  }
}
</style>
