<script setup lang="ts">
const user = useCurrentUser()
const loggingOut = ref(false)

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
  <aside class="sidebar">
    <div class="brand">
      <div class="crate-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
      </div>
      <div>
        <p class="brand-name">Gudang Inventaris</p>
        <p class="brand-sub">Kantor Deli Serdang</p>
      </div>
    </div>

    <p class="nav-label">Menu</p>
    <NuxtLink to="/inventaris" class="nav-item" active-class="active">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.3" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.3" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.3" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.3" /></svg>
      Inventaris
    </NuxtLink>

    <div class="sidebar-spacer" />

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

.nav-label {
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--sidebar-text-dim);
  padding: 0 10px;
  margin: 0 0 8px;
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
</style>
