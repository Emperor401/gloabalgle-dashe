<!-- src/views/HelpView.vue -->
<template>
  <div class="help">

    <!-- ── Hero ── -->
    <div class="help-hero">
      <div class="help-hero-bg"/>
      <div class="help-hero-grid"/>
      <div class="help-hero-content">
        <h1 class="help-hero-title">How can we help you?</h1>
        <p class="help-hero-sub">Search our documentation or browse categories below</p>
        <div class="help-hero-search" :class="{ 'help-hero-search--focus': searchFocused }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" class="help-search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            class="help-search-input"
            type="text"
            placeholder="Search documentation, FAQs, guides…"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
            @keydown.enter="activeCategory = 'all'"
          />
          <button class="help-search-btn" @click="activeCategory = 'all'">Search</button>
        </div>
      </div>
    </div>

    <!-- ── Category cards ── -->
    <div class="help-cats">
      <button v-for="cat in categories" :key="cat.key"
        :class="['help-cat', { 'help-cat--active': activeCategory === cat.key }]"
        @click="activeCategory = cat.key; searchQuery = ''">
        <div :class="['help-cat-icon', `help-cat-icon--${cat.color}`]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" v-html="cat.icon"/>
        </div>
        <span class="help-cat-label">{{ cat.label }}</span>
        <span class="help-cat-count">{{ cat.count }} articles</span>
      </button>
    </div>

    <!-- ── Body ── -->
    <div class="help-body">

      <!-- FAQ Panel -->
      <div class="help-faq">
        <div class="help-faq-hdr">
          <div>
            <h2 class="help-section-title">Frequently Asked Questions</h2>
            <p class="help-section-sub">
        
              {{ filteredFaqs.length }} result{{ filteredFaqs.length !== 1 ? 's' : '' }}
              <span v-if="searchQuery"> for "<strong>{{ searchQuery }}</strong>"</span>
            </p>
          </div>
          <span v-if="activeCategory !== 'all'" class="help-filter-chip">
            {{ categories.find(c => c.key === activeCategory)?.label }}
            <button class="help-chip-x" @click="activeCategory = 'all'">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </span>
        </div>

        <div class="help-faq-list">
          <div v-for="(faq, i) in filteredFaqs" :key="faq.id"
            :class="['help-faq-item', { 'help-faq-item--open': openFaq === i }]">
            <button class="help-faq-trigger" @click="openFaq = openFaq === i ? null : i">
              <span class="help-faq-q">{{ faq.question }}</span>
              <div :class="['help-faq-toggle', { 'help-faq-toggle--open': openFaq === i }]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="3" stroke-linecap="round">
                  <line v-if="openFaq !== i" x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
            </button>
            <Transition name="accordion">
              <div v-if="openFaq === i" class="help-faq-answer">
                {{ faq.answer }}
              </div>
            </Transition>
          </div>

          <div v-if="filteredFaqs.length === 0" class="help-faq-empty">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,.08)" stroke-width="1.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>No results found for "<strong>{{ searchQuery }}</strong>"</p>
            <button class="help-clear-btn" @click="searchQuery = ''; activeCategory = 'all'">Clear search</button>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="help-right">

        <!-- Quick Links -->
        <div class="help-card">
          <h2 class="help-section-title">Quick Links</h2>
          <div class="help-links-list">
            <a v-for="link in quickLinks" :key="link.label" href="#" class="help-link" @click.prevent>
              <div :class="['help-link-icon', `help-link-icon--${link.color}`]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" v-html="link.icon"/>
              </div>
              <span class="help-link-label">{{ link.label }}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round" class="help-link-arrow">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Contact Support -->
        <div class="help-card help-card--green">
          <div class="help-contact-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
              stroke-width="2" stroke-linecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3 class="help-contact-title">Still need help?</h3>
          <p class="help-contact-desc">Our support team is available 24/7 to assist you with any issue.</p>
          <div class="help-contact-btns">
            <button class="help-primary-btn" @click="showToast('success','Ticket submitted! We\'ll respond within 4 minutes.')">
              Open a Ticket
            </button>
            <button class="help-ghost-btn" @click="showToast('info','Live chat is coming soon!')">
              Live Chat
            </button>
          </div>
          <div class="help-contact-meta">
            <div class="help-meta-row">
              <span class="help-meta-dot help-meta-dot--green"/>
              Avg response: ~4 minutes
            </div>
            <div class="help-meta-row">
              <span class="help-meta-dot help-meta-dot--blue"/>
              99.9% satisfaction rate
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="help-card">
          <div class="help-status-hdr">
            <h2 class="help-section-title">System Status</h2>
            <span class="help-status-ok-badge">
              <span class="help-status-pulse"/>
              All systems operational
            </span>
          </div>
          <div class="help-status-list">
            <div v-for="sys in systemStatus" :key="sys.name" class="help-status-row">
              <span class="help-status-name">{{ sys.name }}</span>
              <div class="help-status-right">
                <span :class="['help-status-dot', `help-status-dot--${sys.status}`]"/>
                <span :class="['help-status-label', `help-status-label--${sys.status}`]">{{ sys.label }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-up">
        <div v-if="toast" :class="['help-toast', `help-toast--${toast.type}`]">
          <svg v-if="toast.type === 'success'" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
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

const searchQuery    = ref('')
const activeCategory = ref('all')
const openFaq        = ref(0)
const searchFocused  = ref(false)

/* ── Categories ── */
const categories = [
  { key: 'all',          label: 'All Topics',   count: 24, color: 'purple',
    icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { key: 'accounts',     label: 'Accounts',     count: 8,  color: 'green',
    icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h2"/><path d="M2 10h20"/>' },
  { key: 'transactions', label: 'Transactions', count: 6,  color: 'amber',
    icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { key: 'security',     label: 'Security',     count: 5,  color: 'red',
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { key: 'compliance',   label: 'Compliance',   count: 5,  color: 'blue',
    icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
]

/* ── FAQs ── */
const allFaqs = [
  { id: 1, category: 'accounts',     question: 'How do I onboard a new customer?',           answer: 'To onboard a new customer, navigate to the Customers page and click "Add Customer". Fill in the required KYC details including full name, email, phone number, and government-issued ID. Once submitted, the customer will receive a verification email. Their account status will remain "Pending" until KYC is approved by a compliance officer.' },
  { id: 2, category: 'accounts',     question: 'How do I suspend or reactivate a customer account?', answer: 'Open the customer\'s profile from the Customers page, click the "..." action menu, and select "Suspend Account". The customer\'s status will update to "Suspended" immediately and they will be unable to perform transactions. To reactivate, follow the same steps and choose "Reactivate Account".' },
  { id: 3, category: 'transactions', question: 'What causes a transaction to fail?',           answer: 'Transactions can fail for several reasons: insufficient funds, a suspended account, a flagged KYC status, network timeout, or a fraud detection trigger. Failed transactions are automatically logged with an error code. You can view the details by clicking the transaction in the Transactions view and opening the detail panel.' },
  { id: 4, category: 'transactions', question: 'Can I reverse or refund a completed transaction?', answer: 'Completed transactions cannot be automatically reversed from the dashboard. To initiate a reversal, you must open a support ticket with the Transaction ID, customer name, and reason. The core banking team will review and process the reversal within 1–3 business days subject to compliance review.' },
  { id: 5, category: 'security',     question: 'How do I enable two-factor authentication?',   answer: 'Go to Settings → Security and click "Enable 2FA". You will be prompted to scan a QR code using an authenticator app (Google Authenticator, Authy, etc.). After scanning, enter the 6-digit verification code to confirm. 2FA will be required on every subsequent login.' },
  { id: 6, category: 'security',     question: 'What should I do if I suspect unauthorised access?', answer: 'Immediately go to Settings → Security → Active Sessions and revoke all unrecognised sessions. Then change your password and enable 2FA if not already active. Contact our security team via the support ticket system and mark it as "URGENT – Security Incident" so it is escalated immediately.' },
  { id: 7, category: 'compliance',   question: 'What KYC documents are required for customer verification?', answer: 'Standard KYC requires a government-issued photo ID (national ID card, passport, or driver\'s licence) and proof of address (utility bill or bank statement dated within 90 days). For business accounts, a Certificate of Incorporation and a letter of authorisation from the business owner are also required.' },
  { id: 8, category: 'accounts',     question: 'How are customer balances updated in the dashboard?', answer: 'Customer balances shown in the dashboard are fetched from the core banking system and cached for performance. The cache refreshes every 5 minutes. For a real-time balance, click the "Refresh" button on the customer\'s profile page or view their full transaction history for the most up-to-date ledger.' },
]

const filteredFaqs = computed(() => {
  let list = allFaqs
  if (activeCategory.value !== 'all') list = list.filter(f => f.category === activeCategory.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
  }
  return list
})

/* ── Quick Links ── */
const quickLinks = [
  { label: 'Getting Started Guide',     color: 'green',  icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' },
  { label: 'Transaction Limits & Fees', color: 'amber',  icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { label: 'KYC & Compliance Manual',   color: 'blue',   icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>' },
  { label: 'API Integration Docs',      color: 'purple', icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
  { label: 'Admin Role Permissions',    color: 'green',  icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { label: 'Audit Log & Reporting',     color: 'amber',  icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
]

/* ── System Status ── */
const systemStatus = [
  { name: 'Core Banking API',     status: 'ok',       label: 'Operational' },
  { name: 'Transaction Engine',   status: 'ok',       label: 'Operational' },
  { name: 'KYC Verification',     status: 'ok',       label: 'Operational' },
  { name: 'Notification Service', status: 'degraded', label: 'Degraded'    },
  { name: 'Analytics Pipeline',   status: 'ok',       label: 'Operational' },
]

/* ── Toast ── */
const toast = ref(null)
function showToast(type, msg) {
  toast.value = { type, msg }
  setTimeout(() => { toast.value = null }, 3000)
}
</script>

<style scoped>
.help {
  display: flex; flex-direction: column; gap: 18px;
}

/* ── Hero ── */
.help-hero {
  position: relative; border-radius: 22px; overflow: hidden;
  padding: 44px 24px; display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(34,197,94,.2);
}
.help-hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #071a0f 0%, #0a2318 30%, #0d1f2d 70%, #080d1a 100%);
}
.help-hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(34,197,94,.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,197,94,.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
/* radial glow */
.help-hero::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(34,197,94,.12) 0%, transparent 65%);
  pointer-events: none;
}
.help-hero-content {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  text-align: center; width: 100%;
}
.help-hero-title {
  font-size: 2rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.025em;
}
.help-hero-sub { font-size: 0.87rem; color: rgba(255,255,255,.5); margin: 0; }

.help-hero-search {
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
  border-radius: 13px; padding: 10px 10px 10px 16px;
  width: 100%; max-width: 560px; transition: border-color 0.22s;
}
.help-hero-search--focus { border-color: rgba(34,197,94,.45); background: rgba(255,255,255,.09); }
.help-search-icon { color: rgba(255,255,255,.35); flex-shrink: 0; }
.help-search-input {
  background: none; border: none; outline: none;
  font-family: inherit; font-size: 0.88rem; color: #fff; flex: 1;
}
.help-search-input::placeholder { color: rgba(255,255,255,.3); }
.help-search-btn {
  padding: 8px 22px; border-radius: 9px; background: #22c55e; border: none;
  font-size: 0.84rem; font-weight: 800; color: #fff; cursor: pointer;
  font-family: inherit; transition: background 0.2s; flex-shrink: 0;
}
.help-search-btn:hover { background: #16a34a; }

/* ── Category cards ── */
.help-cats {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;
}
.help-cat {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 16px;
  padding: 18px 14px; display: flex; flex-direction: column;
  align-items: center; gap: 8px; text-align: center;
  cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.help-cat:hover { border-color: rgba(34,197,94,.3); transform: translateY(-2px); }
.help-cat--active { background: rgba(34,197,94,.08); border-color: rgba(34,197,94,.35); }

.help-cat-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.help-cat-icon--purple { background: rgba(167,139,250,.12); color: #a78bfa; border: 1px solid rgba(167,139,250,.2); }
.help-cat-icon--green  { background: rgba(34,197,94,.12);   color: #22c55e; border: 1px solid rgba(34,197,94,.2);   }
.help-cat-icon--amber  { background: rgba(245,158,11,.12);  color: #f59e0b; border: 1px solid rgba(245,158,11,.2);  }
.help-cat-icon--red    { background: rgba(248,113,113,.12); color: #f87171; border: 1px solid rgba(248,113,113,.2); }
.help-cat-icon--blue   { background: rgba(96,165,250,.12);  color: #60a5fa; border: 1px solid rgba(96,165,250,.2);  }

.help-cat--active .help-cat-icon--purple { background: rgba(167,139,250,.2); border-color: rgba(167,139,250,.35); }
.help-cat--active .help-cat-icon--green  { background: rgba(34,197,94,.2);   border-color: rgba(34,197,94,.4);    }
.help-cat--active .help-cat-icon--amber  { background: rgba(245,158,11,.2);  border-color: rgba(245,158,11,.35);  }
.help-cat--active .help-cat-icon--red    { background: rgba(248,113,113,.2); border-color: rgba(248,113,113,.35); }
.help-cat--active .help-cat-icon--blue   { background: rgba(96,165,250,.2);  border-color: rgba(96,165,250,.35);  }

.help-cat-label { font-size: 0.82rem; font-weight: 700; color: var(--t1); }
.help-cat-count { font-size: 0.66rem; color: var(--t3); }

/* ── Body ── */
.help-body {
  display: grid; grid-template-columns: 1fr 290px; gap: 16px; align-items: start;
}

/* ── FAQ Panel ── */
.help-faq {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 20px;
  padding: 22px; display: flex; flex-direction: column; gap: 16px;
}
.help-faq-hdr {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
}
.help-section-title { font-size: 0.92rem; font-weight: 800; color: var(--t1); margin: 0 0 3px; }
.help-section-sub   { font-size: 0.75rem; color: var(--t3); margin: 0; }
.help-section-sub strong { color: var(--t2); }

.help-filter-chip {
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25);
  border-radius: 999px; padding: 4px 8px 4px 12px;
  font-size: 0.72rem; font-weight: 700; color: #22c55e;
}
.help-chip-x {
  background: rgba(34,197,94,.15); border: none; border-radius: 50%;
  width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #22c55e; transition: background 0.2s;
}
.help-chip-x:hover { background: rgba(34,197,94,.3); }

.help-faq-list { display: flex; flex-direction: column; gap: 4px; }

.help-faq-item {
  border: 1px solid var(--border-soft); border-radius: 13px; overflow: hidden;
  transition: border-color 0.2s;
}
.help-faq-item--open { border-color: rgba(34,197,94,.3); background: rgba(34,197,94,.04); }

.help-faq-trigger {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 15px 18px; background: none; border: none; cursor: pointer;
  text-align: left; font-family: inherit; transition: background 0.15s;
}
.help-faq-trigger:hover { background: rgba(255,255,255,.03); }

.help-faq-q {
  font-size: 0.87rem; font-weight: 600; color: var(--t1); line-height: 1.4; flex: 1;
}
.help-faq-toggle {
  width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
  background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center; color: var(--t3);
  transition: all 0.2s;
}
.help-faq-toggle--open {
  background: rgba(34,197,94,.15); border-color: rgba(34,197,94,.3); color: #22c55e;
}

.help-faq-answer {
  padding: 0 18px 16px 18px;
  font-size: 0.82rem; line-height: 1.7; color: var(--t3);
}

.accordion-enter-active, .accordion-leave-active {
  transition: opacity 0.22s ease, max-height 0.28s ease;
  max-height: 500px; overflow: hidden;
}
.accordion-enter-from, .accordion-leave-to { opacity: 0; max-height: 0; }

.help-faq-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 40px 20px; color: var(--t3); font-size: 0.83rem; text-align: center;
}
.help-faq-empty strong { color: var(--t2); }
.help-clear-btn {
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25);
  border-radius: 9px; padding: 7px 16px; font-size: 0.78rem; font-weight: 700;
  color: #22c55e; cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.help-clear-btn:hover { background: rgba(34,197,94,.2); }

/* ── Right column ── */
.help-right { display: flex; flex-direction: column; gap: 14px; }

.help-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 20px;
  padding: 20px; display: flex; flex-direction: column; gap: 12px;
}
.help-card--green { border-color: rgba(34,197,94,.2); background: rgba(34,197,94,.04); }

/* Quick Links */
.help-links-list { display: flex; flex-direction: column; gap: 2px; }
.help-link {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 11px; border-radius: 10px; text-decoration: none;
  border: 1px solid transparent; transition: all 0.18s;
}
.help-link:hover {
  background: rgba(255,255,255,.04); border-color: var(--border-soft);
}
.help-link:hover .help-link-arrow { color: #22c55e; transform: translateX(3px); }

.help-link-icon {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.help-link-icon--green  { background: rgba(34,197,94,.1);   color: #22c55e;  border: 1px solid rgba(34,197,94,.18);   }
.help-link-icon--amber  { background: rgba(245,158,11,.1);  color: #f59e0b;  border: 1px solid rgba(245,158,11,.18);  }
.help-link-icon--blue   { background: rgba(96,165,250,.1);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.18);  }
.help-link-icon--purple { background: rgba(167,139,250,.1); color: #a78bfa;  border: 1px solid rgba(167,139,250,.18); }
.help-link-icon--red    { background: rgba(248,113,113,.1); color: #f87171;  border: 1px solid rgba(248,113,113,.18); }

.help-link-label {
  flex: 1; font-size: 0.8rem; font-weight: 600; color: var(--t2);
}
.help-link-arrow { color: var(--t3); transition: color 0.18s, transform 0.18s; flex-shrink: 0; }

/* Contact */
.help-contact-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  display: flex; align-items: center; justify-content: center;
}
.help-contact-title { font-size: 0.88rem; font-weight: 800; color: var(--t1); margin: 0; }
.help-contact-desc  { font-size: 0.76rem; color: var(--t3); margin: 0; line-height: 1.5; }
.help-contact-btns  { display: flex; gap: 8px; }

.help-primary-btn {
  flex: 1; padding: 9px; border-radius: 10px; background: #22c55e; border: none;
  font-size: 0.8rem; font-weight: 800; color: #fff; cursor: pointer;
  font-family: inherit; transition: background 0.2s;
}
.help-primary-btn:hover { background: #16a34a; }

.help-ghost-btn {
  flex: 1; padding: 9px; border-radius: 10px;
  background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  font-size: 0.8rem; font-weight: 600; color: var(--t2); cursor: pointer;
  font-family: inherit; transition: all 0.2s;
}
.help-ghost-btn:hover { background: rgba(255,255,255,.1); color: var(--t1); }

.help-contact-meta { display: flex; flex-direction: column; gap: 6px; padding-top: 4px; border-top: 1px solid var(--border-soft); }
.help-meta-row {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.71rem; color: var(--t3);
}
.help-meta-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.help-meta-dot--green { background: #22c55e; }
.help-meta-dot--blue  { background: #60a5fa; }

/* System Status */
.help-status-hdr   { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.help-status-ok-badge {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.62rem; font-weight: 700; color: #22c55e;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  border-radius: 999px; padding: 3px 10px; white-space: nowrap;
}
.help-status-pulse {
  width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: .35; }
}

.help-status-list { display: flex; flex-direction: column; gap: 6px; }
.help-status-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px; border-radius: 10px;
  background: rgba(255,255,255,.04); border: 1px solid var(--border-soft);
}
.help-status-name  { font-size: 0.76rem; color: var(--t2); }
.help-status-right { display: flex; align-items: center; gap: 6px; }
.help-status-dot   { width: 7px; height: 7px; border-radius: 50%; }
.help-status-dot--ok       { background: #22c55e; }
.help-status-dot--degraded { background: #f59e0b; }
.help-status-dot--down     { background: #f87171; }
.help-status-label { font-size: 0.7rem; font-weight: 700; }
.help-status-label--ok       { color: #22c55e; }
.help-status-label--degraded { color: #f59e0b; }
.help-status-label--down     { color: #f87171; }

/* ── Toast ── */
.toast-up-enter-active, .toast-up-leave-active { transition: all 0.3s ease; }
.toast-up-enter-from, .toast-up-leave-to       { opacity: 0; transform: translateY(18px); }
.help-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 9px;
  padding: 12px 20px; border-radius: 13px; font-size: 0.83rem; font-weight: 600;
  z-index: 9999; backdrop-filter: blur(20px); white-space: nowrap;
}
.help-toast--success { background: rgba(34,197,94,.18);  border: 1px solid rgba(34,197,94,.3);  color: #22c55e; }
.help-toast--info    { background: rgba(96,165,250,.18); border: 1px solid rgba(96,165,250,.3); color: #60a5fa; }
/* ── Tablet ── */
@media (max-width: 1024px) and (min-width: 769px) {
  .help-cats { grid-template-columns: repeat(5, 1fr); gap: 8px; }
  .help-cat  { padding: 14px 10px; }
  .help-cat-icon { width: 38px; height: 38px; }
  .help-body { grid-template-columns: 1fr 260px; }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .help { gap: 14px; }

  /* Hero */
  .help-hero         { padding: 32px 20px; }
  .help-hero-title   { font-size: 1.5rem; }
  .help-hero-sub     { font-size: 0.8rem; }
  .help-hero-search  { max-width: 100%; }

  /* Category cards — 3 cols */
  .help-cats   { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .help-cat    { padding: 14px 10px; gap: 6px; }
  .help-cat-icon    { width: 38px; height: 38px; border-radius: 10px; }
  .help-cat-label   { font-size: 0.75rem; }
  .help-cat-count   { font-size: 0.62rem; }

  /* Body — stack to single column */
  .help-body   { grid-template-columns: 1fr; gap: 14px; }

  /* FAQ header — wrap on narrow */
  .help-faq-hdr { flex-wrap: wrap; gap: 8px; }
  .help-faq-trigger { padding: 13px 15px; }
  .help-faq-q   { font-size: 0.83rem; }
  .help-faq-answer  { padding: 0 15px 14px; font-size: 0.79rem; }

  /* Right column becomes a normal stacked section */
  .help-right  { gap: 12px; }
  .help-status-hdr  { flex-wrap: wrap; gap: 6px; }
  .help-status-ok-badge { font-size: 0.58rem; }

  /* Toast above bottom nav */
  .help-toast  { bottom: 90px; max-width: calc(100vw - 32px); white-space: normal; text-align: center; }
}

/* ── Small Mobile ── */
@media (max-width: 480px) {
  .help { gap: 12px; }

  /* Hero tighter */
  .help-hero         { padding: 26px 16px; border-radius: 18px; }
  .help-hero-title   { font-size: 1.25rem; }
  .help-hero-sub     { font-size: 0.75rem; }
  .help-hero-search  { padding: 8px 8px 8px 12px; gap: 8px; }
  .help-search-btn   { padding: 7px 14px; font-size: 0.78rem; }

  /* Category cards — 2 cols */
  .help-cats   { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .help-cat    { padding: 12px 8px; border-radius: 14px; }
  .help-cat-icon    { width: 34px; height: 34px; border-radius: 9px; }
  .help-cat-label   { font-size: 0.72rem; }

  /* FAQ */
  .help-faq    { padding: 16px; gap: 12px; }
  .help-faq-trigger { padding: 11px 12px; gap: 10px; }
  .help-faq-answer  { padding: 0 12px 12px; }

  /* Cards */
  .help-card   { padding: 16px; }
  .help-contact-btns { flex-direction: column; }
  .help-primary-btn, .help-ghost-btn { flex: unset; width: 100%; }
  .help-status-name  { font-size: 0.7rem; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .help-faq-trigger:hover,
[data-theme="light"] .help-link:hover,
[data-theme="light"] .help-status-row { background: var(--glass-2); }
[data-theme="light"] .help-faq-toggle,
[data-theme="light"] .help-ghost-btn { background: var(--glass); }
[data-theme="light"] .help-ghost-btn:hover { background: var(--glass-hover); }
</style>
