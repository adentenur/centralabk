<script setup lang="ts">
const user = useCurrentUser()
const loggingOut = ref(false)
const mobileOpen = ref(false)

const route = useRoute()
watch(() => route.fullPath, () => {
  mobileOpen.value = false
})

const initials = computed(() => {
  const name = user.value?.nama || user.value?.username || ''
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AA'
})

async function handleLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
  } finally {
    user.value = null
    loggingOut.value = false
    await navigateTo('/login')
  }
}
</script>

<template>
  <header class="mobile-topbar">
    <button type="button" class="hamburger" aria-label="Buka menu" @click="mobileOpen = true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
    <div class="mobile-brand">
      <div class="crate-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
      </div>
      <span>Gudang Inventaris</span>
    </div>
    <div class="mobile-avatar">{{ initials }}</div>
  </header>

  <div v-if="mobileOpen" class="backdrop" @click="mobileOpen = false" />

  <aside class="sidebar" :class="{ 'mobile-open': mobileOpen }">
    <div class="brand">
      <div class="crate-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
      </div>
      <div>
        <p class="brand-name">Gudang Inventaris</p>
        <p class="brand-sub">Kantor Deli Serdang</p>
      </div>
      <button type="button" class="close-btn" aria-label="Tutup menu" @click="mobileOpen = false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </div>

    <p class="nav-label">Menu</p>
    <NuxtLink to="/inventaris" class="nav-item" active-class="active">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.3" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.3" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.3" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.3" /></svg>
      Inventaris
    </NuxtLink>

    <p class="nav-label">Surat</p>
    <NuxtLink to="/surat/surat-jalan" class="nav-item" active-class="active">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></svg>
      Surat Jalan
    </NuxtLink>

    <div class="sidebar-spacer" />

    <p class="nav-label nav-label-bottom">Pengaturan</p>
    <NuxtLink to="/pengaturan/satuan" class="nav-item" active-class="active">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
      Satuan
    </NuxtLink>

    <div class="user-block">
      <div class="avatar">{{ initials }}</div>
      <div class="who">
        <b>{{ user?.username || '—' }}</b>
        <span>{{ user?.nama || 'Administrator' }}</span>
      </div>
    </div>

    <button type="button" class="nav-item logout" :disabled="loggingOut" @click="handleLogout">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
      {{ loggingOut ? 'Keluar…' : 'Keluar' }}
    </button>
  </aside>
</template>

<style scoped>
.mobile-topbar {
  display: none;
}

.backdrop {
  display: none;
}

.sidebar {
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 18px;
}

.crate-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.crate-mark svg {
  width: 18px;
  height: 18px;
}

.brand-name {
  font-family: Georgia, serif;
  color: #fff;
  font-size: 16.5px;
  margin: 0;
}

.brand-sub {
  color: var(--sidebar-text-dim);
  font-size: 11px;
  margin: 1px 0 0;
}

.close-btn {
  display: none;
  margin-left: auto;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: var(--sidebar-text);
  border-radius: 8px;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}

.close-btn svg {
  width: 15px;
  height: 15px;
}

.nav-label {
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--sidebar-text-dim);
  padding: 0 10px;
  margin: 0 0 8px;
}

.nav-label-bottom {
  padding-top: 12px;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 11px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--sidebar-text);
  margin-bottom: 3px;
  text-decoration: none;
  cursor: pointer;
}

.nav-item svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.nav-item.active {
  background: var(--sidebar-bg-active);
  color: #fff;
  box-shadow: inset 3px 0 0 var(--accent);
}

.sidebar-spacer {
  flex: 1;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 11px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 6px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  font-family: Georgia, serif;
  flex-shrink: 0;
}

.who {
  line-height: 1.25;
  min-width: 0;
}

.who b {
  display: block;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.who span {
  font-size: 11px;
  color: var(--sidebar-text-dim);
}

.nav-item.logout {
  color: var(--sidebar-text-dim);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-family: inherit;
}

.nav-item.logout:hover {
  color: #fff;
}

.nav-item.logout:disabled {
  opacity: 0.6;
  cursor: default;
}

@media (max-width: 860px) {
  .mobile-topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--sidebar-bg);
    color: var(--sidebar-text);
    padding: 12px 16px;
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .hamburger {
    border: none;
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border-radius: 8px;
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
  }

  .hamburger svg {
    width: 18px;
    height: 18px;
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .mobile-brand .crate-mark {
    width: 28px;
    height: 28px;
  }

  .mobile-brand .crate-mark svg {
    width: 15px;
    height: 15px;
  }

  .mobile-brand span {
    font-family: Georgia, serif;
    font-size: 14.5px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 11px;
    font-family: Georgia, serif;
    flex-shrink: 0;
  }

  .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }

  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: 268px;
    max-width: 82vw;
    min-height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    z-index: 50;
    overflow-y: auto;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .close-btn {
    display: inline-flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar {
    transition: none;
  }
}
</style>
