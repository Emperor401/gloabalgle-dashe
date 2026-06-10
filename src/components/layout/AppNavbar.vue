<!-- src/components/layout/AppNavbar.vue -->
<template>

  <!-- ═══════════════════════════════════
       DESKTOP NAVBAR  (hidden on mobile)
       ═══════════════════════════════════ -->
  <header class="navbar desktop-nav">

    <!-- Left: Page title -->
    <div class="navbar__left">
      <div class="page-title">
        <div class="page-title__icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            :stroke="pageAccentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" v-html="pageIcon" />
        </div>
        <div class="page-title__text">
          <h1 class="page-title__name">{{ pageTitle }}</h1>
          <p class="page-title__sub">{{ pageSubtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Right: search, notifications, theme, date -->
    <div class="navbar__right">

      <!-- Search -->
      <div class="navbar__search">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search..."
          class="navbar__search-input" />
      </div>

      <!-- Notifications -->
      <div class="navbar__icon-btn" @click.stop="toggleNotifications" ref="notifBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span v-if="unreadCount > 0" class="navbar__badge">{{ unreadCount }}</span>

        <Transition name="notif-drop">
          <div v-if="showNotifications" class="notif-dropdown" @click.stop>
            <div class="notif-dropdown__header">
              <div class="notif-header-left">
                <span class="notif-dropdown__title">Notifications</span>
                <span v-if="unreadCount > 0" class="notif-count-pill">{{ unreadCount }} new</span>
              </div>
              <span class="notif-dropdown__clear" @click.stop="clearAll">Mark all read</span>
            </div>
            <div class="notif-list">
              <div v-if="notifications.length === 0" class="notif-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#334155"
                  stroke-width="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p>You're all caught up!</p>
              </div>
              <div v-for="notif in notifications" :key="notif.id"
                :class="['notif-item', `notif-item--${notif.type}`, { 'notif-item--unread': !notif.read }]"
                @click.stop="markRead(notif.id)">
                <div :class="['notif-icon', `ni--${notif.type}`]">
                  <svg v-if="notif.type === 'success'" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else-if="notif.type === 'error'" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  <svg v-else-if="notif.type === 'warning'" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div class="notif-item__content">
                  <p class="notif-item__title">{{ notif.title }}</p>
                  <p class="notif-item__message">{{ notif.message }}</p>
                  <span class="notif-item__time">{{ notif.time }}</span>
                </div>
                <div v-if="!notif.read" class="notif-item__dot" />
                <button class="notif-dismiss" @click.stop="dismiss(notif.id)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="notif-footer">
              <span>{{ notifications.length }} total · {{ unreadCount }} unread</span>
              <span class="notif-footer__clear" @click.stop="clearAll">Clear all read</span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Theme Toggle -->
      <button class="navbar__icon-btn theme-btn" @click="toggleTheme"
        :title="isLight ? 'Switch to dark' : 'Switch to light'">
        <svg v-if="!isLight" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1"  x2="12" y2="3"/>  <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1"  y1="12" x2="3"  y2="12"/>  <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
          <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
        </svg>
      </button>

      <!-- Date chip -->
      <div class="navbar__date">{{ currentDate }}</div>

    </div>
  </header>

  <!-- ═══════════════════════════════════
       MOBILE NAVBAR  (hidden on desktop)
       ═══════════════════════════════════ -->
  <header class="mobile-nav">

    <!-- Hamburger -->
    <button class="mn-hamburger" @click="toggleSidebar" aria-label="Open menu">
      <span :class="['mn-bar', { 'mn-bar--open-1': sidebarOpen }]"/>
      <span :class="['mn-bar', 'mn-bar--mid', { 'mn-bar--open-2': sidebarOpen }]"/>
      <span :class="['mn-bar', { 'mn-bar--open-3': sidebarOpen }]"/>
    </button>

    <!-- Greeting + avatar -->
    <div class="mn-greeting">
      <div class="mn-avatar">
        <img
          src="https://api.dicebear.com/9.x/micah/png?seed=Emperor&backgroundColor=0f3d20&baseColor=f9c9b6&earringsProbability=0&facialHairProbability=0&size=36"
          width="36"
          height="36"
          alt="Avatar"
          class="mn-avatar-img"
        />
        <span class="mn-avatar-dot"/>
      </div>
      <div class="mn-greeting-text">
        <span class="mn-greet-line">{{ greeting }},</span>
        <span class="mn-name">Emperor</span>
      </div>
    </div>

    <!-- Right actions -->
    <div class="mn-actions">

      <!-- Notifications -->
      <button class="mn-icon-btn" @click.stop="toggleNotifications" ref="mobileNotifBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span v-if="unreadCount > 0" class="mn-badge">{{ unreadCount }}</span>

        <!-- Mobile notif dropdown -->
        <Transition name="notif-drop">
          <div v-if="showNotifications" class="notif-dropdown notif-dropdown--mobile" @click.stop>
            <div class="notif-dropdown__header">
              <div class="notif-header-left">
                <span class="notif-dropdown__title">Notifications</span>
                <span v-if="unreadCount > 0" class="notif-count-pill">{{ unreadCount }} new</span>
              </div>
              <span class="notif-dropdown__clear" @click.stop="clearAll">Mark all read</span>
            </div>
            <div class="notif-list">
              <div v-if="notifications.length === 0" class="notif-empty">
                <p>You're all caught up!</p>
              </div>
              <div v-for="notif in notifications" :key="notif.id"
                :class="['notif-item', `notif-item--${notif.type}`, { 'notif-item--unread': !notif.read }]"
                @click.stop="markRead(notif.id)">
                <div :class="['notif-icon', `ni--${notif.type}`]">
                  <svg v-if="notif.type === 'success'" width="11" height="11" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div class="notif-item__content">
                  <p class="notif-item__title">{{ notif.title }}</p>
                  <p class="notif-item__message">{{ notif.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </button>

      <!-- Theme -->
      <button class="mn-icon-btn" @click="toggleTheme">
        <svg v-if="!isLight" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        </svg>
      </button>

    </div>
  </header>

  <!-- ═══════════════════════════════════
       MOBILE BOTTOM NAV
       ═══════════════════════════════════ -->
  <nav class="mobile-bottom-nav">
    <router-link
      v-for="item in bottomNavItems" :key="item.route"
      :to="item.route"
      :class="['bn-item', { 'bn-item--active': isActiveNav(item) }]"
      @click="closeSidebar"
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
        stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        v-html="item.icon" />
    </router-link>
  </nav>

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { notifications as notifData } from '../../data/mockData.js'
import { useSidebar } from '../../composables/useSidebar.js'

const route = useRoute()
const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebar()

const bottomNavItems = [
  { route: '/',             icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { route: '/analytics',    icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  { route: '/transactions', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { route: '/wallet',       icon: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>' },
]
const isActiveNav = (item) => route.path === item.route

/* ── Page meta ── */
const pages = {
  '/':           { title: 'Dashboard',       subtitle: 'Welcome back, Daniel',        color: '#22c55e', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
  '/customers':  { title: 'Email Services',  subtitle: 'Manage your email campaigns',  color: '#60a5fa', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
  '/transactions':              { title: 'Transactions', subtitle: 'Your transaction history',       color: '#a78bfa', icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  '/email-services/branded-bills': { title: 'Generator',    subtitle: 'Create and manage content',   color: '#a78bfa', icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  '/email-services/branded-emails':{ title: 'Branded Emails',subtitle: 'Send branded emails',        color: '#22c55e', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
  '/email-services/composer':      { title: 'Email Composer',subtitle: 'Write and send emails',      color: '#60a5fa', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
  '/analytics':  { title: 'Websites',        subtitle: 'Monitor your web properties',  color: '#f472b6', icon: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  '/settings':   { title: 'Settings',        subtitle: 'Manage your preferences',      color: '#94a3b8', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
  '/tutorials':  { title: 'Tutorials',       subtitle: 'Learn how to use every feature',color: '#60a5fa', icon: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>' },
  '/help':       { title: 'Support',         subtitle: 'Get help and find answers',    color: '#34d399', icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/>' },
  '/complaint':  { title: 'Make a Complaint',subtitle: 'Submit and track your reports', color: '#f87171', icon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>' },
  '/wallet':     { title: 'My Wallet',       subtitle: 'Your balance and transactions', color: '#fbbf24', icon: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>' },
  '/billing':    { title: 'Billing & Plans', subtitle: 'Subscriptions and invoices',   color: '#fb923c', icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  '/tools':      { title: 'Tools',           subtitle: 'Extra tools for your business', color: '#22c55e', icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
  '/tools/currency':       { title: 'Currency Converter', subtitle: 'Live exchange rates', color: '#22c55e', icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  '/tools/wallet-funding': { title: 'Wallet Funding',     subtitle: 'Crypto wallet top-ups', color: '#f59e0b', icon: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },
  '/tools/sms-sender':    { title: 'SMS Sender',    subtitle: 'Send SMS messages', color: '#22c55e', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  '/tools/spoof-calling': { title: 'Spoof Calling', subtitle: 'Place calls with a chosen caller ID', color: '#a78bfa', icon: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>' },
}

const currentPage    = computed(() => pages[route.path] ?? { title: 'Globalgle', subtitle: 'Banking Dashboard', color: '#22c55e', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' })
const pageTitle      = computed(() => currentPage.value.title)
const pageSubtitle   = computed(() => currentPage.value.subtitle)
const pageIcon       = computed(() => currentPage.value.icon)
const pageAccentColor = computed(() => currentPage.value.color)

/* ── Shared state ── */
const searchQuery       = ref('')
const showNotifications = ref(false)
const notifBtn          = ref(null)
const mobileNotifBtn    = ref(null)
const notifications     = ref(notifData)
const isLight           = ref(document.documentElement.getAttribute('data-theme') === 'light')

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
)

/* ── Time-based greeting ── */
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
})

/* ── Notifications ── */
const toggleNotifications = () => { showNotifications.value = !showNotifications.value }
const markRead  = (id) => { const n = notifications.value.find(n => n.id === id); if (n) n.read = true }
const dismiss   = (id) => { notifications.value = notifications.value.filter(n => n.id !== id) }
const clearAll  = () => { notifications.value = notifications.value.map(n => ({ ...n, read: true })) }

/* ── Theme ── */
const toggleTheme = () => {
  isLight.value = !isLight.value
  if (isLight.value) {
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
    localStorage.removeItem('theme')
  }
}

/* ── Click outside ── */
const handleOutsideClick = (e) => {
  const clickedNotifBtn   = notifBtn.value?.contains(e.target)
  const clickedMobileBtn  = mobileNotifBtn.value?.contains(e.target)
  if (!clickedNotifBtn && !clickedMobileBtn) showNotifications.value = false
}
onMounted(()       => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
/* ══════════════════════════════
   DESKTOP NAVBAR
   ══════════════════════════════ */
.navbar {
  position: fixed;
  top: 0; left: 260px; right: 0;
  height: 70px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border-soft);
  z-index: 90;
  transition: background 0.35s ease, border-color 0.35s ease;
  gap: 16px;
}

.navbar__left  { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.navbar__right { display: flex; align-items: center; gap: 8px; }

.page-title       { display: flex; align-items: center; gap: 11px; }
.page-title__icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--glass-2); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background 0.25s ease;
}
.page-title__text  { display: flex; flex-direction: column; gap: 1px; }
.page-title__name  { font-size: 1rem; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; margin: 0; line-height: 1.2; }
.page-title__sub   { font-size: 0.7rem; color: var(--t2); margin: 0; line-height: 1.3; }

.navbar__search {
  display: flex; align-items: center; gap: 8px;
  background: var(--glass-2); border: 1px solid var(--border-soft);
  border-radius: 50px; padding: 8px 16px; width: 200px; transition: all 0.25s ease;
}
.navbar__search:focus-within { background: var(--glass-hover); border-color: var(--accent-border); width: 240px; }
.search-icon { width: 14px; height: 14px; color: var(--t4); flex-shrink: 0; }
.navbar__search-input {
  background: transparent; border: none; outline: none;
  font-family: 'Satoshi', sans-serif; font-size: 0.8rem; color: var(--t1); width: 100%;
}
.navbar__search-input::placeholder { color: var(--t4); }

.navbar__icon-btn {
  position: relative; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: var(--glass-2); border: 1px solid var(--border-soft);
  border-radius: 10px; cursor: pointer; transition: all 0.22s ease; flex-shrink: 0;
}
.navbar__icon-btn svg { width: 16px; height: 16px; color: var(--t2); }
.navbar__icon-btn:hover { background: var(--glass-hover); border-color: var(--border); }
.theme-btn:hover svg { color: var(--accent); }

.navbar__badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 18px; height: 18px; background: var(--red);
  border-radius: 9px; font-size: 0.6rem; font-weight: 700; color: #fff;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--bg); padding: 0 3px;
}

.navbar__date {
  font-size: 0.775rem; font-weight: 600; color: var(--t1);
  padding: 8px 13px; background: var(--glass-2); border: 1px solid var(--border);
  border-radius: 8px; white-space: nowrap; flex-shrink: 0;
}

/* ══════════════════════════════
   MOBILE NAVBAR
   ══════════════════════════════ */
.mobile-nav {
  display: none;
  position: fixed; top: 0; left: 0; right: 0; height: 64px; z-index: 90;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border-soft);
  align-items: center; justify-content: space-between;
  padding: 0 16px; gap: 12px;
  transition: background 0.35s ease;
}

/* Hamburger */
.mn-hamburger {
  width: 40px; height: 40px; background: var(--glass-2); border: 1px solid var(--border-soft);
  border-radius: 11px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 5px;
  cursor: pointer; flex-shrink: 0; padding: 0;
}
.mn-bar {
  width: 18px; height: 2px; background: var(--t2); border-radius: 2px;
  transition: all 0.28s ease; transform-origin: center;
}
.mn-bar--mid    { width: 13px; align-self: flex-start; margin-left: 11px; }
.mn-bar--open-1 { transform: rotate(45deg) translate(5px, 5px); width: 18px; }
.mn-bar--open-2 { opacity: 0; transform: scaleX(0); }
.mn-bar--open-3 { transform: rotate(-45deg) translate(5px, -5px); width: 18px; }

/* Greeting */
.mn-greeting { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.mn-avatar {
  position: relative;
  width: 36px; height: 36px; min-width: 36px; min-height: 36px;
  border-radius: 50%; flex-shrink: 0;
  background: #0f3d20;
  overflow: hidden;
  border: 2px solid rgba(34,197,94,.5);
}
.mn-avatar-img {
  width: 36px; height: 36px;
  max-width: 36px; max-height: 36px;
  object-fit: cover; object-position: center top;
  display: block;
}
.mn-avatar-dot {
  position: absolute; bottom: 1px; right: 1px;
  width: 8px; height: 8px; background: #22c55e; border-radius: 50%;
  border: 2px solid var(--bg);
}
.mn-greeting-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.mn-greet-line { font-size: 0.68rem; color: var(--t3); font-weight: 500; white-space: nowrap; }
.mn-name { font-size: 0.88rem; font-weight: 800; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Right actions */
.mn-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.mn-icon-btn {
  position: relative; width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: var(--glass-2); border: 1px solid var(--border-soft);
  border-radius: 10px; cursor: pointer; color: var(--t2);
  transition: all 0.2s;
}
.mn-icon-btn:hover { background: var(--glass-hover); color: var(--t1); }
.mn-badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 17px; height: 17px; background: var(--red);
  border-radius: 8px; font-size: 0.58rem; font-weight: 700; color: #fff;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--bg); padding: 0 3px;
}

/* ══════════════════════════════
   NOTIFICATION DROPDOWN (shared)
   ══════════════════════════════ */
.notif-drop-enter-active, .notif-drop-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.notif-drop-enter-from,   .notif-drop-leave-to     { opacity: 0; transform: translateY(-6px) scale(0.97); }

.notif-dropdown {
  position: absolute; top: calc(100% + 12px); right: 0;
  width: 340px; background: var(--dropdown-bg);
  backdrop-filter: blur(28px) saturate(200%);
  border: 1px solid var(--dropdown-border); border-radius: 18px; overflow: hidden; z-index: 200;
}
.notif-dropdown--mobile { right: -40px; width: min(340px, calc(100vw - 32px)); }

.notif-dropdown__header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px 12px; border-bottom: 1px solid var(--border-soft);
}
.notif-header-left    { display: flex; align-items: center; gap: 8px; }
.notif-dropdown__title { font-size: 0.88rem; font-weight: 700; color: var(--t1); }
.notif-count-pill {
  font-size: 0.65rem; font-weight: 700;
  background: rgba(34,197,94,.18); color: #22c55e;
  border: 1px solid rgba(34,197,94,.3); border-radius: 999px; padding: 2px 8px;
}
.notif-dropdown__clear {
  font-size: 0.72rem; font-weight: 600; color: var(--accent); cursor: pointer; transition: color 0.2s;
}
.notif-dropdown__clear:hover { color: var(--accent-hover); }

.notif-list { max-height: 300px; overflow-y: auto; }
.notif-list::-webkit-scrollbar { width: 3px; }
.notif-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

.notif-empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 28px 16px; color: var(--t3); font-size: 0.8rem;
}
.notif-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 11px 16px; border-bottom: 1px solid var(--border-soft);
  cursor: pointer; transition: background 0.15s; position: relative;
}
.notif-item:last-child  { border-bottom: none; }
.notif-item:hover       { background: var(--glass-2); }
.notif-item--unread     { background: rgba(34,197,94,0.05); }
.notif-item--unread:hover { background: rgba(34,197,94,0.08); }
.notif-item--success { border-left: 2px solid #22c55e; }
.notif-item--error   { border-left: 2px solid #f87171; }
.notif-item--warning { border-left: 2px solid #fbbf24; }
.notif-item--info    { border-left: 2px solid #60a5fa; }

.notif-icon {
  width: 26px; height: 26px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
}
.ni--success { background: rgba(34,197,94,.15);   color: #22c55e; }
.ni--error   { background: rgba(248,113,113,.15); color: #f87171; }
.ni--warning { background: rgba(251,191,36,.15);  color: #fbbf24; }
.ni--info    { background: rgba(96,165,250,.15);  color: #60a5fa; }

.notif-item__content { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.notif-item__title   { font-size: 0.78rem; font-weight: 700; color: var(--t1); margin: 0; }
.notif-item__message { font-size: 0.73rem; color: var(--t2); margin: 0; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notif-item__time    { font-size: 0.67rem; color: var(--t3); margin-top: 2px; }
.notif-item__dot     { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; flex-shrink: 0; margin-top: 6px; }
.notif-dismiss {
  width: 20px; height: 20px; border-radius: 50%; border: none; background: transparent;
  color: var(--t3); cursor: pointer; display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.15s, background 0.15s; flex-shrink: 0; margin-top: 2px;
}
.notif-item:hover .notif-dismiss { opacity: 1; }
.notif-dismiss:hover { background: rgba(248,113,113,.15); color: #f87171; }

.notif-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 16px; border-top: 1px solid var(--border-soft);
  font-size: 0.7rem; color: var(--t3);
}
.notif-footer__clear { color: var(--t2); cursor: pointer; font-weight: 600; transition: color 0.2s; }
.notif-footer__clear:hover { color: #f87171; }

/* ══════════════════════════════
   MOBILE BOTTOM NAV
   ══════════════════════════════ */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 30px;
  padding: 7px;
  gap: 6px;
  align-items: center;
}

.bn-item {
  width: 54px;
  height: 54px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.22s ease;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.28);
  position: relative;
}

.bn-item:not(.bn-item--active):hover {
  color: rgba(255, 255, 255, 0.55);
}

.bn-item--active {
  background: linear-gradient(145deg, rgba(245, 158, 11, 0.32), rgba(180, 83, 9, 0.42));
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #f59e0b;
  box-shadow: 0 4px 18px rgba(245, 158, 11, 0.18) inset;
}

/* ══════════════════════════════
   RESPONSIVE: show/hide
   ══════════════════════════════ */
@media (max-width: 1024px) and (min-width: 769px) {
  .navbar { padding: 0 20px; }
}
@media (max-width: 768px) {
  .desktop-nav       { display: none; }
  .mobile-nav        { display: flex; }
  .mobile-bottom-nav { display: flex; }
}

/* ══════════════════════════════
   LIGHT MODE OVERRIDES
   ══════════════════════════════ */
[data-theme="light"] .bn-item {
  color: rgba(12, 10, 30, 0.38);
}
[data-theme="light"] .bn-item:not(.bn-item--active):hover {
  color: rgba(12, 10, 30, 0.72);
  background: rgba(12, 10, 30, 0.06);
}
[data-theme="light"] .bn-item--active {
  background: linear-gradient(145deg, rgba(245, 158, 11, 0.22), rgba(180, 83, 9, 0.28));
  border: 1px solid rgba(245, 158, 11, 0.45);
  color: #b45309;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.15) inset;
}
[data-theme="light"] .mobile-bottom-nav {
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}
[data-theme="light"] .mn-hamburger {
  border-color: rgba(0, 0, 0, 0.1);
}
[data-theme="light"] .mn-bar {
  background: rgba(12, 10, 30, 0.55);
}
[data-theme="light"] .mn-icon-btn {
  border-color: rgba(0, 0, 0, 0.1);
  color: rgba(12, 10, 30, 0.55);
}
[data-theme="light"] .mn-icon-btn:hover {
  color: rgba(12, 10, 30, 0.85);
}
</style>
