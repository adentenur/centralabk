<script setup lang="ts">
interface PkbmOption {
  id: number
  nama: string
  kecamatan: string
}

const props = defineProps<{ inputId?: string }>()
const model = defineModel<number | null>({ required: true })

const options = ref<PkbmOption[]>([])
const loading = ref(true)
const loadError = ref(false)
const open = ref(false)
const query = ref('')
const activeIndex = ref(0)
const root = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const listId = `${props.inputId ?? 'pkbm'}-list`

const selected = computed(() => options.value.find((o) => o.id === model.value) ?? null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return options.value
  return options.value.filter((o) => o.nama.toLowerCase().includes(q) || o.kecamatan.toLowerCase().includes(q))
})

onMounted(async () => {
  try {
    const list = await $fetch<PkbmOption[]>('/api/pkbm')
    options.value = list
      .map((p) => ({ id: p.id, nama: p.nama, kecamatan: p.kecamatan }))
      .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
  document.addEventListener('pointerdown', onOutside)
})

onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))

function onOutside(event: PointerEvent) {
  if (root.value && !root.value.contains(event.target as Node)) close()
}

function openList() {
  if (open.value) return
  open.value = true
  query.value = ''
  const idx = filtered.value.findIndex((o) => o.id === model.value)
  activeIndex.value = idx >= 0 ? idx : 0
}

function close() {
  open.value = false
  query.value = ''
}

function choose(option: PkbmOption) {
  model.value = option.id
  close()
}

function clear() {
  model.value = null
  close()
  inputEl.value?.focus()
}

watch(query, () => {
  activeIndex.value = 0
})

function scrollActiveIntoView() {
  nextTick(() => document.getElementById(`${listId}-${activeIndex.value}`)?.scrollIntoView({ block: 'nearest' }))
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!open.value) return openList()
    const max = filtered.value.length - 1
    if (max < 0) return
    activeIndex.value = event.key === 'ArrowDown'
      ? Math.min(max, activeIndex.value + 1)
      : Math.max(0, activeIndex.value - 1)
    scrollActiveIntoView()
  } else if (event.key === 'Enter') {
    if (!open.value) return
    event.preventDefault()
    const option = filtered.value[activeIndex.value]
    if (option) choose(option)
  } else if (event.key === 'Escape') {
    if (open.value) {
      event.preventDefault()
      close()
    }
  } else if (event.key === 'Tab') {
    close()
  }
}

const displayValue = computed(() => {
  if (open.value) return query.value
  return selected.value ? selected.value.nama : ''
})

function onInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  open.value = true
}
</script>

<template>
  <div ref="root" class="combo" :class="{ open }">
    <div class="combo-field">
      <svg class="combo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
      <input
        :id="inputId"
        ref="inputEl"
        type="text"
        role="combobox"
        autocomplete="off"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-activedescendant="open && filtered.length ? `${listId}-${activeIndex}` : undefined"
        :value="displayValue"
        :placeholder="loading ? 'Memuat daftar PKBM…' : selected ? selected.nama : 'Ketik untuk mencari PKBM…'"
        :disabled="loading"
        @focus="openList"
        @click="openList"
        @input="onInput"
        @keydown="onKeydown"
      >
      <span v-if="selected && !open && selected.kecamatan" class="combo-meta">{{ selected.kecamatan }}</span>
      <button v-if="selected" type="button" class="combo-clear" aria-label="Kosongkan PKBM" @click="clear">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <svg class="combo-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </div>

    <ul v-if="open" :id="listId" class="combo-list" role="listbox">
      <li
        v-for="(option, index) in filtered"
        :id="`${listId}-${index}`"
        :key="option.id"
        role="option"
        :aria-selected="option.id === model"
        class="combo-option"
        :class="{ active: index === activeIndex, selected: option.id === model }"
        @pointerdown.prevent="choose(option)"
        @pointermove="activeIndex = index"
      >
        <span class="opt-nama">{{ option.nama }}</span>
        <span class="opt-kec">{{ option.kecamatan }}</span>
      </li>
      <li v-if="!filtered.length" class="combo-empty">
        {{ loadError ? 'Daftar PKBM gagal dimuat. Muat ulang halaman.' : `Tidak ada PKBM yang cocok dengan "${query}".` }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.combo {
  position: relative;
}

.combo-field {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  border-radius: 9px;
  padding: 0 10px;
}

.combo.open .combo-field,
.combo-field:focus-within {
  background: var(--surface);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.combo-field input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: var(--text);
  padding: 9px 0;
}

.combo-field input::placeholder {
  color: var(--text-muted);
}

.combo-icon,
.combo-caret {
  width: 15px;
  height: 15px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.combo.open .combo-caret {
  transform: rotate(180deg);
}

.combo-meta {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.combo-clear {
  border: none;
  background: none;
  padding: 2px;
  display: inline-flex;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 5px;
}

.combo-clear:hover {
  color: var(--crit);
}

.combo-clear svg {
  width: 14px;
  height: 14px;
}

.combo-list {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 280px;
  overflow-y: auto;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 12px 32px -12px rgba(33, 38, 31, 0.35);
}

.combo-option {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 13.5px;
}

.combo-option.active {
  background: var(--surface-sunken);
}

.combo-option.selected .opt-nama {
  color: var(--accent-strong);
  font-weight: 700;
}

.opt-nama {
  font-weight: 500;
}

.opt-kec {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.combo-empty {
  padding: 10px;
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .combo-field input {
    font-size: 16px;
  }
}
</style>
