// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'

// Restore saved theme before mount — prevents flash on refresh
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.setAttribute('data-theme', 'light')
}

createApp(App).use(router).mount('#app')