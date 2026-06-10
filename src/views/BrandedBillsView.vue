<!-- src/views/BrandedBillsView.vue -->
<template>
  <div class="gen-page">

    <!-- Back -->
    <button class="back-btn" @click="$router.back()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      Back
    </button>

    <!-- Header -->
    <div class="gen-header">
      <h1 class="gen-title">Generator</h1>
      <p class="gen-sub">Fill in the details and generate branded documents.</p>
    </div>

    <!-- 3 Cards -->
    <div class="gen-grid">
      <div v-for="c in cards" :key="c.title" class="gen-card" @click="open(c)">
        <div class="gen-card__icon" :style="{ background: c.iconBg }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            :stroke="c.iconColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"
            v-html="c.icon"
          />
        </div>
        <h2 class="gen-card__title">{{ c.title }}</h2>
        <p class="gen-card__desc">{{ c.desc }}</p>
      </div>
    </div>

    <!-- Recently Generated -->
    <div class="recent-panel">
      <div class="recent-head">
        <div>
          <h2 class="recent-title">Recently Generated</h2>
          <p class="recent-sub">Documents created in the last 7 days</p>
        </div>
      </div>
      <div class="recent-list">
        <div v-for="d in recentDocs" :key="d.id" class="recent-item">
          <div class="recent-item__icon" :style="{ background: d.iconBg }">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" :stroke="d.iconColor" stroke-width="2" stroke-linecap="round" v-html="d.icon" />
          </div>
          <div class="recent-item__info">
            <span class="recent-item__name">{{ d.name }}</span>
            <span class="recent-item__meta">{{ d.type }} · {{ d.date }}</span>
          </div>
          <span class="recent-item__amount">{{ d.amount }}</span>
          <span :class="['recent-item__status', `ris--${d.status.toLowerCase()}`]">{{ d.status }}</span>
          <button class="recent-item__dl" title="Download">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <Transition name="modal">
      <div v-if="active" class="modal-backdrop" @click.self="active = null">
        <div class="modal-card">
          <div class="modal-head">
            <div class="modal-head__icon" :style="{ background: active.iconBg }">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" :stroke="active.iconColor" stroke-width="2" stroke-linecap="round" v-html="active.icon" />
            </div>
            <div class="modal-head__text">
              <h2 class="modal-title">{{ active.title }}</h2>
              <p class="modal-sub">{{ active.desc }}</p>
            </div>
            <button class="modal-close" @click="active = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-form">
            <div v-for="f in active.fields" :key="f.key" class="form-group">
              <label class="form-label">{{ f.label }}</label>
              <select v-if="f.type === 'select'" v-model="formData[f.key]" class="form-input">
                <option value="">{{ f.placeholder }}</option>
                <option v-for="o in f.options" :key="o">{{ o }}</option>
              </select>
              <input v-else v-model="formData[f.key]" :type="f.type" :placeholder="f.placeholder" class="form-input" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="active = null">Cancel</button>
            <button class="btn-generate" @click="active = null">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Generate & Send
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const active   = ref(null)
const formData = reactive({})

function open(card) {
  active.value = card
  Object.keys(formData).forEach(k => delete formData[k])
}

const recentDocs = [
  { id:1, name:'Emeka Johnson',  type:'Wallet Receipt',    date:'Jun 5',  amount:'$2,400.00', status:'Sent',     iconBg:'rgba(34,197,94,0.14)',   iconColor:'#22c55e', icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
  { id:2, name:'Amara Obi',      type:'Invoice / Bill',    date:'Jun 4',  amount:'$15,000.00',status:'Sent',     iconBg:'rgba(96,165,250,0.14)',  iconColor:'#60a5fa', icon:'<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>' },
  { id:3, name:'Tunde Adeyemi',  type:'Account Statement', date:'Jun 4',  amount:'—',         status:'Draft',    iconBg:'rgba(167,139,250,0.14)', iconColor:'#a78bfa', icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
  { id:4, name:'Chisom Eze',     type:'Wallet Receipt',    date:'Jun 3',  amount:'$500.00',   status:'Sent',     iconBg:'rgba(34,197,94,0.14)',   iconColor:'#22c55e', icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
  { id:5, name:'Ngozi Nwosu',    type:'Invoice / Bill',    date:'Jun 2',  amount:'$3,200.00', status:'Failed',   iconBg:'rgba(248,113,113,0.14)', iconColor:'#f87171', icon:'<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>' },
]

const cards = [
  {
    title:     'Wallet Receipt',
    desc:      'Fill in the details and generate a branded transaction receipt.',
    iconBg:    'rgba(34, 197, 94, 0.12)',
    iconColor: '#22c55e',
    icon:      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    fields: [
      { key:'customer', label:'Customer Name',    type:'text',   placeholder:'e.g. Emeka Johnson' },
      { key:'email',    label:'Email Address',    type:'email',  placeholder:'customer@email.com' },
      { key:'amount',   label:'Amount ($)',        type:'number', placeholder:'0.00'               },
      { key:'ref',      label:'Transaction Ref',  type:'text',   placeholder:'TXN-000000'         },
      { key:'date',     label:'Transaction Date', type:'date',   placeholder:''                   },
      { key:'note',     label:'Note (optional)',  type:'text',   placeholder:'Additional details…' },
    ],
  },
  {
    title:     'Invoice / Bill',
    desc:      'Generate a branded invoice or payment bill for your customer.',
    iconBg:    'rgba(96, 165, 250, 0.12)',
    iconColor: '#60a5fa',
    icon:      '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    fields: [
      { key:'customer', label:'Customer Name',  type:'text',   placeholder:'e.g. Amara Obi'     },
      { key:'email',    label:'Email Address',  type:'email',  placeholder:'customer@email.com' },
      { key:'type',     label:'Bill Type',      type:'select', placeholder:'Select type',
        options:['Service Fee','Loan Repayment','Subscription','Transfer Fee','Other'] },
      { key:'amount',   label:'Amount ($)',      type:'number', placeholder:'0.00'               },
      { key:'due',      label:'Due Date',        type:'date',   placeholder:''                   },
      { key:'note',     label:'Note (optional)', type:'text',  placeholder:'Invoice details…'   },
    ],
  },
  {
    title:     'Account Statement',
    desc:      'Generate a branded account statement for any chosen period.',
    iconBg:    'rgba(167, 139, 250, 0.12)',
    iconColor: '#a78bfa',
    icon:      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="10" y1="9" x2="8" y2="9"/>',
    fields: [
      { key:'customer', label:'Customer Name',   type:'text',  placeholder:'e.g. Tunde Adeyemi' },
      { key:'email',    label:'Email Address',   type:'email', placeholder:'customer@email.com' },
      { key:'account',  label:'Account Number',  type:'text',  placeholder:'0000000000'         },
      { key:'from',     label:'Period From',      type:'date',  placeholder:''                   },
      { key:'to',       label:'Period To',        type:'date',  placeholder:''                   },
      { key:'note',     label:'Note (optional)', type:'text',  placeholder:'Statement note…'    },
    ],
  },
]
</script>

<style scoped>
.gen-page { display:flex; flex-direction:column; gap:24px; }

.back-btn {
  align-self: flex-start;
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  background: var(--glass); border: 1px solid var(--border-soft); border-radius: 9px;
  color: var(--t3); font-family: 'Satoshi', sans-serif; font-size: 0.78rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.back-btn:hover { color: var(--t1); border-color: var(--border); }

.gen-header { display: flex; flex-direction: column; gap: 5px; }
.gen-title { font-size: 1.5rem; font-weight: 800; color: var(--t1); letter-spacing: -0.025em; margin: 0; }
.gen-sub   { font-size: 0.82rem; color: var(--t3); margin: 0; }

/* 3-column grid — same as Email Services */
.gen-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

.gen-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  padding: 28px 26px 30px;
  display: flex; flex-direction: column; gap: 14px;
  cursor: pointer;
  transition: border-color 0.22s ease, transform 0.18s ease;
}
.gen-card:hover { border-color: var(--border); transform: translateY(-3px); }

.gen-card__icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.gen-card__title { font-size: 1rem; font-weight: 700; color: var(--t1); margin: 0; }
.gen-card__desc  { font-size: 0.8rem; color: var(--accent); line-height: 1.55; margin: 0; }

/* ── Recent Panel ── */
.recent-panel { background:var(--glass); backdrop-filter:blur(20px) saturate(180%); border:1px solid var(--border-soft); border-radius:18px; padding:20px 22px; }
.recent-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
.recent-title { font-size:0.95rem; font-weight:700; color:var(--t1); margin:0 0 3px; }
.recent-sub { font-size:0.72rem; color:var(--t4); margin:0; }
.recent-list { display:flex; flex-direction:column; gap:4px; }
.recent-item { display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:10px; transition:background 0.18s; }
.recent-item:hover { background:var(--glass-2); }
.recent-item__icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.recent-item__info { flex:1; display:flex; flex-direction:column; gap:2px; }
.recent-item__name { font-size:0.82rem; font-weight:600; color:var(--t1); }
.recent-item__meta { font-size:0.68rem; color:var(--t4); }
.recent-item__amount { font-size:0.84rem; font-weight:700; color:var(--t1); white-space:nowrap; }
.recent-item__status { font-size:0.65rem; font-weight:700; padding:3px 9px; border-radius:999px; }
.ris--sent   { color:#22c55e; background:var(--accent-dim); border:1px solid var(--accent-border); }
.ris--draft  { color:#94a3b8; background:rgba(148,163,184,0.12); border:1px solid rgba(148,163,184,0.22); }
.ris--failed { color:#f87171; background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.28); }
.recent-item__dl { width:28px; height:28px; border-radius:7px; background:var(--accent-dim); border:1px solid var(--accent-border); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; flex-shrink:0; }
.recent-item__dl:hover { background:var(--accent); }
.recent-item__dl:hover svg { stroke:#fff; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 10000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
}
.modal-card {
  background: var(--modal-glass); backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--modal-border); border-radius: 22px;
  padding: 28px; width: 100%; max-width: 520px;
  display: flex; flex-direction: column; gap: 20px;
}
.modal-head { display: flex; align-items: flex-start; gap: 12px; }
.modal-head__icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-head__text { flex: 1; }
.modal-title { font-size: 1rem; font-weight: 700; color: var(--t1); margin: 0 0 3px; }
.modal-sub   { font-size: 0.74rem; color: var(--t3); margin: 0; }
.modal-close { width: 30px; height: 30px; border-radius: 8px; background: var(--glass-2); border: 1px solid var(--border-soft); color: var(--t3); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s ease; }
.modal-close:hover { color: var(--t1); }

.modal-form { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.68rem; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: 0.06em; }
.form-input {
  background: var(--modal-input); border: 1px solid var(--border-soft); border-radius: 9px;
  padding: 10px 13px; color: var(--t1); font-family: 'Satoshi', sans-serif; font-size: 0.82rem;
  outline: none; transition: border-color 0.2s ease; width: 100%;
}
.form-input::placeholder { color: var(--t4); }
.form-input:focus { border-color: var(--accent-border); }
.form-input option { background: #0c0d1f; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 6px; border-top: 1px solid var(--border-soft); }
.btn-cancel   { padding: 9px 20px; background: var(--glass-2); border: 1px solid var(--border-soft); border-radius: 9px; color: var(--t3); font-family: 'Satoshi', sans-serif; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.btn-cancel:hover { color: var(--t1); }
.btn-generate { display: flex; align-items: center; gap: 7px; padding: 9px 22px; background: var(--accent); border: none; border-radius: 9px; color: #fff; font-family: 'Satoshi', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: opacity 0.2s ease; }
.btn-generate:hover { opacity: 0.88; }

.modal-enter-active { transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1); }
.modal-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.modal-enter-from   { opacity: 0; transform: scale(0.9) translateY(16px); }
.modal-leave-to     { opacity: 0; transform: scale(0.96); }
/* ── Tablet ── */
@media (max-width: 1024px) and (min-width: 769px) {
  .gen-grid   { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .modal-card { max-width: 480px; margin: 0 24px; }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .gen-page       { gap: 18px; }
  .gen-title      { font-size: 1.3rem; }
  .gen-grid       { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .gen-card       { padding: 20px 18px 22px; gap: 10px; }
  .modal-backdrop { align-items: flex-end; padding: 0; }
  .modal-card     { max-width: 100%; border-radius: 22px 22px 0 0; max-height: 90vh; overflow-y: auto; margin: 0; }
  .modal-form     { grid-template-columns: 1fr; gap: 10px; }
  .recent-item__amount { display: none; }
}

/* ── Small Mobile ── */
@media (max-width: 480px) {
  .gen-grid    { grid-template-columns: 1fr; gap: 10px; }
  .gen-title   { font-size: 1.15rem; }
  .gen-card    { padding: 18px 16px 20px; }
  .recent-item { padding: 10px 8px; gap: 8px; }
  .recent-item__status { display: none; }
}
</style>
