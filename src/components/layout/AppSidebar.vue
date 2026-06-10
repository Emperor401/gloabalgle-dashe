<!-- src/components/layout/AppSidebar.vue -->
<template>

  <!-- Backdrop (mobile only) -->
  <Transition name="backdrop-fade">
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="closeSidebar"/>
  </Transition>

  <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">

    <!-- Logo -->
    <div class="sidebar__logo">
      <div class="sidebar__logo-icon">
        <Transition name="logo-flip" mode="out-in">
          <img
            :key="isLight ? 'dark' : 'white'"
            :src="isLight ? darkLogo : whiteLogo"
            alt="Globalgle logo"
            class="logo-img"
          />
        </Transition>
      </div>
      <span class="sidebar__logo-name">Globalgle</span>
      <!-- Mobile close button -->
      <button class="sidebar__close-btn" @click="closeSidebar" aria-label="Close menu">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Scrollable nav area -->
    <div class="sidebar__scroll">

    <!-- Main Navigation -->
    <div class="sidebar__group">
      <span class="sidebar__group-label">Main Menu</span>
      <nav class="sidebar__nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item--active': $route.path === item.path }"
          @click="closeSidebar"
        >
          <div class="nav-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              :stroke="$route.path === item.path ? '#22c55e' : '#94a3b8'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              v-html="item.icon"/>
          </div>
          <span class="nav-item__label">{{ item.name }}</span>
          <span v-if="item.badge" class="nav-item__badge">{{ item.badge }}</span>
        </router-link>
      </nav>
    </div>

    <!-- System Navigation -->
    <div class="sidebar__group">
      <span class="sidebar__group-label">System</span>
      <nav class="sidebar__nav">

        <!-- My Wallet -->
        <router-link to="/wallet" class="nav-item" :class="{ 'nav-item--active': $route.path === '/wallet' }" @click="closeSidebar">
          <div class="nav-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              :stroke="$route.path === '/wallet' ? '#22c55e' : '#94a3b8'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <path d="M16 12h2"/>
              <path d="M2 10h20"/>
            </svg>
          </div>
          <span class="nav-item__label">My Wallet</span>
          <span class="nav-item__badge">₦0</span>
        </router-link>

        <!-- Billing & Plans -->
        <router-link to="/billing" class="nav-item" :class="{ 'nav-item--active': $route.path === '/billing' }" @click="closeSidebar">
          <div class="nav-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              :stroke="$route.path === '/billing' ? '#22c55e' : '#94a3b8'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="9" y1="13" x2="15" y2="13"/>
              <line x1="9" y1="17" x2="12" y2="17"/>
            </svg>
          </div>
          <span class="nav-item__label">Billing &amp; Plans</span>
        </router-link>

        <!-- Settings -->
        <router-link to="/settings" class="nav-item" :class="{ 'nav-item--active': $route.path === '/settings' }" @click="closeSidebar">
          <div class="nav-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              :stroke="$route.path === '/settings' ? '#22c55e' : '#94a3b8'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <span class="nav-item__label">Settings</span>
        </router-link>

        <!-- Tutorials -->
        <router-link to="/tutorials" class="nav-item" :class="{ 'nav-item--active': $route.path === '/tutorials' }" @click="closeSidebar">
          <div class="nav-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              :stroke="$route.path === '/tutorials' ? '#22c55e' : '#94a3b8'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          </div>
          <span class="nav-item__label">Tutorials</span>
        </router-link>

        <!-- Support -->
        <router-link to="/help" class="nav-item" :class="{ 'nav-item--active': $route.path === '/help' }" @click="closeSidebar">
          <div class="nav-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              :stroke="$route.path === '/help' ? '#22c55e' : '#94a3b8'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <span class="nav-item__label">Support</span>
        </router-link>

        <!-- Make a complaint -->
        <router-link to="/complaint" class="nav-item" :class="{ 'nav-item--active': $route.path === '/complaint' }" @click="closeSidebar">
          <div class="nav-item__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              :stroke="$route.path === '/complaint' ? '#22c55e' : '#94a3b8'"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
          </div>
          <span class="nav-item__label">Make a complaint</span>
        </router-link>

      </nav>
    </div>

    </div><!-- end sidebar__scroll -->

    <!-- Upgrade CTA -->
    <div class="sidebar__upgrade" @click="goUpgrade">
      <div class="upgrade__body">
        <p class="upgrade__label">Upgrade to</p>
        <p class="upgrade__title">Premium!</p>
        <button class="upgrade__btn" @click.stop="goUpgrade">Upgrade</button>
      </div>

      <!-- Decorative ribbon -->
      <div class="upgrade__deco" aria-hidden="true">
        <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
          <defs>
            <linearGradient id="bowL" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fcd34d"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
            <linearGradient id="bowR" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
          </defs>
          <!-- left wing -->
          <path d="M32 34 C26 26 10 22 7 12 C5 4 15 1 22 8 C27 13 30 24 32 34Z" fill="url(#bowL)"/>
          <!-- right wing -->
          <path d="M32 34 C38 26 54 22 57 12 C59 4 49 1 42 8 C37 13 34 24 32 34Z" fill="url(#bowR)"/>
          <!-- knot -->
          <ellipse cx="32" cy="34" rx="6" ry="5" fill="#f59e0b"/>
          <ellipse cx="32" cy="34" rx="3" ry="2.5" fill="#fef3c7" opacity="0.6"/>
          <!-- left tail -->
          <path d="M27 37 C22 46 18 57 22 67" stroke="url(#bowL)" stroke-width="5" stroke-linecap="round"/>
          <!-- right tail -->
          <path d="M37 37 C42 46 46 57 42 67" stroke="url(#bowR)" stroke-width="5" stroke-linecap="round"/>
          <!-- sparkle dots -->
          <circle cx="14" cy="6" r="2" fill="#fcd34d" opacity="0.7"/>
          <circle cx="52" cy="5" r="1.5" fill="#f59e0b" opacity="0.6"/>
          <circle cx="58" cy="22" r="1.5" fill="#fef3c7" opacity="0.5"/>
        </svg>
      </div>
    </div>

    <!-- Profile strip -->
    <div class="sidebar__profile" ref="profileRef">
      <div class="profile__avatar-wrap">
        <img
          src="https://api.dicebear.com/9.x/micah/png?seed=Emperor&backgroundColor=0f3d20&baseColor=f9c9b6&earringsProbability=0&facialHairProbability=0&size=34"
          width="34"
          height="34"
          alt="Daniel"
          class="profile__avatar"
        />
        <span class="profile__status" />
      </div>
      <div class="profile__info">
        <span class="profile__name">Daniel</span>
        <span class="profile__role">emprerorsolos@gmail.com</span>
      </div>
      <button class="profile__menu-btn" @click.stop="toggleProfileMenu" :class="{ 'profile__menu-btn--active': profileMenuOpen }" aria-label="Profile options">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
        </svg>
      </button>

      <!-- Profile dropdown -->
      <Transition name="profile-drop">
        <div v-if="profileMenuOpen" class="profile-dropdown" @click.stop>

          <div class="profile-drop__header">
            <img
              src="https://api.dicebear.com/9.x/micah/png?seed=Emperor&backgroundColor=0f3d20&baseColor=f9c9b6&earringsProbability=0&facialHairProbability=0&size=40"
              width="40" height="40" alt="Daniel" class="profile-drop__avatar"
            />
            <div class="profile-drop__info">
              <span class="profile-drop__name">Daniel</span>
              <span class="profile-drop__email">emprerorsolos@gmail.com</span>
            </div>
          </div>

          <div class="profile-drop__divider" />

          <button class="profile-drop__item" @click="goTo('/settings')">
            <span class="profile-drop__icon profile-drop__icon--blue">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </span>
            <span class="profile-drop__label">Account Settings</span>
            <svg class="profile-drop__arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button class="profile-drop__item" @click="goTo('/billing')">
            <span class="profile-drop__icon profile-drop__icon--amber">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </span>
            <span class="profile-drop__label">Billing &amp; Plans</span>
            <svg class="profile-drop__arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button class="profile-drop__item" @click="goTo('/help')">
            <span class="profile-drop__icon profile-drop__icon--green">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/>
              </svg>
            </span>
            <span class="profile-drop__label">Help &amp; Support</span>
            <svg class="profile-drop__arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <div class="profile-drop__divider" />

          <button class="profile-drop__item profile-drop__item--danger" @click="logout">
            <span class="profile-drop__icon profile-drop__icon--red">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span class="profile-drop__label">Log Out</span>
          </button>

        </div>
      </Transition>
    </div>

  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import whiteLogo from '../../assets/white.jpeg'
import darkLogo  from '../../assets/dark.jpeg'
import { useSidebar } from '../../composables/useSidebar.js'

const { sidebarOpen, closeSidebar } = useSidebar()
const router = useRouter()

function goUpgrade() {
  closeSidebar()
  router.push('/billing')
}

/* Profile dropdown */
const profileMenuOpen = ref(false)
const profileRef = ref(null)

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value
}

function goTo(path) {
  profileMenuOpen.value = false
  closeSidebar()
  router.push(path)
}

function logout() {
  profileMenuOpen.value = false
  closeSidebar()
  localStorage.removeItem('theme')
  router.push('/')
}

function handleOutsideClick(e) {
  if (profileRef.value && !profileRef.value.contains(e.target)) {
    profileMenuOpen.value = false
  }
}

/* Track theme so the right logo shows */
const isLight = ref(document.documentElement.getAttribute('data-theme') === 'light')

let themeObserver = null
onMounted(() => {
  themeObserver = new MutationObserver(() => {
    isLight.value = document.documentElement.getAttribute('data-theme') === 'light'
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  document.addEventListener('click', handleOutsideClick)
})
onBeforeUnmount(() => {
  themeObserver?.disconnect()
  document.removeEventListener('click', handleOutsideClick)
})

const navItems = [
  { name: 'Dashboard',      path: '/',                              badge: null,
    icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
  { name: 'Email Services', path: '/customers',                     badge: null,
    icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
  { name: 'Generator',      path: '/email-services/branded-bills',  badge: null,
    icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { name: 'Websites',       path: '/analytics',                     badge: null,
    icon: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  { name: 'Tools',          path: '/tools',                         badge: null,
    icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
]


</script>

<style scoped>
/* ── Shell ── */
.sidebar {
  width: 260px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(20px) saturate(180%);
 
  border-right: 1px solid var(--border-soft);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transition: background 0.35s ease, border-color 0.35s ease, transform 0.32s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}

/* ── Mobile backdrop ── */
.sidebar-backdrop {
  position: fixed; inset: 0; z-index: 99;
  background: rgba(0,0,0,.55); backdrop-filter: blur(3px);
}
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.28s ease; }
.backdrop-fade-enter-from,   .backdrop-fade-leave-to     { opacity: 0; }

/* ── Mobile close btn (hidden on desktop) ── */
.sidebar__close-btn { display: none; }

@media (max-width: 1024px) and (min-width: 769px) {
  .sidebar { width: 220px; }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    z-index: 100;
    width: 280px;
    background: var(--bg);
    backdrop-filter: none;
    border-right: 1px solid var(--border-soft);
  }
  .sidebar--open { transform: translateX(0); }

  .sidebar__close-btn {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 8px; margin-left: auto;
    background: rgba(255,255,255,.08); border: 1px solid var(--border-soft);
    cursor: pointer; color: var(--t2); transition: background 0.2s;
    flex-shrink: 0;
  }
  .sidebar__close-btn:hover { background: rgba(255,255,255,.15); color: var(--t1); }
}

/* ── Scrollable nav wrapper ── */
.sidebar__scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.sidebar__scroll::-webkit-scrollbar { width: 3px; }
.sidebar__scroll::-webkit-scrollbar-track { background: transparent; }
.sidebar__scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }

/* ── Logo ── */
.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 18px;
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
}

.sidebar__logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  perspective: 600px;
  border: 2px solid var(--border-soft);
  background: var(--glass-2);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

/* 3-D Y-axis flip on theme switch */
.logo-flip-enter-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.logo-flip-leave-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}
.logo-flip-enter-from {
  transform: rotateY(-90deg) scale(0.75);
  opacity: 0;
}
.logo-flip-leave-to {
  transform: rotateY(90deg) scale(0.75);
  opacity: 0;
}

.sidebar__logo-name {
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--t1);
  letter-spacing: -0.025em;
}

/* ── Section group ── */
.sidebar__group {
  padding: 18px 14px 6px;
  flex-shrink: 0;
}

.sidebar__group-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--t2);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0 8px;
  margin-bottom: 7px;
}

/* ── Nav items ── */
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.22s ease;
  position: relative;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: var(--glass-hover);
  border-color: var(--border-soft);
}

.nav-item--active {
  background: var(--accent-dim);
  border-color: var(--accent-border);
}

.nav-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 55%;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
}

.nav-item__icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--glass-2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-item__label {
  font-size: 0.845rem;
  font-weight: 500;
  color: var(--t2);
  flex: 1;
  transition: color 0.2s ease;
}

.nav-item--active .nav-item__label,
.nav-item:hover .nav-item__label { color: var(--t1); }

.nav-item__badge {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  padding: 2px 7px;
  border-radius: 999px;
  flex-shrink: 0;
}

/* ── Profile strip ── */
.sidebar__profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 14px 16px;
  padding: 11px 12px;
  border-radius: 12px;
  background: var(--glass-2);
  border: 1px solid var(--border-soft);
  transition: all 0.22s ease;
  flex-shrink: 0;
}

.sidebar__profile:hover {
  background: var(--glass-hover);
  border-color: var(--border);
}

.profile__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.profile__avatar {
  width: 34px;
  height: 34px;
  max-width: 34px;
  max-height: 34px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
  border: 2px solid var(--accent-border);
  display: block;
  background: #0f3d20;
}

.profile__status {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  border: 2px solid var(--bg);
}

.profile__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.profile__name {
  font-size: 0.825rem;
  font-weight: 700;
  color: var(--t1);
  line-height: 1.2;
}

.profile__role {
  font-size: 0.65rem;
  color: var(--t2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile__menu-btn {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  border: 1px solid var(--border-soft);
  background: var(--glass);
  color: var(--t2);
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border-color 0.18s;
}
.profile__menu-btn:hover,
.profile__menu-btn--active {
  background: var(--glass-hover);
  color: var(--t1);
  border-color: var(--border);
}

/* ── Profile dropdown ── */
.profile-dropdown {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  right: 0;
  background: var(--dropdown-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--dropdown-border);
  border-radius: 16px;
  box-shadow: var(--dropdown-shadow);
  z-index: 200;
  overflow: hidden;
  padding: 6px;
}

.profile-drop__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 12px;
}
.profile-drop__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
  border: 2px solid var(--accent-border);
  background: #0f3d20;
  flex-shrink: 0;
}
.profile-drop__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.profile-drop__name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--t1);
  line-height: 1.2;
}
.profile-drop__email {
  font-size: 0.68rem;
  color: var(--t3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-drop__divider {
  height: 1px;
  background: var(--border-soft);
  margin: 4px 0;
}

.profile-drop__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--t1);
  font-family: 'Satoshi', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}
.profile-drop__item:hover { background: var(--glass-hover); }
.profile-drop__item--danger { color: var(--red); }
.profile-drop__item--danger:hover { background: var(--red-dim); }

.profile-drop__icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.profile-drop__icon--blue   { background: rgba(96,165,250,.15);  color: #60a5fa; }
.profile-drop__icon--amber  { background: rgba(245,158,11,.15);  color: #f59e0b; }
.profile-drop__icon--green  { background: rgba(34,197,94,.15);   color: var(--accent); }
.profile-drop__icon--red    { background: var(--red-dim);         color: var(--red); }

.profile-drop__label { flex: 1; }

.profile-drop__arrow { color: var(--t4); flex-shrink: 0; }

/* Transition */
.profile-drop-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.profile-drop-leave-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.profile-drop-enter-from,
.profile-drop-leave-to     { opacity: 0; transform: translateY(6px) scale(0.97); }

/* ── Upgrade CTA ── */
.sidebar__upgrade {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 14px 18px;
  padding: 16px 16px;
  border-radius: 16px;
  background: linear-gradient(145deg, #1e1b30 0%, #13111f 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  transition: border-color 0.25s ease;
}

.sidebar__upgrade:hover { border-color: rgba(245, 158, 11, 0.35); }

.upgrade__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1;
}

.upgrade__label {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  line-height: 1;
}

.upgrade__title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.upgrade__btn {
  margin-top: 10px;
  align-self: flex-start;
  padding: 6px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  color: #fff;
  font-family: 'Satoshi', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.upgrade__btn:hover { opacity: 0.88; transform: translateY(-1px); }

.upgrade__btn {}

.upgrade__deco {
  position: absolute;
  right: -4px;
  bottom: -6px;
  opacity: 0.92;
  pointer-events: none;
  z-index: 0;
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .sidebar__close-btn { background: var(--glass); }
[data-theme="light"] .sidebar__close-btn:hover { background: var(--glass-hover); }
[data-theme="light"] .sidebar__scroll::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); }
[data-theme="light"] .sidebar__scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.28); }
</style>
