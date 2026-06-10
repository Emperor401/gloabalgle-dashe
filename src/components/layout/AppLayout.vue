<!-- src/components/layout/AppLayout.vue -->
<template>
  <div class="app-layout">

    <PageLoader />

    <AppSidebar />

    <div class="app-layout__main">
      <AppNavbar />
      <main class="app-layout__content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppNavbar from './AppNavbar.vue'
import PageLoader from '../ui/PageLoader.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--bg);
  position: relative;
  transition: background 0.35s ease;
}


.app-layout__main {
  margin-left: 260px;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.app-layout__content {
  padding: 96px 28px 32px;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .app-layout__main  { margin-left: 220px; }
  .app-layout__content { padding: 88px 20px 32px; }
}
@media (max-width: 768px) {
  .app-layout__main  { margin-left: 0; }
  .app-layout__content { padding: 80px 16px 100px; }
}

.page-enter-active,
.page-leave-active { transition: all 0.3s ease; }
.page-enter-from   { opacity: 0; transform: translateY(12px); }
.page-leave-to     { opacity: 0; transform: translateY(-12px); }
</style>
