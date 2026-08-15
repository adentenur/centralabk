// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Gudang Inventaris — Kantor Deli Serdang',
      meta: [{ name: 'description', content: 'Sistem inventaris barang kantor.' }]
    }
  },
  runtimeConfig: {
    sessionPassword: process.env.NUXT_SESSION_PASSWORD || ''
  }
})
