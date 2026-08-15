<script setup lang="ts">
await fetchCurrentUser()
</script>

<template>
  <div class="dash-shell">
    <AppSidebar />
    <div class="dash-main">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dash-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.dash-main {
  background: var(--bg);
  min-width: 0;
}

@media (max-width: 860px) {
  .dash-shell {
    grid-template-columns: 1fr;
  }
}
</style>
