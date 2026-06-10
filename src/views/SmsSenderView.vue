<!-- src/views/SmsSenderView.vue -->
<template>
  <div class="sms-page" @click="showCountryDrop = false">

    <!-- Back -->
    <button class="sms-back" @click="router.push('/tools')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      Back to Tools
    </button>

    <!-- Header -->
    <div class="sms-hdr">
      <div class="sms-hdr__inner">
        <div class="sms-hdr-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
            stroke-width="2" stroke-linecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <h1 class="sms-hdr-title">SMS Sender</h1>
          <p class="sms-hdr-sub">
            On Starter ·
            <strong style="color:var(--t1)">0/0</strong> SMS left this month ·
            then pay-as-you-go
            <span style="color:#60a5fa">(price depends on the destination)</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="sms-stats">
      <div class="sms-stat">
        <span class="sms-stat__label">PLAN SMS LEFT THIS MONTH</span>
        <span class="sms-stat__val">0/0</span>
      </div>
      <div class="sms-stat">
        <span class="sms-stat__label">PAY-AS-YOU-GO</span>
        <span class="sms-stat__val sms-stat__val--sm">Priced per destination</span>
      </div>
      <div class="sms-stat">
        <span class="sms-stat__label">WALLET BALANCE</span>
        <span class="sms-stat__val">₦0</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="sms-tab-bar">
      <button v-for="t in tabs" :key="t.id"
        :class="['sms-tab', { 'sms-tab--active': activeTab === t.id }]"
        @click="activeTab = t.id">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" v-html="t.icon" />
        {{ t.label }}
      </button>
    </div>

    <!-- ═══════════════ SINGLE SMS ═══════════════ -->
    <div v-if="activeTab === 'single'" class="sms-split">

      <!-- Form Card -->
      <div class="sms-form-card">

        <!-- Sender ID -->
        <div class="sms-field">
          <label class="sms-label">Sender ID</label>
          <input
            v-model="senderID"
            maxlength="11"
            :class="['sms-input', { 'sms-input--err': senderID && !senderIDValid }]"
            placeholder="e.g. YourBrand, MyCompany"
            @input="senderID = senderID.replace(/[^A-Za-z0-9]/g, '')"
          />
          <div :class="['sms-hint', { 'sms-hint--err': senderID && !senderIDValid }]">
            <svg v-if="senderID && !senderIDValid" width="11" height="11" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ senderID && !senderIDValid
              ? 'Must be 1–11 alphanumeric characters only.'
              : `Up to 11 letters/digits. Shown as the sender on the recipient's phone. (${senderID.length}/11)` }}
          </div>
        </div>

        <!-- Recipient phone -->
        <div class="sms-field">
          <label class="sms-label">Recipient phone number</label>
          <div class="sms-phone-row">
            <!-- Country select -->
            <div class="sms-country-wrap" @click.stop="showCountryDrop = !showCountryDrop">
              <span>{{ selectedCountry.flag }}</span>
              <span class="sms-dial-code">{{ selectedCountry.code }} {{ selectedCountry.dial }}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
              <!-- Country dropdown -->
              <div v-if="showCountryDrop" class="sms-country-drop" @click.stop>
                <input
                  v-model="countrySearch"
                  class="sms-drop-search"
                  placeholder="Search country..."
                  autofocus
                />
                <div
                  v-for="c in filteredCountries"
                  :key="c.code"
                  class="sms-country-item"
                  :class="{ active: c.code === selectedCountry.code }"
                  @click.stop="selectCountry(c)"
                >
                  <span>{{ c.flag }}</span>
                  <span class="sms-country-name">{{ c.name }}</span>
                  <span class="sms-country-dial">{{ c.dial }}</span>
                </div>
              </div>
            </div>
            <input
              v-model="phoneNumber"
              type="tel"
              class="sms-input sms-input--phone"
              placeholder="8012345678"
            />
          </div>
          <p class="sms-hint">
            Pick the destination country, then type the local number. We auto-add the country code
            and remove a leading 0.
          </p>
        </div>

        <!-- Message -->
        <div class="sms-field">
          <label class="sms-label">Message</label>
          <textarea
            v-model="message"
            class="sms-textarea"
            placeholder="Type your message here..."
            rows="5"
          />
          <div class="sms-char-row">
            <span>{{ charCount }} characters · {{ segments }} SMS segment{{ segments !== 1 ? 's' : '' }}</span>
            <span class="sms-char-info">(informational)</span>
          </div>
        </div>

        <!-- Schedule toggle -->
        <label class="sms-schedule-toggle">
          <div
            :class="['sms-toggle', { 'sms-toggle--on': scheduleForLater }]"
            @click="scheduleForLater = !scheduleForLater"
          >
            <div class="sms-toggle-thumb" />
          </div>
          Schedule for later
        </label>

        <!-- Schedule fields -->
        <Transition name="slide-down">
          <div v-if="scheduleForLater" class="sms-schedule-fields">
            <div class="sms-field sms-field--inline">
              <label class="sms-label">Date</label>
              <input type="date" v-model="scheduleDate" class="sms-input" />
            </div>
            <div class="sms-field sms-field--inline">
              <label class="sms-label">Time</label>
              <input type="time" v-model="scheduleTime" class="sms-input" />
            </div>
          </div>
        </Transition>

        <!-- Cost row -->
        <div class="sms-cost-row">
          <div>
            <span class="sms-cost-label">Estimated Cost</span>
            <span class="sms-cost-sub">from wallet balance</span>
          </div>
          <span class="sms-cost-val">
            {{ estimatedCost !== null ? `₦${estimatedCost}` : '—' }}
          </span>
        </div>

        <!-- Send button -->
        <button class="sms-send-btn" :disabled="!canSend" @click="sendSMS">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          {{ scheduleForLater ? 'Schedule SMS' : 'Send SMS' }}
        </button>
      </div>

      <!-- Phone Preview Panel -->
      <div class="sms-preview-panel">
        <div class="sms-preview-label">Live Preview</div>
        <div class="sms-phone-wrap">
          <div class="sms-phone-frame">
            <!-- Notch -->
            <div class="sms-phone-notch" />
            <!-- Screen content -->
            <div class="sms-phone-screen">
              <!-- Contact bar -->
              <div class="sms-phone-topbar">
                <div class="sms-phone-avatar">
                  {{ (senderID || 'YB')[0].toUpperCase() }}
                </div>
                <div>
                  <div class="sms-phone-sender-name">{{ senderID || 'YourBrand' }}</div>
                  <div class="sms-phone-meta">SMS · {{ selectedCountry.flag }} {{ selectedCountry.name }}</div>
                </div>
              </div>
              <!-- Message bubble -->
              <div class="sms-phone-body">
                <div class="sms-bubble" v-if="message">{{ message }}</div>
                <div class="sms-bubble sms-bubble--placeholder" v-else>
                  Your message will appear here...
                </div>
                <div class="sms-bubble-time">{{ previewTime }}</div>
              </div>
            </div>
            <!-- Home indicator -->
            <div class="sms-phone-home" />
          </div>
        </div>

        <!-- Preview stats -->
        <div class="sms-preview-stats">
          <div class="sms-preview-stat">
            <span class="sms-preview-stat__val">{{ charCount }}</span>
            <span class="sms-preview-stat__lbl">Characters</span>
          </div>
          <div class="sms-preview-stat">
            <span class="sms-preview-stat__val">{{ segments }}</span>
            <span class="sms-preview-stat__lbl">Segments</span>
          </div>
          <div class="sms-preview-stat">
            <span class="sms-preview-stat__val" style="color:#22c55e">
              {{ estimatedCost !== null ? `₦${estimatedCost}` : '₦0' }}
            </span>
            <span class="sms-preview-stat__lbl">Est. cost</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ BULK SMS ═══════════════ -->
    <div v-else-if="activeTab === 'bulk'" class="sms-bulk-wrap">

      <div class="sms-form-card">
        <!-- Sender ID -->
        <div class="sms-field">
          <label class="sms-label">Sender ID</label>
          <input v-model="bulkSenderID" maxlength="11" class="sms-input"
            placeholder="e.g. YourBrand" @input="bulkSenderID = bulkSenderID.replace(/[^A-Za-z0-9]/g, '')" />
        </div>

        <!-- Numbers -->
        <div class="sms-field">
          <label class="sms-label">
            Recipient numbers
            <span class="sms-label-count" v-if="bulkRecipients.length">
              {{ bulkRecipients.length }} recipient{{ bulkRecipients.length !== 1 ? 's' : '' }}
            </span>
          </label>
          <textarea
            v-model="bulkNumbers"
            class="sms-textarea"
            rows="6"
            placeholder="Enter one number per line (local format, e.g. 08012345678)&#10;08012345678&#10;08087654321&#10;08011223344"
          />
          <p class="sms-hint">One local phone number per line. We'll use the country code selected below.</p>
        </div>

        <!-- Country for bulk -->
        <div class="sms-field">
          <label class="sms-label">Destination country</label>
          <div class="sms-country-wrap sms-country-wrap--full" @click.stop="showBulkCountryDrop = !showBulkCountryDrop">
            <span>{{ bulkCountry.flag }}</span>
            <span class="sms-dial-code">{{ bulkCountry.name }} {{ bulkCountry.dial }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
            <div v-if="showBulkCountryDrop" class="sms-country-drop" @click.stop>
              <input v-model="bulkCountrySearch" class="sms-drop-search" placeholder="Search..." />
              <div v-for="c in filteredBulkCountries" :key="c.code" class="sms-country-item"
                :class="{ active: c.code === bulkCountry.code }" @click.stop="bulkCountry = c; showBulkCountryDrop = false">
                <span>{{ c.flag }}</span>
                <span class="sms-country-name">{{ c.name }}</span>
                <span class="sms-country-dial">{{ c.dial }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="sms-field">
          <label class="sms-label">Message</label>
          <textarea v-model="bulkMessage" class="sms-textarea" rows="4"
            placeholder="Type your bulk SMS message..." />
          <div class="sms-char-row">
            <span>{{ bulkMessage.length }} characters</span>
            <span class="sms-char-info">({{ bulkSegments }} segment{{ bulkSegments !== 1 ? 's' : '' }} per recipient)</span>
          </div>
        </div>

        <!-- Cost -->
        <div class="sms-cost-row" v-if="bulkRecipients.length && bulkMessage">
          <div>
            <span class="sms-cost-label">Estimated Total Cost</span>
            <span class="sms-cost-sub">{{ bulkRecipients.length }} recipients × ₦{{ bulkCountry.price * bulkSegments }}</span>
          </div>
          <span class="sms-cost-val">₦{{ bulkRecipients.length * bulkCountry.price * bulkSegments }}</span>
        </div>

        <button class="sms-send-btn" :disabled="!canSendBulk" @click="sendBulkSMS">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Send Bulk SMS ({{ bulkRecipients.length }} recipients)
        </button>
      </div>
    </div>

    <!-- ═══════════════ HISTORY ═══════════════ -->
    <div v-else class="sms-history">
      <div v-if="smsHistory.length === 0" class="sms-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.15)"
          stroke-width="1.5" stroke-linecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <p>No SMS messages sent yet.</p>
        <button class="sms-empty-btn" @click="activeTab = 'single'">Send your first SMS</button>
      </div>
      <div v-else class="sms-history-table">
        <div class="sms-history-head">
          <span>SENDER ID</span>
          <span>RECIPIENT</span>
          <span>MESSAGE</span>
          <span>SEGMENTS</span>
          <span>COST</span>
          <span>STATUS</span>
          <span>DATE</span>
        </div>
        <div v-for="h in smsHistory" :key="h.id" class="sms-history-row">
          <span class="sms-h-sender">{{ h.senderID }}</span>
          <span class="sms-h-phone">{{ h.phone }}</span>
          <span class="sms-h-msg">{{ h.message.slice(0, 40) }}{{ h.message.length > 40 ? '…' : '' }}</span>
          <span>{{ h.segments }}</span>
          <span class="sms-h-cost">₦{{ h.cost }}</span>
          <span :class="['sms-h-status', `sms-h-status--${h.status}`]">{{ h.status }}</span>
          <span class="sms-h-date">{{ h.date }}</span>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-up">
        <div v-if="toast" :class="['sms-toast', `sms-toast--${toast.type}`]">
          <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ toast.msg }}
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* ── Countries ── */
const countries = [
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria',       dial: '+234', price: 15 },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana',         dial: '+233', price: 18 },
  { code: 'KE', flag: '🇰🇪', name: 'Kenya',         dial: '+254', price: 18 },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa',  dial: '+27',  price: 22 },
  { code: 'SN', flag: '🇸🇳', name: 'Senegal',       dial: '+221', price: 18 },
  { code: 'US', flag: '🇺🇸', name: 'United States', dial: '+1',   price: 30 },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom',dial: '+44',  price: 28 },
  { code: 'DE', flag: '🇩🇪', name: 'Germany',       dial: '+49',  price: 32 },
  { code: 'FR', flag: '🇫🇷', name: 'France',        dial: '+33',  price: 30 },
  { code: 'IN', flag: '🇮🇳', name: 'India',         dial: '+91',  price: 12 },
  { code: 'AE', flag: '🇦🇪', name: 'UAE',           dial: '+971', price: 35 },
  { code: 'CA', flag: '🇨🇦', name: 'Canada',        dial: '+1',   price: 30 },
]

/* ── Tabs ── */
const tabs = [
  { id: 'single', label: 'Single SMS', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { id: 'bulk',   label: 'Bulk SMS',   icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { id: 'history',label: 'History',    icon: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/>' },
]

/* ── State: Single SMS ── */
const activeTab       = ref('single')
const senderID        = ref('')
const selectedCountry = ref(countries[0])
const showCountryDrop = ref(false)
const countrySearch   = ref('')
const phoneNumber     = ref('')
const message         = ref('')
const scheduleForLater= ref(false)
const scheduleDate    = ref('')
const scheduleTime    = ref('')

/* ── State: Bulk SMS ── */
const bulkSenderID         = ref('')
const bulkNumbers          = ref('')
const bulkMessage          = ref('')
const bulkCountry          = ref(countries[0])
const bulkCountrySearch    = ref('')
const showBulkCountryDrop  = ref(false)

/* ── History ── */
const smsHistory = ref([])

/* ── Toast ── */
const toast = ref(null)

/* ── Computed: single ── */
const senderIDValid = computed(() => /^[A-Za-z0-9]{1,11}$/.test(senderID.value))
const charCount     = computed(() => message.value.length)
const segments      = computed(() => {
  if (!charCount.value) return 0
  return charCount.value <= 160 ? 1 : Math.ceil(charCount.value / 153)
})
const cleanPhone = computed(() =>
  phoneNumber.value.replace(/^0+/, '').replace(/\D/g, '')
)
const fullPhone = computed(() =>
  cleanPhone.value ? `${selectedCountry.value.dial}${cleanPhone.value}` : ''
)
const estimatedCost = computed(() => {
  if (!message.value || !cleanPhone.value) return null
  return selectedCountry.value.price * (segments.value || 1)
})
const canSend = computed(() =>
  senderIDValid.value && cleanPhone.value.length >= 7 && message.value.trim().length > 0
)

const previewTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
})

const filteredCountries = computed(() =>
  countries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.value.toLowerCase()) ||
    c.dial.includes(countrySearch.value) ||
    c.code.toLowerCase().includes(countrySearch.value.toLowerCase())
  )
)

/* ── Computed: bulk ── */
const bulkRecipients = computed(() =>
  bulkNumbers.value
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length >= 7)
)
const bulkSegments = computed(() =>
  !bulkMessage.value.length ? 0
    : bulkMessage.value.length <= 160 ? 1
    : Math.ceil(bulkMessage.value.length / 153)
)
const canSendBulk = computed(() =>
  bulkSenderID.value.length >= 1 &&
  bulkRecipients.value.length > 0 &&
  bulkMessage.value.trim().length > 0
)
const filteredBulkCountries = computed(() =>
  countries.filter(c =>
    c.name.toLowerCase().includes(bulkCountrySearch.value.toLowerCase()) ||
    c.code.toLowerCase().includes(bulkCountrySearch.value.toLowerCase())
  )
)

/* ── Methods ── */
function selectCountry(c) {
  selectedCountry.value = c
  showCountryDrop.value = false
  countrySearch.value   = ''
}

function showToast(type, msg) {
  toast.value = { type, msg }
  setTimeout(() => { toast.value = null }, 3500)
}

function sendSMS() {
  if (!canSend.value) return
  const entry = {
    id:       Date.now(),
    senderID: senderID.value,
    phone:    fullPhone.value,
    message:  message.value,
    segments: segments.value,
    cost:     estimatedCost.value,
    status:   'sent',
    date:     new Date().toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }),
  }
  smsHistory.value.unshift(entry)

  showToast('success',
    scheduleForLater.value
      ? `SMS scheduled for ${scheduleDate.value} at ${scheduleTime.value}`
      : `SMS sent to ${fullPhone.value}`)

  senderID.value         = ''
  phoneNumber.value      = ''
  message.value          = ''
  scheduleForLater.value = false
  scheduleDate.value     = ''
  scheduleTime.value     = ''
}

function sendBulkSMS() {
  if (!canSendBulk.value) return
  bulkRecipients.value.forEach(num => {
    smsHistory.value.unshift({
      id:       Date.now() + Math.random(),
      senderID: bulkSenderID.value,
      phone:    `${bulkCountry.value.dial}${num.replace(/^0+/, '')}`,
      message:  bulkMessage.value,
      segments: bulkSegments.value,
      cost:     bulkCountry.value.price * bulkSegments.value,
      status:   'sent',
      date:     new Date().toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }),
    })
  })
  showToast('success', `${bulkRecipients.value.length} SMS messages sent successfully.`)
  bulkSenderID.value = ''
  bulkNumbers.value  = ''
  bulkMessage.value  = ''
}
</script>

<style scoped>
.sms-page {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 100vh;
}

/* back */
.sms-back {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--t3); font-size: 0.82rem; font-family: inherit;
  padding: 0; transition: color 0.2s; width: fit-content;
}
.sms-back:hover { color: var(--t1); }

/* ── Header ── */
.sms-hdr { display: flex; align-items: center; justify-content: space-between; }
.sms-hdr__inner { display: flex; align-items: center; gap: 16px; }
.sms-hdr-icon {
  width: 52px; height: 52px; border-radius: 16px;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sms-hdr-title { font-size: 1.5rem; font-weight: 800; color: var(--t1); margin: 0 0 4px; letter-spacing: -0.02em; }
.sms-hdr-sub   { font-size: 0.8rem; color: var(--t3); margin: 0; }

/* ── Stats ── */
.sms-stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}
.sms-stat {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 16px; padding: 18px 22px;
  display: flex; flex-direction: column; gap: 8px;
}
.sms-stat__label {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--t3);
}
.sms-stat__val     { font-size: 1.4rem; font-weight: 800; color: var(--t1); }
.sms-stat__val--sm { font-size: 1rem; }

/* ── Tab bar ── */
.sms-tab-bar {
  display: flex; gap: 4px;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 14px; padding: 5px; width: fit-content;
}
.sms-tab {
  display: flex; align-items: center; gap: 7px;
  background: none; border: none;
  border-radius: 10px; padding: 9px 18px;
  font-size: 0.82rem; font-weight: 600; color: var(--t3);
  cursor: pointer; font-family: inherit; transition: all 0.18s;
}
.sms-tab:hover { color: var(--t1); background: rgba(255,255,255,.05); }
.sms-tab--active { background: rgba(34,197,94,.12); color: #22c55e; border: 1px solid rgba(34,197,94,.25); }

/* ── Split layout ── */
.sms-split {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}

/* ── Form Card ── */
.sms-form-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; padding: 28px;
  display: flex; flex-direction: column; gap: 20px;
}

/* fields */
.sms-field { display: flex; flex-direction: column; gap: 7px; }
.sms-field--inline { flex: 1; }
.sms-label {
  font-size: 0.78rem; font-weight: 700; color: var(--t2);
  display: flex; align-items: center; gap: 8px;
}
.sms-label-count {
  font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 999px;
  background: rgba(34,197,94,.12); color: #22c55e; border: 1px solid rgba(34,197,94,.2);
}

/* inputs */
.sms-input {
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 12px 16px; font-size: 0.88rem;
  color: var(--t1); font-family: inherit; outline: none; transition: border-color 0.2s;
}
.sms-input:focus       { border-color: rgba(34,197,94,.4); }
.sms-input--err        { border-color: rgba(248,113,113,.4); }
.sms-input--phone      { flex: 1; border-radius: 0 12px 12px 0; border-left: none; }
.sms-input::placeholder{ color: var(--t3); }

.sms-textarea {
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 12px 16px; font-size: 0.88rem;
  color: var(--t1); font-family: inherit; outline: none; resize: vertical;
  transition: border-color 0.2s; line-height: 1.6;
}
.sms-textarea:focus       { border-color: rgba(34,197,94,.4); }
.sms-textarea::placeholder{ color: var(--t3); }

.sms-hint {
  font-size: 0.73rem; color: var(--t3); line-height: 1.4;
  display: flex; align-items: center; gap: 4px;
}
.sms-hint--err { color: #f87171; }

.sms-char-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.72rem; color: var(--t3);
}
.sms-char-info { color: var(--t3); font-style: italic; }

/* phone input row */
.sms-phone-row { display: flex; }

.sms-country-wrap {
  position: relative;
  display: flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 12px 0 0 12px; padding: 12px 14px;
  cursor: pointer; user-select: none; flex-shrink: 0;
  transition: border-color 0.2s;
}
.sms-country-wrap:hover { border-color: rgba(34,197,94,.3); }
.sms-country-wrap--full { border-radius: 12px; width: 100%; }

.sms-dial-code { font-size: 0.82rem; font-weight: 600; color: var(--t1); white-space: nowrap; }

/* country dropdown */
.sms-country-drop {
  position: absolute; top: calc(100% + 6px); left: 0; min-width: 240px;
  background: var(--bg-card); border: 1px solid var(--border-soft);
  border-radius: 14px; padding: 8px; z-index: 200;
  max-height: 220px; overflow-y: auto;
}
.sms-drop-search {
  width: 100%; background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 8px; padding: 7px 10px; font-size: 0.78rem; color: var(--t1);
  font-family: inherit; outline: none; margin-bottom: 6px; box-sizing: border-box;
}
.sms-country-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border-radius: 9px; cursor: pointer; transition: background 0.15s;
}
.sms-country-item:hover, .sms-country-item.active { background: rgba(34,197,94,.08); }
.sms-country-name { font-size: 0.8rem; color: var(--t1); flex: 1; }
.sms-country-dial { font-size: 0.75rem; color: var(--t3); }

/* schedule toggle */
.sms-schedule-toggle {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; user-select: none; font-size: 0.84rem; font-weight: 600; color: var(--t2);
}
.sms-toggle {
  width: 36px; height: 20px; border-radius: 10px;
  background: rgba(255,255,255,.1); border: 1px solid var(--border-soft);
  position: relative; cursor: pointer; transition: background 0.25s, border-color 0.25s;
  flex-shrink: 0;
}
.sms-toggle--on { background: rgba(34,197,94,.25); border-color: rgba(34,197,94,.4); }
.sms-toggle-thumb {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--t3); position: absolute; top: 2px; left: 2px;
  transition: transform 0.25s, background 0.25s;
}
.sms-toggle--on .sms-toggle-thumb { transform: translateX(16px); background: #22c55e; }

/* schedule fields */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

.sms-schedule-fields { display: flex; gap: 12px; }

/* cost row */
.sms-cost-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px; border-radius: 12px;
  background: rgba(255,255,255,.03); border: 1px solid var(--border-soft);
}
.sms-cost-label { font-size: 0.82rem; font-weight: 600; color: var(--t2); display: block; }
.sms-cost-sub   { font-size: 0.7rem; color: var(--t3); }
.sms-cost-val   { font-size: 1.1rem; font-weight: 800; color: var(--t1); }

/* send btn */
.sms-send-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 14px; border-radius: 12px;
  background: #22c55e; border: none;
  font-size: 0.88rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s, opacity 0.2s;
}
.sms-send-btn:hover:not(:disabled) { background: #16a34a; }
.sms-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Phone Preview ── */
.sms-preview-panel {
  display: flex; flex-direction: column; align-items: center; gap: 18px;
  position: sticky; top: 90px;
}
.sms-preview-label {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--t3);
}
.sms-phone-wrap { width: 220px; }

.sms-phone-frame {
  width: 220px; height: 420px; border-radius: 36px;
  border: 3px solid var(--border-soft);
  background: rgba(255,255,255,.04);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
}
.sms-phone-notch {
  width: 70px; height: 22px; border-radius: 0 0 14px 14px;
  background: var(--border-soft); margin: 0 auto;
  flex-shrink: 0;
}
.sms-phone-screen { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.sms-phone-topbar {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px 8px;
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
}
.sms-phone-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.25);
  font-size: 0.8rem; font-weight: 800; color: #22c55e;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.sms-phone-sender-name { font-size: 0.72rem; font-weight: 700; color: var(--t1); }
.sms-phone-meta        { font-size: 0.6rem; color: var(--t3); }
.sms-phone-body {
  flex: 1; padding: 12px 10px; display: flex;
  flex-direction: column; justify-content: flex-end; gap: 4px;
  overflow-y: auto;
}
.sms-bubble {
  background: rgba(34,197,94,.12); border: 1px solid rgba(34,197,94,.2);
  border-radius: 14px 14px 4px 14px;
  padding: 9px 12px; font-size: 0.72rem; color: var(--t1); line-height: 1.5;
  word-break: break-word; align-self: flex-end; max-width: 90%;
}
.sms-bubble--placeholder { opacity: 0.35; font-style: italic; }
.sms-bubble-time { font-size: 0.58rem; color: var(--t3); text-align: right; padding-right: 4px; }
.sms-phone-home {
  width: 60px; height: 4px; border-radius: 2px;
  background: var(--border-soft); margin: 6px auto 10px;
  flex-shrink: 0;
}

/* preview stats */
.sms-preview-stats {
  display: flex; gap: 14px; justify-content: center;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 14px; padding: 14px 18px;
  width: 100%; box-sizing: border-box;
}
.sms-preview-stat { display: flex; flex-direction: column; align-items: center; gap: 3px; flex: 1; }
.sms-preview-stat__val { font-size: 1rem; font-weight: 800; color: var(--t1); }
.sms-preview-stat__lbl { font-size: 0.62rem; color: var(--t3); text-transform: uppercase; letter-spacing: 0.05em; }

/* ── Bulk ── */
.sms-bulk-wrap .sms-form-card { max-width: 680px; }

/* ── History ── */
.sms-history {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; overflow: hidden;
}
.sms-empty {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 60px 24px; color: var(--t3); font-size: 0.85rem;
}
.sms-empty-btn {
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  border-radius: 10px; padding: 9px 20px; font-size: 0.82rem; font-weight: 700;
  color: #22c55e; cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.sms-empty-btn:hover { background: rgba(34,197,94,.2); }

.sms-history-head {
  display: grid;
  grid-template-columns: 100px 130px 1fr 70px 70px 80px 120px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-soft);
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--t3);
  gap: 12px;
}
.sms-history-row {
  display: grid;
  grid-template-columns: 100px 130px 1fr 70px 70px 80px 120px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-soft);
  font-size: 0.8rem; color: var(--t2); gap: 12px;
  align-items: center; transition: background 0.15s;
}
.sms-history-row:last-child { border-bottom: none; }
.sms-history-row:hover { background: rgba(255,255,255,.03); }
.sms-h-sender { font-weight: 700; color: var(--t1); }
.sms-h-phone  { color: var(--t2); font-size: 0.76rem; }
.sms-h-msg    { color: var(--t3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sms-h-cost   { color: #22c55e; font-weight: 700; }
.sms-h-date   { font-size: 0.72rem; color: var(--t3); }
.sms-h-status {
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
  padding: 3px 8px; border-radius: 999px; width: fit-content;
}
.sms-h-status--sent     { background: rgba(34,197,94,.12);  color: #22c55e; border: 1px solid rgba(34,197,94,.2); }
.sms-h-status--failed   { background: rgba(248,113,113,.12); color: #f87171; border: 1px solid rgba(248,113,113,.2); }
.sms-h-status--pending  { background: rgba(251,191,36,.12);  color: #fbbf24; border: 1px solid rgba(251,191,36,.2); }

/* ── Toast ── */
.toast-up-enter-active, .toast-up-leave-active { transition: all 0.3s ease; }
.toast-up-enter-from, .toast-up-leave-to { opacity: 0; transform: translateY(20px); }

.sms-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px;
  padding: 13px 22px; border-radius: 14px;
  font-size: 0.84rem; font-weight: 600; z-index: 9999;
  backdrop-filter: blur(20px);
}
.sms-toast--success {
  background: rgba(34,197,94,.18); border: 1px solid rgba(34,197,94,.3); color: #22c55e;
}
.sms-toast--error {
  background: rgba(248,113,113,.18); border: 1px solid rgba(248,113,113,.3); color: #f87171;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .sms-stats         { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .sms-split         { grid-template-columns: 1fr 1fr; gap: 14px; }
}
@media (max-width: 768px) {
  .sms-page          { padding: 0; gap: 16px; }
  .sms-hdr           { flex-direction: column; align-items: flex-start; gap: 10px; }
  .sms-stats         { grid-template-columns: 1fr 1fr; gap: 10px; }
  .sms-tab-bar       { width: 100%; }
  .sms-tab           { flex: 1; justify-content: center; }
  .sms-split         { grid-template-columns: 1fr; }
  .sms-preview-panel { display: none; }
  .sms-form-card     { padding: 18px 16px; }
  .sms-schedule-fields { flex-direction: column; gap: 10px; }
  .sms-history-head  { display: none; }
  .sms-history-row   {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 6px 12px; padding: 14px 16px;
  }
  .sms-history-row > :nth-child(4),
  .sms-history-row > :nth-child(5) { display: none; }
  .sms-country-drop  { min-width: 200px; max-width: calc(100vw - 40px); }
  .sms-toast         { bottom: 90px; max-width: calc(100vw - 32px); }
}
@media (max-width: 480px) {
  .sms-stats { grid-template-columns: 1fr; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .sms-empty svg { stroke: var(--t4); }
[data-theme="light"] .sms-cost-row,
[data-theme="light"] .sms-history-row:hover,
[data-theme="light"] .sms-phone-frame { background: var(--glass-2); }
[data-theme="light"] .sms-tab:hover,
[data-theme="light"] .sms-input,
[data-theme="light"] .sms-textarea,
[data-theme="light"] .sms-country-wrap,
[data-theme="light"] .sms-drop-search { background: var(--glass); }
[data-theme="light"] .sms-toggle { background: var(--glass-hover); }
</style>
