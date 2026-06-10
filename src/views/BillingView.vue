<!-- src/views/BillingView.vue -->
<template>
  <div class="bill-page">

    <!-- Header -->
    <div class="bill-hdr">
      <div>
        <h1 class="bill-title">Billing</h1>
        <p class="bill-sub">Manage your subscription.</p>
      </div>
      <button class="bill-hist-btn" @click="showHistory = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
        </svg>
        Subscription history
      </button>
    </div>

    <!-- Stats row -->
    <div class="bill-stats">
      <div class="bill-stat">
        <div class="bill-stat__top">
          <span class="bill-stat__label">CURRENT PLAN</span>
          <div class="bill-stat-icon bill-stat-icon--green">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
              stroke-width="2" stroke-linecap="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
        </div>
        <span class="bill-stat__val">{{ currentPlan }}</span>
      </div>

      <div class="bill-stat">
        <div class="bill-stat__top">
          <span class="bill-stat__label">RENEWS / EXPIRES</span>
          <div class="bill-stat-icon bill-stat-icon--blue">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa"
              stroke-width="2" stroke-linecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8"  y1="2" x2="8"  y2="6"/>
              <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
          </div>
        </div>
        <span class="bill-stat__val">{{ renewDate }}</span>
      </div>

      <div class="bill-stat">
        <div class="bill-stat__top">
          <span class="bill-stat__label">DAYS REMAINING</span>
          <div class="bill-stat-icon" :class="daysLeft <= 3 ? 'bill-stat-icon--red' : 'bill-stat-icon--amber'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              :stroke="daysLeft <= 3 ? '#f87171' : '#f59e0b'"
              stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
        </div>
        <span class="bill-stat__val" :class="{ 'bill-stat__val--warn': daysLeft <= 3 }">{{ daysLeft }}</span>
        <span v-if="daysLeft <= 5" class="bill-stat__note bill-stat__note--warn">
          {{ daysLeft <= 1 ? 'Expires today!' : `Renews in ${daysLeft} days` }}
        </span>
      </div>

      <div class="bill-stat">
        <div class="bill-stat__top">
          <span class="bill-stat__label">AUTO-RENEW</span>
          <div class="bill-stat-icon bill-stat-icon--purple">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa"
              stroke-width="2" stroke-linecap="round">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </div>
        </div>
        <div :class="['bill-toggle', { 'bill-toggle--on': autoRenew }]"
          @click="autoRenew = !autoRenew" style="margin-top:8px">
          <div class="bill-toggle-thumb"/>
        </div>
        <span class="bill-stat__note">{{ autoRenew ? 'Enabled' : 'Disabled' }}</span>
      </div>
    </div>

    <!-- Switch plan section -->
    <div class="bill-switch-hdr">
      <div>
        <h2 class="bill-switch-title">Switch plan</h2>
        <p class="bill-switch-sub">
          On <strong style="color:var(--t1)">{{ currentPlan }}</strong>.
          Upgrade charges immediately.
          <span style="color:#60a5fa">Downgrade is queued and starts when your current plan ends.</span>
        </p>
      </div>
      <div class="bill-switch-actions">
        <!-- Billing cycle toggle -->
        <div class="bill-cycle-toggle">
          <button :class="['bill-cycle-btn', { 'bill-cycle-btn--active': cycle === 'monthly' }]"
            @click="cycle = 'monthly'">Monthly</button>
          <button :class="['bill-cycle-btn', { 'bill-cycle-btn--active': cycle === 'annual' }]"
            @click="cycle = 'annual'">
            Annual
            <span class="bill-cycle-save">Save 20%</span>
          </button>
        </div>
        <button class="bill-redeem-btn" @click="showRedeem = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
            <line x1="10" y1="14" x2="14" y2="14"/>
          </svg>
          Redeem code
        </button>
      </div>
    </div>

    <!-- Plan cards -->
    <div class="bill-plans-grid">
      <div v-for="plan in plans" :key="plan.id"
        :class="['bill-plan-card',
          { 'bill-plan-card--current': plan.id === currentPlan },
          { 'bill-plan-card--popular': plan.popular },
        ]">

        <!-- Popular badge -->
        <div v-if="plan.popular" class="bill-plan-popular">Most Popular</div>

        <!-- Plan name + price -->
        <div class="bill-plan-head">
          <span class="bill-plan-name">{{ plan.id }}</span>
          <div class="bill-plan-price-wrap">
            <span class="bill-plan-price">{{ displayPrice(plan) }}</span>
            <span class="bill-plan-period" v-if="plan.base > 0">
              /{{ cycle === 'annual' ? 'yr' : 'mo' }}
            </span>
          </div>
          <span v-if="cycle === 'annual' && plan.base > 0" class="bill-plan-saving">
            Save ₦{{ annualSaving(plan).toLocaleString() }}/yr
          </span>
        </div>

        <!-- Features -->
        <ul class="bill-plan-features">
          <li v-for="f in plan.features" :key="f">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
              stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ f }}
          </li>
        </ul>

        <!-- Limits row -->
        <div class="bill-plan-limits">
          <div v-for="limit in plan.limits" :key="limit.label" class="bill-plan-limit">
            <span class="bill-plan-limit-val">{{ limit.val }}</span>
            <span class="bill-plan-limit-lbl">{{ limit.label }}</span>
          </div>
        </div>

        <!-- CTA button -->
        <button
          :class="['bill-plan-btn',
            plan.id === currentPlan ? 'bill-plan-btn--current' : 'bill-plan-btn--select'
          ]"
          :disabled="plan.id === currentPlan"
          @click="switchPlan(plan)">
          <svg v-if="plan.id === currentPlan" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ plan.id === currentPlan ? 'Current plan' : plan.id === 'Enterprise' ? 'Contact sales' : `Switch to ${plan.id}` }}
        </button>
      </div>
    </div>

    <!-- FAQ / notes -->
    <div class="bill-notes">
      <div v-for="note in notes" :key="note.q" class="bill-note-item" @click="note.open = !note.open">
        <div class="bill-note-q">
          <span>{{ note.q }}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round"
            :style="{ transform: note.open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
        <Transition name="slide-down">
          <p v-if="note.open" class="bill-note-a">{{ note.a }}</p>
        </Transition>
      </div>
    </div>

    <!-- ════ HISTORY MODAL ════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showHistory" class="bill-overlay" @click.self="showHistory = false">
          <div class="bill-modal">
            <div class="bill-modal-hdr">
              <div>
                <h2 class="bill-modal-title">Subscription History</h2>
                <p class="bill-modal-sub">All billing events and invoices</p>
              </div>
              <button class="bill-modal-close" @click="showHistory = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div v-if="billingHistory.length === 0" class="bill-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,.12)" stroke-width="1.5" stroke-linecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p>No billing history yet.</p>
            </div>
            <div v-else class="bill-hist-list">
              <div v-for="h in billingHistory" :key="h.id" class="bill-hist-row">
                <div :class="['bill-hist-icon', `bill-hist-icon--${h.type}`]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    v-html="h.type === 'upgrade' ? '<polyline points=\'17 11 21 7 17 3\'/><path d=\'M3 11V9a4 4 0 0 1 4-4h14\'/>' :
                    h.type === 'renew' ? '<polyline points=\'1 4 1 10 7 10\'/><path d=\'M3.51 15a9 9 0 1 0 .49-4.95\'/>' :
                    '<line x1=\'5\' y1=\'12\' x2=\'19\' y2=\'12\'/>'"/>
                </div>
                <div class="bill-hist-info">
                  <span class="bill-hist-desc">{{ h.description }}</span>
                  <span class="bill-hist-date">{{ h.date }}</span>
                </div>
                <span :class="['bill-hist-amount', h.amount === 0 ? 'bill-hist-amount--free' : '']">
                  {{ h.amount === 0 ? 'Free' : `₦${h.amount.toLocaleString()}` }}
                </span>
                <span :class="['bill-hist-status', `bill-hist-status--${h.status}`]">{{ h.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════ REDEEM CODE MODAL ════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showRedeem" class="bill-overlay" @click.self="showRedeem = false">
          <div class="bill-modal bill-modal--sm">
            <div class="bill-modal-hdr">
              <div>
                <h2 class="bill-modal-title">Redeem Code</h2>
                <p class="bill-modal-sub">Enter a promo or gift code below</p>
              </div>
              <button class="bill-modal-close" @click="showRedeem = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="bill-redeem-body">
              <input v-model="redeemCode" class="bill-redeem-input"
                placeholder="Enter your code (e.g. GLOBAL50FREE)"
                @keydown.enter="applyCode" />
              <p class="bill-redeem-hint">Codes are case-insensitive. Each code can only be used once.</p>
              <button class="bill-redeem-apply" :disabled="!redeemCode.trim()" @click="applyCode">
                Apply Code
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════ UPGRADE CONFIRM MODAL ════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="confirmPlan" class="bill-overlay" @click.self="confirmPlan = null">
          <div class="bill-modal bill-modal--sm">
            <div class="bill-modal-hdr">
              <div>
                <h2 class="bill-modal-title">Switch to {{ confirmPlan?.id }}?</h2>
                <p class="bill-modal-sub">Confirm your plan change</p>
              </div>
              <button class="bill-modal-close" @click="confirmPlan = null">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="bill-confirm-body">
              <div class="bill-confirm-row">
                <span>Current plan</span><strong>{{ currentPlan }}</strong>
              </div>
              <div class="bill-confirm-row">
                <span>New plan</span><strong>{{ confirmPlan?.id }}</strong>
              </div>
              <div class="bill-confirm-row">
                <span>Amount due</span>
                <strong style="color:#22c55e">{{ displayPrice(confirmPlan) }}</strong>
              </div>
              <div class="bill-confirm-row">
                <span>Billing cycle</span>
                <strong>{{ cycle === 'annual' ? 'Annual' : 'Monthly' }}</strong>
              </div>
              <div v-if="isPaidUpgrade(confirmPlan)" class="bill-confirm-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b"
                  stroke-width="2" stroke-linecap="round" style="flex-shrink:0">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <p>Upgrade charge is applied immediately to your wallet balance.</p>
              </div>
              <div class="bill-confirm-btns">
                <button class="bill-confirm-cancel" @click="confirmPlan = null">Cancel</button>
                <button class="bill-confirm-ok" @click="confirmSwitch">Confirm switch</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-up">
        <div v-if="toast" :class="['bill-toast', `bill-toast--${toast.type}`]">
          <svg v-if="toast.type === 'success'" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ toast.msg }}
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* ── State ── */
const currentPlan = ref('Starter')
const renewDate   = ref('6/14/2026')
const autoRenew   = ref(false)
const cycle       = ref('monthly')
const showHistory = ref(false)
const showRedeem  = ref(false)
const redeemCode  = ref('')
const confirmPlan = ref(null)
const toast       = ref(null)

const daysLeft = computed(() => {
  const renew = new Date('2026-06-14')
  const today = new Date('2026-06-09')
  return Math.ceil((renew - today) / (1000 * 60 * 60 * 24))
})

/* ── Plans ── */
const plans = [
  {
    id: 'Starter', base: 0, annualBase: 0, popular: false,
    features: ['Email Composer', 'Support Pages', 'Tracking Pages', 'Online Banking', 'Pay-as-you-go SMS', 'Basic Analytics'],
    limits: [
      { val: '5', label: 'Emails/mo' },
      { val: '0', label: 'SMS credits' },
      { val: '0', label: 'Call mins' },
      { val: '1', label: 'Website' },
    ],
  },
  {
    id: 'Basic', base: 5000, annualBase: 4000, popular: false,
    features: ['Everything in Starter', '500 Branded Emails/mo', '50 SMS Credits/mo', '10 Call Minutes/mo', '3 Websites', 'Priority Support'],
    limits: [
      { val: '500', label: 'Emails/mo' },
      { val: '50',  label: 'SMS credits' },
      { val: '10',  label: 'Call mins' },
      { val: '3',   label: 'Websites' },
    ],
  },
  {
    id: 'Professional', base: 15000, annualBase: 12000, popular: true,
    features: ['Everything in Basic', '5,000 Branded Emails/mo', '500 SMS Credits/mo', '60 Call Minutes/mo', '10 Websites', 'Custom Sender IDs', 'Advanced Analytics', '24/7 Support'],
    limits: [
      { val: '5K',  label: 'Emails/mo' },
      { val: '500', label: 'SMS credits' },
      { val: '60',  label: 'Call mins' },
      { val: '10',  label: 'Websites' },
    ],
  },
  {
    id: 'Enterprise', base: 50000, annualBase: 40000, popular: false,
    features: ['Everything in Professional', 'Unlimited Emails', 'Unlimited SMS', '300 Call Minutes/mo', 'Unlimited Websites', 'Dedicated Account Manager', 'SLA Guarantee', 'White-label Options'],
    limits: [
      { val: '∞',   label: 'Emails/mo' },
      { val: '∞',   label: 'SMS credits' },
      { val: '300', label: 'Call mins' },
      { val: '∞',   label: 'Websites' },
    ],
  },
]

/* ── Billing history ── */
const billingHistory = ref([
  { id: 1, type: 'renew',   description: 'Starter plan activated',       date: 'Jun 9, 2026',  amount: 0,     status: 'completed' },
])

/* ── FAQ ── */
const notes = ref([
  { q: 'When am I charged for an upgrade?',    a: 'Upgrades are charged immediately from your wallet balance. Ensure you have sufficient funds before switching.',                          open: false },
  { q: 'How does downgrading work?',           a: 'Downgrades are queued. Your current plan remains active until it expires, then the new lower plan takes effect on renewal.',                open: false },
  { q: 'What happens when my plan expires?',   a: 'If auto-renew is off and your plan expires, you fall back to Starter (free). No features are lost permanently — just re-upgrade anytime.', open: false },
  { q: 'Can I cancel anytime?',                a: 'Yes. Turn off auto-renew and your plan will expire at the end of the current billing period without charging you again.',                    open: false },
])

/* ── Computed ── */
function displayPrice(plan) {
  if (!plan) return ''
  if (plan.base === 0) return 'Free'
  const p = cycle.value === 'annual' ? plan.annualBase * 12 : plan.base
  return `₦${p.toLocaleString()}`
}

function annualSaving(plan) {
  return (plan.base - plan.annualBase) * 12
}

function isPaidUpgrade(plan) {
  if (!plan) return false
  return plan.base > 0
}

/* ── Methods ── */
function switchPlan(plan) {
  if (plan.id === currentPlan.value) return
  if (plan.id === 'Enterprise') {
    showToast('info', 'Contact our sales team for Enterprise pricing.')
    return
  }
  confirmPlan.value = plan
}

function confirmSwitch() {
  const plan = confirmPlan.value
  if (!plan) return

  billingHistory.value.unshift({
    id:          Date.now(),
    type:        plan.base > (plans.find(p => p.id === currentPlan.value)?.base ?? 0) ? 'upgrade' : 'downgrade',
    description: `Switched from ${currentPlan.value} to ${plan.id}`,
    date:        new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    amount:      cycle.value === 'annual' ? plan.annualBase * 12 : plan.base,
    status:      'completed',
  })

  currentPlan.value = plan.id
  confirmPlan.value = null
  showToast('success', `Successfully switched to ${plan.id} plan!`)
}

function applyCode() {
  const code = redeemCode.value.trim().toUpperCase()
  if (!code) return
  if (['GLOBAL50FREE', 'WELCOME2026', 'UPGRADE100'].includes(code)) {
    showToast('success', `Code "${code}" applied! 1 month free added.`)
    showRedeem.value  = false
    redeemCode.value  = ''
  } else {
    showToast('error', 'Invalid or expired code.')
  }
}

function showToast(type, msg) {
  toast.value = { type, msg }
  setTimeout(() => { toast.value = null }, 3500)
}
</script>

<style scoped>
.bill-page {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100vh;
}

/* ── Header ── */
.bill-hdr {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px;
}
.bill-title { font-size: 1.6rem; font-weight: 800; color: var(--t1); margin: 0 0 5px; letter-spacing: -0.02em; }
.bill-sub   { font-size: 0.82rem; color: var(--t3); margin: 0; }

.bill-hist-btn {
  display: flex; align-items: center; gap: 7px; flex-shrink: 0;
  background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 10px 18px; font-size: 0.83rem;
  font-weight: 600; color: var(--t2); cursor: pointer;
  font-family: inherit; transition: all 0.2s;
  backdrop-filter: blur(20px) saturate(180%);
}
.bill-hist-btn:hover { border-color: rgba(34,197,94,.35); color: var(--t1); }

/* ── Stats ── */
.bill-stats {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
}
.bill-stat {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 18px; padding: 20px 22px;
  display: flex; flex-direction: column; gap: 8px;
}
.bill-stat__top {
  display: flex; justify-content: space-between; align-items: center;
}
.bill-stat__label {
  font-size: 0.63rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--t3);
}
.bill-stat-icon {
  width: 32px; height: 32px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
}
.bill-stat-icon--green  { background: rgba(34,197,94,.1);   border: 1px solid rgba(34,197,94,.2);   }
.bill-stat-icon--blue   { background: rgba(96,165,250,.1);  border: 1px solid rgba(96,165,250,.2);  }
.bill-stat-icon--amber  { background: rgba(245,158,11,.1);  border: 1px solid rgba(245,158,11,.2);  }
.bill-stat-icon--red    { background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.2); }
.bill-stat-icon--purple { background: rgba(167,139,250,.1); border: 1px solid rgba(167,139,250,.2); }

.bill-stat__val         { font-size: 1.5rem; font-weight: 800; color: var(--t1); line-height: 1; }
.bill-stat__val--warn   { color: #f87171; }
.bill-stat__note        { font-size: 0.7rem; color: var(--t3); }
.bill-stat__note--warn  { color: #f59e0b; font-weight: 600; }

/* toggle */
.bill-toggle {
  width: 42px; height: 24px; border-radius: 12px;
  background: rgba(255,255,255,.1); border: 1px solid var(--border-soft);
  position: relative; cursor: pointer; transition: all 0.25s;
}
.bill-toggle--on { background: rgba(34,197,94,.25); border-color: rgba(34,197,94,.4); }
.bill-toggle-thumb {
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--t3); position: absolute; top: 2px; left: 2px;
  transition: transform 0.25s, background 0.25s;
}
.bill-toggle--on .bill-toggle-thumb { transform: translateX(18px); background: #22c55e; }

/* ── Switch plan header ── */
.bill-switch-hdr {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.bill-switch-title { font-size: 1.25rem; font-weight: 800; color: var(--t1); margin: 0 0 6px; letter-spacing: -0.01em; }
.bill-switch-sub   { font-size: 0.8rem; color: var(--t3); margin: 0; line-height: 1.5; max-width: 520px; }

.bill-switch-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

/* billing cycle toggle */
.bill-cycle-toggle {
  display: flex; gap: 0;
  background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 4px;
  backdrop-filter: blur(20px) saturate(180%);
}
.bill-cycle-btn {
  display: flex; align-items: center; gap: 6px;
  background: none; border: none; border-radius: 7px;
  padding: 7px 14px; font-size: 0.78rem; font-weight: 600;
  color: var(--t3); cursor: pointer; font-family: inherit; transition: all 0.18s;
}
.bill-cycle-btn--active { background: rgba(34,197,94,.12); color: #22c55e; border: 1px solid rgba(34,197,94,.25); }
.bill-cycle-save {
  background: rgba(34,197,94,.18); color: #22c55e;
  font-size: 0.58rem; font-weight: 800; padding: 1px 5px; border-radius: 4px;
}

.bill-redeem-btn {
  display: flex; align-items: center; gap: 7px;
  background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 9px 16px; font-size: 0.8rem;
  font-weight: 600; color: var(--t2); cursor: pointer;
  font-family: inherit; transition: all 0.2s;
  backdrop-filter: blur(20px) saturate(180%);
}
.bill-redeem-btn:hover { border-color: rgba(167,139,250,.35); color: var(--t1); }

/* ── Plan cards grid ── */
.bill-plans-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: start;
}

.bill-plan-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; padding: 24px 20px;
  display: flex; flex-direction: column; gap: 18px;
  position: relative; overflow: visible;
  transition: border-color 0.22s, transform 0.22s;
}
.bill-plan-card:hover:not(.bill-plan-card--current) {
  transform: translateY(-3px);
  border-color: rgba(34,197,94,.3);
}
.bill-plan-card--current { border-color: rgba(34,197,94,.5); background: rgba(34,197,94,.04); }
.bill-plan-card--popular { border-color: rgba(167,139,250,.4); background: rgba(167,139,250,.04); }

.bill-plan-popular {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(90deg, #a78bfa, #7c5cfc);
  color: #fff; font-size: 0.6rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.09em;
  padding: 3px 12px; border-radius: 999px; white-space: nowrap;
}

.bill-plan-head { display: flex; flex-direction: column; gap: 6px; }
.bill-plan-name {
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.09em; color: var(--t3);
}
.bill-plan-price-wrap { display: flex; align-items: baseline; gap: 3px; }
.bill-plan-price  { font-size: 1.7rem; font-weight: 800; color: var(--t1); line-height: 1; }
.bill-plan-period { font-size: 0.8rem; color: var(--t3); }
.bill-plan-saving {
  font-size: 0.68rem; font-weight: 700; color: #22c55e;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  border-radius: 6px; padding: 2px 7px; width: fit-content;
}

.bill-plan-features {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 9px; flex: 1;
}
.bill-plan-features li {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 0.77rem; color: var(--t2); line-height: 1.4;
}

/* limits row */
.bill-plan-limits {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  padding: 14px; border-radius: 12px;
  background: rgba(255,255,255,.03); border: 1px solid var(--border-soft);
}
.bill-plan-limit { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.bill-plan-limit-val { font-size: 0.95rem; font-weight: 800; color: var(--t1); }
.bill-plan-limit-lbl { font-size: 0.6rem; color: var(--t3); text-transform: uppercase; letter-spacing: 0.06em; text-align: center; }

/* plan button */
.bill-plan-btn {
  width: 100%; padding: 11px; border-radius: 11px;
  font-size: 0.8rem; font-weight: 700; cursor: pointer;
  font-family: inherit; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.bill-plan-btn--current {
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #22c55e;
  cursor: default;
}
.bill-plan-btn--select {
  background: rgba(255,255,255,.07); border: 1px solid var(--border-soft); color: var(--t2);
}
.bill-plan-btn--select:hover { background: rgba(34,197,94,.1); border-color: rgba(34,197,94,.3); color: #22c55e; }

/* ── FAQ ── */
.bill-notes {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; overflow: hidden;
}
.bill-note-item {
  padding: 16px 22px; border-bottom: 1px solid var(--border-soft);
  cursor: pointer; transition: background 0.15s;
}
.bill-note-item:last-child { border-bottom: none; }
.bill-note-item:hover { background: rgba(255,255,255,.03); }
.bill-note-q {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.84rem; font-weight: 600; color: var(--t1);
}
.bill-note-a {
  font-size: 0.78rem; color: var(--t3); margin: 10px 0 0; line-height: 1.6;
}

/* ── Modals ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from,  .modal-fade-leave-to     { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,  .slide-down-leave-to     { opacity: 0; transform: translateY(-6px); }

.bill-overlay {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,.65); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.bill-modal {
  background: var(--modal-glass); backdrop-filter: blur(24px) saturate(180%); border: 1px solid var(--modal-border);
  border-radius: 24px; padding: 28px;
  width: 100%; max-width: 580px; max-height: 88vh; overflow-y: auto;
  display: flex; flex-direction: column; gap: 0;
}
.bill-modal--sm { max-width: 420px; }

.bill-modal-hdr {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 22px;
}
.bill-modal-title { font-size: 1.1rem; font-weight: 800; color: var(--t1); margin: 0 0 4px; }
.bill-modal-sub   { font-size: 0.77rem; color: var(--t3); margin: 0; }
.bill-modal-close {
  width: 30px; height: 30px; border-radius: 8px;
  background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  color: var(--t2); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: background 0.15s;
  flex-shrink: 0;
}
.bill-modal-close:hover { background: rgba(248,113,113,.12); color: #f87171; }

/* empty */
.bill-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 32px 0; color: var(--t3); font-size: 0.82rem;
}

/* history list */
.bill-hist-list { display: flex; flex-direction: column; gap: 0; }
.bill-hist-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 0; border-bottom: 1px solid var(--border-soft);
}
.bill-hist-row:last-child { border-bottom: none; }
.bill-hist-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.bill-hist-icon--upgrade  { background: rgba(34,197,94,.1);   color: #22c55e;  border: 1px solid rgba(34,197,94,.2);   }
.bill-hist-icon--renew    { background: rgba(96,165,250,.1);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.2);  }
.bill-hist-icon--downgrade{ background: rgba(245,158,11,.1);  color: #f59e0b;  border: 1px solid rgba(245,158,11,.2);  }

.bill-hist-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.bill-hist-desc { font-size: 0.83rem; font-weight: 600; color: var(--t1); }
.bill-hist-date { font-size: 0.7rem; color: var(--t3); }
.bill-hist-amount { font-size: 0.85rem; font-weight: 700; color: var(--t1); flex-shrink: 0; }
.bill-hist-amount--free { color: #22c55e; }
.bill-hist-status {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  padding: 2px 8px; border-radius: 999px; flex-shrink: 0;
}
.bill-hist-status--completed { background: rgba(34,197,94,.1); color: #22c55e; border: 1px solid rgba(34,197,94,.2); }

/* redeem */
.bill-redeem-body { display: flex; flex-direction: column; gap: 14px; }
.bill-redeem-input {
  width: 100%; background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 13px 16px; font-size: 0.92rem; font-weight: 600;
  color: var(--t1); font-family: 'Satoshi', inherit; outline: none;
  transition: border-color 0.2s; text-transform: uppercase; letter-spacing: 0.05em;
  box-sizing: border-box;
}
.bill-redeem-input:focus { border-color: rgba(34,197,94,.4); }
.bill-redeem-hint  { font-size: 0.72rem; color: var(--t3); margin: 0; }
.bill-redeem-apply {
  width: 100%; padding: 13px; border-radius: 12px;
  background: #22c55e; border: none;
  font-size: 0.88rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s, opacity 0.2s;
}
.bill-redeem-apply:hover:not(:disabled) { background: #16a34a; }
.bill-redeem-apply:disabled { opacity: 0.4; cursor: not-allowed; }

/* confirm */
.bill-confirm-body { display: flex; flex-direction: column; gap: 14px; }
.bill-confirm-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.82rem; color: var(--t3);
  padding: 10px 0; border-bottom: 1px solid var(--border-soft);
}
.bill-confirm-row:last-of-type { border-bottom: none; }
.bill-confirm-row strong { color: var(--t1); font-weight: 700; }
.bill-confirm-note {
  display: flex; gap: 9px; align-items: flex-start;
  background: rgba(245,158,11,.07); border: 1px solid rgba(245,158,11,.2);
  border-radius: 11px; padding: 12px 14px;
}
.bill-confirm-note p { font-size: 0.78rem; color: var(--t2); margin: 0; line-height: 1.5; }
.bill-confirm-btns { display: flex; gap: 10px; margin-top: 4px; }
.bill-confirm-cancel {
  flex: 1; padding: 12px; border-radius: 11px;
  background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  color: var(--t2); cursor: pointer; font-family: inherit;
  font-size: 0.84rem; font-weight: 600; transition: all 0.2s;
}
.bill-confirm-cancel:hover { background: rgba(255,255,255,.1); color: var(--t1); }
.bill-confirm-ok {
  flex: 1; padding: 12px; border-radius: 11px;
  background: #22c55e; border: none;
  color: #fff; cursor: pointer; font-family: inherit;
  font-size: 0.84rem; font-weight: 800; transition: background 0.2s;
}
.bill-confirm-ok:hover { background: #16a34a; }

/* ── Toast ── */
.toast-up-enter-active, .toast-up-leave-active { transition: all 0.3s ease; }
.toast-up-enter-from, .toast-up-leave-to       { opacity: 0; transform: translateY(20px); }
.bill-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px;
  padding: 13px 22px; border-radius: 14px;
  font-size: 0.84rem; font-weight: 600; z-index: 9999;
  backdrop-filter: blur(20px); white-space: nowrap;
}
.bill-toast--success { background: rgba(34,197,94,.18);  border: 1px solid rgba(34,197,94,.3);  color: #22c55e;  }
.bill-toast--error   { background: rgba(248,113,113,.18); border: 1px solid rgba(248,113,113,.3); color: #f87171; }
.bill-toast--info    { background: rgba(96,165,250,.18);  border: 1px solid rgba(96,165,250,.3);  color: #60a5fa; }

@media (max-width: 1024px) and (min-width: 769px) {
  .bill-stats      { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .bill-plans-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
  .bill-switch-hdr { flex-wrap: wrap; gap: 10px; }
}
@media (max-width: 768px) {
  .bill-page       { padding: 0; gap: 18px; }
  .bill-hdr        { flex-direction: column; align-items: flex-start; gap: 10px; }
  .bill-hist-btn   { width: 100%; justify-content: center; }
  .bill-stats      { grid-template-columns: 1fr 1fr; gap: 10px; }
  .bill-stat       { padding: 14px 16px; }
  .bill-stat__val  { font-size: 1.2rem; }
  .bill-switch-hdr { flex-direction: column; align-items: flex-start; gap: 12px; }
  .bill-switch-actions { flex-wrap: wrap; width: 100%; }
  .bill-cycle-toggle   { flex: 1; }
  .bill-redeem-btn     { flex: 1; justify-content: center; }
  .bill-plans-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .bill-plan-card  { padding: 18px 14px; }
  .bill-plan-price { font-size: 1.4rem; }
  .bill-overlay    { padding: 12px; align-items: flex-end; }
  .bill-modal      { max-width: 100%; border-radius: 22px 22px 0 0; max-height: 90vh; }
  .bill-toast      { bottom: 90px; max-width: calc(100vw - 32px); white-space: normal; }
}
@media (max-width: 480px) {
  .bill-stats      { grid-template-columns: 1fr; }
  .bill-plans-grid { grid-template-columns: 1fr; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .bill-empty svg { stroke: var(--t4); }
[data-theme="light"] .bill-plan-limits,
[data-theme="light"] .bill-note-item:hover { background: var(--glass-2); }
[data-theme="light"] .bill-redeem-input,
[data-theme="light"] .bill-modal-close,
[data-theme="light"] .bill-confirm-cancel,
[data-theme="light"] .bill-plan-btn--select { background: var(--glass); }
[data-theme="light"] .bill-toggle,
[data-theme="light"] .bill-confirm-cancel:hover { background: var(--glass-hover); }
</style>
