<script setup lang="ts">
import { ASPEK_FASILITAS } from '~/types/pkbm'
import type { Pkbm, PkbmFasilitas, PkbmRelawan } from '~/types/pkbm'

const props = defineProps<{
  mode: 'create' | 'edit'
  pkbm?: Pkbm | null
}>()

const form = ref({
  nama: props.pkbm?.nama ?? '',
  kecamatan: props.pkbm?.kecamatan ?? '',
  statusIzin: props.pkbm?.statusIzin ?? 'Berizin',
  jamOperasional: props.pkbm?.jamOperasional ?? '',
  nilaiJam: props.pkbm?.nilaiJam ?? '',
  kepalaSekolah: props.pkbm?.kepalaSekolah ?? '',
  nilaiKepalaSekolah: props.pkbm?.nilaiKepalaSekolah ?? '',
  fasilitas: ASPEK_FASILITAS.map((aspek): PkbmFasilitas => {
    const found = props.pkbm?.fasilitas.find((f) => f.aspek === aspek)
    return { aspek, nilai: found?.nilai ?? '', catatan: found?.catatan ?? '' }
  }),
  relawan: (props.pkbm?.relawan.length ? props.pkbm.relawan.map((r) => ({ ...r })) : [{ nama: '', nilai: '' }]) as PkbmRelawan[]
})

const saving = ref(false)
const errorMsg = ref('')

function tambahRelawan() {
  form.value.relawan.push({ nama: '', nilai: '' })
}

function hapusRelawan(index: number) {
  form.value.relawan.splice(index, 1)
  if (!form.value.relawan.length) tambahRelawan()
}

async function handleSubmit() {
  if (saving.value) return
  errorMsg.value = ''
  if (!form.value.nama.trim()) {
    errorMsg.value = 'Nama PKBM wajib diisi.'
    return
  }
  saving.value = true
  try {
    const body = { ...form.value, relawan: form.value.relawan.filter((r) => r.nama.trim()) }
    if (props.mode === 'edit' && props.pkbm) {
      await $fetch(`/api/pkbm/${props.pkbm.id}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/pkbm', { method: 'POST', body })
    }
    await navigateTo('/pkbm')
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal menyimpan data PKBM.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="pkbm-form" novalidate @submit.prevent="handleSubmit">
    <p v-if="errorMsg" class="form-error" role="alert">{{ errorMsg }}</p>

    <section class="form-section">
      <h3>Profil PKBM</h3>
      <div class="field-grid">
        <div class="field">
          <label for="nama">Nama PKBM<span class="req">*</span></label>
          <input id="nama" v-model="form.nama" type="text" class="input" placeholder="Contoh: PKBM Al Hidayah">
        </div>
        <div class="field">
          <label for="kecamatan">Kecamatan</label>
          <input id="kecamatan" v-model="form.kecamatan" type="text" class="input" placeholder="Contoh: Labuhan Deli">
        </div>
        <div class="field full">
          <span class="field-label">Status izin</span>
          <div class="segmented" role="radiogroup" aria-label="Status izin">
            <button
              v-for="status in (['Berizin', 'Dalam proses'] as const)"
              :key="status"
              type="button"
              role="radio"
              :aria-checked="form.statusIzin === status"
              :class="{ on: form.statusIzin === status }"
              @click="form.statusIzin = status"
            >
              {{ status }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="form-section">
      <h3>Fasilitas</h3>
      <div class="rated-list">
        <div v-for="item in form.fasilitas" :key="item.aspek" class="rated-row">
          <span class="rated-label">{{ item.aspek }}</span>
          <NilaiPicker v-model="item.nilai" :label="item.aspek" />
          <input v-model="item.catatan" type="text" class="input small" :placeholder="`Catatan ${item.aspek.toLowerCase()} (opsional)`">
        </div>
      </div>
    </section>

    <section class="form-section">
      <h3>Jam Operasional & Kepala Sekolah</h3>
      <div class="rated-list">
        <div class="rated-row">
          <label for="jam" class="rated-label">Jam operasional</label>
          <NilaiPicker v-model="form.nilaiJam" label="Nilai jam operasional" />
          <input id="jam" v-model="form.jamOperasional" type="text" class="input small" placeholder="Contoh: Senin–Jumat, 09.00–12.00 WIB">
        </div>
        <div class="rated-row">
          <label for="kepsek" class="rated-label">Kepala sekolah</label>
          <NilaiPicker v-model="form.nilaiKepalaSekolah" label="Nilai kepala sekolah" />
          <input id="kepsek" v-model="form.kepalaSekolah" type="text" class="input small" placeholder="Nama dan pendidikan terakhir">
        </div>
      </div>
    </section>

    <section class="form-section">
      <div class="section-head">
        <h3>Relawan <span class="count">{{ form.relawan.filter((r) => r.nama.trim()).length }}</span></h3>
        <button type="button" class="btn-add" @click="tambahRelawan">+ Tambah relawan</button>
      </div>
      <div class="rated-list">
        <div v-for="(relawan, index) in form.relawan" :key="index" class="rated-row relawan-row">
          <span class="relawan-no">{{ index + 1 }}.</span>
          <input v-model="relawan.nama" type="text" class="input small" placeholder="Nama relawan dan pendidikan terakhir" :aria-label="`Nama relawan ${index + 1}`">
          <NilaiPicker v-model="relawan.nilai" :label="`Nilai relawan ${index + 1}`" />
          <button type="button" class="icon-btn" :aria-label="`Hapus relawan ${index + 1}`" @click="hapusRelawan(index)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      </div>
    </section>

    <div class="form-actions">
      <NuxtLink to="/pkbm" class="btn-ghost">Batal</NuxtLink>
      <button type="submit" class="btn-solid" :disabled="saving">
        {{ saving ? 'Menyimpan…' : mode === 'edit' ? 'Simpan perubahan' : 'Simpan PKBM' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.pkbm-form {
  max-width: 860px;
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

.form-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 18px 20px;
  margin-bottom: 16px;
}

.form-section h3 {
  font-size: 15px;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.count {
  font-family: -apple-system, 'Segoe UI', ui-sans-serif, system-ui, sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--accent-strong);
  background: var(--accent-tint);
  border-radius: 999px;
  padding: 2px 8px;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
}

.field {
  margin-bottom: 14px;
}

.field.full {
  grid-column: 1 / -1;
}

.field label,
.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.req {
  color: var(--crit);
  margin-left: 2px;
}

.input {
  width: 100%;
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text);
  outline: none;
}

.input.small {
  padding: 7px 10px;
  font-size: 13.5px;
}

.input:focus {
  background: var(--surface);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
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

.rated-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

.rated-row {
  display: grid;
  grid-template-columns: 140px auto minmax(160px, 1fr);
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-top: 1px solid var(--border);
}

.rated-row:first-child {
  border-top: none;
}

.rated-row:nth-child(even) {
  background: var(--surface-sunken);
}

.rated-label {
  font-size: 13px;
  font-weight: 600;
}

.relawan-row {
  grid-template-columns: 24px minmax(160px, 1fr) auto 30px;
}

.relawan-no {
  font-size: 12.5px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.btn-add {
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--accent);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.icon-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 7px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
}

.icon-btn svg {
  width: 14px;
  height: 14px;
}

.icon-btn:hover {
  color: var(--crit);
  border-color: var(--crit);
}

.form-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 0 18px;
  background: linear-gradient(to bottom, transparent, var(--bg) 35%);
}

.btn-ghost,
.btn-solid {
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 18px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-solid {
  background: var(--accent);
  border-color: var(--accent);
  color: #f5fbf8;
  box-shadow: var(--shadow);
}

.btn-solid:disabled {
  opacity: 0.7;
  cursor: default;
}

@media (max-width: 720px) {
  .form-section {
    padding: 14px;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .rated-row {
    grid-template-columns: 1fr;
    gap: 7px;
  }

  .relawan-row {
    grid-template-columns: 22px 1fr 30px;
  }

  .relawan-row .nilai-picker {
    grid-column: 2 / 3;
  }

  .input {
    font-size: 16px;
  }

  .form-actions .btn-ghost,
  .form-actions .btn-solid {
    flex: 1;
    justify-content: center;
  }
}
</style>
