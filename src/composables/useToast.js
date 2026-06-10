// src/composables/useToast.js
import { ref } from 'vue'

const toasts = ref([])
let _id = 0

export function useToast() {
  function add(type, title, message = '', duration = 4000) {
    const id = ++_id
    toasts.value.push({ id, type, title, message })
    setTimeout(() => remove(id), duration)
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    remove,
    success: (title, message) => add('success', title, message),
    error:   (title, message) => add('error',   title, message),
    warning: (title, message) => add('warning', title, message),
    info:    (title, message) => add('info',    title, message),
  }
}
