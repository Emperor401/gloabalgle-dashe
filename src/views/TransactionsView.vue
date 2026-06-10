<!-- src/views/TransactionsView.vue -->
<template>
  <div class="transactions">

    <!-- KPI Cards -->
    <div class="kpi-row">
      <div v-for="k in kpis" :key="k.label" class="kpi-card" :style="{ background: k.bg, borderColor: k.border }">
        <div class="kpi-card__icon" :style="{ background: k.iconBg }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="k.color" stroke-width="1.8" stroke-linecap="round" v-html="k.icon" />
        </div>
        <div class="kpi-card__body">
          <span class="kpi-card__label">{{ k.label }}</span>
          <span class="kpi-card__value">{{ k.value }}</span>
        </div>
        <span class="kpi-card__trend" :style="{ color: k.up ? '#22c55e' : '#f87171' }">
          {{ k.up ? '↑' : '↓' }} {{ k.pct }}
        </span>
      </div>
    </div>

    <!-- Table Panel -->
    <div class="txn-panel">

      <!-- Panel Header -->
      <div class="panel-header">
        <div>
          <h2 class="panel-title">All Transactions</h2>
          <p class="panel-sub">Complete transaction history</p>
        </div>
        <div class="panel-controls">
          <!-- Date filter -->
          <div class="date-tabs">
            <button v-for="d in dateFilters" :key="d"
              :class="['dtab', { 'dtab--active': activeDateFilter === d }]"
              @click="activeDateFilter = d">{{ d }}</button>
          </div>
          <!-- Search -->
          <div class="search-box">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="searchQuery" type="text" placeholder="Search transactions…" class="search-input" />
          </div>
          <!-- Status filter -->
          <div class="filter-tabs">
            <button v-for="tab in tabs" :key="tab"
              :class="['ftab', { 'ftab--active': activeTab === tab }]"
              @click="activeTab = tab">{{ tab }}</button>
          </div>
          <!-- Export -->
          <button class="btn-export" @click="exportCSV">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table class="txn-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in paginatedTransactions" :key="t.id" :class="['txn-row', { 'txn-row--flagged': flagged.has(t.id) }]">
              <td><span class="txn-id">{{ t.id }}</span></td>
              <td>
                <div class="cust-cell">
                  <img :src="t.avatar" :alt="t.customer" class="cust-avatar" />
                  <span class="cust-name">{{ t.customer }}</span>
                </div>
              </td>
              <td><span class="txn-type">{{ t.type }}</span></td>
              <td><span :class="['txn-amount', t.direction === 'credit' ? 'txn-amount--pos' : 'txn-amount--neg']">{{ t.amount }}</span></td>
              <td><span class="txn-date">{{ t.date }}</span></td>
              <td>
                <span :class="['status-badge', `status-badge--${t.status.toLowerCase()}`]">
                  <span class="s-dot" />{{ t.status }}
                </span>
              </td>
              <td>
                <div class="row-acts">
                  <button class="act-btn act-btn--view" title="View" @click="viewing = t">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <div class="more-wrap">
                    <button class="act-btn act-btn--more" title="More" @click.stop="toggleMenu(t.id)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="5" r="1" fill="var(--t3)"/><circle cx="12" cy="12" r="1" fill="var(--t3)"/><circle cx="12" cy="19" r="1" fill="var(--t3)"/></svg>
                    </button>
                    <Transition name="menu-pop">
                      <div v-if="activeMenu === t.id" class="row-menu" @click.stop>
                        <button class="row-menu__item" @click="viewing = t; activeMenu = null">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          View Details
                        </button>
                        <button class="row-menu__item" @click="downloadReceipt(t); activeMenu = null">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Download Receipt
                        </button>
                        <button class="row-menu__item row-menu__item--danger" @click="flagTransaction(t); activeMenu = null">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                          Flag Transaction
                        </button>
                      </div>
                    </Transition>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredTransactions.length === 0" class="empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>No transactions found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span class="pagination__info">Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredTransactions.length }}</span>
        <div class="pagination__btns">
          <button class="page-btn" :disabled="page === 1" @click="page--">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button v-for="p in totalPages" :key="p" :class="['page-num', { 'page-num--active': p === page }]" @click="page = p">{{ p }}</button>
          <button class="page-btn" :disabled="page === totalPages" @click="page++">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast-slide">
      <div v-if="toast.show" class="txn-toast" :class="`txn-toast--${toast.type}`">
        <svg v-if="toast.type === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Transaction Detail Modal -->
    <Transition name="modal">
      <div v-if="viewing" class="modal-backdrop" @click.self="viewing = null">
        <div class="detail-modal">
          <div class="detail-modal__head">
            <h3 class="detail-modal__title">Transaction Details</h3>
            <button class="modal-close" @click="viewing = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="detail-grid">
            <div v-for="f in detailFields" :key="f.label" class="detail-item">
              <span class="detail-item__label">{{ f.label }}</span>
              <span class="detail-item__val" :class="f.cls">{{ f.value }}</span>
            </div>
          </div>
          <div class="detail-actions">
            <button class="btn-receipt" @click="downloadReceipt(viewing)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Receipt
            </button>
            <button class="btn-flag" @click="flagTransaction(viewing)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              Flag Transaction
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { transactions as txnData } from '../data/mockData.js'

const searchQuery      = ref('')
const activeTab        = ref('All')
const activeDateFilter = ref('All Time')
const page             = ref(1)
const perPage          = 5
const viewing          = ref(null)
const activeMenu       = ref(null)
const flagged          = ref(new Set())

const tabs        = ['All', 'Completed', 'Pending', 'Failed']
const dateFilters = ['Today', 'This Week', 'This Month', 'All Time']

const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
  clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

const kpis = [
  { label:'Total Volume',  value:'$24,850', pct:'8.2%', up:true,  color:'#22c55e', iconBg:'rgba(34,197,94,0.18)',   border:'rgba(34,197,94,0.25)',   bg:'linear-gradient(135deg,rgba(34,197,94,0.16) 0%,rgba(20,83,45,0.32) 100%)',  icon:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { label:'Completed',     value:'6',       pct:'2.1%', up:true,  color:'#60a5fa', iconBg:'rgba(96,165,250,0.18)',  border:'rgba(96,165,250,0.25)',  bg:'linear-gradient(135deg,rgba(96,165,250,0.14) 0%,rgba(30,58,138,0.32) 100%)', icon:'<polyline points="20 6 9 17 4 12"/>' },
  { label:'Failed',        value:'1',       pct:'0.5%', up:false, color:'#f87171', iconBg:'rgba(248,113,113,0.18)', border:'rgba(248,113,113,0.25)', bg:'linear-gradient(135deg,rgba(248,113,113,0.14) 0%,rgba(80,20,20,0.32) 100%)',  icon:'<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' },
  { label:'Pending',       value:'1',       pct:'1.3%', up:false, color:'#fbbf24', iconBg:'rgba(251,191,36,0.18)',  border:'rgba(251,191,36,0.25)',  bg:'linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(80,55,10,0.32) 100%)',  icon:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
]

// Date filter helpers — today is treated as the reference point
function parseTxnDate(str) { return new Date(str) }
const now = new Date()
const todayStr = now.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })

const filteredTransactions = computed(() => {
  let list = txnData

  // Date filter
  if (activeDateFilter.value === 'Today') {
    list = list.filter(t => {
      const d = parseTxnDate(t.date)
      return d.getFullYear() === now.getFullYear() &&
             d.getMonth()    === now.getMonth()    &&
             d.getDate()     === now.getDate()
    })
  } else if (activeDateFilter.value === 'This Week') {
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
    list = list.filter(t => parseTxnDate(t.date) >= weekAgo)
  } else if (activeDateFilter.value === 'This Month') {
    list = list.filter(t => {
      const d = parseTxnDate(t.date)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
  }

  // Status filter
  if (activeTab.value !== 'All') list = list.filter(t => t.status === activeTab.value)

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t =>
      t.customer.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    )
  }
  return list
})

// Reset to page 1 whenever filters change
watch([searchQuery, activeTab, activeDateFilter], () => { page.value = 1 })

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / perPage) || 1)
const pageStart  = computed(() => filteredTransactions.value.length === 0 ? 0 : (page.value - 1) * perPage + 1)
const pageEnd    = computed(() => Math.min(page.value * perPage, filteredTransactions.value.length))

const paginatedTransactions = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredTransactions.value.slice(start, start + perPage)
})

const detailFields = computed(() => {
  if (!viewing.value) return []
  const t = viewing.value
  return [
    { label:'Transaction ID', value: t.id,       cls: 'val--id'  },
    { label:'Customer',       value: t.customer,  cls: ''         },
    { label:'Type',           value: t.type,      cls: ''         },
    { label:'Amount',         value: t.amount,    cls: t.direction === 'credit' ? 'val--pos' : 'val--neg' },
    { label:'Date',           value: t.date,      cls: ''         },
    { label:'Status',         value: t.status,    cls: `val--${t.status.toLowerCase()}` },
  ]
})

function toggleMenu(id) {
  activeMenu.value = activeMenu.value === id ? null : id
}

// Close menu on outside click
function onDocClick() { activeMenu.value = null }
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

function downloadReceipt(t) {
  if (!t) return
  const lines = [
    '=============================',
    '       GLOBALGLE RECEIPT     ',
    '=============================',
    `Transaction ID : ${t.id}`,
    `Customer       : ${t.customer}`,
    `Type           : ${t.type}`,
    `Amount         : ${t.amount}`,
    `Date           : ${t.date}`,
    `Status         : ${t.status}`,
    '=============================',
    'Thank you for using Globalgle',
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `receipt-${t.id}.txt`
  a.click()
  showToast(`Receipt for ${t.id} downloaded`)
}

function flagTransaction(t) {
  if (!t) return
  if (flagged.value.has(t.id)) {
    flagged.value.delete(t.id)
    showToast(`${t.id} unflagged`, 'flag')
  } else {
    flagged.value.add(t.id)
    showToast(`${t.id} flagged for review`, 'flag')
  }
}

function exportCSV() {
  const headers = ['ID,Customer,Type,Amount,Date,Status']
  const rows = filteredTransactions.value.map(t =>
    `${t.id},${t.customer},${t.type},"${t.amount}",${t.date},${t.status}`
  )
  const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `globalgle-transactions-${activeDateFilter.value.replace(/\s/g,'-').toLowerCase()}.csv`
  a.click()
  showToast(`Exported ${filteredTransactions.value.length} transactions`)
}
</script>

<style scoped>
.transactions { display:flex; flex-direction:column; gap:20px; }

/* KPI */
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.kpi-card { border:1px solid; border-radius:16px; padding:18px 20px; display:flex; align-items:center; gap:14px; transition:opacity 0.2s; }
.kpi-card:hover { opacity:0.9; }
.kpi-card__icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.kpi-card__body { flex:1; display:flex; flex-direction:column; gap:2px; }
.kpi-card__label { font-size:0.7rem; color:var(--t2); }
.kpi-card__value { font-size:1.1rem; font-weight:800; color:var(--t1); letter-spacing:-0.02em; }
.kpi-card__trend { font-size:0.7rem; font-weight:700; flex-shrink:0; }

/* Panel */
.txn-panel { background:var(--glass); backdrop-filter:blur(20px) saturate(180%); border:1px solid var(--border-soft); border-radius:20px; padding:24px; display:flex; flex-direction:column; gap:20px; }

.panel-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.panel-title { font-size:1rem; font-weight:700; color:var(--t1); margin:0 0 3px; }
.panel-sub { font-size:0.72rem; color:var(--t4); margin:0; }
.panel-controls { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }

.date-tabs { display:flex; gap:3px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:9px; padding:3px; }
.dtab { font-family:'Satoshi',sans-serif; font-size:0.72rem; color:var(--t3); background:transparent; border:none; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s; }
.dtab:hover { color:var(--t1); }
.dtab--active { color:var(--t1) !important; background:var(--glass-hover) !important; font-weight:700; }

.search-box { display:flex; align-items:center; gap:7px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:9px; padding:7px 11px; width:190px; transition:border-color 0.2s; }
.search-box:focus-within { border-color:var(--accent-border); }
.search-input { background:none; border:none; outline:none; font-family:'Satoshi',sans-serif; font-size:0.8rem; color:var(--t1); width:100%; }
.search-input::placeholder { color:var(--t4); }

.filter-tabs { display:flex; gap:2px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:9px; padding:3px; }
.ftab { font-family:'Satoshi',sans-serif; font-size:0.74rem; color:var(--t3); background:transparent; border:none; padding:5px 11px; border-radius:6px; cursor:pointer; transition:all 0.2s; }
.ftab:hover { color:var(--t1); }
.ftab--active { color:#fff !important; background:var(--accent) !important; font-weight:700; }

.btn-export { display:flex; align-items:center; gap:6px; padding:8px 16px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:9px; color:var(--t2); font-family:'Satoshi',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
.btn-export:hover { background:var(--accent-dim); border-color:var(--accent-border); color:var(--accent); }

/* Table */
.table-wrap { overflow-x:auto; }
.txn-table { width:100%; border-collapse:collapse; }
.txn-table thead tr { border-bottom:1px solid var(--border-soft); }
.txn-table th { font-size:0.67rem; font-weight:600; color:var(--t4); text-transform:uppercase; letter-spacing:0.08em; padding:10px 14px; text-align:left; white-space:nowrap; }
.txn-row { border-bottom:1px solid var(--border-soft); transition:background 0.18s; }
.txn-row:last-child { border-bottom:none; }
.txn-row:hover { background:var(--glass-2); }
.txn-table td { padding:13px 14px; vertical-align:middle; }

.txn-id { display:inline-block; padding:3px 9px; background:var(--accent-dim); border:1px solid var(--accent-border); border-radius:6px; color:var(--accent); font-size:0.72rem; font-weight:700; white-space:nowrap; }
.cust-cell { display:flex; align-items:center; gap:10px; }
.cust-avatar { width:34px; height:34px; border-radius:9px; object-fit:cover; border:1px solid var(--border-soft); flex-shrink:0; }
.cust-name { font-size:0.82rem; font-weight:600; color:var(--t1); white-space:nowrap; }
.txn-type { font-size:0.78rem; color:var(--t3); }
.txn-amount { font-size:0.88rem; font-weight:700; white-space:nowrap; }
.txn-amount--pos { color:#22c55e; }
.txn-amount--neg { color:#f87171; }
.txn-date { font-size:0.75rem; color:var(--t4); white-space:nowrap; }

.status-badge { display:inline-flex; align-items:center; gap:6px; font-size:0.7rem; font-weight:700; padding:4px 10px; border-radius:999px; white-space:nowrap; }
.s-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.status-badge--completed { color:#22c55e; background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.25); }
.status-badge--completed .s-dot { background:#22c55e; }
.status-badge--pending { color:#fbbf24; background:rgba(251,191,36,0.12); border:1px solid rgba(251,191,36,0.28); }
.status-badge--pending .s-dot { background:#fbbf24; }
.status-badge--failed { color:#f87171; background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.28); }
.status-badge--failed .s-dot { background:#f87171; }

.row-acts { display:flex; gap:6px; }
.act-btn { width:30px; height:30px; border-radius:8px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:opacity 0.2s; }
.act-btn:hover { opacity:0.7; }
.act-btn--view { background:var(--accent-dim); border:1px solid var(--accent-border); }
.act-btn--more { background:var(--glass-2); border:1px solid var(--border-soft); }

.more-wrap { position:relative; }
.row-menu {
  position:absolute; right:0; top:36px; z-index:200;
  background:var(--glass); backdrop-filter:blur(20px) saturate(180%);
  border:1px solid var(--border); border-radius:12px;
  padding:6px; display:flex; flex-direction:column; gap:2px;
  min-width:168px;
}
.row-menu__item {
  display:flex; align-items:center; gap:8px;
  padding:8px 12px; border-radius:8px; border:none;
  background:transparent; color:var(--t2);
  font-family:'Satoshi',sans-serif; font-size:0.78rem; font-weight:600;
  cursor:pointer; text-align:left; transition:background 0.15s, color 0.15s;
  white-space:nowrap;
}
.row-menu__item:hover { background:var(--glass-hover); color:var(--t1); }
.row-menu__item--danger { color:#f87171; }
.row-menu__item--danger:hover { background:rgba(248,113,113,0.10); color:#f87171; }

.menu-pop-enter-active { transition:opacity 0.15s ease, transform 0.15s cubic-bezier(0.34,1.56,0.64,1); }
.menu-pop-leave-active { transition:opacity 0.1s ease, transform 0.1s ease; }
.menu-pop-enter-from { opacity:0; transform:scale(0.9) translateY(-6px); }
.menu-pop-leave-to   { opacity:0; transform:scale(0.95) translateY(-4px); }

.txn-row--flagged { background:rgba(248,113,113,0.04) !important; }

/* Toast */
.txn-toast {
  position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
  z-index:99999; display:flex; align-items:center; gap:8px;
  padding:10px 20px; border-radius:99px;
  font-family:'Satoshi',sans-serif; font-size:0.82rem; font-weight:600;
  white-space:nowrap;
  background:var(--glass); backdrop-filter:blur(20px) saturate(180%);
  border:1px solid var(--border);
}
.txn-toast--success { color:#22c55e; border-color:rgba(34,197,94,0.35); }
.txn-toast--flag    { color:#f87171; border-color:rgba(248,113,113,0.35); }
.toast-slide-enter-active { transition:opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
.toast-slide-leave-active { transition:opacity 0.18s ease, transform 0.18s ease; }
.toast-slide-enter-from { opacity:0; transform:translateX(-50%) translateY(12px); }
.toast-slide-leave-to   { opacity:0; transform:translateX(-50%) translateY(12px); }

.empty-state { display:flex; flex-direction:column; align-items:center; gap:10px; padding:48px 0; color:var(--t4); font-size:0.875rem; }

/* Pagination */
.pagination { display:flex; align-items:center; justify-content:space-between; padding-top:16px; border-top:1px solid var(--border-soft); }
.pagination__info { font-size:0.72rem; color:var(--t4); }
.pagination__btns { display:flex; align-items:center; gap:4px; }
.page-btn { width:30px; height:30px; border-radius:8px; background:var(--glass-2); border:1px solid var(--border-soft); color:var(--t3); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; }
.page-btn:disabled { opacity:0.35; cursor:not-allowed; }
.page-btn:not(:disabled):hover { color:var(--t1); border-color:var(--border); }
.page-num { width:30px; height:30px; border-radius:8px; background:var(--glass-2); border:1px solid var(--border-soft); color:var(--t3); font-family:'Satoshi',sans-serif; font-size:0.78rem; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; }
.page-num:hover { color:var(--t1); }
.page-num--active { background:var(--accent) !important; border-color:var(--accent) !important; color:#fff !important; font-weight:700; }

/* Detail Modal */
.modal-backdrop { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.5); backdrop-filter:blur(6px); }
.detail-modal { background:var(--modal-glass); backdrop-filter:blur(24px) saturate(180%); border:1px solid var(--modal-border); border-radius:20px; padding:26px; width:100%; max-width:420px; display:flex; flex-direction:column; gap:20px; }
.detail-modal__head { display:flex; align-items:center; justify-content:space-between; }
.detail-modal__title { font-size:1rem; font-weight:700; color:var(--t1); margin:0; }
.modal-close { width:28px; height:28px; border-radius:7px; background:var(--glass-2); border:1px solid var(--border-soft); color:var(--t3); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; }
.modal-close:hover { color:var(--t1); }
.detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.detail-item { display:flex; flex-direction:column; gap:4px; background:var(--modal-input); border:1px solid var(--border-soft); border-radius:10px; padding:12px 14px; }
.detail-item__label { font-size:0.65rem; font-weight:700; color:var(--t4); text-transform:uppercase; letter-spacing:0.07em; }
.detail-item__val { font-size:0.88rem; font-weight:700; color:var(--t1); }
.val--id { color:var(--accent); }
.val--pos { color:#22c55e; }
.val--neg { color:#f87171; }
.val--completed { color:#22c55e; }
.val--pending { color:#fbbf24; }
.val--failed { color:#f87171; }
.detail-actions { display:flex; gap:10px; padding-top:4px; border-top:1px solid var(--border-soft); }
.btn-receipt { flex:1; padding:9px; background:var(--accent-dim); border:1px solid var(--accent-border); border-radius:9px; color:var(--accent); font-family:'Satoshi',sans-serif; font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
.btn-receipt:hover { background:var(--accent); color:#fff; }
.btn-flag { flex:1; padding:9px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.25); border-radius:9px; color:#f87171; font-family:'Satoshi',sans-serif; font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
.btn-flag:hover { background:rgba(248,113,113,0.2); }

.modal-enter-active { transition:opacity 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1); }
.modal-leave-active { transition:opacity 0.18s ease, transform 0.18s ease; }
.modal-enter-from { opacity:0; transform:scale(0.9) translateY(12px); }
.modal-leave-to { opacity:0; transform:scale(0.96); }

@media (max-width: 1024px) and (min-width: 769px) {
  .kpi-row         { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .panel-controls  { flex-wrap: wrap; gap: 8px; }
  .search-box      { width: 180px; }
}
@media (max-width: 768px) {
  .kpi-row         { grid-template-columns: 1fr 1fr; gap: 10px; }
  .kpi-card        { padding: 14px 12px; gap: 10px; }
  .kpi-card__icon  { width: 36px; height: 36px; border-radius: 10px; }
  .kpi-card__value { font-size: 0.95rem; }
  .txn-panel       { padding: 16px; gap: 14px; }
  .panel-header    { flex-direction: column; align-items: flex-start; }
  .panel-controls  { width: 100%; gap: 6px; }
  .date-tabs       { overflow-x: auto; flex-shrink: 0; }
  .filter-tabs     { overflow-x: auto; flex-shrink: 0; }
  .search-box      { width: 100%; }
  .btn-export      { width: 100%; justify-content: center; }
  .table-wrap      { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .txn-table       { min-width: 560px; }
  .pagination      { flex-direction: column; align-items: center; gap: 10px; }
  .modal-backdrop  { padding: 12px; align-items: flex-end; }
  .detail-modal    { max-width: 100%; border-radius: 22px 22px 0 0; }
  .detail-grid     { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .kpi-row       { grid-template-columns: 1fr; }
  .detail-grid   { grid-template-columns: 1fr; }
}
</style>
