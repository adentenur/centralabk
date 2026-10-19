<script setup lang="ts">
import { NILAI_OPTIONS, nilaiClass } from '~/types/pkbm'
import type { Nilai } from '~/types/pkbm'

defineProps<{ label: string }>()
const model = defineModel<Nilai>({ required: true })

function pilih(nilai: Nilai) {
  model.value = model.value === nilai ? '' : nilai
}
</script>

<template>
  <div class="nilai-picker" role="radiogroup" :aria-label="label">
    <button
      v-for="option in NILAI_OPTIONS"
      :key="option"
      type="button"
      role="radio"
      :aria-checked="model === option"
      class="nilai-opt"
      :class="[nilaiClass(option), { on: model === option }]"
      @click="pilih(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.nilai-picker {
  display: inline-flex;
  gap: 4px;
  flex-shrink: 0;
}

.nilai-opt {
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  border-radius: 999px;
  padding: 5px 11px;
  cursor: pointer;
}

.nilai-opt:focus-visible {
  outline: 2px solid var(--accent-strong);
  outline-offset: 2px;
}

.nilai-opt.good.on {
  background: var(--good-bg);
  color: var(--good);
  border-color: var(--good);
}

.nilai-opt.warn.on {
  background: var(--warn-bg);
  color: var(--warn);
  border-color: var(--warn);
}

.nilai-opt.crit.on {
  background: var(--crit-bg);
  color: var(--crit);
  border-color: var(--crit);
}
</style>
