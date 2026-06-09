// src/composables/useSidebar.js
import { ref } from 'vue'

const sidebarOpen = ref(false)

export function useSidebar() {
  return {
    sidebarOpen,
    openSidebar:   () => { sidebarOpen.value = true  },
    closeSidebar:  () => { sidebarOpen.value = false },
    toggleSidebar: () => { sidebarOpen.value = !sidebarOpen.value },
  }
}
