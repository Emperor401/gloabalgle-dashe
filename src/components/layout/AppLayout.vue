<!-- src/components/layout/AppLayout.vue -->
<template>
  <div class="app-layout">

    <PageLoader />

    <!-- Background Orbs -->
    <div class="bg-orbs">
      <div class="orb orb--violet" />
      <div class="orb orb--emerald" />
      <div class="orb orb--rose" />
      <div class="orb orb--indigo" />
    </div>

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

.bg-orbs {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
}

.orb--violet {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, #22c55e 0%, transparent 70%);
  top: -260px;
  left: -140px;
  opacity: 0.22;
  animation: floatOrb 14s ease-in-out infinite alternate;
}

.orb--emerald {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, #4ade80 0%, transparent 70%);
  bottom: -180px;
  right: 6%;
  opacity: 0.14;
  animation: floatOrb 17s ease-in-out infinite alternate-reverse;
}

.orb--rose {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #f87171 0%, transparent 70%);
  top: 40%;
  right: -120px;
  opacity: 0.13;
  animation: floatOrb 11s ease-in-out infinite alternate;
}

.orb--indigo {
  width: 760px;
  height: 760px;
  background: radial-gradient(circle, #14532d 0%, transparent 70%);
  bottom: -340px;
  left: 20%;
  opacity: 0.28;
  animation: floatOrb 20s ease-in-out infinite alternate-reverse;
}

@keyframes floatOrb {
  0%   { transform: translate(0px, 0px) scale(1); }
  50%  { transform: translate(28px, -22px) scale(1.05); }
  100% { transform: translate(-22px, 28px) scale(0.95); }
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
