<!-- src/views/CurrencyConverterView.vue -->
<template>
  <div class="cc-page">

    <!-- Back nav -->
    <button class="cc-back" @click="router.push('/tools')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      Back to Tools
    </button>

    <!-- Header -->
    <div class="cc-header">
      <div class="cc-header-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
          stroke-width="2" stroke-linecap="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <div>
        <h1 class="cc-title">Currency Converter</h1>
        <p class="cc-sub">Live exchange rates across 12 global currencies</p>
      </div>
      <span :class="['cc-status', apiOnline ? 'cc-status--live' : 'cc-status--offline']">
        <span class="cc-dot" />
        {{ apiOnline ? 'Live rates' : 'Offline rates' }}
      </span>
    </div>

    <!-- Converter card -->
    <div class="cc-card">

      <!-- From -->
      <div class="cc-field">
        <label class="cc-label">Amount</label>
        <div class="cc-input-row">
          <input
            v-model="fromAmount"
            type="number"
            min="0"
            class="cc-input"
            placeholder="0.00"
          />
          <div class="cc-select-wrap" @click="toggleFromDrop">
            <span class="cc-flag">{{ selectedFrom.flag }}</span>
            <span class="cc-code">{{ selectedFrom.code }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            <div v-if="showFromDrop" class="cc-drop">
              <input v-model="fromSearch" class="cc-drop-search" placeholder="Search..." @click.stop />
              <div
                v-for="c in filteredFrom"
                :key="c.code"
                class="cc-drop-item"
                @click.stop="selectFrom(c)"
              >
                <span>{{ c.flag }}</span>
                <span class="cc-drop-code">{{ c.code }}</span>
                <span class="cc-drop-name">{{ c.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Swap -->
      <button class="cc-swap" @click="swapCurrencies" title="Swap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
          stroke-width="2.5" stroke-linecap="round">
          <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
      </button>

      <!-- To -->
      <div class="cc-field">
        <label class="cc-label">Converted to</label>
        <div class="cc-input-row">
          <div class="cc-result-val">{{ formattedResult }}</div>
          <div class="cc-select-wrap" @click="toggleToDrop">
            <span class="cc-flag">{{ selectedTo.flag }}</span>
            <span class="cc-code">{{ selectedTo.code }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            <div v-if="showToDrop" class="cc-drop cc-drop--right">
              <input v-model="toSearch" class="cc-drop-search" placeholder="Search..." @click.stop />
              <div
                v-for="c in filteredTo"
                :key="c.code"
                class="cc-drop-item"
                @click.stop="selectTo(c)"
              >
                <span>{{ c.flag }}</span>
                <span class="cc-drop-code">{{ c.code }}</span>
                <span class="cc-drop-name">{{ c.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rate line -->
      <p class="cc-rate-line" v-if="currentRate">
        1 {{ selectedFrom.code }} = {{ currentRate.toFixed(4) }} {{ selectedTo.code }}
      </p>
    </div>

    <!-- Quick amounts -->
    <div class="cc-section-label">Quick amounts</div>
    <div class="cc-quick">
      <button
        v-for="q in quickAmounts"
        :key="q"
        class="cc-quick-btn"
        :class="{ active: fromAmount == q }"
        @click="fromAmount = q"
      >
        {{ q.toLocaleString() }}
      </button>
    </div>

    <!-- Popular pairs -->
    <div class="cc-section-label">Popular pairs</div>
    <div class="cc-pairs">
      <div
        v-for="pair in popularPairs"
        :key="pair.from + pair.to"
        class="cc-pair-card"
        @click="setPair(pair)"
      >
        <div class="cc-pair-flags">{{ pair.fromFlag }} → {{ pair.toFlag }}</div>
        <div class="cc-pair-codes">{{ pair.from }}/{{ pair.to }}</div>
        <div class="cc-pair-rate" v-if="rates">
          {{ getPairRate(pair) }}
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currencies = [
  { code: 'USD', name: 'US Dollar',         flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro',              flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',     flag: '🇬🇧' },
  { code: 'NGN', name: 'Nigerian Naira',    flag: '🇳🇬' },
  { code: 'GHS', name: 'Ghanaian Cedi',     flag: '🇬🇭' },
  { code: 'KES', name: 'Kenyan Shilling',   flag: '🇰🇪' },
  { code: 'ZAR', name: 'South African Rand',flag: '🇿🇦' },
  { code: 'JPY', name: 'Japanese Yen',      flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar',   flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'INR', name: 'Indian Rupee',      flag: '🇮🇳' },
  { code: 'AED', name: 'UAE Dirham',        flag: '🇦🇪' },
]

const FALLBACK = {
  USD:1,EUR:0.93,GBP:0.79,NGN:1580,GHS:14.2,KES:129,
  ZAR:18.7,JPY:157,CAD:1.37,AUD:1.55,INR:83.4,AED:3.67,
}

const rates      = ref(null)
const apiOnline  = ref(false)
const fromAmount = ref(100)
const selectedFrom = ref(currencies[0])
const selectedTo   = ref(currencies[3])
const showFromDrop = ref(false)
const showToDrop   = ref(false)
const fromSearch   = ref('')
const toSearch     = ref('')

const quickAmounts = [10, 50, 100, 500, 1000, 5000]

const popularPairs = [
  { from:'USD', to:'NGN', fromFlag:'🇺🇸', toFlag:'🇳🇬' },
  { from:'USD', to:'EUR', fromFlag:'🇺🇸', toFlag:'🇪🇺' },
  { from:'GBP', to:'NGN', fromFlag:'🇬🇧', toFlag:'🇳🇬' },
  { from:'EUR', to:'GHS', fromFlag:'🇪🇺', toFlag:'🇬🇭' },
  { from:'USD', to:'GHS', fromFlag:'🇺🇸', toFlag:'🇬🇭' },
  { from:'USD', to:'KES', fromFlag:'🇺🇸', toFlag:'🇰🇪' },
]

const currentRate = computed(() => {
  if (!rates.value) return null
  const r = rates.value
  const from = selectedFrom.value.code
  const to   = selectedTo.value.code
  if (!r[from] || !r[to]) return null
  return r[to] / r[from]
})

const formattedResult = computed(() => {
  if (!currentRate.value || !fromAmount.value) return '—'
  const result = parseFloat(fromAmount.value) * currentRate.value
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(result)
})

const filteredFrom = computed(() =>
  currencies.filter(c =>
    c.code.toLowerCase().includes(fromSearch.value.toLowerCase()) ||
    c.name.toLowerCase().includes(fromSearch.value.toLowerCase())
  )
)
const filteredTo = computed(() =>
  currencies.filter(c =>
    c.code.toLowerCase().includes(toSearch.value.toLowerCase()) ||
    c.name.toLowerCase().includes(toSearch.value.toLowerCase())
  )
)

function toggleFromDrop() { showFromDrop.value = !showFromDrop.value; showToDrop.value = false }
function toggleToDrop()   { showToDrop.value = !showToDrop.value; showFromDrop.value = false  }

function selectFrom(c) {
  selectedFrom.value = c
  showFromDrop.value = false
  fromSearch.value   = ''
}
function selectTo(c) {
  selectedTo.value = c
  showToDrop.value = false
  toSearch.value   = ''
}

function swapCurrencies() {
  const tmp = selectedFrom.value
  selectedFrom.value = selectedTo.value
  selectedTo.value   = tmp
}

function setPair(pair) {
  selectedFrom.value = currencies.find(c => c.code === pair.from)
  selectedTo.value   = currencies.find(c => c.code === pair.to)
}

function getPairRate(pair) {
  const r = rates.value
  if (!r || !r[pair.from] || !r[pair.to]) return '—'
  const rate = r[pair.to] / r[pair.from]
  return `1 = ${rate.toFixed(2)}`
}

onMounted(async () => {
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = await res.json()
    if (data?.rates) {
      rates.value    = data.rates
      apiOnline.value = true
    } else {
      rates.value = FALLBACK
    }
  } catch {
    rates.value = FALLBACK
  }
})
</script>

<style scoped>
.cc-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 680px;
}

/* back */
.cc-back {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--t3); font-size: 0.82rem; font-family: inherit;
  padding: 0; transition: color 0.2s;
}
.cc-back:hover { color: var(--t1); }

/* header */
.cc-header {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
}
.cc-header-icon {
  width: 52px; height: 52px; border-radius: 16px;
  background: rgba(34,197,94,.12);
  border: 1px solid rgba(34,197,94,.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.cc-title {
  font-size: 1.4rem; font-weight: 800; color: var(--t1);
  margin: 0 0 3px; letter-spacing: -0.02em;
}
.cc-sub { font-size: 0.82rem; color: var(--t3); margin: 0; }
.cc-status {
  margin-left: auto; display: flex; align-items: center; gap: 6px;
  font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.06em; padding: 4px 12px; border-radius: 999px;
}
.cc-status--live    { background: rgba(34,197,94,.12); color: #22c55e; border: 1px solid rgba(34,197,94,.2); }
.cc-status--offline { background: rgba(251,191,36,.12); color: #fbbf24; border: 1px solid rgba(251,191,36,.2); }
.cc-dot {
  width: 6px; height: 6px; border-radius: 50%; background: currentColor;
}

/* converter card */
.cc-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  border: 1px solid var(--border-soft);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.cc-label {
  display: block; font-size: 0.74rem; font-weight: 600;
  color: var(--t3); text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.cc-input-row {
  display: flex; gap: 10px; align-items: center;
}

.cc-input {
  flex: 1; background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 13px 16px; font-size: 1.25rem; font-weight: 700;
  color: var(--t1); font-family: inherit; outline: none; transition: border-color 0.2s;
}
.cc-input:focus { border-color: rgba(34,197,94,.4); }
.cc-input::-webkit-inner-spin-button { display: none; }

.cc-result-val {
  flex: 1; background: rgba(34,197,94,.06); border: 1px solid rgba(34,197,94,.15);
  border-radius: 12px; padding: 13px 16px; font-size: 1.25rem; font-weight: 700;
  color: #22c55e;
}

.cc-select-wrap {
  position: relative;
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 11px 14px; cursor: pointer;
  user-select: none; transition: border-color 0.2s; flex-shrink: 0;
}
.cc-select-wrap:hover { border-color: rgba(34,197,94,.3); }
.cc-flag { font-size: 1.2rem; }
.cc-code { font-size: 0.9rem; font-weight: 700; color: var(--t1); min-width: 36px; }

/* dropdown */
.cc-drop {
  position: absolute; top: calc(100% + 8px); left: 0; min-width: 210px;
  background: var(--modal-glass); backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--modal-border);
  border-radius: 14px; padding: 8px; z-index: 100;
  max-height: 240px; overflow-y: auto;
}
.cc-drop--right { left: auto; right: 0; }
.cc-drop-search {
  width: 100%; background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 8px; padding: 7px 10px; font-size: 0.8rem; color: var(--t1);
  font-family: inherit; outline: none; margin-bottom: 6px; box-sizing: border-box;
}
.cc-drop-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border-radius: 9px; cursor: pointer; transition: background 0.15s;
}
.cc-drop-item:hover { background: rgba(255,255,255,.07); }
.cc-drop-code { font-size: 0.82rem; font-weight: 700; color: var(--t1); min-width: 36px; }
.cc-drop-name { font-size: 0.78rem; color: var(--t3); }

/* swap btn */
.cc-swap {
  align-self: center;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s, transform 0.2s;
}
.cc-swap:hover { background: rgba(34,197,94,.2); transform: rotate(180deg); }

.cc-rate-line {
  font-size: 0.8rem; color: var(--t3); margin: 0;
  text-align: center; padding-top: 4px;
  border-top: 1px solid var(--border-soft);
}

/* quick amounts */
.cc-section-label {
  font-size: 0.72rem; font-weight: 700; color: var(--t3);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.cc-quick {
  display: flex; gap: 10px; flex-wrap: wrap;
}
.cc-quick-btn {
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 9px 18px; font-size: 0.85rem; font-weight: 600;
  color: var(--t2); cursor: pointer; font-family: inherit; transition: all 0.18s;
}
.cc-quick-btn:hover,
.cc-quick-btn.active {
  background: rgba(34,197,94,.12); border-color: rgba(34,197,94,.3); color: #22c55e;
}

/* popular pairs */
.cc-pairs {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.cc-pair-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  border: 1px solid var(--border-soft);
  border-radius: 14px; padding: 16px;
  cursor: pointer; transition: border-color 0.2s, transform 0.2s;
}
.cc-pair-card:hover { border-color: rgba(34,197,94,.35); transform: translateY(-2px); }
.cc-pair-flags { font-size: 1.05rem; margin-bottom: 6px; }
.cc-pair-codes { font-size: 0.82rem; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
.cc-pair-rate  { font-size: 0.78rem; color: #22c55e; }

/* ── Tablet ── */
@media (max-width: 1024px) and (min-width: 769px) {
  .cc-pairs { grid-template-columns: repeat(3, 1fr); gap: 12px; }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .cc-page { gap: 16px; }

  /* header: single compact row — [icon] [title flex:1] [badge] */
  .cc-header      { flex-wrap: nowrap; align-items: center; gap: 10px; }
  .cc-header-icon { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; }
  .cc-header > div:not(.cc-header-icon) { flex: 1; min-width: 0; }
  .cc-title       { font-size: 1.15rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cc-sub         { display: none; }
  .cc-status      { margin-left: 0; flex-shrink: 0; white-space: nowrap; font-size: 0.65rem; padding: 3px 9px; }

  /* converter card */
  .cc-card        { padding: 18px 16px; gap: 14px; }

  /* input + selector stay side-by-side (stacking looks broken) */
  .cc-input-row   { flex-direction: row; gap: 8px; align-items: stretch; }
  .cc-input,
  .cc-result-val  { flex: 1; min-width: 0; font-size: 1.05rem; padding: 12px; }
  .cc-select-wrap { padding: 10px; gap: 5px; }
  .cc-code        { min-width: unset; font-size: 0.82rem; }
  .cc-flag        { font-size: 1rem; }

  /* swap */
  .cc-swap        { width: 36px; height: 36px; }

  /* dropdowns: right-align to prevent screen-edge overflow */
  .cc-drop        { left: auto; right: 0; min-width: 200px; }

  /* quick amounts */
  .cc-quick       { gap: 8px; }
  .cc-quick-btn   { padding: 8px 12px; font-size: 0.8rem; }

  /* popular pairs */
  .cc-pairs       { grid-template-columns: 1fr 1fr; gap: 8px; }
  .cc-pair-card   { padding: 14px 12px; }
}

/* ── Small Mobile ── */
@media (max-width: 480px) {
  .cc-input, .cc-result-val { font-size: 0.95rem; padding: 11px 10px; }
  .cc-select-wrap { padding: 9px 8px; gap: 4px; }
  .cc-flag        { font-size: 0.9rem; }

  /* quick amounts: even 3-column grid */
  .cc-quick       { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .cc-quick-btn   { text-align: center; padding: 8px 6px; }

  .cc-pairs       { gap: 6px; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .cc-input,
[data-theme="light"] .cc-drop-search,
[data-theme="light"] .cc-quick-btn,
[data-theme="light"] .cc-select-wrap,
[data-theme="light"] .cc-drop-item:hover { background: var(--glass); }
</style>
