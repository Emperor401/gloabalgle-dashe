<!-- src/views/WalletView.vue -->
<template>
  <div class="wallet-page">

    <!-- Header -->
    <div class="w-hdr">
      <div>
        <h1 class="w-title">Wallet</h1>
        <p class="w-sub">Top up your balance to pay for plans and other on-platform charges.</p>
      </div>
      <div class="w-hdr-actions">
        <button class="w-switch-btn" @click="showSwitchPlan = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          Switch Plan
        </button>
        <button class="w-add-btn" @click="showAddFunds = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Funds
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="w-stats">
      <div class="w-stat w-stat--balance">
        <div class="w-stat__top">
          <span class="w-stat__label">BALANCE</span>
          <div class="w-stat-icon w-stat-icon--orange">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b"
              stroke-width="2" stroke-linecap="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
        </div>
        <span class="w-stat__val">₦{{ balance.toLocaleString() }}</span>
        <span class="w-stat__sub">Available to spend</span>
      </div>

      <div class="w-stat">
        <div class="w-stat__top">
          <span class="w-stat__label">TOTAL SPENT</span>
          <div class="w-stat-icon w-stat-icon--blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa"
              stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="19 12 12 19 5 12"/>
            </svg>
          </div>
        </div>
        <span class="w-stat__val">₦{{ totalSpent.toLocaleString() }}</span>
        <span class="w-stat__sub">This billing cycle</span>
      </div>

      <div class="w-stat">
        <div class="w-stat__top">
          <span class="w-stat__label">PLAN</span>
          <div class="w-stat-icon w-stat-icon--purple">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa"
              stroke-width="2" stroke-linecap="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
        </div>
        <span class="w-stat__val w-stat__val--plan">{{ currentPlan }}</span>
        <span class="w-stat__sub w-stat__sub--link" @click="showSwitchPlan = true">View plan details →</span>
      </div>
    </div>

    <!-- Auto-deposit row -->
    <div class="w-auto-row">
      <div class="w-auto-info">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
          stroke-width="2" stroke-linecap="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
        </svg>
        <div>
          <span class="w-auto-title">Auto top-up</span>
          <span class="w-auto-desc">Automatically add ₦5,000 when balance falls below ₦500</span>
        </div>
      </div>
      <div :class="['w-toggle', { 'w-toggle--on': autoDeposit }]"
        @click="autoDeposit = !autoDeposit">
        <div class="w-toggle-thumb"/>
      </div>
    </div>

    <!-- Transactions section -->
    <div class="w-txn-section">
      <div class="w-txn-hdr">
        <h2 class="w-txn-title">Transactions</h2>
        <div class="w-txn-filters">
          <button v-for="f in filters" :key="f.id"
            :class="['w-filter-btn', { 'w-filter-btn--active': activeFilter === f.id }]"
            @click="activeFilter = f.id">
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredTxns.length === 0" class="w-empty">
        <div class="w-empty-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.5" stroke-linecap="round">
            <path d="M22 17H2a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3"/>
            <path d="M9.5 2h5L18 6H6L9.5 2z"/>
            <path d="M12 6v6"/><path d="M9 9l3 3 3-3"/>
          </svg>
        </div>
        <p class="w-empty-title">No transactions yet</p>
        <p class="w-empty-sub">
          Top-ups, plan payments, SMS charges and other wallet activity will show up here.
        </p>
        <button class="w-empty-cta" @click="showAddFunds = true">Add your first funds →</button>
      </div>

      <!-- Transaction list -->
      <div v-else class="w-txn-table">
        <div class="w-txn-head">
          <span>TYPE</span>
          <span>DESCRIPTION</span>
          <span>DATE</span>
          <span>STATUS</span>
          <span style="text-align:right">AMOUNT</span>
        </div>
        <div v-for="t in filteredTxns" :key="t.id" class="w-txn-row">
          <div :class="['w-txn-badge', `w-txn-badge--${t.category}`]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round" v-html="txnIcon(t.category)"/>
          </div>
          <div class="w-txn-desc">
            <span class="w-txn-desc-title">{{ t.description }}</span>
            <span class="w-txn-desc-ref">REF: {{ t.ref }}</span>
          </div>
          <span class="w-txn-date">{{ t.date }}</span>
          <span :class="['w-txn-status', `w-txn-status--${t.status}`]">{{ t.status }}</span>
          <span :class="['w-txn-amount', t.type === 'credit' ? 'w-txn-amount--cr' : 'w-txn-amount--dr']"
            style="text-align:right">
            {{ t.type === 'credit' ? '+' : '-' }}₦{{ t.amount.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>

    <!-- ═══════════ ADD FUNDS MODAL ═══════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showAddFunds" class="w-overlay" @click.self="showAddFunds = false">
          <div class="w-modal">
            <div class="w-modal-hdr">
              <div>
                <h2 class="w-modal-title">Add Funds</h2>
                <p class="w-modal-sub">Choose an amount and payment method</p>
              </div>
              <button class="w-modal-close" @click="showAddFunds = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Quick amounts -->
            <div class="w-modal-section">
              <label class="w-modal-label">Quick select</label>
              <div class="w-quick-grid">
                <button v-for="q in quickAmounts" :key="q"
                  :class="['w-quick-btn', { active: fundAmount === q }]"
                  @click="fundAmount = q">
                  ₦{{ q.toLocaleString() }}
                </button>
              </div>
            </div>

            <!-- Custom amount -->
            <div class="w-modal-section">
              <label class="w-modal-label">Or enter custom amount</label>
              <div class="w-amount-input-wrap">
                <span class="w-currency-sign">₦</span>
                <input v-model="fundAmount" type="number" class="w-amount-input"
                  placeholder="0" min="100" />
              </div>
            </div>

            <!-- Payment method -->
            <div class="w-modal-section">
              <label class="w-modal-label">Payment method</label>
              <div class="w-methods">
                <label v-for="m in paymentMethods" :key="m.id"
                  :class="['w-method', { 'w-method--active': payMethod === m.id }]"
                  @click="payMethod = m.id">
                  <div class="w-method-radio" :class="{ on: payMethod === m.id }">
                    <div v-if="payMethod === m.id" class="w-method-dot"/>
                  </div>
                  <div :class="['w-method-icon', `w-method-icon--${m.color}`]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      v-html="m.icon"/>
                  </div>
                  <div>
                    <div class="w-method-name">{{ m.name }}</div>
                    <div class="w-method-desc">{{ m.desc }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Bank details (if bank transfer) -->
            <Transition name="slide-down">
              <div v-if="payMethod === 'bank'" class="w-bank-details">
                <div class="w-bank-row">
                  <span class="w-bank-lbl">Bank</span>
                  <span class="w-bank-val">Globalgle MFB</span>
                </div>
                <div class="w-bank-row">
                  <span class="w-bank-lbl">Account Name</span>
                  <span class="w-bank-val">IFEANYI GLOBALGLE</span>
                </div>
                <div class="w-bank-row">
                  <span class="w-bank-lbl">Account Number</span>
                  <div class="w-bank-copy" @click="copyText('7081234567')">
                    <span class="w-bank-val">7081234567</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="#22c55e" stroke-width="2.5" stroke-linecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </div>
                </div>
                <p class="w-bank-note">Transfer the exact amount. Your balance is credited instantly.</p>
              </div>
            </Transition>

            <!-- Card form -->
            <Transition name="slide-down">
              <div v-if="payMethod === 'card'" class="w-card-form">
                <div class="w-modal-section">
                  <label class="w-modal-label">Card number</label>
                  <input v-model="cardNumber" class="w-modal-input" placeholder="1234 5678 9012 3456"
                    maxlength="19" @input="formatCard" />
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                  <div class="w-modal-section">
                    <label class="w-modal-label">Expiry</label>
                    <input v-model="cardExpiry" class="w-modal-input" placeholder="MM/YY" maxlength="5" />
                  </div>
                  <div class="w-modal-section">
                    <label class="w-modal-label">CVV</label>
                    <input v-model="cardCvv" class="w-modal-input" placeholder="123" maxlength="3" type="password" />
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Crypto address -->
            <Transition name="slide-down">
              <div v-if="payMethod === 'usdt'" class="w-bank-details">
                <div class="w-bank-row">
                  <span class="w-bank-lbl">Network</span>
                  <span class="w-bank-val">TRC-20 (TRON)</span>
                </div>
                <div class="w-bank-row">
                  <span class="w-bank-lbl">USDT Address</span>
                  <div class="w-bank-copy" @click="copyText('TGq9XN...Kd82jP')">
                    <span class="w-bank-val w-bank-val--mono">TGq9XN...Kd82jP</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="#22c55e" stroke-width="2.5" stroke-linecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </div>
                </div>
                <p class="w-bank-note">Send USDT TRC-20 only. Rate: $1 ≈ ₦1,580. Balance credited on confirmation.</p>
              </div>
            </Transition>

            <!-- Confirm -->
            <button class="w-confirm-btn" :disabled="!fundAmount || fundAmount < 100"
              @click="confirmFunds">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ payMethod === 'bank' ? 'I\'ve sent the transfer' : payMethod === 'usdt' ? 'I\'ve sent USDT' : `Pay ₦${Number(fundAmount || 0).toLocaleString()}` }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════ SWITCH PLAN MODAL ═══════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showSwitchPlan" class="w-overlay" @click.self="showSwitchPlan = false">
          <div class="w-modal w-modal--wide">
            <div class="w-modal-hdr">
              <div>
                <h2 class="w-modal-title">Switch Plan</h2>
                <p class="w-modal-sub">Choose the plan that fits your business</p>
              </div>
              <button class="w-modal-close" @click="showSwitchPlan = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="w-plans-grid">
              <div v-for="plan in plans" :key="plan.id"
                :class="['w-plan-card', {
                  'w-plan-card--current': plan.id === currentPlan,
                  'w-plan-card--popular': plan.popular,
                }]">
                <div v-if="plan.popular" class="w-plan-popular">Most Popular</div>
                <div class="w-plan-name">{{ plan.id }}</div>
                <div class="w-plan-price">
                  <span class="w-plan-price-val">{{ plan.price }}</span>
                  <span class="w-plan-price-period" v-if="plan.period">/{{ plan.period }}</span>
                </div>
                <ul class="w-plan-features">
                  <li v-for="f in plan.features" :key="f">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="#22c55e" stroke-width="2.5" stroke-linecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {{ f }}
                  </li>
                </ul>
                <button
                  :class="['w-plan-btn', plan.id === currentPlan ? 'w-plan-btn--current' : 'w-plan-btn--select']"
                  :disabled="plan.id === currentPlan"
                  @click="selectPlan(plan.id)">
                  {{ plan.id === currentPlan ? 'Current Plan' : 'Switch to this' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-up">
        <div v-if="toast" :class="['w-toast', `w-toast--${toast.type}`]">
          <svg v-if="toast.type === 'success'" width="15" height="15" viewBox="0 0 24 24"
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
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast.js'
const { error: toastError } = useToast()

/* ── State ── */
const balance      = ref(0)
const totalSpent   = ref(0)
const currentPlan  = ref('Starter')
const autoDeposit  = ref(false)
const activeFilter = ref('all')
const showAddFunds  = ref(false)
const showSwitchPlan= ref(false)
const toast         = ref(null)

/* ── Add Funds form ── */
const fundAmount   = ref('')
const payMethod    = ref('bank')
const cardNumber   = ref('')
const cardExpiry   = ref('')
const cardCvv      = ref('')

const quickAmounts  = [500, 1000, 5000, 10000, 50000, 100000]

const paymentMethods = [
  { id: 'bank', name: 'Bank Transfer', desc: 'Instant · No fees', color: 'green',
    icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>' },
  { id: 'card', name: 'Debit / Credit Card', desc: 'Visa, Mastercard · 1.5% fee', color: 'blue',
    icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M6 14h2"/>' },
  { id: 'usdt', name: 'USDT (Crypto)', desc: 'TRC-20 · No fees · Rate: ₦1,580/$', color: 'amber',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6"/>' },
]

/* ── Transactions ── */
const transactions = ref([])

const filters = [
  { id: 'all',     label: 'All' },
  { id: 'topup',   label: 'Top-ups' },
  { id: 'plan',    label: 'Plan Payments' },
  { id: 'service', label: 'Service Charges' },
]

const filteredTxns = computed(() => {
  if (activeFilter.value === 'all') return transactions.value
  return transactions.value.filter(t => t.category === activeFilter.value)
})

/* ── Plans ── */
const plans = [
  {
    id: 'Starter', price: 'Free', period: null, popular: false,
    features: ['5 branded emails/mo', '0 SMS credits', '0 call minutes', '1 website', 'Pay-as-you-go overage'],
  },
  {
    id: 'Basic', price: '₦5,000', period: 'mo', popular: false,
    features: ['500 branded emails/mo', '50 SMS credits/mo', '10 call minutes/mo', '3 websites', 'Priority support'],
  },
  {
    id: 'Professional', price: '₦15,000', period: 'mo', popular: true,
    features: ['5,000 branded emails/mo', '500 SMS credits/mo', '60 call minutes/mo', '10 websites', 'Custom sender IDs', '24/7 support'],
  },
  {
    id: 'Enterprise', price: '₦50,000', period: 'mo', popular: false,
    features: ['Unlimited emails', 'Unlimited SMS', '300 call minutes/mo', 'Unlimited websites', 'Dedicated account manager', 'SLA guarantee'],
  },
]

/* ── Methods ── */
function txnIcon(cat) {
  const icons = {
    topup:   '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 5 5 12"/>',
    plan:    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    service: '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
  }
  return icons[cat] ?? icons.service
}

function formatCard() {
  cardNumber.value = cardNumber.value
    .replace(/\D/g, '').slice(0, 16)
    .replace(/(.{4})/g, '$1 ').trim()
}

function copyText(text) {
  navigator.clipboard?.writeText(text)
  showToast('success', 'Copied to clipboard!')
}

function confirmFunds() {
  if (!fundAmount.value || fundAmount.value < 100) {
    toastError('Invalid amount', 'Minimum top-up amount is ₦100.')
    return
  }
  if (payMethod.value === 'card') {
    const rawCard = cardNumber.value.replace(/\s/g, '')
    if (rawCard.length < 16)                                          { toastError('Card number required',  'Enter a valid 16-digit card number.');       return }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value))                    { toastError('Expiry required',       'Enter expiry in MM/YY format.');             return }
    if (cardCvv.value.length < 3)                                     { toastError('CVV required',          'Enter a valid 3-digit CVV.');                return }
  }
  const amount = Number(fundAmount.value)

  transactions.value.unshift({
    id:          Date.now(),
    type:        'credit',
    category:    'topup',
    description: `Wallet top-up via ${paymentMethods.find(m => m.id === payMethod.value)?.name}`,
    ref:         `TXN-${Math.floor(Math.random() * 900000 + 100000)}`,
    amount,
    status:      payMethod.value === 'bank' ? 'pending' : 'completed',
    date:        new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  })

  if (payMethod.value !== 'bank') {
    balance.value += amount
  }

  showAddFunds.value = false
  fundAmount.value   = ''
  cardNumber.value   = ''
  cardExpiry.value   = ''
  cardCvv.value      = ''

  showToast('success',
    payMethod.value === 'bank'
      ? 'Transfer recorded. Balance will update once confirmed.'
      : `₦${amount.toLocaleString()} added to your wallet!`)
}

function selectPlan(planId) {
  currentPlan.value = planId

  transactions.value.unshift({
    id:          Date.now(),
    type:        'debit',
    category:    'plan',
    description: `Plan switched to ${planId}`,
    ref:         `PLAN-${Math.floor(Math.random() * 900000 + 100000)}`,
    amount:      0,
    status:      'completed',
    date:        new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  })

  showSwitchPlan.value = false
  showToast('success', `Switched to ${planId} plan!`)
}

function showToast(type, msg) {
  toast.value = { type, msg }
  setTimeout(() => { toast.value = null }, 3500)
}
</script>

<style scoped>
.wallet-page {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 100vh;
}

/* ── Header ── */
.w-hdr {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.w-title { font-size: 1.6rem; font-weight: 800; color: var(--t1); margin: 0 0 5px; letter-spacing: -0.02em; }
.w-sub   { font-size: 0.82rem; color: var(--t3); margin: 0; }

.w-hdr-actions { display: flex; gap: 10px; flex-shrink: 0; align-items: center; }

.w-switch-btn {
  display: flex; align-items: center; gap: 7px;
  background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 10px 18px; font-size: 0.83rem;
  font-weight: 600; color: var(--t2); cursor: pointer;
  font-family: inherit; transition: all 0.2s;
  backdrop-filter: blur(20px) saturate(180%);
}
.w-switch-btn:hover { border-color: rgba(34,197,94,.35); color: var(--t1); }

.w-add-btn {
  display: flex; align-items: center; gap: 7px;
  background: #22c55e; border: none;
  border-radius: 10px; padding: 10px 20px; font-size: 0.83rem;
  font-weight: 700; color: #fff; cursor: pointer;
  font-family: inherit; transition: background 0.2s;
}
.w-add-btn:hover { background: #16a34a; }

/* ── Stats ── */
.w-stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
.w-stat {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; padding: 22px 24px;
  display: flex; flex-direction: column; gap: 8px;
}
.w-stat--balance { border-color: rgba(245,158,11,.2); }

.w-stat__top {
  display: flex; justify-content: space-between; align-items: center;
}
.w-stat__label {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--t3);
}
.w-stat-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.w-stat-icon--orange { background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.2); }
.w-stat-icon--blue   { background: rgba(96,165,250,.12);  border: 1px solid rgba(96,165,250,.2);  }
.w-stat-icon--purple { background: rgba(167,139,250,.12); border: 1px solid rgba(167,139,250,.2); }

.w-stat__val       { font-size: 1.8rem; font-weight: 800; color: var(--t1); line-height: 1; }
.w-stat__val--plan { font-size: 1.3rem; }
.w-stat__sub       { font-size: 0.72rem; color: var(--t3); }
.w-stat__sub--link { color: #a78bfa; cursor: pointer; transition: color 0.2s; }
.w-stat__sub--link:hover { color: #c4b5fd; text-decoration: underline; }

/* ── Auto deposit row ── */
.w-auto-row {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 16px; padding: 16px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.w-auto-info { display: flex; align-items: center; gap: 12px; }
.w-auto-title { font-size: 0.85rem; font-weight: 700; color: var(--t1); display: block; margin-bottom: 2px; }
.w-auto-desc  { font-size: 0.74rem; color: var(--t3); }

.w-toggle {
  width: 42px; height: 24px; border-radius: 12px;
  background: rgba(255,255,255,.1); border: 1px solid var(--border-soft);
  position: relative; cursor: pointer; transition: all 0.25s; flex-shrink: 0;
}
.w-toggle--on { background: rgba(34,197,94,.25); border-color: rgba(34,197,94,.4); }
.w-toggle-thumb {
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--t3); position: absolute; top: 2px; left: 2px;
  transition: transform 0.25s, background 0.25s;
}
.w-toggle--on .w-toggle-thumb { transform: translateX(18px); background: #22c55e; }

/* ── Transactions ── */
.w-txn-section {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; overflow: hidden;
}
.w-txn-hdr {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
  padding: 20px 24px 16px; gap: 12px; border-bottom: 1px solid var(--border-soft);
}
.w-txn-title { font-size: 1rem; font-weight: 700; color: var(--t1); margin: 0; }

.w-txn-filters { display: flex; gap: 6px; }
.w-filter-btn {
  background: none; border: 1px solid var(--border-soft);
  border-radius: 8px; padding: 6px 13px; font-size: 0.75rem;
  font-weight: 600; color: var(--t3); cursor: pointer;
  font-family: inherit; transition: all 0.18s;
}
.w-filter-btn:hover       { color: var(--t1); border-color: rgba(34,197,94,.3); }
.w-filter-btn--active     { background: rgba(34,197,94,.1); border-color: rgba(34,197,94,.3); color: #22c55e; }

/* empty state */
.w-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  margin: 28px; padding: 36px 24px;
  border: 1.5px dashed var(--border-soft); border-radius: 16px;
}
.w-empty-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(255,255,255,.04); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center;
  color: var(--t3);
}
.w-empty-title { font-size: 0.95rem; font-weight: 700; color: var(--t1); margin: 0; }
.w-empty-sub   { font-size: 0.78rem; color: var(--t3); text-align: center; max-width: 320px; line-height: 1.55; margin: 0; }
.w-empty-cta   {
  background: none; border: none; color: #22c55e;
  font-size: 0.8rem; font-weight: 700; cursor: pointer;
  font-family: inherit; transition: color 0.2s;
}
.w-empty-cta:hover { color: #16a34a; }

/* table */
.w-txn-table { display: flex; flex-direction: column; }
.w-txn-head {
  display: grid;
  grid-template-columns: 44px 1fr 140px 90px 120px;
  padding: 12px 24px;
  font-size: 0.63rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.09em; color: var(--t3); gap: 12px;
  border-bottom: 1px solid var(--border-soft);
}
.w-txn-row {
  display: grid;
  grid-template-columns: 44px 1fr 140px 90px 120px;
  padding: 15px 24px; gap: 12px; align-items: center;
  border-bottom: 1px solid var(--border-soft); transition: background 0.15s;
}
.w-txn-row:last-child { border-bottom: none; }
.w-txn-row:hover      { background: rgba(255,255,255,.03); }

.w-txn-badge {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.w-txn-badge--topup   { background: rgba(34,197,94,.1);   color: #22c55e;  border: 1px solid rgba(34,197,94,.2);   }
.w-txn-badge--plan    { background: rgba(167,139,250,.1); color: #a78bfa;  border: 1px solid rgba(167,139,250,.2); }
.w-txn-badge--service { background: rgba(96,165,250,.1);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.2);  }

.w-txn-desc       { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.w-txn-desc-title { font-size: 0.83rem; font-weight: 600; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.w-txn-desc-ref   { font-size: 0.68rem; color: var(--t3); font-family: monospace; }
.w-txn-date       { font-size: 0.73rem; color: var(--t3); }

.w-txn-status {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  padding: 3px 9px; border-radius: 999px; width: fit-content;
}
.w-txn-status--completed { background: rgba(34,197,94,.1);  color: #22c55e;  border: 1px solid rgba(34,197,94,.2);  }
.w-txn-status--pending   { background: rgba(251,191,36,.1); color: #fbbf24;  border: 1px solid rgba(251,191,36,.2); }
.w-txn-status--failed    { background: rgba(248,113,113,.1);color: #f87171;  border: 1px solid rgba(248,113,113,.2);}

.w-txn-amount      { font-size: 0.88rem; font-weight: 700; }
.w-txn-amount--cr  { color: #22c55e; }
.w-txn-amount--dr  { color: #f87171; }

/* ── Modals ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from,  .modal-fade-leave-to     { opacity: 0; }

.w-overlay {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,.65); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.w-modal {
  background: var(--modal-glass); backdrop-filter: blur(24px) saturate(180%); border: 1px solid var(--modal-border);
  border-radius: 24px; padding: 28px;
  width: 100%; max-width: 460px;
  display: flex; flex-direction: column; gap: 0;
  max-height: 90vh; overflow-y: auto;
}
.w-modal--wide { max-width: 780px; }

.w-modal-hdr {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 22px;
}
.w-modal-title { font-size: 1.15rem; font-weight: 800; color: var(--t1); margin: 0 0 4px; }
.w-modal-sub   { font-size: 0.78rem; color: var(--t3); margin: 0; }
.w-modal-close {
  width: 30px; height: 30px; border-radius: 8px;
  background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  color: var(--t2); cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s; flex-shrink: 0;
}
.w-modal-close:hover { background: rgba(248,113,113,.12); color: #f87171; }

.w-modal-section { margin-bottom: 18px; }
.w-modal-label   { font-size: 0.74rem; font-weight: 700; color: var(--t2); display: block; margin-bottom: 9px; }
.w-modal-input {
  width: 100%; background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 11px; padding: 11px 14px; font-size: 0.86rem;
  color: var(--t1); font-family: inherit; outline: none;
  transition: border-color 0.2s; box-sizing: border-box;
}
.w-modal-input:focus       { border-color: rgba(34,197,94,.4); }
.w-modal-input::placeholder{ color: var(--t3); }

/* quick amounts */
.w-quick-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
}
.w-quick-btn {
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 10px 8px; font-size: 0.82rem; font-weight: 700;
  color: var(--t2); cursor: pointer; font-family: inherit; transition: all 0.18s;
  text-align: center;
}
.w-quick-btn:hover, .w-quick-btn.active {
  background: rgba(34,197,94,.1); border-color: rgba(34,197,94,.3); color: #22c55e;
}

/* amount input */
.w-amount-input-wrap {
  display: flex; align-items: center;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 12px; overflow: hidden; transition: border-color 0.2s;
}
.w-amount-input-wrap:focus-within { border-color: rgba(34,197,94,.4); }
.w-currency-sign {
  padding: 12px 14px; font-size: 1rem; font-weight: 700; color: var(--t2);
  border-right: 1px solid var(--border-soft);
}
.w-amount-input {
  flex: 1; background: transparent; border: none; outline: none;
  padding: 12px 16px; font-size: 1.1rem; font-weight: 700;
  color: var(--t1); font-family: inherit;
}
.w-amount-input::-webkit-inner-spin-button { display: none; }

/* payment methods */
.w-methods { display: flex; flex-direction: column; gap: 8px; }
.w-method {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 16px; border-radius: 13px;
  border: 1px solid var(--border-soft); cursor: pointer; transition: all 0.18s;
  background: rgba(255,255,255,.03);
}
.w-method:hover      { border-color: rgba(34,197,94,.3); background: rgba(34,197,94,.03); }
.w-method--active    { background: rgba(34,197,94,.06); border-color: rgba(34,197,94,.35); }
.w-method-radio {
  width: 17px; height: 17px; border-radius: 50%;
  border: 2px solid var(--border-soft); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; transition: border-color 0.2s;
}
.w-method-radio.on { border-color: #22c55e; }
.w-method-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
.w-method-icon {
  width: 32px; height: 32px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.w-method-icon--green { background: rgba(34,197,94,.1);   color: #22c55e;  border: 1px solid rgba(34,197,94,.2);   }
.w-method-icon--blue  { background: rgba(96,165,250,.1);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.2);  }
.w-method-icon--amber { background: rgba(245,158,11,.1);  color: #f59e0b;  border: 1px solid rgba(245,158,11,.2);  }
.w-method-name { font-size: 0.84rem; font-weight: 700; color: var(--t1); }
.w-method-desc { font-size: 0.7rem; color: var(--t3); }

/* bank details */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); max-height: 0; }

.w-bank-details {
  background: rgba(255,255,255,.03); border: 1px solid var(--border-soft);
  border-radius: 13px; padding: 16px; margin-bottom: 18px;
  display: flex; flex-direction: column; gap: 10px;
}
.w-card-form { margin-bottom: 18px; }
.w-bank-row  { display: flex; justify-content: space-between; align-items: center; }
.w-bank-lbl  { font-size: 0.73rem; color: var(--t3); }
.w-bank-val  { font-size: 0.82rem; font-weight: 700; color: var(--t1); }
.w-bank-val--mono { font-family: monospace; font-size: 0.78rem; }
.w-bank-copy { display: flex; align-items: center; gap: 7px; cursor: pointer; }
.w-bank-copy:hover .w-bank-val { color: #22c55e; }
.w-bank-note { font-size: 0.72rem; color: var(--t3); margin: 4px 0 0; line-height: 1.5; }

/* confirm btn */
.w-confirm-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 14px; border-radius: 12px;
  background: #22c55e; border: none;
  font-size: 0.88rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s, opacity 0.2s;
  margin-top: 4px;
}
.w-confirm-btn:hover:not(:disabled) { background: #16a34a; }
.w-confirm-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* switch plan */
.w-plans-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
}
.w-plan-card {
  background: rgba(255,255,255,.03); border: 1px solid var(--border-soft);
  border-radius: 18px; padding: 22px 18px;
  display: flex; flex-direction: column; gap: 14px; position: relative;
  transition: border-color 0.2s;
}
.w-plan-card--popular { border-color: rgba(34,197,94,.3); background: rgba(34,197,94,.04); }
.w-plan-card--current { border-color: rgba(167,139,250,.35); background: rgba(167,139,250,.05); }
.w-plan-popular {
  position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
  background: #22c55e; color: #fff; font-size: 0.62rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 999px;
  white-space: nowrap;
}
.w-plan-name  { font-size: 0.82rem; font-weight: 700; color: var(--t2); text-transform: uppercase; letter-spacing: 0.07em; }
.w-plan-price { display: flex; align-items: baseline; gap: 2px; }
.w-plan-price-val    { font-size: 1.5rem; font-weight: 800; color: var(--t1); }
.w-plan-price-period { font-size: 0.78rem; color: var(--t3); }

.w-plan-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.w-plan-features li { display: flex; align-items: flex-start; gap: 7px; font-size: 0.76rem; color: var(--t2); line-height: 1.4; }

.w-plan-btn {
  width: 100%; padding: 10px; border-radius: 10px;
  font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.w-plan-btn--select  { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #22c55e; }
.w-plan-btn--select:hover { background: rgba(34,197,94,.2); }
.w-plan-btn--current { background: rgba(167,139,250,.1); border: 1px solid rgba(167,139,250,.25); color: #a78bfa; cursor: default; }

/* ── Toast ── */
.toast-up-enter-active, .toast-up-leave-active { transition: all 0.3s ease; }
.toast-up-enter-from, .toast-up-leave-to       { opacity: 0; transform: translateY(20px); }
.w-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px;
  padding: 13px 22px; border-radius: 14px;
  font-size: 0.84rem; font-weight: 600; z-index: 9999;
  backdrop-filter: blur(20px); white-space: nowrap;
}
.w-toast--success { background: rgba(34,197,94,.18);  border: 1px solid rgba(34,197,94,.3);  color: #22c55e;  }
.w-toast--error   { background: rgba(248,113,113,.18); border: 1px solid rgba(248,113,113,.3); color: #f87171; }

@media (max-width: 1024px) and (min-width: 769px) {
  .w-stats         { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .w-plans-grid    { grid-template-columns: 1fr 1fr; gap: 12px; }
  .w-hdr           { flex-wrap: wrap; gap: 10px; }
}
@media (max-width: 768px) {
  .wallet-page     { padding: 0; gap: 16px; }
  .w-hdr           { flex-direction: column; align-items: flex-start; gap: 10px; }
  .w-hdr-actions   { width: 100%; }
  .w-switch-btn, .w-add-btn { flex: 1; justify-content: center; }
  .w-stats         { grid-template-columns: 1fr 1fr; gap: 10px; }
  .w-stat          { padding: 14px 16px; }
  .w-stat__val     { font-size: 1.3rem; }
  .w-auto-row      { flex-direction: column; align-items: flex-start; gap: 10px; }
  .w-txn-hdr       { padding: 16px; }
  .w-txn-filters   { overflow-x: auto; gap: 4px; }
  .w-txn-head      { display: none; }
  .w-txn-row       { grid-template-columns: 44px 1fr 90px; padding: 12px 16px; }
  .w-txn-row > :nth-child(3) { display: none; }
  .w-txn-row > :nth-child(5) { display: none; }
  .w-plans-grid    { grid-template-columns: 1fr 1fr; gap: 12px; }
  .w-plan-card     { padding: 16px 14px; }
  .w-overlay       { padding: 12px; align-items: flex-end; }
  .w-modal         { max-width: 100%; border-radius: 22px 22px 0 0; max-height: 90vh; }
  .w-modal--wide   { max-width: 100%; }
  .w-toast         { bottom: 90px; max-width: calc(100vw - 32px); white-space: normal; }
}
@media (max-width: 480px) {
  .w-stats      { grid-template-columns: 1fr; }
  .w-plans-grid { grid-template-columns: 1fr; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .w-txn-row:hover,
[data-theme="light"] .w-method,
[data-theme="light"] .w-bank-details,
[data-theme="light"] .w-plan-card,
[data-theme="light"] .w-empty-icon { background: var(--glass-2); }
[data-theme="light"] .w-modal-input,
[data-theme="light"] .w-quick-btn,
[data-theme="light"] .w-amount-input-wrap,
[data-theme="light"] .w-modal-close { background: var(--glass); }
[data-theme="light"] .w-toggle { background: var(--glass-hover); }
</style>
