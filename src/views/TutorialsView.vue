<!-- src/views/TutorialsView.vue -->
<template>
  <div class="tut-page">

    <!-- ── Header ── -->
    <div class="tut-header">
      <div>
        <h1 class="tut-title">Tutorials</h1>
        <p class="tut-sub">Walkthroughs and guides for our platform.</p>
      </div>
    </div>

    <!-- ── Filter bar + grid — only when tutorials exist ── -->
    <template v-if="tutorials.length">
      <div class="tut-filterbar">
        <div class="tut-pills">
          <button v-for="cat in categories" :key="cat"
            :class="['tut-pill', { 'tut-pill--active': activeCategory === cat }]"
            @click="activeCategory = cat">
            {{ cat }}
          </button>
        </div>
        <div class="tut-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="searchQuery" placeholder="Search tutorials…" class="tut-search-input"/>
        </div>
      </div>
    </template>

    <!-- ── Tutorials grid ── -->
    <template v-if="visibleTutorials.length">
      <div class="tut-grid">
        <div v-for="tut in visibleTutorials" :key="tut.id"
          class="tut-card" @click="openModal(tut)">
          <div class="tut-thumb" :style="{ background: tut.gradient }">
            <div class="tut-thumb-grid"/>
            <div class="tut-thumb-center-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,.25)" stroke-width="1.5" stroke-linecap="round"
                v-html="tut.thumbIcon"/>
            </div>
            <div class="tut-thumb-play">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="none">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <span class="tut-dur-badge">{{ tut.duration }}</span>
            <span v-if="tut.badge" :class="['tut-hot-badge', `tut-hot--${tut.badge}`]">
              {{ tut.badge === 'new' ? 'New' : 'Popular' }}
            </span>
          </div>
          <div class="tut-card-body">
            <div class="tut-card-row">
              <span :class="['tut-cat-tag', `tut-cat--${tut.color}`]">{{ tut.category }}</span>
              <span :class="['tut-diff', `tut-diff--${tut.difficulty.toLowerCase()}`]">{{ tut.difficulty }}</span>
            </div>
            <h3 class="tut-card-title">{{ tut.title }}</h3>
            <p class="tut-card-desc">{{ tut.desc }}</p>
            <div class="tut-card-footer">
              Watch tutorial
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ── Empty state ── -->
    <template v-else>

      <!-- Empty container -->
      <div class="tut-empty-container">
        <div class="tut-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="var(--t3)" stroke-width="1.5" stroke-linecap="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            <line x1="12" y1="11" x2="12" y2="17"/>
            <line x1="9" y1="14" x2="15" y2="14"/>
          </svg>
        </div>
        <p class="tut-empty-title">No tutorials yet</p>
        <p class="tut-empty-sub">
          Tutorials are created by our team and will appear here once published.
          <span class="tut-empty-hint">Admins can add new videos in <code>/admin/video-tutorials</code></span>
        </p>
        <button class="tut-notify-btn" @click="handleNotify">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Notify me when available
        </button>
      </div>

    </template>

    <!-- ── Watch modal ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="modal" class="tut-modal-overlay" @click.self="closeModal">
          <div class="tut-modal">
            <div class="tut-modal-video" :style="{ background: modal.gradient }">
              <div class="tut-thumb-grid"/>
              <button class="tut-modal-play-btn" @click="playing = !playing">
                <svg v-if="!playing" width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="none">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
              </button>
              <div v-if="playing" class="tut-progress-bar">
                <div class="tut-progress-fill" :style="{ width: progress + '%' }"/>
                <span>{{ modal.duration }}</span>
              </div>
              <button class="tut-modal-x" @click="closeModal">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="tut-modal-body">
              <div class="tut-modal-tags">
                <span :class="['tut-cat-tag', `tut-cat--${modal.color}`]">{{ modal.category }}</span>
                <span :class="['tut-diff', `tut-diff--${modal.difficulty.toLowerCase()}`]">{{ modal.difficulty }}</span>
              </div>
              <h2 class="tut-modal-title">{{ modal.title }}</h2>
              <p class="tut-modal-desc">{{ modal.desc }}</p>
              <div class="tut-modal-meta">
                <div class="tut-meta-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ modal.duration }}
                </div>
                <div class="tut-meta-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  {{ modal.difficulty }}
                </div>
              </div>
              <div class="tut-learn-block">
                <div class="tut-learn-hdr">What you'll learn</div>
                <div v-for="pt in modal.learn" :key="pt" class="tut-learn-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
                    stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;margin-top:2px">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ pt }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-up">
        <div v-if="toast" :class="['tut-toast', `tut-toast--${toast.type}`]">
          <svg v-if="toast.type === 'success'" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ toast.msg }}
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

/* ── Static data ── */
const categories   = ['All', 'Getting Started', 'Wallet', 'Tools & SMS', 'Security', 'Account']
const activeCategory = ref('All')
const searchQuery    = ref('')

/* Tutorials list — starts empty (flip to test populated state) */
const tutorials = ref([])

const visibleTutorials = computed(() => {
  return tutorials.value.filter(t => {
    const matchCat = activeCategory.value === 'All' || t.category === activeCategory.value
    const q = searchQuery.value.toLowerCase()
    return matchCat && (!q || t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
  })
})

/* ── Notify ── */
const notified = ref(false)
function handleNotify() {
  if (notified.value) return showToast('info', 'You\'re already on the list!')
  notified.value = true
  showToast('success', 'You\'ll be notified when tutorials go live.')
}

/* ── Modal ── */
const modal    = ref(null)
const playing  = ref(false)
const progress = ref(0)
let   progInt  = null

function openModal(tut) {
  if (!tut.learn.length) return
  modal.value   = tut
  playing.value = false
  progress.value = 0
}

function closeModal() {
  modal.value = null
  playing.value = false
  clearInterval(progInt)
  progress.value = 0
}

watch(playing, val => {
  clearInterval(progInt)
  if (val) {
    progInt = setInterval(() => {
      progress.value = Math.min(progress.value + 0.35, 100)
      if (progress.value >= 100) { clearInterval(progInt); playing.value = false }
    }, 80)
  }
})

onBeforeUnmount(() => clearInterval(progInt))

/* ── Toast ── */
const toast = ref(null)
function showToast(type, msg) {
  toast.value = { type, msg }
  setTimeout(() => { toast.value = null }, 3000)
}
</script>

<style scoped>
.tut-page {
  display: flex; flex-direction: column; gap: 22px;
}

/* ── Header ── */
.tut-header {
  display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;
}
.tut-title { font-size: 1.6rem; font-weight: 800; color: var(--t1); margin: 0 0 4px; letter-spacing: -0.02em; }
.tut-sub   { font-size: 0.85rem; color: var(--t3); margin: 0; }

.tut-filterbar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
}

.tut-pills { display: flex; gap: 5px; flex-wrap: wrap; }
.tut-pill {
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 999px; padding: 6px 14px; font-size: 0.76rem; font-weight: 600;
  color: var(--t3); cursor: pointer; font-family: inherit; transition: all 0.18s;
}
.tut-pill:hover         { color: var(--t1); border-color: rgba(34,197,94,.25); }
.tut-pill--active       { background: rgba(34,197,94,.12); border-color: rgba(34,197,94,.3); color: #22c55e; }

.tut-search {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 999px; padding: 7px 15px; color: var(--t3);
  transition: border-color 0.2s; min-width: 180px;
}
.tut-search:focus-within { border-color: rgba(34,197,94,.3); color: var(--t2); }
.tut-search-input {
  background: none; border: none; outline: none;
  font-family: inherit; font-size: 0.79rem; color: var(--t1); width: 100%;
}
.tut-search-input::placeholder { color: var(--t3); }

/* ── Empty state ── */
.tut-empty-container {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1.5px dashed var(--border-soft); border-radius: 20px;
  padding: 48px 24px; display: flex; flex-direction: column;
  align-items: center; text-align: center; gap: 10px;
}

.tut-empty-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
}

.tut-empty-title { font-size: 1.05rem; font-weight: 800; color: var(--t1); margin: 0; }
.tut-empty-sub {
  font-size: 0.82rem; color: var(--t3); margin: 0; line-height: 1.6; max-width: 420px;
  display: flex; flex-direction: column; gap: 6px;
}
.tut-empty-hint { font-size: 0.73rem; color: var(--t3); }
.tut-empty-hint code {
  background: rgba(255,255,255,.08); border: 1px solid var(--border-soft);
  border-radius: 5px; padding: 1px 7px; font-size: 0.72rem; color: var(--t2);
  font-family: monospace;
}

.tut-notify-btn {
  display: flex; align-items: center; gap: 8px; margin-top: 8px;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25);
  border-radius: 10px; padding: 10px 22px; font-size: 0.82rem; font-weight: 700;
  color: #22c55e; cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.tut-notify-btn:hover { background: rgba(34,197,94,.2); border-color: rgba(34,197,94,.4); }

/* ── Grid ── */
.tut-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}

/* ── Card ── */
.tut-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 20px;
  overflow: hidden; cursor: pointer; transition: border-color 0.22s, transform 0.22s;
  display: flex; flex-direction: column;
}
.tut-card:hover { border-color: rgba(34,197,94,.38); transform: translateY(-3px); }
/* thumbnail */
.tut-thumb {
  position: relative; height: 138px; overflow: hidden;
}
.tut-thumb-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 28px 28px;
}
.tut-thumb-center-icon {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
}
.tut-thumb-play {
  position: absolute; bottom: 10px; right: 11px;
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.18);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, transform 0.2s;
}
.tut-card:hover .tut-thumb-play {
  background: rgba(34,197,94,.5); transform: scale(1.1);
}

.tut-dur-badge {
  position: absolute; top: 10px; left: 10px;
  background: rgba(0,0,0,.65); border: 1px solid rgba(255,255,255,.1);
  border-radius: 6px; padding: 3px 8px; font-size: 0.66rem; font-weight: 700; color: #fff;
}
.tut-hot-badge {
  position: absolute; top: 10px; right: 10px;
  font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  padding: 2px 8px; border-radius: 999px;
}
.tut-hot--new     { background: rgba(34,197,94,.25);  color: #22c55e;  border: 1px solid rgba(34,197,94,.4);  }
.tut-hot--popular { background: rgba(245,158,11,.25); color: #f59e0b;  border: 1px solid rgba(245,158,11,.4); }

/* card body */
.tut-card-body  { padding: 15px 17px 17px; display: flex; flex-direction: column; gap: 7px; flex: 1; }
.tut-card-row   { display: flex; justify-content: space-between; align-items: center; }
.tut-card-title {
  font-size: 0.89rem; font-weight: 800; color: var(--t1); margin: 0; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.tut-card-desc {
  font-size: 0.75rem; color: var(--t3); margin: 0; line-height: 1.55; flex: 1;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.tut-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 9px; padding: 7px 12px; font-size: 0.75rem; font-weight: 700;
  color: var(--t2); transition: all 0.2s; margin-top: 3px;
}
.tut-card:hover .tut-card-footer {
  background: rgba(34,197,94,.1); border-color: rgba(34,197,94,.25); color: #22c55e;
}
/* ── Category / diff tags ── */
.tut-cat-tag {
  font-size: 0.63rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; padding: 2px 8px; border-radius: 999px;
}
.tut-cat--green  { background: rgba(34,197,94,.1);   color: #22c55e;  border: 1px solid rgba(34,197,94,.2);   }
.tut-cat--amber  { background: rgba(245,158,11,.1);  color: #f59e0b;  border: 1px solid rgba(245,158,11,.2);  }
.tut-cat--purple { background: rgba(167,139,250,.1); color: #a78bfa;  border: 1px solid rgba(167,139,250,.2); }
.tut-cat--red    { background: rgba(248,113,113,.1); color: #f87171;  border: 1px solid rgba(248,113,113,.2); }
.tut-cat--blue   { background: rgba(96,165,250,.1);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.2);  }

.tut-diff {
  font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; padding: 2px 7px; border-radius: 999px;
}
.tut-diff--beginner     { background: rgba(34,197,94,.08);   color: #22c55e;  }
.tut-diff--intermediate { background: rgba(245,158,11,.08);  color: #f59e0b;  }
.tut-diff--advanced     { background: rgba(248,113,113,.08); color: #f87171;  }

/* ── Modal ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to       { opacity: 0; transform: scale(0.96); }

.tut-modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,.75); backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.tut-modal {
  width: 100%; max-width: 620px; max-height: 88vh; overflow-y: auto;
  background: var(--modal-glass);
  backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid var(--modal-border); border-radius: 24px;
  scrollbar-width: none;
}
.tut-modal::-webkit-scrollbar { display: none; }

.tut-modal-video {
  position: relative; height: 230px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.tut-modal-play-btn {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(255,255,255,.12); border: 2px solid rgba(255,255,255,.25);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: transform 0.2s, background 0.2s; z-index: 2;
}
.tut-modal-play-btn:hover { background: rgba(34,197,94,.35); border-color: rgba(34,197,94,.55); transform: scale(1.07); }

.tut-progress-bar {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
  display: flex; align-items: center; gap: 10px; padding: 10px 16px;
  background: linear-gradient(transparent, rgba(0,0,0,.65));
}
.tut-progress-fill { height: 4px; border-radius: 2px; background: #22c55e; transition: width 0.15s linear; flex: 1; }
.tut-progress-bar span { font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,.8); flex-shrink: 0; }

.tut-modal-x {
  position: absolute; top: 12px; right: 12px; z-index: 4;
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.14);
  color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.tut-modal-x:hover { background: rgba(248,113,113,.4); }

.tut-modal-body  { padding: 20px 24px 26px; display: flex; flex-direction: column; gap: 12px; }
.tut-modal-tags  { display: flex; gap: 8px; align-items: center; }
.tut-modal-title { font-size: 1.1rem; font-weight: 800; color: var(--t1); margin: 0; letter-spacing: -0.015em; line-height: 1.3; }
.tut-modal-desc  { font-size: 0.8rem; color: var(--t3); margin: 0; line-height: 1.6; }
.tut-modal-meta  { display: flex; gap: 14px; flex-wrap: wrap; }

.tut-meta-chip {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.74rem; color: var(--t3); font-weight: 600;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 8px; padding: 5px 11px;
}

.tut-learn-block { display: flex; flex-direction: column; gap: 9px; }
.tut-learn-hdr   {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.09em; color: var(--t3);
}
.tut-learn-item  {
  display: flex; align-items: flex-start; gap: 9px;
  font-size: 0.8rem; color: var(--t2); line-height: 1.45;
}

/* ── Toast ── */
.toast-up-enter-active, .toast-up-leave-active { transition: all 0.3s ease; }
.toast-up-enter-from, .toast-up-leave-to       { opacity: 0; transform: translateY(18px); }
.tut-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 9px;
  padding: 12px 20px; border-radius: 13px; font-size: 0.83rem; font-weight: 600;
  z-index: 10000; backdrop-filter: blur(20px); white-space: nowrap;
}
.tut-toast--success { background: rgba(34,197,94,.18);   border: 1px solid rgba(34,197,94,.3);   color: #22c55e;  }
.tut-toast--info    { background: rgba(96,165,250,.18);  border: 1px solid rgba(96,165,250,.3);  color: #60a5fa;  }

@media (max-width: 1024px) and (min-width: 769px) {
  .tut-grid        { grid-template-columns: repeat(2, 1fr); gap: 14px; }
}

@media (max-width: 768px) {
  .tut-page        { gap: 16px; }

  /* Header */
  .tut-title       { font-size: 1.35rem; }

  /* Filter bar — pills scroll horizontally, search below */
  .tut-filterbar   { flex-direction: column; align-items: stretch; gap: 10px; }
  .tut-pills       { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; gap: 6px; padding-bottom: 2px; }
  .tut-pills::-webkit-scrollbar { display: none; }
  .tut-pill        { flex-shrink: 0; }
  .tut-search      { width: 100%; min-width: unset; }

  /* Grid — 2 cols on tablet/mobile */
  .tut-grid        { grid-template-columns: 1fr 1fr; gap: 12px; }
  .tut-thumb       { height: 110px; }

  /* Empty state */
  .tut-empty-container { padding: 36px 20px; gap: 8px; }
  .tut-notify-btn  { width: 100%; justify-content: center; }

  /* Modal — bottom sheet */
  .tut-modal-overlay { padding: 0; align-items: flex-end; }
  .tut-modal       { max-width: 100%; border-radius: 24px 24px 0 0; max-height: 92vh; }
  .tut-modal-video { height: 200px; }
  .tut-modal-body  { padding: 18px 20px 24px; }

  /* Toast above bottom nav */
  .tut-toast       { bottom: 90px; max-width: calc(100vw - 32px); white-space: normal; text-align: center; }
}

@media (max-width: 480px) {
  .tut-page        { gap: 14px; }
  .tut-title       { font-size: 1.2rem; }

  /* Single column on small phones */
  .tut-grid        { grid-template-columns: 1fr; gap: 10px; }
  .tut-thumb       { height: 130px; }

  /* Empty state tighter */
  .tut-empty-container { padding: 30px 16px; }
  .tut-empty-icon  { width: 48px; height: 48px; border-radius: 13px; }
  .tut-empty-title { font-size: 0.95rem; }
  .tut-empty-sub   { font-size: 0.78rem; }

  /* Modal video shorter on small phones */
  .tut-modal-video { height: 170px; }
  .tut-modal-title { font-size: 0.97rem; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .tut-pill,
[data-theme="light"] .tut-search,
[data-theme="light"] .tut-empty-icon,
[data-theme="light"] .tut-card-footer,
[data-theme="light"] .tut-meta-chip,
[data-theme="light"] .tut-empty-hint code { background: var(--glass); }
[data-theme="light"] .tut-modal-play-btn {
  background: var(--glass-hover);
  border-color: var(--border);
}
</style>
