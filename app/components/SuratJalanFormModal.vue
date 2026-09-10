<script setup lang="ts">
import { emptySuratJalanForm, emptySuratJalanItem } from '~/types/suratJalan'
import type { SuratJalan, SuratJalanFormState } from '~/types/suratJalan'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  surat?: SuratJalan | null
}>()

const emit = defineEmits<{
  close: []
  saved: [SuratJalan]
}>()

const form = ref<SuratJalanFormState>(emptySuratJalanForm())
const saving = ref(false)
const errorMsg = ref('')

const { satuanOptions, loadSatuanOptions } = useSatuanOptions()

watch(
  () => [props.open, props.surat],
  () => {
    if (!props.open) return
    errorMsg.value = ''
    loadSatuanOptions()
    if (props.mode === 'edit' && props.surat) {
      form.value = {
        tanggal: props.surat.tanggal,
        namaPengirim: props.surat.namaPengirim,
        asalBarang: props.surat.asalBarang,
        namaPenerima: props.surat.namaPenerima,
        keterangan: props.surat.keterangan,
        items: props.surat.items.length
          ? props.surat.items.map((item) => ({ namaBarang: item.namaBarang, jumlah: item.jumlah, satuan: item.satuan }))
          : [emptySuratJalanItem()]
      }
    } else {
      form.value = emptySuratJalanForm()
    }
  },
  { immediate: true }
)

function addItemRow() {
  form.value.items.push(emptySuratJalanItem())
}

function removeItemRow(index: number) {
  if (form.value.items.length <= 1) return
  form.value.items.splice(index, 1)
}

async function handleSubmit() {
  if (saving.value) return
  errorMsg.value = ''
  saving.value = true
  try {
    const payload = {
      tanggal: form.value.tanggal,
      namaPengirim: form.value.namaPengirim.trim(),
      asalBarang: form.value.asalBarang.trim(),
      namaPenerima: form.value.namaPenerima.trim(),
      keterangan: form.value.keterangan.trim(),
      items: form.value.items
        .filter((item) => item.namaBarang.trim())
        .map((item) => ({
          namaBarang: item.namaBarang.trim(),
          jumlah: Number(item.jumlah) || 0,
          satuan: item.satuan.trim()
        }))
    }
    const saved = props.mode === 'edit' && props.surat
      ? await $fetch<SuratJalan>(`/api/surat-jalan/${props.surat.id}`, { method: 'PUT', body: payload })
      : await $fetch<SuratJalan>('/api/surat-jalan', { method: 'POST', body: payload })
    emit('saved', saved)
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal menyimpan surat jalan.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-head">
        <h3>{{ mode === 'edit' ? 'Ubah Surat Jalan' : 'Tambah Surat Jalan' }}</h3>
        <button type="button" class="icon-btn" aria-label="Tutup" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

        <div class="grid-2">
          <div class="field">
            <label>Nomor surat</label>
            <div v-if="mode === 'edit' && surat" class="nomor-readonly">{{ surat.nomorSurat }}</div>
            <div v-else class="nomor-readonly nomor-auto">Dibuat otomatis saat disimpan</div>
          </div>
          <div class="field">
            <label for="tanggal">Tanggal</label>
            <input id="tanggal" v-model="form.tanggal" type="date" required>
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label for="namaPengirim">Nama pengirim <span class="optional">(opsional)</span></label>
            <input id="namaPengirim" v-model="form.namaPengirim" type="text" placeholder="Contoh: CV Sumber Jaya">
          </div>
          <div class="field">
            <label for="asalBarang">Asal barang <span class="optional">(opsional)</span></label>
            <input id="asalBarang" v-model="form.asalBarang" type="text" placeholder="Contoh: Medan">
          </div>
        </div>

        <div class="field">
          <label for="namaPenerima">Diterima oleh <span class="optional">(opsional)</span></label>
          <input id="namaPenerima" v-model="form.namaPenerima" type="text" placeholder="Contoh: Budi Santoso">
        </div>

        <div class="items-section">
          <div class="items-head">
            <label>Daftar barang</label>
            <button type="button" class="btn-add-item" @click="addItemRow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
              Tambah Barang
            </button>
          </div>

          <div v-for="(item, index) in form.items" :key="index" class="item-row">
            <input v-model="item.namaBarang" type="text" placeholder="Nama barang" class="item-nama" required>
            <input v-model.number="item.jumlah" type="number" min="0" step="1" placeholder="Jumlah" class="item-jumlah">
            <select v-model="item.satuan" class="item-satuan">
              <option value="">Satuan</option>
              <option v-for="opt in satuanOptions" :key="opt.id" :value="opt.nama">{{ opt.nama }}</option>
            </select>
            <button
              type="button"
              class="icon-btn remove-item"
              :disabled="form.items.length <= 1"
              aria-label="Hapus barang ini"
              @click="removeItemRow(index)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
        </div>

        <div class="field">
          <label for="keterangan">Keterangan <span class="optional">(opsional)</span></label>
          <textarea id="keterangan" v-model="form.keterangan" rows="2" placeholder="Catatan tambahan (kondisi barang, dsb.)" />
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
  max-width: 620px;
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
  flex-shrink: 0;
}

.icon-btn svg {
  width: 15px;
  height: 15px;
}

.icon-btn:hover {
  color: var(--text);
}

.icon-btn:disabled {
  opacity: 0.35;
  cursor: default;
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
.field textarea {
  width: 100%;
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text);
  outline: none;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  background: var(--surface);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.nomor-readonly {
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.nomor-readonly.nomor-auto {
  color: var(--text-muted);
  font-style: italic;
  font-variant-numeric: normal;
}

.items-section {
  margin-bottom: 16px;
}

.items-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.items-head label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.btn-add-item {
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  background: none;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.btn-add-item svg {
  width: 13px;
  height: 13px;
}

.btn-add-item:hover {
  color: var(--accent-strong);
}

.item-row {
  display: grid;
  grid-template-columns: 1fr 90px 90px auto;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.item-row input,
.item-row select {
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13.5px;
  font-family: inherit;
  color: var(--text);
  outline: none;
  width: 100%;
}

.item-row input:focus,
.item-row select:focus {
  background: var(--surface);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.remove-item {
  width: 30px;
  height: 30px;
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

  .item-row {
    grid-template-columns: 1fr 70px 70px auto;
  }
}
</style>
