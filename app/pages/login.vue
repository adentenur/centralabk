<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (loading.value) return
  errorMsg.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    await fetchCurrentUser()
    await navigateTo('/inventaris')
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal masuk. Periksa nama pengguna dan kata sandi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-screen">
    <div class="login-visual">
      <div>
        <div class="crate-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
        </div>
        <h1 class="lede">Sistem Inventaris Barang</h1>
        <p class="lede-sub">Kelola data barang, kondisi, dan lokasi penyimpanan kantor secara terpusat dan rapi.</p>
      </div>
      <div class="stat-row">
        <div><b class="figures">238</b><span>Barang tercatat</span></div>
        <div><b class="figures">12</b><span>Kategori</span></div>
        <div><b class="figures">6</b><span>Lokasi</span></div>
      </div>
    </div>

    <div class="login-form-pane">
      <form @submit.prevent="handleSubmit">
        <p class="kicker">Masuk ke Akun</p>
        <h2>Selamat datang kembali</h2>
        <p class="sub">Masukkan kredensial admin untuk mengelola data inventaris.</p>

        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

        <div class="field">
          <label for="username">Nama pengguna</label>
          <div class="input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" /></svg>
            <input id="username" v-model="username" type="text" autocomplete="username" placeholder="adminabk" required>
          </div>
        </div>
        <div class="field">
          <label for="password">Kata sandi</label>
          <div class="input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="10.5" width="14" height="9" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
            <input id="password" v-model="password" type="password" autocomplete="current-password" placeholder="••••••••••••" required>
          </div>
        </div>
        <button class="login-btn" type="submit" :disabled="loading">{{ loading ? 'Memproses…' : 'Masuk' }}</button>
        <div class="login-foot"><span class="dot" /> Terhubung ke database lokal (SQLite)</div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-screen {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  background: var(--surface);
}

.login-visual {
  background:
    radial-gradient(circle at 22% 18%, rgba(255, 255, 255, 0.06), transparent 45%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 64px),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 64px),
    linear-gradient(160deg, var(--accent-strong), var(--sidebar-bg) 75%);
  color: var(--sidebar-text);
  padding: 48px 44px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.crate-mark {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.crate-mark svg {
  width: 24px;
  height: 24px;
}

.login-visual .lede {
  font-size: 30px;
  line-height: 1.28;
  color: #ffffff;
  max-width: 26ch;
  margin: 26px 0 0;
}

.login-visual .lede-sub {
  font-family: -apple-system, 'Segoe UI', ui-sans-serif, system-ui, sans-serif;
  font-size: 14.5px;
  color: var(--sidebar-text-dim);
  max-width: 34ch;
  margin-top: 14px;
  line-height: 1.6;
}

.login-visual .stat-row {
  display: flex;
  gap: 28px;
}

.login-visual .stat-row div b {
  display: block;
  font-family: Georgia, serif;
  font-size: 22px;
  color: #fff;
}

.login-visual .stat-row div span {
  font-size: 12px;
  color: var(--sidebar-text-dim);
}

.login-form-pane {
  padding: 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form-pane form {
  max-width: 360px;
  width: 100%;
  margin: 0 auto;
}

.kicker {
  font-size: 12.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  font-weight: 700;
  margin: 0 0 10px;
}

.login-form-pane h2 {
  font-size: 24px;
  margin: 0 0 6px;
}

.login-form-pane .sub {
  color: var(--text-muted);
  font-size: 14px;
  margin: 0 0 24px;
}

.form-error {
  background: var(--crit-bg);
  color: var(--crit);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 13px;
  border-radius: 8px;
  margin: 0 0 18px;
}

.field {
  margin-bottom: 18px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text);
}

.field .input {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  border-radius: 9px;
  padding: 4px 13px;
}

.field .input svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.field .input input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14.5px;
  color: var(--text);
  font-family: inherit;
  padding: 9px 0;
  width: 100%;
}

.field .input:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
  border-radius: 9px;
}

.login-btn {
  margin-top: 8px;
  width: 100%;
  background: var(--accent);
  color: #f5fbf8;
  border: none;
  border-radius: 9px;
  padding: 13px;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.login-btn:hover:not(:disabled) {
  background: var(--accent-strong);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.login-btn:focus-visible {
  outline: 2px solid var(--accent-strong);
  outline-offset: 2px;
}

.login-foot {
  margin-top: 22px;
  font-size: 12.5px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-foot .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--good);
  flex-shrink: 0;
}

@media (max-width: 860px) {
  .login-screen {
    grid-template-columns: 1fr;
  }

  .login-visual {
    display: none;
  }
}
</style>
