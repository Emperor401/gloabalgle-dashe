<!-- src/views/ToolsView.vue -->
<template>
  <div class="tools-page">

    <!-- Page header -->
    <div class="tools-header">
      <div>
        <h1 class="tools-title">Tools</h1>
        <p class="tools-sub">Extra tools for your business.</p>
      </div>
    </div>

    <!-- Cards grid -->
    <div class="tools-grid">
      <div
        v-for="tool in tools"
        :key="tool.title"
        class="tool-card"
        @click="tool.action"
      >
        <div class="tc-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#22c55e" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" v-html="tool.icon" />
        </div>

        <div class="tc-body">
          <div class="tc-title-row">
            <h3 class="tc-title">{{ tool.title }}</h3>
            <span v-if="tool.badge" :class="['tc-badge', `tc-badge--${tool.badge}`]">
              {{ tool.badge }}
            </span>
          </div>
          <p class="tc-desc">{{ tool.desc }}</p>
        </div>

        <div class="tc-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const tools = [
  {
    title: 'Wallet Funding',
    desc:  'Offer crypto wallet top-ups to your customers quickly and securely.',
    badge: 'new',
    icon:  '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    action: () => router.push('/tools/wallet-funding'),
  },
  {
    title: 'SMS Sender',
    desc:  'Send bulk or individual SMS messages directly to your customers.',
    badge: 'soon',
    icon:  '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    action: () => router.push('/tools/sms-sender'),
  },
  {
    title: 'Spoof Calling',
    desc:  'Place a professional call to customers with a chosen caller ID.',
    badge: 'soon',
    icon:  '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    action: () => router.push('/tools/spoof-calling'),
  },
  {
    title: 'Currency Converter',
    desc:  'Convert between 12 global currencies with live exchange rates.',
    badge: 'live',
    icon:  '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    action: () => router.push('/tools/currency'),
  },
]
</script>

<style scoped>
.tools-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ── Header ── */
.tools-header { display: flex; align-items: center; justify-content: space-between; }

.tools-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--t1);
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}
.tools-sub {
  font-size: 0.85rem;
  color: var(--t3);
  margin: 0;
}

/* ── Grid ── */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

/* ── Card ── */
.tool-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  border: 1px solid var(--border-soft);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: pointer;
  transition: border-color 0.22s, transform 0.22s;
  position: relative;
  overflow: hidden;
}

.tool-card:hover {
  border-color: rgba(34,197,94,.45);
  transform: translateY(-3px);
}

/* icon */
.tc-icon-wrap {
  width: 48px; height: 48px;
  border-radius: 14px;
  background: rgba(34,197,94,.12);
  border: 1px solid rgba(34,197,94,.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* body */
.tc-body { display: flex; flex-direction: column; gap: 7px; flex: 1; }

.tc-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tc-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--t1);
  margin: 0;
}

.tc-badge {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 999px;
}
.tc-badge--new  { background: rgba(34,197,94,.15);  color: #22c55e; border: 1px solid rgba(34,197,94,.3);  }
.tc-badge--soon { background: rgba(96,165,250,.15);  color: #60a5fa; border: 1px solid rgba(96,165,250,.3); }
.tc-badge--live { background: rgba(251,191,36,.15);  color: #fbbf24; border: 1px solid rgba(251,191,36,.3); }

.tc-desc {
  font-size: 0.82rem;
  color: var(--t3);
  margin: 0;
  line-height: 1.55;
}

/* arrow */
.tc-arrow {
  align-self: flex-end;
  color: var(--t3);
  transition: color 0.2s, transform 0.2s;
}
.tool-card:hover .tc-arrow {
  color: #22c55e;
  transform: translateX(3px);
}

/* ── Tablet ── */
@media (max-width: 1024px) and (min-width: 769px) {
  .tools-page  { gap: 22px; }
  .tools-grid  { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .tool-card   { padding: 20px; }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .tools-page    { gap: 18px; }
  .tools-title   { font-size: 1.35rem; }
  .tools-grid    { grid-template-columns: 1fr; gap: 10px; }
  .tool-card     { flex-direction: row; align-items: center; padding: 18px 20px; gap: 14px; }
  .tc-icon-wrap  { flex-shrink: 0; }
  .tc-body       { flex: 1; min-width: 0; }
  .tc-desc       { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .tc-arrow      { align-self: center; flex-shrink: 0; margin-left: auto; }
}

/* ── Small Mobile ── */
@media (max-width: 480px) {
  .tools-page   { gap: 14px; }
  .tools-title  { font-size: 1.2rem; }
  .tool-card    { padding: 16px; gap: 12px; }
  .tc-icon-wrap { width: 42px; height: 42px; border-radius: 12px; }
  .tc-title     { font-size: 0.92rem; }
}
</style>
