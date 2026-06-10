<!-- src/views/BrandedEmailsView.vue -->
<template>
  <div class="be-page">

    <!-- Header -->
    <div class="be-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div>
        <h1 class="be-title">Branded Emails</h1>
        <p class="be-sub">Send branded wallet & transaction emails to your customers.</p>
      </div>
      <div class="header-meta">
        <div class="stat-pill">
          <span class="stat-pill__num">12,480</span>
          <span class="stat-pill__label">Sent this month</span>
        </div>
        <div class="stat-pill">
          <span class="stat-pill__num accent">98.4%</span>
          <span class="stat-pill__label">Delivery rate</span>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-bar">
      <button v-for="tab in tabs" :key="tab"
        :class="['ftab', { 'ftab--active': activeTab === tab }]"
        @click="activeTab = tab">{{ tab }}</button>
    </div>

    <!-- Template Grid -->
    <div class="template-grid">
      <div v-for="t in filtered" :key="t.id" class="t-card">
        <!-- Preview area -->
        <div class="t-preview" :style="{ background: t.previewBg }">
          <div class="t-preview__inner">
            <div class="t-preview__bar" />
            <div class="t-preview__line" style="width:70%" />
            <div class="t-preview__line" style="width:50%" />
            <div class="t-preview__badge" :style="{ background: t.color }">{{ t.tag }}</div>
          </div>
        </div>
        <!-- Info -->
        <div class="t-info">
          <div class="t-info__top">
            <div class="t-icon" :style="{ background: t.dimColor }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="t.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="t.icon" />
            </div>
            <span :class="['t-badge', `t-badge--${t.category.toLowerCase()}`]">{{ t.category }}</span>
          </div>
          <h3 class="t-name">{{ t.name }}</h3>
          <p class="t-desc">{{ t.desc }}</p>
          <div class="t-actions">
            <button class="btn-preview" @click="previewTemplate(t)">Preview</button>
            <button class="btn-send" @click="sendTemplate(t)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="previewOpen" class="modal-overlay" @click.self="previewOpen = false">
          <div class="modal-box">
            <div class="modal-top">
              <h3 class="modal-title">{{ previewItem?.name }}</h3>
              <button class="modal-close" @click="previewOpen = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-email" :style="{ borderTopColor: previewItem?.color }">
              <div class="me-header">
                <div class="me-logo" :style="{ background: previewItem?.color }">G</div>
                <div>
                  <p class="me-brand">Globalgle Bank</p>
                  <p class="me-from">noreply@globalgle.com</p>
                </div>
              </div>
              <div class="me-badge" :style="{ background: previewItem?.dimColor, color: previewItem?.color, borderColor: previewItem?.color + '44' }">{{ previewItem?.tag }}</div>
              <p class="me-subject">{{ previewItem?.name }}</p>
              <p class="me-body">{{ previewItem?.desc }} This is a sample preview of the branded email that will be delivered to your customers with your company's branding and identity.</p>
              <div class="me-cta" :style="{ background: previewItem?.color }">View Details →</div>
              <p class="me-footer">© 2026 Globalgle Bank · Unsubscribe · Privacy Policy</p>
            </div>
            <div class="modal-actions">
              <button class="modal-btn-cancel" @click="previewOpen = false">Close</button>
              <button class="modal-btn-send" :style="{ background: previewItem?.color }" @click="sendTemplate(previewItem); previewOpen = false">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Send to Customers
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Recent Sends -->
    <div class="glass-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Recent Sends</h2>
          <p class="panel-sub">Latest emails dispatched to customers</p>
        </div>
      </div>
      <div class="sends-table-wrap">
        <table class="sends-table">
          <thead><tr>
            <th>Recipient</th><th>Template</th><th>Sent At</th><th>Status</th>
          </tr></thead>
          <tbody>
            <tr v-for="r in recentSends" :key="r.id">
              <td>
                <div class="recipient-cell">
                  <div class="avatar" :style="{ background: r.avatarBg }">{{ r.initials }}</div>
                  <div>
                    <p class="r-name">{{ r.name }}</p>
                    <p class="r-email">{{ r.email }}</p>
                  </div>
                </div>
              </td>
              <td><span class="r-template">{{ r.template }}</span></td>
              <td><span class="r-time">{{ r.time }}</span></td>
              <td><span :class="['r-status', `r-status--${r.status}`]">{{ r.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast.js'
const { success: toastSuccess } = useToast()

const activeTab   = ref('All')
const previewOpen = ref(false)
const previewItem = ref(null)

function previewTemplate(t) {
  previewItem.value = t
  previewOpen.value = true
}

function sendTemplate(t) {
  toastSuccess(`${t.name} Sent`, `Your branded email was dispatched to all eligible customers successfully.`)
}


const tabs = ['All', 'Transactional', 'Marketing', 'Alerts']

const templates = [
  { id:1, name:'Transaction Receipt',  desc:'Auto-sent after every debit or credit on a wallet.',      category:'Transactional', tag:'TXN',  color:'#22c55e', dimColor:'rgba(34,197,94,0.14)',   previewBg:'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.02))',  icon:'<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>' },
  { id:2, name:'Welcome Email',        desc:'Sent when a new customer onboards to the platform.',      category:'Transactional', tag:'NEW',  color:'#60a5fa', dimColor:'rgba(96,165,250,0.14)',  previewBg:'linear-gradient(135deg,rgba(96,165,250,0.08),rgba(96,165,250,0.02))', icon:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
  { id:3, name:'Promotional Offer',    desc:'Highlight loan offers, cashback and savings promos.',     category:'Marketing',     tag:'PROMO',color:'#fbbf24', dimColor:'rgba(251,191,36,0.14)',  previewBg:'linear-gradient(135deg,rgba(251,191,36,0.08),rgba(251,191,36,0.02))', icon:'<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/>' },
  { id:4, name:'Security Alert',       desc:'Notifies user of suspicious login or transaction.',       category:'Alerts',        tag:'SEC',  color:'#f87171', dimColor:'rgba(248,113,113,0.14)', previewBg:'linear-gradient(135deg,rgba(248,113,113,0.08),rgba(248,113,113,0.02))',icon:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { id:5, name:'Monthly Statement',    desc:'Summary of all transactions for the billing period.',     category:'Transactional', tag:'STMT', color:'#a78bfa', dimColor:'rgba(167,139,250,0.14)', previewBg:'linear-gradient(135deg,rgba(167,139,250,0.08),rgba(167,139,250,0.02))',icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
  { id:6, name:'Low Balance Nudge',    desc:'Reminds customer when wallet balance falls below limit.', category:'Alerts',        tag:'BAL',  color:'#fb923c', dimColor:'rgba(251,146,60,0.14)',  previewBg:'linear-gradient(135deg,rgba(251,146,60,0.08),rgba(251,146,60,0.02))',  icon:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
]

const filtered = computed(() =>
  activeTab.value === 'All' ? templates : templates.filter(t => t.category === activeTab.value)
)

const recentSends = [
  { id:1, name:'Emeka Johnson',  email:'emeka@example.com',  initials:'EJ', avatarBg:'rgba(34,197,94,0.2)',   template:'Transaction Receipt', time:'Today, 10:42 AM', status:'delivered' },
  { id:2, name:'Amara Obi',      email:'amara@example.com',  initials:'AO', avatarBg:'rgba(96,165,250,0.2)',  template:'Welcome Email',        time:'Today, 09:15 AM', status:'delivered' },
  { id:3, name:'Tunde Adeyemi',  email:'tunde@example.com',  initials:'TA', avatarBg:'rgba(251,191,36,0.2)', template:'Low Balance Nudge',    time:'Yesterday',       status:'opened'    },
  { id:4, name:'Chisom Eze',     email:'chisom@example.com', initials:'CE', avatarBg:'rgba(248,113,113,0.2)',template:'Security Alert',       time:'Yesterday',       status:'failed'    },
]
</script>

<style scoped>
.be-page { display:flex; flex-direction:column; gap:22px; }

/* Header */
.be-header { display:flex; align-items:flex-start; gap:16px; flex-wrap:wrap; }
.back-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; background:var(--glass); border:1px solid var(--border-soft); border-radius:9px; color:var(--t3); font-family:'Satoshi',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; flex-shrink:0; margin-top:4px; }
.back-btn:hover { color:var(--t1); border-color:var(--border); }
.be-title { font-size:1.4rem; font-weight:800; color:var(--t1); letter-spacing:-0.025em; margin:0 0 4px; }
.be-sub { font-size:0.8rem; color:var(--t3); margin:0; }
.header-meta { margin-left:auto; display:flex; gap:12px; }
.stat-pill { background:var(--glass); border:1px solid var(--border-soft); border-radius:12px; padding:12px 18px; display:flex; flex-direction:column; gap:2px; min-width:120px; }
.stat-pill__num { font-size:1.1rem; font-weight:800; color:var(--t1); }
.stat-pill__num.accent { color:var(--accent); }
.stat-pill__label { font-size:0.68rem; color:var(--t4); }

/* Tabs */
.filter-bar { display:flex; gap:4px; }
.ftab { font-family:'Satoshi',sans-serif; font-size:0.78rem; font-weight:500; color:var(--t3); background:var(--glass); border:1px solid var(--border-soft); padding:7px 16px; border-radius:9px; cursor:pointer; transition:all 0.2s ease; }
.ftab:hover { color:var(--t1); }
.ftab--active { color:var(--accent) !important; background:var(--accent-dim) !important; border-color:var(--accent-border) !important; font-weight:700; }

/* Template Grid */
.template-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }

.t-card { background:var(--glass); border:1px solid var(--border-soft); border-radius:16px; overflow:hidden; transition:border-color 0.22s ease, transform 0.18s ease; }
.t-card:hover { border-color:var(--border); transform:translateY(-2px); }

.t-preview { padding:22px 20px 16px; display:flex; align-items:center; justify-content:center; min-height:90px; }
.t-preview__inner { width:100%; display:flex; flex-direction:column; gap:7px; }
.t-preview__bar { height:8px; border-radius:4px; background:rgba(255,255,255,0.08); width:40%; }
.t-preview__line { height:5px; border-radius:3px; background:rgba(255,255,255,0.05); }
.t-preview__badge { align-self:flex-start; font-size:0.6rem; font-weight:800; padding:3px 8px; border-radius:999px; color:#fff; letter-spacing:0.06em; margin-top:4px; }

.t-info { padding:16px; display:flex; flex-direction:column; gap:10px; }
.t-info__top { display:flex; align-items:center; justify-content:space-between; }
.t-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
.t-badge { font-size:0.62rem; font-weight:700; padding:3px 8px; border-radius:999px; }
.t-badge--transactional { color:#22c55e; background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.25); }
.t-badge--marketing     { color:#fbbf24; background:rgba(251,191,36,0.12); border:1px solid rgba(251,191,36,0.25); }
.t-badge--alerts        { color:#f87171; background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.25); }

.t-name { font-size:0.9rem; font-weight:700; color:var(--t1); margin:0; }
.t-desc { font-size:0.74rem; color:var(--t3); line-height:1.5; margin:0; }
.t-actions { display:flex; gap:8px; }
.btn-preview { flex:1; padding:8px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:8px; color:var(--t3); font-family:'Satoshi',sans-serif; font-size:0.75rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; }
.btn-preview:hover { color:var(--t1); border-color:var(--border); }
.btn-send { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:8px; background:var(--accent-dim); border:1px solid var(--accent-border); border-radius:8px; color:var(--accent); font-family:'Satoshi',sans-serif; font-size:0.75rem; font-weight:700; cursor:pointer; transition:all 0.2s ease; }
.btn-send:hover { background:var(--accent); color:#fff; }

/* Recent Sends */
.glass-panel { background:var(--glass); border:1px solid var(--border-soft); border-radius:18px; padding:22px; }
.panel-head { margin-bottom:16px; }
.panel-title { font-size:0.95rem; font-weight:700; color:var(--t1); margin:0 0 3px; }
.panel-sub { font-size:0.72rem; color:var(--t4); margin:0; }
.sends-table { width:100%; border-collapse:collapse; }
.sends-table th { font-size:0.67rem; font-weight:600; color:var(--t4); text-transform:uppercase; letter-spacing:0.07em; padding:8px 12px; text-align:left; border-bottom:1px solid var(--border-soft); }
.sends-table td { padding:12px 12px; border-bottom:1px solid var(--border-soft); vertical-align:middle; }
.sends-table tr:last-child td { border-bottom:none; }
.recipient-cell { display:flex; align-items:center; gap:10px; }
.avatar { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:800; color:var(--t1); flex-shrink:0; }
.r-name { font-size:0.82rem; font-weight:600; color:var(--t1); margin:0; }
.r-email { font-size:0.68rem; color:var(--t4); margin:0; }
.r-template { font-size:0.78rem; color:var(--t2); }
.r-time { font-size:0.75rem; color:var(--t4); }
.r-status { font-size:0.65rem; font-weight:700; padding:3px 9px; border-radius:999px; }
.r-status--delivered { color:var(--accent); background:var(--accent-dim); border:1px solid var(--accent-border); }
.r-status--opened    { color:#60a5fa; background:rgba(96,165,250,0.12); border:1px solid rgba(96,165,250,0.25); }
.r-status--failed    { color:#f87171; background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.25); }
/* ══ TABLET (769px – 1024px) ══ */
@media (max-width: 1024px) and (min-width: 769px) {
  .template-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .header-meta   { gap: 10px; }
  .stat-pill     { min-width: 100px; padding: 10px 14px; }
}

/* ══ MOBILE (≤ 768px) ══ */
@media (max-width: 768px) {
  .be-page       { gap: 16px; }

  /* Header stacks vertically */
  .be-header     { flex-direction: column; align-items: flex-start; gap: 12px; }
  .header-meta   { margin-left: 0; width: 100%; }
  .stat-pill     { flex: 1; min-width: unset; padding: 10px 14px; }

  /* Filter tabs scroll horizontally */
  .filter-bar    { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; padding-bottom: 2px; }
  .ftab          { white-space: nowrap; flex-shrink: 0; }

  /* Template cards: 2-col on medium mobile */
  .template-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }

  /* Recent Sends table scrolls */
  .glass-panel   { padding: 16px; }
  .sends-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .sends-table   { min-width: 480px; }
}

/* ══ SMALL MOBILE (≤ 480px) ══ */
@media (max-width: 480px) {
  .template-grid { grid-template-columns: 1fr; gap: 10px; }
  .be-title      { font-size: 1.2rem; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .t-preview__bar,
[data-theme="light"] .t-preview__line { background: var(--border-soft); }

/* ── Preview Modal ── */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; }
.modal-box { background:var(--glass); border:1px solid var(--border-soft); border-radius:20px; width:100%; max-width:440px; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.4); }
.modal-top { display:flex; align-items:center; justify-content:space-between; padding:18px 20px 14px; border-bottom:1px solid var(--border-soft); }
.modal-title { font-size:0.95rem; font-weight:700; color:var(--t1); margin:0; }
.modal-close { background:none; border:none; cursor:pointer; color:var(--t3); display:flex; padding:4px; border-radius:6px; transition:color 0.2s; }
.modal-close:hover { color:var(--t1); }
.modal-email { margin:20px; border-radius:12px; border:1px solid var(--border-soft); border-top-width:3px; overflow:hidden; background:rgba(255,255,255,0.03); }
.me-header { display:flex; align-items:center; gap:10px; padding:14px 16px 10px; }
.me-logo { width:30px; height:30px; border-radius:8px; color:#fff; font-size:0.8rem; font-weight:900; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.me-brand { font-size:0.82rem; font-weight:700; color:var(--t1); margin:0 0 1px; }
.me-from { font-size:0.65rem; color:var(--t4); margin:0; }
.me-badge { display:inline-block; font-size:0.6rem; font-weight:800; padding:3px 9px; border-radius:999px; border:1px solid; margin:0 16px 10px; letter-spacing:0.06em; }
.me-subject { font-size:0.88rem; font-weight:700; color:var(--t1); margin:0 16px 8px; }
.me-body { font-size:0.75rem; color:var(--t3); line-height:1.6; margin:0 16px 16px; }
.me-cta { margin:0 16px 16px; padding:10px 16px; border-radius:8px; color:#fff; font-size:0.8rem; font-weight:700; text-align:center; cursor:pointer; }
.me-footer { font-size:0.62rem; color:var(--t4); text-align:center; padding:10px 16px 14px; border-top:1px solid var(--border-soft); }
.modal-actions { display:flex; gap:10px; padding:0 20px 20px; }
.modal-btn-cancel { flex:1; padding:10px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:10px; color:var(--t3); font-family:'Satoshi',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
.modal-btn-cancel:hover { color:var(--t1); }
.modal-btn-send { flex:2; display:flex; align-items:center; justify-content:center; gap:7px; padding:10px; border:none; border-radius:10px; color:#fff; font-family:'Satoshi',sans-serif; font-size:0.82rem; font-weight:700; cursor:pointer; opacity:0.92; transition:opacity 0.2s; }
.modal-btn-send:hover { opacity:1; }

.modal-enter-active, .modal-leave-active { transition:all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity:0; transform:scale(0.96); }

@media (max-width: 480px) {
  .modal-box { max-width:100%; border-radius:22px 22px 0 0; }
  .modal-overlay { align-items:flex-end; padding:0; }
}

[data-theme="light"] .modal-email { background: rgba(255,255,255,0.7); }
</style>
