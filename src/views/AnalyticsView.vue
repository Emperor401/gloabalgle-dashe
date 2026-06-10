<!-- src/views/AnalyticsView.vue  →  Websites -->
<template>
  <div class="websites-page">

    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Websites</h1>
      <p class="page-sub">Launch and manage the sites you offer your own customers.</p>
    </div>

    <!-- Service Cards -->
    <div class="sites-grid">
      <div v-for="s in sites" :key="s.title" class="site-card" @click="openLaunch(s)">
        <div class="site-card__icon" :style="{ background: s.iconBg }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="s.iconColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="s.icon" />
        </div>
        <h2 class="site-card__title">{{ s.title }}</h2>
        <p class="site-card__desc">{{ s.desc }}</p>
        <span class="site-card__badge" :style="{ color: s.badgeColor, background: s.badgeBg, border: `1px solid ${s.badgeBorder}` }">{{ s.badge }}</span>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div v-for="st in stats" :key="st.label" class="stat-chip">
        <div class="stat-chip__icon" :style="{ background: st.dimColor }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="st.color" stroke-width="2" stroke-linecap="round" v-html="st.icon" />
        </div>
        <div class="stat-chip__body">
          <span class="stat-chip__val" :style="{ color: st.color }">{{ st.value }}</span>
          <span class="stat-chip__label">{{ st.label }}</span>
        </div>
      </div>
    </div>

    <!-- Deployed Sites -->
    <div class="glass-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Deployed Sites</h2>
          <p class="panel-sub">Your live and staging websites</p>
        </div>
        <button class="btn-new-site" @click="openLaunch(sites[0])">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Site
        </button>
      </div>

      <div class="deployed-list">
        <div v-for="site in deployedSites" :key="site.id" class="deployed-item">
          <div class="deployed-item__icon" :style="{ background: site.iconBg }">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="site.iconColor" stroke-width="2" stroke-linecap="round" v-html="site.icon" />
          </div>
          <div class="deployed-item__info">
            <div class="deployed-item__top">
              <span class="deployed-item__name">{{ site.name }}</span>
              <span :class="['d-status', `d-status--${site.status.toLowerCase()}`]">
                <span class="d-dot" />{{ site.status }}
              </span>
            </div>
            <a class="deployed-item__url" href="#">{{ site.url }}</a>
          </div>
          <div class="deployed-item__meta">
            <span class="meta-visitors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              {{ site.visitors }}
            </span>
            <span class="meta-date">{{ site.launched }}</span>
          </div>
          <div class="deployed-item__acts">
            <button class="d-btn" title="Visit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
            <button class="d-btn" title="Settings">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Launch Modal -->
    <Transition name="modal">
      <div v-if="launching" class="modal-backdrop" @click.self="launching = null">
        <div class="launch-modal">
          <div class="launch-modal__head">
            <div class="launch-modal__icon" :style="{ background: launching.iconBg }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="launching.iconColor" stroke-width="2" stroke-linecap="round" v-html="launching.icon" />
            </div>
            <div>
              <h3 class="launch-modal__title">{{ launching.title }}</h3>
              <p class="launch-modal__sub">{{ launching.desc }}</p>
            </div>
            <button class="modal-close" @click="launching = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="launch-form">
            <div class="form-group"><label class="form-label">Site Name</label><input type="text" placeholder="e.g. My Banking Portal" class="form-input" /></div>
            <div class="form-group"><label class="form-label">Subdomain</label><div class="subdomain-wrap"><input type="text" placeholder="mybank" class="form-input subdomain-input" /><span class="subdomain-suffix">.globalgle.com</span></div></div>
            <div class="form-group"><label class="form-label">Theme</label>
              <div class="theme-picker">
                <div v-for="t in themes" :key="t" class="theme-dot" :style="{ background: t }" :class="{ 'theme-dot--active': selectedTheme === t }" @click="selectedTheme = t" />
              </div>
            </div>
            <div class="form-group"><label class="form-label">Plan</label>
              <select class="form-input"><option>Starter — Free</option><option>Pro — $29/mo</option><option>Business — $79/mo</option></select>
            </div>
          </div>
          <div class="launch-footer">
            <button class="btn-cancel" @click="launching = null">Cancel</button>
            <button class="btn-launch" @click="launching = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="5 12 12 5 19 12"/><polyline points="5 19 12 12 19 19"/></svg>
              Launch Site
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const launching     = ref(null)
const selectedTheme = ref('#22c55e')
const themes        = ['#22c55e','#60a5fa','#a78bfa','#f472b6','#fbbf24','#f87171']

function openLaunch(s) { launching.value = s }

const sites = [
  { title:'Support Pages',  desc:'Create a branded help & support page.',    badge:'Ready',  badgeColor:'#22c55e', badgeBg:'rgba(34,197,94,0.12)',  badgeBorder:'rgba(34,197,94,0.25)',  iconBg:'rgba(34,197,94,0.12)',  iconColor:'#22c55e', icon:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="#22c55e"/>' },
  { title:'Online Banking',  desc:'Spin up your own online banking site.',    badge:'Popular',badgeColor:'#60a5fa', badgeBg:'rgba(96,165,250,0.12)', badgeBorder:'rgba(96,165,250,0.25)', iconBg:'rgba(34,197,94,0.12)',  iconColor:'#22c55e', icon:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>' },
  { title:'Broker',          desc:'Launch your own trading / broker platform.',badge:'New',   badgeColor:'#fbbf24', badgeBg:'rgba(251,191,36,0.12)', badgeBorder:'rgba(251,191,36,0.25)', iconBg:'rgba(34,197,94,0.12)',  iconColor:'#22c55e', icon:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { title:'Tracking Pages',  desc:'Create package tracking pages.',           badge:'Beta',   badgeColor:'#a78bfa', badgeBg:'rgba(167,139,250,0.12)',badgeBorder:'rgba(167,139,250,0.25)',iconBg:'rgba(34,197,94,0.12)',  iconColor:'#22c55e', icon:'<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
]

const stats = [
  { label:'Total Sites',     value:'4',      color:'#22c55e', dimColor:'rgba(34,197,94,0.12)',   icon:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  { label:'Live Sites',      value:'2',      color:'#60a5fa', dimColor:'rgba(96,165,250,0.12)',  icon:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { label:'Pending Setup',   value:'1',      color:'#fbbf24', dimColor:'rgba(251,191,36,0.12)', icon:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
  { label:'Monthly Visitors',value:'24.3K',  color:'#a78bfa', dimColor:'rgba(167,139,250,0.12)',icon:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
]

const deployedSites = [
  { id:1, name:'Globalgle Support Hub',  url:'support.globalgle.com',  status:'Live',    iconBg:'rgba(34,197,94,0.14)',  iconColor:'#22c55e', icon:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>',  visitors:'8.2K', launched:'May 12, 2026' },
  { id:2, name:'G-Bank Online Portal',   url:'banking.globalgle.com',  status:'Live',    iconBg:'rgba(96,165,250,0.14)', iconColor:'#60a5fa', icon:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>', visitors:'16.1K',launched:'Apr 3, 2026'  },
  { id:3, name:'TradeDesk Broker Alpha', url:'broker.globalgle.com',   status:'Staging', iconBg:'rgba(251,191,36,0.14)', iconColor:'#fbbf24', icon:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',                                   visitors:'—',    launched:'Jun 1, 2026'  },
]
</script>

<style scoped>
.websites-page { display:flex; flex-direction:column; gap:22px; }

.page-header { display:flex; flex-direction:column; gap:5px; }
.page-title { font-size:1.5rem; font-weight:800; color:var(--t1); letter-spacing:-0.025em; margin:0; }
.page-sub   { font-size:0.82rem; color:var(--t3); margin:0; }

/* Service cards */
.sites-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.site-card { background:var(--glass); backdrop-filter:blur(20px) saturate(180%); border:1px solid var(--border-soft); border-radius:18px; padding:26px 24px 28px; display:flex; flex-direction:column; gap:12px; cursor:pointer; transition:border-color 0.22s, transform 0.18s; position:relative; }
.site-card:hover { border-color:var(--border); transform:translateY(-3px); }
.site-card__icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.site-card__title { font-size:1rem; font-weight:700; color:var(--t1); margin:0; }
.site-card__desc  { font-size:0.8rem; color:var(--accent); line-height:1.55; margin:0; flex:1; }
.site-card__badge { align-self:flex-start; font-size:0.62rem; font-weight:700; padding:3px 9px; border-radius:999px; }

/* Stats row */
.stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.stat-chip { background:var(--glass); border:1px solid var(--border-soft); border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:12px; }
.stat-chip__icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.stat-chip__body { display:flex; flex-direction:column; gap:2px; }
.stat-chip__val   { font-size:1.05rem; font-weight:800; }
.stat-chip__label { font-size:0.68rem; color:var(--t4); }

/* Deployed panel */
.glass-panel { background:var(--glass); backdrop-filter:blur(20px) saturate(180%); border:1px solid var(--border-soft); border-radius:18px; padding:22px; }
.panel-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:18px; }
.panel-title { font-size:0.95rem; font-weight:700; color:var(--t1); margin:0 0 3px; }
.panel-sub { font-size:0.72rem; color:var(--t4); margin:0; }
.btn-new-site { display:flex; align-items:center; gap:6px; padding:8px 16px; background:var(--accent-dim); border:1px solid var(--accent-border); border-radius:9px; color:var(--accent); font-family:'Satoshi',sans-serif; font-size:0.78rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
.btn-new-site:hover { background:var(--accent); color:#fff; }

.deployed-list { display:flex; flex-direction:column; gap:4px; }
.deployed-item { display:flex; align-items:center; gap:14px; padding:12px 14px; border-radius:12px; transition:background 0.18s; }
.deployed-item:hover { background:var(--glass-2); }
.deployed-item__icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.deployed-item__info { flex:1; display:flex; flex-direction:column; gap:3px; }
.deployed-item__top { display:flex; align-items:center; gap:10px; }
.deployed-item__name { font-size:0.85rem; font-weight:600; color:var(--t1); }
.deployed-item__url { font-size:0.72rem; color:var(--accent); text-decoration:none; }
.deployed-item__url:hover { text-decoration:underline; }
.deployed-item__meta { display:flex; flex-direction:column; align-items:flex-end; gap:3px; }
.meta-visitors { display:flex; align-items:center; gap:5px; font-size:0.72rem; color:var(--t3); }
.meta-date { font-size:0.68rem; color:var(--t4); }
.deployed-item__acts { display:flex; gap:6px; }
.d-btn { width:28px; height:28px; border-radius:7px; background:var(--glass-2); border:1px solid var(--border-soft); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; }
.d-btn:hover { border-color:var(--border); }

.d-status { display:inline-flex; align-items:center; gap:5px; font-size:0.62rem; font-weight:700; padding:2px 8px; border-radius:999px; }
.d-dot { width:5px; height:5px; border-radius:50%; }
.d-status--live { color:#22c55e; background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.25); }
.d-status--live .d-dot { background:#22c55e; }
.d-status--staging { color:#fbbf24; background:rgba(251,191,36,0.12); border:1px solid rgba(251,191,36,0.28); }
.d-status--staging .d-dot { background:#fbbf24; }

/* Launch Modal */
.modal-backdrop { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.5); backdrop-filter:blur(6px); }
.launch-modal { background:var(--modal-glass); backdrop-filter:blur(24px) saturate(180%); border:1px solid var(--modal-border); border-radius:22px; padding:28px; width:100%; max-width:480px; display:flex; flex-direction:column; gap:20px; }
.launch-modal__head { display:flex; align-items:flex-start; gap:12px; }
.launch-modal__icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.launch-modal__title { font-size:1rem; font-weight:700; color:var(--t1); margin:0 0 3px; }
.launch-modal__sub { font-size:0.74rem; color:var(--t3); margin:0; }
.modal-close { margin-left:auto; width:28px; height:28px; border-radius:7px; background:var(--glass-2); border:1px solid var(--border-soft); color:var(--t3); display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:all 0.2s; }
.modal-close:hover { color:var(--t1); }
.launch-form { display:flex; flex-direction:column; gap:14px; }
.form-group { display:flex; flex-direction:column; gap:6px; }
.form-label { font-size:0.68rem; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:0.06em; }
.form-input { background:var(--glass-2); border:1px solid var(--border-soft); border-radius:9px; padding:10px 13px; color:var(--t1); font-family:'Satoshi',sans-serif; font-size:0.82rem; outline:none; transition:border-color 0.2s; width:100%; }
.form-input:focus { border-color:var(--accent-border); }
.form-input::placeholder { color:var(--t4); }
.form-input option { background:#0c0d1f; }
.subdomain-wrap { display:flex; align-items:center; gap:0; }
.subdomain-input { border-radius:9px 0 0 9px !important; flex:1; }
.subdomain-suffix { background:var(--glass-2); border:1px solid var(--border-soft); border-left:none; border-radius:0 9px 9px 0; padding:10px 12px; font-size:0.78rem; color:var(--t3); white-space:nowrap; }
.theme-picker { display:flex; gap:8px; padding:4px 0; }
.theme-dot { width:24px; height:24px; border-radius:50%; cursor:pointer; transition:transform 0.18s; border:2px solid transparent; }
.theme-dot:hover { transform:scale(1.15); }
.theme-dot--active { border-color:#fff; transform:scale(1.2); }
.launch-footer { display:flex; justify-content:flex-end; gap:10px; padding-top:6px; border-top:1px solid var(--border-soft); }
.btn-cancel { padding:9px 20px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:9px; color:var(--t3); font-family:'Satoshi',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
.btn-cancel:hover { color:var(--t1); }
.btn-launch { display:flex; align-items:center; gap:7px; padding:9px 22px; background:var(--accent); border:none; border-radius:9px; color:#fff; font-family:'Satoshi',sans-serif; font-size:0.82rem; font-weight:700; cursor:pointer; transition:opacity 0.2s; }
.btn-launch:hover { opacity:0.88; }

.modal-enter-active { transition:opacity 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1); }
.modal-leave-active { transition:opacity 0.18s ease, transform 0.18s ease; }
.modal-enter-from { opacity:0; transform:scale(0.9) translateY(12px); }
.modal-leave-to { opacity:0; transform:scale(0.96); }

@media (max-width: 1024px) and (min-width: 769px) {
  .sites-grid  { grid-template-columns: 1fr 1fr; gap: 14px; }
  .stats-row   { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .panel-head  { flex-wrap: wrap; gap: 10px; }
}
@media (max-width: 768px) {
  .sites-grid  { grid-template-columns: 1fr 1fr; gap: 12px; }
  .stats-row   { grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-chip   { padding: 12px 14px; }
  .panel-head  { flex-direction: column; align-items: flex-start; gap: 10px; }
  .btn-new-site { width: 100%; justify-content: center; }
  .deployed-item { flex-wrap: wrap; gap: 10px; }
  .deployed-item__meta { align-items: flex-start; }
  .launch-modal { padding: 20px; border-radius: 18px; margin: 12px; }
  .modal-backdrop { padding: 12px; align-items: flex-end; }
}
@media (max-width: 480px) {
  .sites-grid { grid-template-columns: 1fr; }
  .stats-row  { grid-template-columns: 1fr; }
}
</style>

