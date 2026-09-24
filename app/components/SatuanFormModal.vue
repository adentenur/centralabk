<script setup lang="ts">
import type { Satuan } from '~/types/satuan'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  satuan?: Satuan | null
}>()

const emit = defineEmits<{
  close: []
  saved: [Satuan]
}>()

const nama = ref('')
const saving = ref(false)
const errorMsg = ref('')

watch(
  () => [props.open, props.satuan],
  () => {
    if (!props.open) return
    errorMsg.value = ''
    nama.value = props.mode === 'edit' && props.satuan ? props.satuan.nama : ''
  },
  { immediate: true }
)

async function handleSubmit() {
  if (saving.value) return
  errorMsg.value = ''
  saving.value = true
  try {
    const payload = { nama: nama.value.trim() }
    const saved = props.mode === 'edit' && props.satuan
      ? await $fetch<Satuan>(`/api/satuan/${props.satuan.id}`, { method: 'PUT', body: payload })
      : await $fetch<Satuan>('/api/satuan', { method: 'POST', body: payload })
    emit('saved', saved)
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal menyimpan satuan.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-head">
        <h3>{{ mode === 'edit' ? 'Ubah Satuan' : 'Tambah Satuan' }}</h3>
        <button type="button" class="icon-btn" aria-label="Tutup" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

        <div class="field">
          <label for="nama">Nama satuan</label>
          <input id="nama" v-model="nama" type="text" placeholder="Contoh: Dus, Sak, Kg" required>
        </div>

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
  max-width: 400px;
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

.icon-btn:hover {
  color: var(--text);
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
  margin-bottom: 18px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text);
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

.btn-ghost:hover {
  background: var(--surface-sunken);
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
