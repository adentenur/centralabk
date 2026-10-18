<script setup lang="ts">
export interface Pengguna {
  id: number
  username: string
  nama: string
  role: 'superadmin' | 'admin'
}

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  pengguna?: Pengguna | null
  isSelf?: boolean
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const username = ref('')
const nama = ref('')
const role = ref<'superadmin' | 'admin'>('admin')
const password = ref('')
const konfirmasi = ref('')
const saving = ref(false)
const errorMsg = ref('')

watch(
  () => [props.open, props.pengguna],
  () => {
    if (!props.open) return
    errorMsg.value = ''
    password.value = ''
    konfirmasi.value = ''
    username.value = props.pengguna?.username ?? ''
    nama.value = props.pengguna?.nama ?? ''
    role.value = props.pengguna?.role ?? 'admin'
  },
  { immediate: true }
)

const passwordRequired = computed(() => props.mode === 'create')
const showPasswordFields = computed(() => props.mode === 'create' || !props.isSelf)

async function handleSubmit() {
  if (saving.value) return
  errorMsg.value = ''

  const isiPassword = password.value.length > 0
  if (passwordRequired.value || isiPassword) {
    if (password.value.length < 8) {
      errorMsg.value = 'Password minimal 8 karakter.'
      return
    }
    if (password.value !== konfirmasi.value) {
      errorMsg.value = 'Konfirmasi password tidak sama.'
      return
    }
  }

  saving.value = true
  try {
    if (props.mode === 'create') {
      await $fetch('/api/pengguna', {
        method: 'POST',
        body: { username: username.value, nama: nama.value, role: role.value, password: password.value }
      })
    } else if (props.pengguna) {
      await $fetch(`/api/pengguna/${props.pengguna.id}`, {
        method: 'PUT',
        body: { nama: nama.value, role: role.value }
      })
      if (isiPassword) {
        await $fetch(`/api/pengguna/${props.pengguna.id}/password`, {
          method: 'PUT',
          body: { passwordBaru: password.value }
        })
      }
    }
    emit('saved')
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal menyimpan pengguna.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="pengguna-modal-title">
      <div class="modal-head">
        <h3 id="pengguna-modal-title">{{ mode === 'edit' ? 'Ubah Pengguna' : 'Tambah Pengguna' }}</h3>
        <button type="button" class="icon-btn" aria-label="Tutup" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <form novalidate @submit.prevent="handleSubmit">
        <p v-if="errorMsg" class="form-error" role="alert">{{ errorMsg }}</p>

        <div class="field">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="off"
            autocapitalize="none"
            placeholder="contoh: admincentralabk02"
            :disabled="mode === 'edit'"
            required
          >
          <span class="hint">{{ mode === 'edit' ? 'Username tidak dapat diubah.' : 'Huruf kecil, angka, titik, garis bawah, atau tanda hubung (3–32 karakter).' }}</span>
        </div>

        <div class="field">
          <label for="nama">Nama</label>
          <input id="nama" v-model="nama" type="text" placeholder="Nama lengkap pengguna" required>
        </div>

        <div class="field">
          <span class="field-label">Level</span>
          <div class="segmented" role="radiogroup" aria-label="Level">
            <button
              v-for="option in (['admin', 'superadmin'] as const)"
              :key="option"
              type="button"
              role="radio"
              :aria-checked="role === option"
              :class="{ on: role === option }"
              :disabled="isSelf"
              @click="role = option"
            >
              {{ roleLabel(option) }}
            </button>
          </div>
          <span class="hint">
            {{ isSelf ? 'Anda tidak dapat mengubah level akun Anda sendiri.' : 'Superadmin dapat mengelola pengguna, fitur, dan selalu melihat harga.' }}
          </span>
        </div>

        <template v-if="showPasswordFields">
          <div class="divider" />
          <div class="field">
            <label for="password">{{ mode === 'create' ? 'Password' : 'Reset password (opsional)' }}</label>
            <input id="password" v-model="password" type="password" autocomplete="new-password" :placeholder="mode === 'edit' ? 'Kosongkan jika tidak diganti' : ''">
            <span class="hint">
              Minimal 8 karakter.{{ mode === 'edit' ? ' Jika diisi, pengguna ini otomatis keluar dari semua perangkat.' : '' }}
            </span>
          </div>
          <div v-if="mode === 'create' || password" class="field">
            <label for="konfirmasi">Ulangi password</label>
            <input id="konfirmasi" v-model="konfirmasi" type="password" autocomplete="new-password">
          </div>
        </template>
        <p v-else class="hint self-note">Untuk mengganti password Anda sendiri, gunakan menu <NuxtLink to="/pengaturan/akun">Akun Saya</NuxtLink>.</p>

        <div class="modal-actions">
          <button type="button" class="btn-ghost" @click="emit('close')">Batal</button>
          <button type="submit" class="btn-solid" :disabled="saving">{{ saving ? 'Menyimpan…' : 'Simpan' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(33, 38, 31, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 50;
}

.modal-card {
  background: var(--surface);
  border-radius: 14px;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 22px 24px 24px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.modal-head h3 {
  font-size: 18px;
  margin: 0;
}

.icon-btn {
  border: none;
  background: var(--surface-sunken);
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
}

.icon-btn svg {
  width: 15px;
  height: 15px;
}

.form-error {
  background: var(--crit-bg);
  color: var(--crit);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 13px;
  border-radius: 8px;
  margin: 0 0 16px;
}

.field {
  margin-bottom: 15px;
}

.field label,
.field-label {
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

.field input:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}

.hint {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 5px;
  line-height: 1.45;
}

.self-note a {
  color: var(--accent);
  font-weight: 600;
}

.segmented {
  display: inline-flex;
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 3px;
  gap: 2px;
}

.segmented button {
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 7px;
  padding: 7px 16px;
  cursor: pointer;
}

.segmented button.on {
  background: var(--surface);
  color: var(--accent-strong);
  box-shadow: var(--shadow);
}

.segmented button:disabled {
  cursor: not-allowed;
}

.segmented button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.divider {
  border-top: 1px solid var(--border);
  margin: 4px 0 15px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}

.btn-ghost,
.btn-solid {
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 8px;
  padding: 9px 16px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}

.btn-solid {
  background: var(--accent);
  border-color: var(--accent);
  color: #f5fbf8;
}

.btn-solid:hover:not(:disabled) {
  background: var(--accent-strong);
}

.btn-solid:disabled {
  opacity: 0.7;
  cursor: default;
}

@media (max-width: 560px) {
  .modal-card {
    padding: 18px 16px 20px;
  }

  .field input {
    font-size: 16px;
  }
}
</style>
