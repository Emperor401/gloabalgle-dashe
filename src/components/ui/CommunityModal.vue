<!-- src/components/ui/CommunityModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-backdrop" @click.self="dismiss">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">

          <!-- Close -->
          <button class="modal-close" @click="dismiss" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Icon -->
          <div class="modal-icon-wrap">
            <div class="modal-icon-ring" />
            <div class="modal-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>

          <!-- Copy -->
          <div class="modal-body">
            <h2 id="modal-title" class="modal-title">Join our community</h2>
            <p class="modal-sub">Get the latest updates, guides, and support<br/>directly on our channel.</p>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <a href="#" class="btn-join" @click.prevent="join">
              Join channel
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
            <button class="btn-later" @click="dismiss">Maybe later</button>
          </div>

          <!-- Countdown bar -->
          <div class="modal-timer">
            <div class="modal-timer__fill" :style="{ width: timerPct + '%' }" />
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible   = ref(false)
const timerPct  = ref(100)

let showInterval  = null
let countInterval = null
let countSeconds  = 0
const INTERVAL_MS = 60_000   // show every 60 s
const DISPLAY_MS  = 15_000   // auto-dismiss after 15 s of inactivity

function show() {
  visible.value  = true
  timerPct.value = 100
  countSeconds   = 0
  clearInterval(countInterval)
  countInterval = setInterval(() => {
    countSeconds += 100
    timerPct.value = Math.max(0, 100 - (countSeconds / DISPLAY_MS) * 100)
    if (countSeconds >= DISPLAY_MS) dismiss()
  }, 100)
}

function dismiss() {
  visible.value = false
  clearInterval(countInterval)
}

function join() {
  dismiss()
  // Replace href with actual community link when available
}

onMounted(() => {
  // First show after 1 minute, then every minute
  showInterval = setInterval(show, INTERVAL_MS)
})

onBeforeUnmount(() => {
  clearInterval(showInterval)
  clearInterval(countInterval)
})
</script>

<style scoped>
/* Backdrop */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 10000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
 
}

/* Card */
.modal-card {
  position: relative;
  background: var(--modal-glass);
  backdrop-filter: blur(24px) saturate(180%);
 
  border: 1px solid var(--modal-border);
  border-radius: 24px;
  padding: 36px 32px 28px;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow: hidden;
}

/* Ambient glow behind card */
.modal-card::before {
  content: '';
  position: absolute;
  top: -60px; left: 50%; transform: translateX(-50%);
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%);
  pointer-events: none;
}

/* Close button */
.modal-close {
  position: absolute; top: 14px; right: 14px;
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--glass-2); border: 1px solid var(--border-soft);
  color: var(--t3); display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s ease;
}
.modal-close:hover { background: var(--glass-hover); color: var(--t1); }

/* Icon */
.modal-icon-wrap { position: relative; width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; }
.modal-icon-ring {
  position: absolute; inset: 0; border-radius: 50%;
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  animation: pulse-ring 2s ease-out infinite;
}
.modal-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #14a04a);
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
}

@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.7; }
  70%  { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Copy */
.modal-body { text-align: center; }
.modal-title { font-size: 1.15rem; font-weight: 800; color: var(--t1); margin: 0 0 8px; letter-spacing: -0.02em; }
.modal-sub { font-size: 0.825rem; color: var(--t3); line-height: 1.55; margin: 0; }

/* Buttons */
.modal-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }

.btn-join {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px 24px;
  background: linear-gradient(135deg, var(--accent), #14a04a);
  border: none; border-radius: 12px;
  color: #fff; font-family: 'Satoshi', sans-serif; font-size: 0.9rem; font-weight: 700;
  text-decoration: none; cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
}
.btn-join:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-later {
  width: 100%; padding: 12px 24px;
  background: var(--glass-2); border: 1px solid var(--border-soft); border-radius: 12px;
  color: var(--t3); font-family: 'Satoshi', sans-serif; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.btn-later:hover { background: var(--glass-hover); color: var(--t2); border-color: var(--border); }

/* Countdown timer bar */
.modal-timer {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 3px; background: var(--glass-2);
}
.modal-timer__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), rgba(34,197,94,0.4));
  border-radius: 0 2px 2px 0;
  transition: width 0.1s linear;
}

/* Transitions */
.modal-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.modal-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-enter-from   { opacity: 0; transform: scale(0.88) translateY(16px); }
.modal-leave-to     { opacity: 0; transform: scale(0.95) translateY(8px); }
</style>
