<!-- src/components/ui/PageLoader.vue -->
<template>
  <Transition name="loader">
    <div v-if="loading" class="page-loader">
      <div class="spinner">
        <svg viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" stroke="var(--accent-dim)" stroke-width="3.5"/>
          <circle cx="20" cy="20" r="16" stroke="var(--accent)" stroke-width="3.5"
            stroke-linecap="round" stroke-dasharray="30 70" />
        </svg>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useLoader } from '../../composables/useLoader.js'
const { loading } = useLoader()
</script>

<style scoped>
.page-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 13, 31, 0.45);
  backdrop-filter: blur(4px);
 
}

.spinner {
  width: 48px;
  height: 48px;
  animation: spin 0.75s linear infinite;
}

.spinner svg {
  width: 100%;
  height: 100%;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader-enter-active { transition: opacity 0.15s ease; }
.loader-enter-from   { opacity: 0; }
.loader-leave-active { transition: opacity 0.25s ease; }
.loader-leave-to     { opacity: 0; }
</style>
