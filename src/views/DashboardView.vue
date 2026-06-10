<!-- src/views/DashboardView.vue -->
<template>
  <div class="dashboard">
    <CommunityModal />

    <!-- Page header -->
    <div class="dash-header">
      <div class="dash-header__left">
        <h1 class="dash-header__title">Dashboard</h1>
        <p class="dash-header__sub">At-a-glance view of your account, subscription, and recent activity.</p>
      </div>
      <div class="dash-header__right">
        <div class="plan-badge">
          <span class="plan-badge__dot"></span>
          Current: Starter
        </div>
        <button class="upgrade-btn" @click="router.push('/billing')">Upgrade plan</button>
      </div>
    </div>

    <div class="bento">

      <!-- ╔══ Balance Card (span 2) ══╗ -->
      <div class="b-card b-balance">

        <!-- Greeting -->
        <p class="bal-greeting">Welcome back, <strong>Daniel</strong> <span class="wave-emoji">👋</span></p>

        <!-- Balance row -->
        <div class="bal-top-row">
          <div class="bal-left">
            <span class="bal-label" @click="router.push('/wallet')" style="cursor:pointer">Balance
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </span>
            <div class="bal-fig">
              <span class="bal-sign">$</span>
              <span class="bal-int">260,375</span><span class="bal-dec">.03</span>
            </div>
          </div>
          <button class="add-funds-btn" @click="router.push('/wallet')">Fund Wallet</button>
        </div>

        <!-- Auto deposit toggle -->
        <div class="auto-dep-row">
          <div class="toggle-wrap" @click="autoDeposit = !autoDeposit">
            <div class="toggle" :class="{ 'toggle--on': autoDeposit }">
              <div class="toggle__knob" />
            </div>
          </div>
          <span class="auto-dep-text">Auto deposit is {{ autoDeposit ? 'enabled' : 'disabled' }}</span>
        </div>

        <!-- Action buttons -->
        <div class="bal-actions">
          <!-- Email Services -->
          <button class="ba-tile" @click="router.push('/customers')">
            <span class="ba-tile__icon ba-tile__icon--blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <span class="ba-tile__label">Email</span>
          </button>
          <!-- Generator -->
          <button class="ba-tile" @click="router.push('/email-services/branded-bills')">
            <span class="ba-tile__icon ba-tile__icon--amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </span>
            <span class="ba-tile__label">Generator</span>
          </button>
          <!-- Websites -->
          <button class="ba-tile" @click="router.push('/analytics')">
            <span class="ba-tile__icon ba-tile__icon--purple">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </span>
            <span class="ba-tile__label">Websites</span>
          </button>
          <!-- Tools -->
          <button class="ba-tile" @click="router.push('/tools')">
            <span class="ba-tile__icon ba-tile__icon--green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </span>
            <span class="ba-tile__label">Tools</span>
          </button>
        </div>


      </div>

      <!-- ╔══ Plan Stats (span 2) ══╗ -->
      <div class="b-plan-row">

        <!-- Active Plan -->
        <div class="b-card ps-card" @click="router.push('/billing')" style="cursor:pointer">
          <div class="ps-top">
            <span class="ps-label">Active Plan</span>
            <div class="ps-icon ps-icon--green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M2 10h20"/><path d="M16 14h2"/>
              </svg>
            </div>
          </div>
          <span class="ps-value">Starter</span>
          <span class="ps-sub">Current subscription</span>
        </div>

        <!-- Renews / Expires -->
        <div class="b-card ps-card" @click="router.push('/billing')" style="cursor:pointer">
          <div class="ps-top">
            <span class="ps-label">Renews / Expires</span>
            <div class="ps-icon ps-icon--blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>
          <span class="ps-value">6/14/2026</span>
          <span class="ps-sub">Next billing date</span>
        </div>

        <!-- Recent Payments -->
        <div class="b-card ps-card" @click="router.push('/transactions')" style="cursor:pointer">
          <div class="ps-top">
            <span class="ps-label">Recent Payments</span>
            <div class="ps-icon ps-icon--purple">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round">
                <rect x="2" y="3" width="20" height="18" rx="2"/>
                <line x1="8" y1="10" x2="16" y2="10"/>
                <line x1="8" y1="14" x2="13" y2="14"/>
              </svg>
            </div>
          </div>
          <span class="ps-value">3</span>
          <span class="ps-sub">This billing cycle</span>
        </div>

      </div>

      <!-- ╔══ Recent Wallet Transactions (span 2) ══╗ -->
      <div class="b-card b-recent-txn">
        <div class="section-head">
          <span class="section-title">Recent wallet transactions</span>
          <a class="see-all" @click="router.push('/transactions')">See all →</a>
        </div>
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-6l-2 3H10l-2-3H2"/>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
          </div>
          <p class="empty-title">No transactions yet</p>
          <p class="empty-sub">Top up your wallet to see activity here.</p>
        </div>
      </div>

      <!-- ╔══ Recent Payments (span 2) ══╗ -->
      <div class="b-card b-recent-pay">
        <div class="section-head">
          <span class="section-title">Recent payments</span>
          <a class="see-all" @click="router.push('/transactions')">See all →</a>
        </div>

        <table class="pay-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in recentPayments" :key="p.id">
              <td>{{ p.date }}</td>
              <td>
                <div class="pay-method">
                  <div class="pay-method-icon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="#22c55e" stroke-width="2" stroke-linecap="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <path d="M2 10h20"/>
                    </svg>
                  </div>
                  <span>{{ p.method }} <span class="pay-cur">{{ p.currency }}</span></span>
                </div>
              </td>
              <td class="pay-amount">{{ fmtAmount(p.amount, p.currency) }}</td>
              <td><span class="pay-status" :class="`pay-status--${p.status}`">{{ p.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ╔══ Referral + Advertplace (span 4) ══╗ -->
      <div class="b-promo-row">

        <!-- Refer & Earn -->
        <div class="promo-card promo-card--referral">
          <div class="promo-card__header">
            <div class="promo-icon promo-icon--purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <p class="promo-card__title">Refer &amp; Earn</p>
              <p class="promo-card__sub">Invite friends, earn rewards</p>
            </div>
          </div>

          <div class="ref-code-row">
            <div class="ref-code-box">
              <span class="ref-code-label">Your referral code</span>
              <span class="ref-code-val">GLB-IFY2024</span>
            </div>
            <div class="ref-code-actions">
              <button class="ref-copy-btn" @click="copyReferralCode" :class="{ 'ref-copy-btn--copied': refCopied }">
                <svg v-if="!refCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ refCopied ? 'Copied!' : 'Copy' }}
              </button>
              <button class="ref-share-btn" @click="shareReferral">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        <!-- Advertplace -->
        <div class="promo-card promo-card--advert">
          <div class="promo-card__header">
            <div class="promo-icon promo-icon--amber">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <p class="promo-card__title">Advertplace</p>
              <p class="promo-card__sub">Grow your business reach</p>
            </div>
            <span class="advert-live-badge">
              <span class="advert-live-dot"></span> Live
            </span>
          </div>

          <div class="advert-metrics">
            <div class="advert-metric">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span class="advert-metric__val">24.8k</span>
              <span class="advert-metric__lbl">Impressions</span>
            </div>
            <div class="advert-metric">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span class="advert-metric__val">1,340</span>
              <span class="advert-metric__lbl">Clicks</span>
            </div>
            <div class="advert-metric">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span class="advert-metric__val">$312</span>
              <span class="advert-metric__lbl">Revenue</span>
            </div>
          </div>

          <div class="advert-slots">
            <div class="advert-slot advert-slot--active">
              <div class="advert-slot__dot advert-slot__dot--green"></div>
              <div class="advert-slot__info">
                <span class="advert-slot__name">Globalgle Pro Banner</span>
                <span class="advert-slot__meta">Ends Jun 20 · 5.4% CTR</span>
              </div>
              <span class="advert-slot__badge">Active</span>
            </div>
            <div class="advert-slot">
              <div class="advert-slot__dot advert-slot__dot--amber"></div>
              <div class="advert-slot__info">
                <span class="advert-slot__name">Summer Promo Spot</span>
                <span class="advert-slot__meta">Scheduled · Jul 1</span>
              </div>
              <span class="advert-slot__badge advert-slot__badge--pending">Pending</span>
            </div>
          </div>

          <button class="advert-cta-btn" @click="router.push('/tools')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create New Ad
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CommunityModal from '../components/ui/CommunityModal.vue'

const router = useRouter()

const autoDeposit = ref(true)


const refCopied = ref(false)
function copyReferralCode() {
  navigator.clipboard?.writeText('GLB-IFY2024').catch(() => {})
  refCopied.value = true
  setTimeout(() => { refCopied.value = false }, 2000)
}
function shareReferral() {
  const text = 'Join Globalgle — the smarter banking dashboard. Use my referral code GLB-IFY2024 to get started!'
  if (navigator.share) {
    navigator.share({ title: 'Join Globalgle', text }).catch(() => {})
  } else {
    navigator.clipboard?.writeText(text).catch(() => {})
    refCopied.value = true
    setTimeout(() => { refCopied.value = false }, 2000)
  }
}

const recentPayments = [
  { id: 1, date: 'Jun 7, 2026', method: 'Korapay', currency: 'NGN', amount: 8,     status: 'pending'   },
  { id: 2, date: 'Jun 7, 2026', method: 'Korapay', currency: 'NGN', amount: 50000, status: 'pending'   },
  { id: 3, date: 'Jun 7, 2026', method: 'Korapay', currency: 'NGN', amount: 6000,  status: 'pending'   },
]

function fmtAmount(amount, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency', currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount)
}
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 20px; }

/* ══ PAGE HEADER ══ */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 4px;
}

.dash-header__left { display: flex; flex-direction: column; gap: 4px; }

.dash-header__title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--t1);
  margin: 0;
  letter-spacing: -0.02em;
}

.dash-header__sub {
  font-size: 0.82rem;
  color: var(--t3);
  margin: 0;
}

.dash-header__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.plan-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 999px;
  background: rgba(34,197,94,.12);
  border: 1px solid rgba(34,197,94,.25);
  color: #22c55e;
  font-size: 0.78rem;
  font-weight: 600;
}

.plan-badge__dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse-dot 2s infinite;
}

.upgrade-btn {
  padding: 7px 18px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  color: var(--t1);
  font-family: 'Satoshi', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.upgrade-btn:hover {
  border-color: #22c55e;
  color: #22c55e;
  background: rgba(34,197,94,.08);
}

/* ══ Bento grid ══ */
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* Card base */
.b-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  border: 1px solid var(--border-soft);
  border-radius: 22px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
  transition: border-color 0.25s ease;
}

.b-card:hover { border-color: var(--border); }

/* Column spans */
.b-balance  { grid-column: span 2; }
.b-recent-txn { grid-column: span 2; }
.b-recent-pay { grid-column: span 2; }

/* ══ BALANCE CARD ══ */
.bal-greeting {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--t2);
  margin: 0 0 2px;
}
.bal-greeting strong { color: var(--t1); font-weight: 800; }
.wave-emoji {
  display: inline-block;
  animation: wave-hand 2.4s ease-in-out infinite;
  transform-origin: 70% 70%;
}
@keyframes wave-hand {
  0%, 60%, 100% { transform: rotate(0deg); }
  10%, 30%      { transform: rotate(18deg); }
  20%           { transform: rotate(-6deg); }
  40%           { transform: rotate(12deg); }
  50%           { transform: rotate(-2deg); }
}

.bal-top-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.bal-left { display: flex; flex-direction: column; gap: 4px; }

.bal-label {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--t2);
  cursor: pointer;
}
.bal-label svg { color: var(--t3); }

.bal-fig {
  display: flex;
  align-items: baseline;
  gap: 2px;
  line-height: 1;
}
.bal-sign {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--t2);
  align-self: flex-start;
  margin-top: 5px;
}
.bal-int {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.04em;
}
.bal-dec {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--t2);
  letter-spacing: -0.02em;
}

/* Add funds button */
.add-funds-btn {
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-family: 'Satoshi', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.15s;
}
.add-funds-btn:hover { opacity: 0.88; transform: translateY(-1px); }

/* Auto deposit toggle */
.auto-dep-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.toggle-wrap { cursor: pointer; }
.toggle {
  width: 38px; height: 22px;
  border-radius: 999px;
  background: var(--border);
  position: relative;
  transition: background 0.25s;
}
.toggle--on { background: #22c55e; }
.toggle__knob {
  position: absolute;
  top: 3px; left: 3px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.25s;
}
.toggle--on .toggle__knob { transform: translateX(16px); }
.auto-dep-text {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--t2);
}

/* Action buttons row */
.bal-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.ba-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
  flex-shrink: 0;
  font-family: 'Satoshi', sans-serif;
}
.ba-tile:hover { transform: translateY(-2px); opacity: 0.85; }
.ba-tile:active { transform: translateY(0) scale(0.97); }

.ba-tile__icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ba-tile__icon--green  { background: rgba(34, 197, 94, 0.15);  color: #22c55e; }
.ba-tile__icon--amber  { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.ba-tile__icon--blue   { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
.ba-tile__icon--purple { background: rgba(167, 139, 250, 0.15);color: #a78bfa; }
.ba-tile__icon--teal   { background: rgba(20, 184, 166, 0.15); color: #14b8a6; }

.ba-tile__label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--t2);
  white-space: nowrap;
}

/* ══ PLAN STATS ROW ══ */
.b-plan-row {
  grid-column: span 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.ps-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 18px;
  min-height: unset;
}

.ps-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.ps-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--t3);
  line-height: 1.4;
}

.ps-icon {
  width: 30px; height: 30px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ps-icon--green  { background: rgba(34,197,94,.15);  }
.ps-icon--blue   { background: rgba(96,165,250,.15);  }
.ps-icon--purple { background: rgba(167,139,250,.15); }

.ps-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.03em;
  line-height: 1;
}

.ps-sub {
  font-size: 0.7rem;
  color: var(--t3);
  margin-top: auto;
}

/* ══ COMMON TITLE ══ */
.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--t1);
  margin: 0;
}

/* ══ MORE MENU ══ */
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; transform: translateY(-4px); }


/* ══ SECTION HEADER ══ */
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--t1);
}
.see-all {
  font-size: 0.78rem;
  font-weight: 600;
  color: #22c55e;
  cursor: pointer;
  transition: opacity 0.2s;
}
.see-all:hover { opacity: 0.75; }

/* ══ EMPTY STATE ══ */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1.5px dashed var(--border);
  border-radius: 14px;
  padding: 36px 20px;
  margin-top: 4px;
}
.empty-icon {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: var(--glass-2);
  border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center;
}
.empty-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--t1);
  margin: 0;
}
.empty-sub {
  font-size: 0.75rem;
  color: var(--t3);
  margin: 0;
  text-align: center;
}

/* ══ PAYMENTS TABLE ══ */
.pay-table {
  width: 100%; border-collapse: collapse; margin-top: 4px;
}
.pay-table th {
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: var(--t3);
  padding: 0 12px 10px; text-align: left;
  border-bottom: 1px solid var(--border-soft);
}
.pay-table td {
  font-size: 0.82rem; color: var(--t2);
  padding: 12px; border-bottom: 1px solid var(--border-soft);
}
.pay-table tr:last-child td { border-bottom: none; }
.pay-table tr:hover td      { background: rgba(255,255,255,.03); }

.pay-method      { display: flex; align-items: center; gap: 8px; }
.pay-method-icon {
  width: 24px; height: 24px; border-radius: 7px;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pay-cur    { font-size: 0.65rem; color: var(--t4); font-weight: 600; }
.pay-amount { font-weight: 700; color: var(--t1); letter-spacing: -0.02em; }

.pay-status {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 999px;
  font-size: 0.7rem; font-weight: 700;
}
.pay-status--pending   { background: rgba(245,158,11,.12);  color: #f59e0b; border: 1px solid rgba(245,158,11,.25);  }
.pay-status--completed { background: rgba(34,197,94,.12);   color: #22c55e; border: 1px solid rgba(34,197,94,.25);   }
.pay-status--failed    { background: rgba(248,113,113,.12); color: #f87171; border: 1px solid rgba(248,113,113,.25); }

/* ══ REFERRAL + ADVERTPLACE ══ */
.b-promo-row {
  grid-column: span 4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.promo-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  border-radius: 20px;
  border: 1.5px solid var(--border-soft);
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  transition: border-color 0.22s;
}
.promo-card--referral:hover { border-color: rgba(124,92,252,0.35); }
.promo-card--advert:hover   { border-color: rgba(245,158,11,0.35); }

.promo-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.promo-card__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--t1);
  margin: 0;
}
.promo-card__sub {
  font-size: 0.72rem;
  color: var(--t3);
  margin: 2px 0 0;
}

.promo-icon {
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.promo-icon--purple { background: rgba(124,92,252,0.14); color: #a78bfa; }
.promo-icon--amber  { background: rgba(245,158,11,0.14); color: #f59e0b; }

/* ── Referral stats ── */
.ref-stats {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  overflow: hidden;
}
.ref-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  gap: 2px;
}
.ref-stat__val {
  font-size: 1.15rem;
  font-weight: 700;
  color: #a78bfa;
}
.ref-stat__lbl {
  font-size: 0.68rem;
  color: var(--t3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.ref-stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-soft);
  flex-shrink: 0;
}

/* ── Referral progress ── */
.ref-progress-wrap { display: flex; flex-direction: column; gap: 6px; }
.ref-progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--t3);
}
.ref-progress-pct { font-weight: 700; color: #a78bfa; }
.ref-progress-bar {
  height: 6px;
  border-radius: 99px;
  background: rgba(124,92,252,0.12);
  overflow: hidden;
}
.ref-progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #7c5cfc, #a78bfa);
  transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
}
.ref-progress-hint {
  font-size: 0.7rem;
  color: var(--t3);
  margin: 0;
}
.ref-progress-hint strong { color: var(--t2); }

/* ── Referral code row ── */
.ref-code-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}
.ref-code-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px dashed rgba(124,92,252,0.35);
  background: rgba(124,92,252,0.06);
  min-width: 0;
}
.ref-code-label { font-size: 0.65rem; color: var(--t3); text-transform: uppercase; letter-spacing: 0.05em; }
.ref-code-val   { font-size: 0.9rem; font-weight: 700; color: #a78bfa; letter-spacing: 0.06em; }
.ref-code-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.ref-copy-btn,
.ref-share-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(124,92,252,0.35);
  background: rgba(124,92,252,0.10);
  color: #a78bfa;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: 'Satoshi', sans-serif;
}
.ref-copy-btn:hover,
.ref-share-btn:hover { background: rgba(124,92,252,0.20); border-color: #7c5cfc; }
.ref-copy-btn--copied {
  border-color: rgba(34,197,94,0.45);
  background: rgba(34,197,94,0.12);
  color: #22c55e;
}

/* ── Advert live badge ── */
.advert-live-badge {
  margin-left: auto;
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px;
  border-radius: 99px;
  background: rgba(34,197,94,0.10);
  border: 1px solid rgba(34,197,94,0.25);
  font-size: 0.68rem;
  font-weight: 600;
  color: #22c55e;
}
.advert-live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: live-pulse 1.8s ease-in-out infinite;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

/* ── Advert metrics ── */
.advert-metrics {
  display: flex;
  gap: 0;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  overflow: hidden;
}
.advert-metric {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 0;
}
.advert-metric__val {
  font-size: 1rem;
  font-weight: 700;
  color: var(--t1);
}
.advert-metric__lbl {
  font-size: 0.65rem;
  color: var(--t3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── Advert active slots ── */
.advert-slots { display: flex; flex-direction: column; gap: 8px; }
.advert-slot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  background: rgba(255,255,255,0.02);
}
.advert-slot__dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.advert-slot__dot--green { background: #22c55e; }
.advert-slot__dot--amber { background: #f59e0b; }
.advert-slot__info { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.advert-slot__name {
  font-size: 0.78rem; font-weight: 600; color: var(--t1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.advert-slot__meta { font-size: 0.67rem; color: var(--t3); }
.advert-slot__badge {
  font-size: 0.65rem; font-weight: 700;
  padding: 3px 8px; border-radius: 99px;
  background: rgba(34,197,94,0.12);
  border: 1px solid rgba(34,197,94,0.25);
  color: #22c55e;
  white-space: nowrap;
}
.advert-slot__badge--pending {
  background: rgba(245,158,11,0.10);
  border-color: rgba(245,158,11,0.25);
  color: #f59e0b;
}

/* ── Advert CTA ── */
.advert-cta-btn {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  margin-top: auto;
  padding: 11px 0;
  border-radius: 12px;
  border: 1.5px solid rgba(245,158,11,0.35);
  background: rgba(245,158,11,0.09);
  color: #f59e0b;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.22s;
  width: 100%;
}
.advert-cta-btn:hover {
  background: rgba(245,158,11,0.18);
  border-color: #f59e0b;
  transform: translateY(-1px);
}

/* ══════════════════════════════════════
   MOBILE RESPONSIVE
   ══════════════════════════════════════ */
@media (max-width: 1024px) and (min-width: 769px) {
  .dashboard       { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .b-balance       { grid-column: span 2; }
  .b-plan-row      { grid-column: span 2; }
  .b-recent-txn    { grid-column: span 1; }
  .b-recent-pay    { grid-column: span 1; }
  .b-promo-row     { grid-column: span 2; }
  .bal-actions     { gap: 8px; }
}
@media (max-width: 768px) {

  /* Page padding */
  .dashboard { gap: 14px; }

  /* Header stacks */
  .dash-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .dash-header__title { font-size: 1.25rem; }
  .dash-header__right { width: 100%; }
  .plan-badge { font-size: 0.72rem; }

  /* Bento: single column */
  .bento {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* Reset all column spans */
  .b-balance,
  .b-plan-row,
  .b-recent-txn,
  .b-recent-pay,
  .b-promo-row {
    grid-column: span 1;
  }

  /* Balance card */
  .b-card { padding: 18px; border-radius: 18px; }
  .bal-int  { font-size: 2.2rem; }
  .bal-sign { font-size: 1.2rem; }
  .bal-dec  { font-size: 1.2rem; }
  .bal-top-row { align-items: center; }
  .add-funds-btn { padding: 9px 16px; font-size: 0.8rem; }

  /* Action buttons — evenly spaced */
  .bal-actions { gap: 16px; justify-content: space-between; }
  .ba-tile__icon { width: 34px; height: 34px; border-radius: 10px; }
  .ba-tile__label { font-size: 0.63rem; }

  /* Plan stats: 3 cards side-by-side (they're compact enough) */
  .b-plan-row {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .ps-card  { padding: 12px 10px; }
  .ps-value { font-size: 1rem; }
  .ps-label { font-size: 0.58rem; letter-spacing: 0.04em; }
  .ps-icon  { width: 24px; height: 24px; }
  .ps-icon svg { width: 12px; height: 12px; }

  /* Payments table — fits mobile width */
  .b-recent-pay { overflow: hidden; }
  .pay-table    { width: 100%; table-layout: fixed; }
  .pay-table th,
  .pay-table td { padding: 9px 6px; font-size: 0.75rem; }
  .pay-table th { font-size: 0.62rem; padding-bottom: 8px; }
  .pay-method-icon { width: 20px; height: 20px; border-radius: 5px; }
  .pay-method   { gap: 5px; }
  .pay-amount   { font-size: 0.78rem; }

  /* Promo row — stack on mobile */
  .b-promo-row { grid-template-columns: 1fr; gap: 12px; }
  .promo-card  { padding: 16px; }
  .ref-stats,
  .advert-metrics { gap: 0; }
}

@media (max-width: 400px) {
  /* Very small screens: plan cards stack */
  .b-plan-row { grid-template-columns: 1fr; }
  .ba-tile__icon { width: 30px; height: 30px; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .pay-table tr:hover td,
[data-theme="light"] .ref-stats,
[data-theme="light"] .advert-metrics,
[data-theme="light"] .advert-slot { background: var(--glass-2); }
</style>
