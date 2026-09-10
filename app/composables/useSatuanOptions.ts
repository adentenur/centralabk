import type { Satuan } from '~/types/satuan'

export function useSatuanOptions() {
  const satuanOptions = useState<Satuan[]>('satuan-options', () => [])
  const loaded = useState('satuan-options-loaded', () => false)

  async function loadSatuanOptions(force = false) {
    if (loaded.value && !force) return
    try {
      satuanOptions.value = await $fetch<Satuan[]>('/api/satuan')
      loaded.value = true
    } catch {
      satuanOptions.value = []
    }
  }

  return { satuanOptions, loadSatuanOptions }
}
