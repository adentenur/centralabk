<script setup lang="ts">
import type { AsesmenField } from '~/utils/asesmenForm'

const props = defineProps<{
  mode: 'create' | 'edit'
  muridId?: number
  initialData?: Record<string, any> | null
  initialPkbmId?: number | null
}>()

const data = ref<Record<string, any>>(mergeAsesmen(props.initialData))
const pkbmId = ref<number | null>(props.initialPkbmId ?? null)
if (props.mode === 'create' && !data.value.tanggalAsesmen) {
  data.value.tanggalAsesmen = new Date().toISOString().slice(0, 10)
}

const saving = ref(false)
const errorMsg = ref('')

watch(
  () => [data.value.tanggalLahir, data.value.tanggalAsesmen],
  ([lahir, asesmen], old) => {
    if (!old) return
    const usia = hitungUsia(lahir, asesmen || undefined)
    if (!usia) return
    data.value.usiaTahun = String(usia.tahun)
    data.value.usiaBulan = String(usia.bulan)
  }
)

function isVisible(field: AsesmenField) {
  if (!field.showIf) return true
  return data.value[field.showIf.key] === field.showIf.equals
}

function choiceOptions(field: AsesmenField) {
  return field.other ? [...(field.options ?? []), 'Lainnya'] : field.options ?? []
}

function isSelected(field: AsesmenField, option: string) {
  const value = data.value[field.key!]
  return field.type === 'checkbox' ? Array.isArray(value) && value.includes(option) : value === option
}

function toggleChoice(field: AsesmenField, option: string) {
  const key = field.key!
  if (field.type === 'checkbox') {
    const current: string[] = Array.isArray(data.value[key]) ? data.value[key] : []
    data.value[key] = current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
  } else {
    data.value[key] = data.value[key] === option ? '' : option
  }
}

function toggleGrid(field: AsesmenField, row: string, column: string) {
  const cell = data.value[field.key!][row]
  cell.nilai = cell.nilai === column ? '' : column
}

function inputType(field: AsesmenField) {
  return field.type === 'tel' ? 'tel' : field.type
}

function isFullWidth(field: AsesmenField) {
  return field.full || ['textarea', 'radio', 'checkbox', 'grid', 'heading', 'info'].includes(field.type)
}

// ---- Dokumen (foto anak, Kartu Keluarga, kartu BPJS) ----
interface DokumenMeta {
  jenis: string
  namaFile: string
  mimeType: string
  ukuran: number
  createdAt: string
}

interface DokumenDipilih {
  file: File
  previewUrl: string | null
}

const DOKUMEN = [
  { jenis: 'foto', label: 'Foto anak', accept: 'image/jpeg,image/png,image/webp', hint: 'JPG, PNG, atau WEBP' },
  { jenis: 'kk', label: 'Kartu Keluarga', accept: 'image/jpeg,image/png,image/webp,application/pdf', hint: 'Foto atau PDF' },
  { jenis: 'bpjs', label: 'Kartu BPJS', accept: 'image/jpeg,image/png,image/webp,application/pdf', hint: 'Foto atau PDF' }
]
const MAKS_UKURAN = 5 * 1024 * 1024

// Saat menambah murid, id baru tersedia setelah disimpan; disimpan di sini agar
// jika upload dokumen gagal, menyimpan ulang memperbarui murid yang sama (bukan membuat duplikat).
const savedId = ref<number | null>(props.muridId ?? null)
const dokumenAda = ref<Record<string, DokumenMeta>>({})
const dokumenDipilih = ref<Record<string, DokumenDipilih>>({})
const dokumenDihapus = ref<Record<string, boolean>>({})
const dokumenError = ref<Record<string, string>>({})
const dokumenMemproses = ref<Record<string, boolean>>({})

onMounted(async () => {
  if (!savedId.value) return
  try {
    const list = await $fetch<DokumenMeta[]>(`/api/murid/${savedId.value}/dokumen`)
    dokumenAda.value = Object.fromEntries(list.map((d) => [d.jenis, d]))
  } catch {
    // Daftar dokumen gagal dimuat; form tetap bisa dipakai.
  }
})

onBeforeUnmount(() => {
  for (const item of Object.values(dokumenDipilih.value)) {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
  }
})

async function kecilkanGambar(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  try {
    const bitmap = await createImageBitmap(file)
    const skala = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * skala)
    canvas.height = Math.round(bitmap.height * skala)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]*$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

async function pilihDokumen(jenis: string, event: Event) {
  const input = event.target as HTMLInputElement
  const asli = input.files?.[0]
  input.value = ''
  if (!asli) return
  dokumenError.value[jenis] = ''
  dokumenMemproses.value[jenis] = true
  try {
    const file = await kecilkanGambar(asli)
    if (file.size > MAKS_UKURAN) {
      dokumenError.value[jenis] = 'Ukuran file maksimal 5 MB.'
      return
    }
    batalPilih(jenis)
    dokumenDipilih.value[jenis] = {
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }
    dokumenDihapus.value[jenis] = false
  } finally {
    dokumenMemproses.value[jenis] = false
  }
}

function batalPilih(jenis: string) {
  const item = dokumenDipilih.value[jenis]
  if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
  delete dokumenDipilih.value[jenis]
}

function tandaiHapus(jenis: string) {
  batalPilih(jenis)
  dokumenDihapus.value[jenis] = true
}

function statusDokumen(jenis: string) {
  const dipilih = dokumenDipilih.value[jenis]
  if (dipilih) return { nama: dipilih.file.name, isImage: !!dipilih.previewUrl, url: dipilih.previewUrl, baru: true }
  const ada = dokumenAda.value[jenis]
  if (ada && !dokumenDihapus.value[jenis] && savedId.value) {
    return {
      nama: ada.namaFile,
      isImage: ada.mimeType.startsWith('image/'),
      url: `/api/murid/${savedId.value}/dokumen/${jenis}?v=${encodeURIComponent(ada.createdAt)}`,
      baru: false
    }
  }
  return null
}

function formatUkuran(byte: number) {
  return byte >= 1024 * 1024 ? `${(byte / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(byte / 1024))} KB`
}

async function simpanDokumen(muridId: number) {
  const gagal: string[] = []
  for (const { jenis, label } of DOKUMEN) {
    try {
      const dipilih = dokumenDipilih.value[jenis]
      if (dipilih) {
        const body = new FormData()
        body.append('file', dipilih.file, dipilih.file.name)
        dokumenAda.value[jenis] = await $fetch<DokumenMeta>(`/api/murid/${muridId}/dokumen/${jenis}`, { method: 'PUT', body })
        batalPilih(jenis)
      } else if (dokumenDihapus.value[jenis] && dokumenAda.value[jenis]) {
        await $fetch(`/api/murid/${muridId}/dokumen/${jenis}`, { method: 'DELETE' })
        delete dokumenAda.value[jenis]
        dokumenDihapus.value[jenis] = false
      }
    } catch (err: any) {
      dokumenError.value[jenis] = err?.data?.statusMessage || 'Gagal mengunggah file.'
      gagal.push(label)
    }
  }
  return gagal
}

async function handleSubmit() {
  if (saving.value) return
  errorMsg.value = ''
  if (!String(data.value.namaAnak ?? '').trim()) {
    errorMsg.value = 'Nama anak wajib diisi (bagian A. Identitas Pasien).'
    document.getElementById('sec-a')?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  saving.value = true
  try {
    if (savedId.value) {
      await $fetch(`/api/murid/${savedId.value}`, { method: 'PUT', body: { data: data.value, pkbmId: pkbmId.value } })
    } else {
      const created = await $fetch<{ id: number }>('/api/murid', { method: 'POST', body: { data: data.value, pkbmId: pkbmId.value } })
      savedId.value = created.id
    }

    const gagal = await simpanDokumen(savedId.value!)
    if (gagal.length) {
      errorMsg.value = `Data murid tersimpan, tetapi ${gagal.join(', ')} gagal diunggah. Periksa bagian Dokumen lalu klik Simpan lagi.`
      document.getElementById('sec-dokumen')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    await navigateTo('/murid')
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || 'Gagal menyimpan data murid.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="murid-form" novalidate @submit.prevent="handleSubmit">
    <nav class="section-nav" aria-label="Bagian formulir">
      <a v-for="section in ASESMEN_SECTIONS" :key="section.id" :href="`#sec-${section.id}`">{{ section.title }}</a>
      <a href="#sec-dokumen">T. Dokumen</a>
    </nav>

    <div class="form-body">
      <p v-if="errorMsg" class="form-error" role="alert">{{ errorMsg }}</p>

      <section v-for="section in ASESMEN_SECTIONS" :id="`sec-${section.id}`" :key="section.id" class="form-section">
        <h3>{{ section.title }}</h3>
        <div class="field-grid">
          <div v-if="section.id === 'a'" class="field full">
            <label for="f-pkbm">PKBM</label>
            <PkbmSelect v-model="pkbmId" input-id="f-pkbm" />
          </div>
          <template v-for="(field, index) in section.fields" :key="`${section.id}-${index}`">
            <template v-if="isVisible(field)">
              <h4 v-if="field.type === 'heading'" class="sub-heading">{{ field.text }}</h4>

              <p v-else-if="field.type === 'info'" class="info-note">{{ field.text }}</p>

              <div v-else-if="field.type === 'grid'" class="field full">
                <div class="grid-list">
                  <div v-for="row in field.rows" :key="row" class="grid-row">
                    <span class="grid-row-label">{{ row }}</span>
                    <div class="chips" role="group" :aria-label="row">
                      <button
                        v-for="column in field.columns"
                        :key="column"
                        type="button"
                        class="chip"
                        :class="{ on: data[field.key!][row].nilai === column }"
                        :aria-pressed="data[field.key!][row].nilai === column"
                        @click="toggleGrid(field, row, column)"
                      >
                        {{ column }}
                      </button>
                    </div>
                    <input v-if="field.note" v-model="data[field.key!][row].catatan" type="text" class="input grid-note" :placeholder="`Keterangan ${row.toLowerCase()}`">
                  </div>
                </div>
              </div>

              <div v-else-if="field.type === 'radio' || field.type === 'checkbox'" class="field full">
                <span class="field-label">
                  {{ field.label }}
                  <span v-if="field.type === 'checkbox'" class="hint">(boleh pilih lebih dari satu)</span>
                </span>
                <div class="chips" role="group" :aria-label="field.label">
                  <button
                    v-for="option in choiceOptions(field)"
                    :key="option"
                    type="button"
                    class="chip"
                    :class="{ on: isSelected(field, option) }"
                    :aria-pressed="isSelected(field, option)"
                    @click="toggleChoice(field, option)"
                  >
                    {{ option }}
                  </button>
                </div>
                <input
                  v-if="field.other && isSelected(field, 'Lainnya')"
                  v-model="data[`${field.key}Lainnya`]"
                  type="text"
                  class="input other-input"
                  placeholder="Sebutkan lainnya"
                >
              </div>

              <div v-else class="field" :class="{ full: isFullWidth(field) }">
                <label :for="`f-${field.key}`">
                  {{ field.label }}<span v-if="field.required" class="req">*</span>
                </label>
                <textarea v-if="field.type === 'textarea'" :id="`f-${field.key}`" v-model="data[field.key!]" class="input" rows="3" />
                <div v-else class="input-wrap">
                  <input
                    :id="`f-${field.key}`"
                    v-model="data[field.key!]"
                    :type="inputType(field)"
                    :min="field.type === 'number' ? 0 : undefined"
                    class="input"
                  >
                  <span v-if="field.suffix" class="suffix">{{ field.suffix }}</span>
                </div>
              </div>
            </template>
          </template>
        </div>
      </section>

      <section id="sec-dokumen" class="form-section">
        <h3>T. Dokumen</h3>
        <p class="dok-intro">Unggah foto anak, Kartu Keluarga, dan kartu BPJS. Maksimal 5 MB per file. Foto akan dikecilkan otomatis. File diunggah saat formulir disimpan.</p>
        <div class="dok-grid">
          <div v-for="dok in DOKUMEN" :key="dok.jenis" class="dok-card" :class="{ pending: statusDokumen(dok.jenis)?.baru }">
            <div class="dok-preview">
              <template v-if="statusDokumen(dok.jenis)">
                <img v-if="statusDokumen(dok.jenis)!.isImage" :src="statusDokumen(dok.jenis)!.url!" :alt="dok.label">
                <div v-else class="dok-pdf">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5" /></svg>
                  <span>PDF</span>
                </div>
              </template>
              <div v-else class="dok-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
                <span>Belum ada file</span>
              </div>
            </div>

            <div class="dok-info">
              <p class="dok-label">{{ dok.label }}</p>
              <p v-if="statusDokumen(dok.jenis)" class="dok-file">
                {{ statusDokumen(dok.jenis)!.nama }}
                <template v-if="statusDokumen(dok.jenis)!.baru"> · {{ formatUkuran(dokumenDipilih[dok.jenis]!.file.size) }} · <b>belum disimpan</b></template>
                <template v-else-if="dokumenAda[dok.jenis]"> · {{ formatUkuran(dokumenAda[dok.jenis]!.ukuran) }}</template>
              </p>
              <p v-else-if="dokumenDihapus[dok.jenis]" class="dok-file warn">Akan dihapus saat disimpan</p>
              <p v-else class="dok-file">{{ dok.hint }}</p>
              <p v-if="dokumenError[dok.jenis]" class="dok-error" role="alert">{{ dokumenError[dok.jenis] }}</p>
            </div>

            <div class="dok-actions">
              <label class="dok-btn" :class="{ busy: dokumenMemproses[dok.jenis] }">
                {{ dokumenMemproses[dok.jenis] ? 'Memproses…' : statusDokumen(dok.jenis) ? 'Ganti' : 'Pilih file' }}
                <input type="file" :accept="dok.accept" class="visually-hidden" :disabled="dokumenMemproses[dok.jenis]" @change="pilihDokumen(dok.jenis, $event)">
              </label>
              <a
                v-if="statusDokumen(dok.jenis) && !statusDokumen(dok.jenis)!.baru"
                :href="statusDokumen(dok.jenis)!.url!"
                target="_blank"
                rel="noopener"
                class="dok-btn ghost"
              >Lihat</a>
              <button v-if="statusDokumen(dok.jenis)?.baru" type="button" class="dok-btn ghost" @click="batalPilih(dok.jenis)">Batal</button>
              <button v-else-if="statusDokumen(dok.jenis)" type="button" class="dok-btn danger" @click="tandaiHapus(dok.jenis)">Hapus</button>
              <button v-else-if="dokumenDihapus[dok.jenis]" type="button" class="dok-btn ghost" @click="dokumenDihapus[dok.jenis] = false">Urungkan</button>
            </div>
          </div>
        </div>
      </section>

      <div class="form-actions">
        <NuxtLink to="/murid" class="btn-ghost">Batal</NuxtLink>
        <button type="submit" class="btn-solid" :disabled="saving">
          {{ saving ? 'Menyimpan…' : mode === 'edit' ? 'Simpan perubahan' : 'Simpan murid' }}
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.murid-form {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.section-nav {
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.section-nav a {
  font-size: 12.5px;
  color: var(--text-muted);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 7px;
  line-height: 1.35;
}

.section-nav a:hover {
  background: var(--surface-sunken);
  color: var(--text);
}

.form-body {
  min-width: 0;
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
  padding: 18px 20px 6px;
  margin-bottom: 16px;
  scroll-margin-top: 16px;
}

.form-section h3 {
  font-size: 15.5px;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
}

.field,
.sub-heading,
.info-note {
  margin-bottom: 16px;
}

.field.full,
.sub-heading,
.info-note {
  grid-column: 1 / -1;
}

.sub-heading {
  font-family: inherit;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-strong);
  margin-top: 4px;
}

.info-note {
  font-size: 12.5px;
  color: var(--warn);
  background: var(--warn-bg);
  padding: 9px 12px;
  border-radius: 8px;
}

.field label,
.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 7px;
  color: var(--text);
}

.hint {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 12px;
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
  resize: vertical;
}

.input:focus {
  background: var(--surface);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrap .suffix {
  position: absolute;
  right: 12px;
  font-size: 12.5px;
  color: var(--text-muted);
  pointer-events: none;
}

.input-wrap .input:has(+ .suffix) {
  padding-right: 64px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  line-height: 1.2;
}

.chip:hover {
  border-color: var(--accent);
}

.chip.on {
  background: var(--accent);
  border-color: var(--accent);
  color: #f5fbf8;
  font-weight: 600;
}

.chip:focus-visible {
  outline: 2px solid var(--accent-strong);
  outline-offset: 2px;
}

.other-input {
  margin-top: 8px;
  max-width: 360px;
}

.grid-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

.grid-row {
  display: grid;
  grid-template-columns: 150px auto minmax(140px, 1fr);
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-top: 1px solid var(--border);
}

.grid-row:first-child {
  border-top: none;
}

.grid-row:nth-child(even) {
  background: var(--surface-sunken);
}

.grid-row-label {
  font-size: 13px;
  font-weight: 600;
}

.grid-note {
  padding: 7px 10px;
  font-size: 13px;
  background: var(--surface);
}

.dok-intro {
  font-size: 12.5px;
  color: var(--text-muted);
  margin: -6px 0 14px;
}

.dok-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

.dok-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--surface);
}

.dok-card.pending {
  border-color: var(--accent);
}

.dok-preview {
  aspect-ratio: 4 / 3;
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border);
}

.dok-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dok-empty,
.dok-pdf {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 12px;
}

.dok-empty svg,
.dok-pdf svg {
  width: 26px;
  height: 26px;
}

.dok-pdf {
  color: var(--crit);
  font-weight: 700;
}

.dok-info {
  padding: 10px 12px 4px;
  flex: 1;
  min-width: 0;
}

.dok-label {
  font-size: 13.5px;
  font-weight: 600;
  margin: 0 0 3px;
}

.dok-file {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  word-break: break-word;
}

.dok-file b {
  color: var(--accent-strong);
}

.dok-file.warn {
  color: var(--crit);
  font-weight: 600;
}

.dok-error {
  font-size: 12px;
  font-weight: 600;
  color: var(--crit);
  margin: 6px 0 0;
}

.dok-actions {
  display: flex;
  gap: 6px;
  padding: 8px 12px 12px;
  flex-wrap: wrap;
}

.dok-btn {
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 7px;
  padding: 6px 12px;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #f5fbf8;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.dok-btn:focus-within,
.dok-btn:focus-visible {
  outline: 2px solid var(--accent-strong);
  outline-offset: 2px;
}

.dok-btn.busy {
  opacity: 0.6;
  cursor: progress;
}

.dok-btn.ghost {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.dok-btn.danger {
  background: var(--surface);
  color: var(--crit);
  border-color: var(--border);
}

.dok-btn.danger:hover {
  border-color: var(--crit);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
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

.btn-solid:hover:not(:disabled) {
  background: var(--accent-strong);
}

.btn-solid:disabled {
  opacity: 0.7;
  cursor: default;
}

@media (max-width: 1100px) {
  .murid-form {
    grid-template-columns: 1fr;
  }

  .section-nav {
    position: static;
    flex-direction: row;
    overflow-x: auto;
    max-height: none;
    padding-bottom: 4px;
  }

  .section-nav a {
    white-space: nowrap;
    background: var(--surface);
    border: 1px solid var(--border);
  }
}

@media (max-width: 720px) {
  .form-section {
    padding: 14px 14px 4px;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .grid-row {
    grid-template-columns: 1fr;
    gap: 7px;
  }

  .dok-grid {
    grid-template-columns: 1fr;
  }

  .input,
  .grid-note {
    font-size: 16px;
  }

  .other-input {
    max-width: none;
  }

  .form-actions .btn-ghost,
  .form-actions .btn-solid {
    flex: 1;
    justify-content: center;
  }
}
</style>
