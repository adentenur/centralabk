<script setup lang="ts">
import { emptyItemForm } from '~/types/item'
import type { Item, ItemFormState } from '~/types/item'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  item?: Item | null
}>()

const emit = defineEmits<{
  close: []
  saved: [Item]
}>()

const form = ref<ItemFormState>(emptyItemForm())
const saving = ref(false)
const errorMsg = ref('')

watch(
  () => [props.open, props.item],
  () => {
    if (!props.open) return
    errorMsg.value = ''
    if (props.mode === 'edit' && props.item) {
      form.value = {
        namaBarang: props.item.namaBarang,
        kategori: props.item.kategori,
        namaToko: props.item.namaToko,
        jumlah: props.item.jumlah,
        hargaSatuan: props.item.hargaSatuan,
        lokasi: props.item.lokasi,
        kondisi: props.item.kondisi
      }
    } else {
      form.value = emptyItemForm()
    }
  },
  { immediate: true }
)

async function handleSubmit() {
  if (saving.value) return
  errorMsg.value = ''
  saving.value = true
  try {
    const payload = {
      namaBarang: form.value.namaBarang.trim(),
      kategori: form.value.kategori.trim(),
      namaToko: form.value.namaToko.trim(),
      jumlah: Number(form.value.jumlah),
      hargaSatuan: Number(form.value.hargaSatuan),
      lokasi: form.value.lokasi.trim(),
      kondisi: form.value.kondisi
    }
    const saved = props.mode === 'edit' && props.item
      ? await $fetch<Item>(`/api/items/${props.item.id}`, { method: 'PUT', body: payload })
      : await $fetch<Item>('/api/items', { method: 'POST', body: payload })
    emit('saved', saved)
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal menyimpan data barang.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-head">
        <h3>{{ mode === 'edit' ? 'Ubah Barang' : 'Tambah Barang' }}</h3>
        <button type="button" class="icon-btn" aria-label="Tutup" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

        <div class="grid-2">
          <div class="field">
            <label for="namaBarang">Nama barang</label>
            <input id="namaBarang" v-model="form.namaBarang" type="text" placeholder="Contoh: Laptop Lenovo ThinkPad" required>
          </div>
          <div class="field">
            <label for="kategori">Kategori <span class="optional">(opsional)</span></label>
            <input id="kategori" v-model="form.kategori" type="text" placeholder="Contoh: Elektronik">
          </div>
        </div>

        <div class="field">
          <label for="namaToko">Nama toko <span class="optional">(opsional)</span></label>
          <input id="namaToko" v-model="form.namaToko" type="text" placeholder="Contoh: Toko Komputer Medan Jaya">
        </div>

        <div class="grid-2">
          <div class="field">
            <label for="jumlah">Jumlah <span class="optional">(opsional)</span></label>
            <input id="jumlah" v-model.number="form.jumlah" type="number" min="0" step="1" placeholder="0">
          </div>
          <div class="field">
            <label for="hargaSatuan">Harga satuan (Rp) <span class="optional">(opsional)</span></label>
            <input id="hargaSatuan" v-model.number="form.hargaSatuan" type="number" min="0" step="1000" placeholder="0">
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label for="lokasi">Lokasi <span class="optional">(opsional)</span></label>
            <input id="lokasi" v-model="form.lokasi" type="text" placeholder="Contoh: Ruang Rapat">
          </div>
          <div class="field">
            <label for="kondisi">Kondisi</label>
            <select id="kondisi" v-model="form.kondisi" required>
              <option value="Baik">Baik</option>
              <option value="Perbaikan">Perbaikan</option>
              <option value="Rusak">Rusak</option>
            </select>
          </div>
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
  max-width: 520px;
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

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text);
}

.field label .optional {
  font-weight: 400;
  color: var(--text-muted);
}

.field input,
.field select {
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

.field input:focus,
.field select:focus {
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
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
