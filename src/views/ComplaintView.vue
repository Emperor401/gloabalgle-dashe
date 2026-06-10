<!-- src/views/ComplaintView.vue -->
<template>
  <div class="cmp">

    <!-- ── Page Header ── -->
    <div class="cmp-header">
      <div>
        <h1 class="cmp-title">Make a complaint</h1>
        <p class="cmp-sub">Submit a complaint or feature request and track its status.</p>
      </div>
      <button class="cmp-new-btn" @click="openModal">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New report
      </button>
    </div>

    <!-- ── Filter tabs (only when there are reports) ── -->
    <template v-if="reports.length">
      <div class="cmp-tabs">
        <button v-for="tab in tabs" :key="tab.key"
          :class="['cmp-tab', { 'cmp-tab--active': activeTab === tab.key }]"
          @click="activeTab = tab.key">
          {{ tab.label }}
          <span :class="['cmp-tab-badge', { 'cmp-tab-badge--active': activeTab === tab.key }]">
            {{ tabCount(tab.key) }}
          </span>
        </button>
      </div>

      <!-- ── Reports list ── -->
      <div class="cmp-list">
        <TransitionGroup name="list-fade" tag="div" class="cmp-list-inner">
          <div v-for="r in filteredReports" :key="r.id"
            :class="['cmp-row', { 'cmp-row--open': expandedId === r.id }]"
            @click="expandedId = expandedId === r.id ? null : r.id">

            <div class="cmp-row-main">
              <div class="cmp-row-left">
                <span :class="['cmp-cat-dot', `cmp-cat-dot--${r.categoryColor}`]"/>
                <div>
                  <div class="cmp-row-subject">
                    {{ r.subject || r.message.slice(0, 60) + (r.message.length > 60 ? '…' : '') }}
                  </div>
                  <div class="cmp-row-meta">
                    <span :class="['cmp-cat-pill', `cmp-cat-pill--${r.categoryColor}`]">{{ r.category }}</span>
                    <span v-if="r.priority !== 'low'" :class="['cmp-pri-pill', `cmp-pri-pill--${r.priority}`]">
                      {{ capitalize(r.priority) }}
                    </span>
                    <span class="cmp-row-date">{{ formatDate(r.createdAt) }}</span>
                    <span class="cmp-row-id">{{ r.ticketId }}</span>
                  </div>
                </div>
              </div>
              <div class="cmp-row-right">
                <span :class="['cmp-status-badge', `cmp-status-badge--${r.status}`]">
                  <span class="cmp-status-dot"/>
                  {{ statusLabel(r.status) }}
                </span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round" class="cmp-chevron"
                  :style="{ transform: expandedId === r.id ? 'rotate(90deg)' : 'rotate(0deg)' }">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>

            <Transition name="accordion">
              <div v-if="expandedId === r.id" class="cmp-row-detail">
                <div class="cmp-detail-grid">
                  <div class="cmp-detail-field">
                    <span class="cmp-detail-label">Ticket ID</span>
                    <span class="cmp-detail-value">{{ r.ticketId }}</span>
                  </div>
                  <div class="cmp-detail-field">
                    <span class="cmp-detail-label">Category</span>
                    <span :class="['cmp-cat-pill', `cmp-cat-pill--${r.categoryColor}`]">{{ r.category }}</span>
                  </div>
                  <div class="cmp-detail-field">
                    <span class="cmp-detail-label">Priority</span>
                    <span :class="['cmp-pri-pill', `cmp-pri-pill--${r.priority}`]">{{ capitalize(r.priority) }}</span>
                  </div>
                  <div class="cmp-detail-field">
                    <span class="cmp-detail-label">Submitted</span>
                    <span class="cmp-detail-value">{{ formatDate(r.createdAt, true) }}</span>
                  </div>
                </div>
                <div class="cmp-detail-msg">
                  <span class="cmp-detail-label">Message</span>
                  <p class="cmp-detail-body">{{ r.message }}</p>
                </div>
                <div v-if="r.status === 'open'" class="cmp-detail-actions">
                  <button class="cmp-close-btn" @click.stop="closeTicket(r.id)">Close ticket</button>
                </div>
              </div>
            </Transition>
          </div>
        </TransitionGroup>

        <div v-if="filteredReports.length === 0" class="cmp-empty-filter">
          No {{ activeTab }} reports found.
        </div>
      </div>
    </template>

    <!-- ── Empty state ── -->
    <template v-else>
      <div class="cmp-empty-wrap">
        <div class="cmp-empty">
          <div class="cmp-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="cmp-empty-svg">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
          </div>
          <p class="cmp-empty-text">You haven't made any complaints yet.</p>
          <button class="cmp-first-btn" @click="openModal">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Submit your first report
          </button>
        </div>
      </div>
    </template>

    <!-- ── Modal ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="modal" class="cmp-overlay" @click.self="closeModal">
          <div class="cmp-modal">

            <!-- Success state -->
            <template v-if="submitSuccess">
              <div class="cmp-success">
                <div class="cmp-success-ring">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
                    stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 class="cmp-modal-title">Report submitted!</h2>
                <p class="cmp-modal-sub">
                  Your ticket <strong class="cmp-ticket-id">{{ submittedTicketId }}</strong>
                  has been received. Our team will review and respond shortly.
                </p>
                <div class="cmp-success-info">
                  <div class="cmp-sinfo-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#22c55e" stroke-width="2" stroke-linecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Average response time: <strong>4–12 hours</strong>
                  </div>
                  <div class="cmp-sinfo-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#60a5fa" stroke-width="2" stroke-linecap="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    You'll be notified at <strong>{{ userEmail }}</strong>
                  </div>
                </div>
                <button class="cmp-done-btn" @click="closeModal">Done</button>
              </div>
            </template>

            <!-- Form state -->
            <template v-else>
              <div class="cmp-modal-hdr">
                <div>
                  <h2 class="cmp-modal-title">Report an issue</h2>
                  <p class="cmp-modal-sub">Describe what's happening and we'll follow up as soon as possible.</p>
                </div>
                <button class="cmp-modal-close" @click="closeModal">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div class="cmp-modal-body">

                <!-- Category -->
                <div class="cmp-field">
                  <label class="cmp-label">Category</label>
                  <div class="cmp-cat-grid">
                    <button v-for="cat in categories" :key="cat.key"
                      :class="['cmp-cat-card', { 'cmp-cat-card--active': form.category === cat.key }]"
                      type="button" @click="form.category = cat.key">
                      <div :class="['cmp-cat-card-icon', `cmp-cat-card-icon--${cat.color}`]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          v-html="cat.icon"/>
                      </div>
                      <span class="cmp-cat-card-name">{{ cat.label }}</span>
                      <span class="cmp-cat-card-desc">{{ cat.desc }}</span>
                    </button>
                  </div>
                </div>

                <!-- Priority -->
                <div class="cmp-field">
                  <label class="cmp-label">Priority</label>
                  <div class="cmp-pri-row">
                    <button v-for="p in priorities" :key="p.key"
                      :class="['cmp-pri-btn', `cmp-pri-btn--${p.key}`, { 'cmp-pri-btn--active': form.priority === p.key }]"
                      type="button" @click="form.priority = p.key">
                      <span :class="['cmp-pri-dot', `cmp-pri-dot--${p.key}`]"/>
                      {{ p.label }}
                    </button>
                  </div>
                </div>

                <!-- Subject -->
                <div class="cmp-field">
                  <label class="cmp-label">
                    Subject <span class="cmp-optional">(optional)</span>
                  </label>
                  <input v-model="form.subject" class="cmp-input"
                    placeholder="Brief summary of the issue…" maxlength="120"/>
                </div>

                <!-- Message -->
                <div class="cmp-field">
                  <label class="cmp-label">
                    Message <span class="cmp-required">*</span>
                  </label>
                  <div :class="['cmp-textarea-wrap', { 'cmp-textarea-wrap--error': submitAttempted && !form.message.trim() }]">
                    <textarea v-model="form.message" class="cmp-textarea"
                      placeholder="Describe the issue in detail — include steps to reproduce, expected vs actual behaviour, screenshots if relevant…"
                      rows="5" maxlength="1500" @input="charCount = form.message.length"/>
                  </div>
                  <div class="cmp-textarea-footer">
                    <span v-if="submitAttempted && !form.message.trim()" class="cmp-field-error">
                      Message is required
                    </span>
                    <span v-else/>
                    <span :class="['cmp-char-count', { 'cmp-char-count--warn': charCount > 1200 }]">
                      {{ charCount }} / 1500
                    </span>
                  </div>
                </div>

                <!-- Attachment area -->
                <div class="cmp-field">
                  <label class="cmp-label">Attachments <span class="cmp-optional">(optional)</span></label>
                  <div class="cmp-drop-zone" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                    <input ref="fileInput" type="file" multiple accept="image/*,.pdf,.txt"
                      style="display:none" @change="handleFiles"/>
                    <template v-if="form.files.length === 0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(255,255,255,.2)" stroke-width="1.5" stroke-linecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span class="cmp-drop-text">
                        Drop files here or <span class="cmp-drop-link">browse</span>
                      </span>
                      <span class="cmp-drop-hint">PNG, JPG, PDF · max 10 MB each</span>
                    </template>
                    <div v-else class="cmp-file-list">
                      <div v-for="(f, i) in form.files" :key="i" class="cmp-file-chip">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        {{ f.name }}
                        <button class="cmp-file-remove" @click.stop="removeFile(i)">×</button>
                      </div>
                      <button class="cmp-add-more" @click.stop="triggerFileInput">+ Add more</button>
                    </div>
                  </div>
                </div>

              </div><!-- /modal-body -->

              <!-- Footer -->
              <div class="cmp-modal-footer">
                <button class="cmp-view-link" @click="closeModal; activeTab = 'all'">
                  View my reports
                </button>
                <div class="cmp-footer-btns">
                  <button class="cmp-cancel-btn" @click="closeModal">Cancel</button>
                  <button class="cmp-submit-btn" :class="{ 'cmp-submit-btn--loading': submitting }"
                    @click="submitReport" :disabled="submitting">
                    <template v-if="submitting">
                      <span class="cmp-spinner"/>
                      Submitting…
                    </template>
                    <template v-else>Submit report</template>
                  </button>
                </div>
              </div>
            </template>

          </div>
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
const modal          = ref(false)
const submitSuccess  = ref(false)
const submitting     = ref(false)
const submitAttempted= ref(false)
const expandedId     = ref(null)
const activeTab      = ref('all')
const charCount      = ref(0)
const submittedTicketId = ref('')
const fileInput      = ref(null)

const userEmail = 'emprerorsolos@gmail.com'

const form = ref({
  category: 'general',
  priority: 'medium',
  subject:  '',
  message:  '',
  files:    [],
})

/* ── Categories ── */
const categories = [
  { key: 'general',  label: 'General',         desc: 'General questions or concerns',      color: 'green',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  { key: 'support',  label: 'Report support',  desc: 'Request help from our support team', color: 'blue',
    icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { key: 'bug',      label: 'Bug',             desc: "Something isn't working as expected",color: 'red',
    icon: '<path d="M8 6l4-4 4 4"/><path d="M2 12h20"/><path d="M6 8a6 6 0 0 0 0 12h12a6 6 0 0 0 0-12"/><path d="M12 12v8"/>' },
  { key: 'feature',  label: 'Feature request', desc: 'Suggest something new or improved',  color: 'amber',
    icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { key: 'other',    label: 'Others',          desc: "Anything that doesn't fit above",    color: 'purple',
    icon: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>' },
]

const catMeta = {
  general: { color: 'green',  label: 'General'         },
  support: { color: 'blue',   label: 'Report support'  },
  bug:     { color: 'red',    label: 'Bug'             },
  feature: { color: 'amber',  label: 'Feature request' },
  other:   { color: 'purple', label: 'Others'          },
}

/* ── Priorities ── */
const priorities = [
  { key: 'low',      label: 'Low'      },
  { key: 'medium',   label: 'Medium'   },
  { key: 'high',     label: 'High'     },
  { key: 'critical', label: 'Critical' },
]

/* ── Reports store ── */
const reports = ref([])

let ticketSeq = 1
function makeTicketId() {
  return '#TKT-' + String(ticketSeq++).padStart(4, '0')
}

/* ── Tabs ── */
const tabs = [
  { key: 'all',    label: 'All'        },
  { key: 'open',   label: 'Open'       },
  { key: 'closed', label: 'Closed'     },
]

const filteredReports = computed(() => {
  if (activeTab.value === 'all') return reports.value
  return reports.value.filter(r => r.status === activeTab.value)
})

function tabCount(key) {
  if (key === 'all') return reports.value.length
  return reports.value.filter(r => r.status === key).length
}

/* ── Helpers ── */
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

function formatDate(d, long = false) {
  const date = new Date(d)
  if (long) return date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusLabel(s) {
  return { open: 'Open', 'in-progress': 'In Progress', closed: 'Closed' }[s] ?? s
}

/* ── Modal ── */
function openModal() {
  submitSuccess.value  = false
  submitAttempted.value = false
  form.value = { category: 'general', priority: 'medium', subject: '', message: '', files: [] }
  charCount.value = 0
  modal.value = true
}

function closeModal() {
  modal.value = false
}

/* ── File handling ── */
function triggerFileInput() { fileInput.value?.click() }

function handleFiles(e) {
  const incoming = Array.from(e.target.files)
  form.value.files.push(...incoming.slice(0, 5 - form.value.files.length))
}

function handleDrop(e) {
  const incoming = Array.from(e.dataTransfer.files)
  form.value.files.push(...incoming.slice(0, 5 - form.value.files.length))
}

function removeFile(i) { form.value.files.splice(i, 1) }

/* ── Submit ── */
function submitReport() {
  submitAttempted.value = true
  if (!form.value.category) {
    toastError('Category required', 'Please select a complaint category.')
    return
  }
  if (!form.value.message.trim()) {
    toastError('Message required', 'Please describe your issue before submitting.')
    return
  }

  submitting.value = true
  setTimeout(() => {
    const tid = makeTicketId()
    submittedTicketId.value = tid
    const meta = catMeta[form.value.category]
    reports.value.unshift({
      id:            Date.now(),
      ticketId:      tid,
      category:      meta.label,
      categoryColor: meta.color,
      priority:      form.value.priority,
      subject:       form.value.subject.trim(),
      message:       form.value.message.trim(),
      status:        'open',
      createdAt:     new Date().toISOString(),
    })
    submitting.value  = false
    submitSuccess.value = true
  }, 1400)
}

/* ── Close ticket ── */
function closeTicket(id) {
  const r = reports.value.find(r => r.id === id)
  if (r) r.status = 'closed'
  expandedId.value = null
}
</script>

<style scoped>
.cmp {
  display: flex; flex-direction: column; gap: 20px;
}

/* ── Header ── */
.cmp-header {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
}
.cmp-title {
  font-size: 1.45rem; font-weight: 800; color: var(--t1);
  letter-spacing: -0.03em; margin: 0 0 4px;
}
.cmp-sub { font-size: 0.82rem; color: var(--t3); margin: 0; }

.cmp-new-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 20px; border-radius: 12px;
  background: #22c55e; border: none; color: #fff;
  font-size: 0.84rem; font-weight: 800; font-family: inherit;
  cursor: pointer; transition: background 0.2s; white-space: nowrap; flex-shrink: 0;
}
.cmp-new-btn:hover { background: #16a34a; }

/* ── Tabs ── */
.cmp-tabs {
  display: flex; gap: 4px;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 14px;
  padding: 5px; width: fit-content;
}
.cmp-tab {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 16px; border-radius: 10px; border: none; background: none;
  font-size: 0.8rem; font-weight: 600; color: var(--t3);
  cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.cmp-tab--active { background: rgba(34,197,94,.12); color: #22c55e; }
.cmp-tab-badge {
  background: var(--glass); border-radius: 999px;
  padding: 1px 8px; font-size: 0.68rem; font-weight: 700; color: var(--t3);
}
.cmp-tab-badge--active { background: rgba(34,197,94,.15); color: #22c55e; }

/* ── Reports list ── */
.cmp-list { display: flex; flex-direction: column; gap: 6px; }
.cmp-list-inner { display: flex; flex-direction: column; gap: 6px; }

.list-fade-enter-active { transition: all 0.3s ease; }
.list-fade-enter-from   { opacity: 0; transform: translateY(-10px); }

.cmp-row {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 16px;
  overflow: hidden; cursor: pointer; transition: border-color 0.2s;
}
.cmp-row:hover       { border-color: var(--border); }
.cmp-row--open       { border-color: rgba(34,197,94,.3); background: rgba(34,197,94,.04); }

.cmp-row-main {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 14px 18px;
}
.cmp-row-left  { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.cmp-row-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

.cmp-cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.cmp-cat-dot--green  { background: #22c55e; }
.cmp-cat-dot--blue   { background: #60a5fa; }
.cmp-cat-dot--red    { background: #f87171; }
.cmp-cat-dot--amber  { background: #f59e0b; }
.cmp-cat-dot--purple { background: #a78bfa; }

.cmp-row-subject {
  font-size: 0.85rem; font-weight: 600; color: var(--t1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 420px;
}
.cmp-row-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.cmp-row-date { font-size: 0.7rem; color: var(--t3); }
.cmp-row-id   { font-size: 0.7rem; color: var(--t4); font-family: monospace; }

.cmp-cat-pill {
  font-size: 0.67rem; font-weight: 700; border-radius: 999px; padding: 2px 9px;
}
.cmp-cat-pill--green  { background: rgba(34,197,94,.1);   color: #22c55e;  border: 1px solid rgba(34,197,94,.2);   }
.cmp-cat-pill--blue   { background: rgba(96,165,250,.1);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.2);  }
.cmp-cat-pill--red    { background: rgba(248,113,113,.1); color: #f87171;  border: 1px solid rgba(248,113,113,.2); }
.cmp-cat-pill--amber  { background: rgba(245,158,11,.1);  color: #f59e0b;  border: 1px solid rgba(245,158,11,.2);  }
.cmp-cat-pill--purple { background: rgba(167,139,250,.1); color: #a78bfa;  border: 1px solid rgba(167,139,250,.2); }

.cmp-pri-pill {
  font-size: 0.67rem; font-weight: 700; border-radius: 999px; padding: 2px 9px;
}
.cmp-pri-pill--low      { background: rgba(255,255,255,.06); color: var(--t3); border: 1px solid var(--border-soft); }
.cmp-pri-pill--medium   { background: rgba(96,165,250,.1);   color: #60a5fa;  border: 1px solid rgba(96,165,250,.2);  }
.cmp-pri-pill--high     { background: rgba(245,158,11,.1);   color: #f59e0b;  border: 1px solid rgba(245,158,11,.2);  }
.cmp-pri-pill--critical { background: rgba(248,113,113,.1);  color: #f87171;  border: 1px solid rgba(248,113,113,.2); }

.cmp-status-badge {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 999px;
}
.cmp-status-badge--open        { background: rgba(34,197,94,.1);   color: #22c55e;  border: 1px solid rgba(34,197,94,.2);   }
.cmp-status-badge--in-progress { background: rgba(245,158,11,.1);  color: #f59e0b;  border: 1px solid rgba(245,158,11,.2);  }
.cmp-status-badge--closed      { background: var(--glass); color: var(--t3); border: 1px solid var(--border-soft); }

.cmp-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.cmp-chevron { color: var(--t3); transition: transform 0.25s ease; flex-shrink: 0; }

/* Row detail */
.accordion-enter-active, .accordion-leave-active {
  transition: opacity 0.22s, max-height 0.28s; max-height: 600px; overflow: hidden;
}
.accordion-enter-from, .accordion-leave-to { opacity: 0; max-height: 0; }

.cmp-row-detail {
  padding: 0 18px 18px; border-top: 1px solid var(--border-soft);
  display: flex; flex-direction: column; gap: 14px; margin: 0 0 0 32px;
}
.cmp-detail-grid {
  display: grid; grid-template-columns: repeat(4, auto); gap: 12px 24px;
  padding-top: 14px; width: fit-content;
}
.cmp-detail-field { display: flex; flex-direction: column; gap: 4px; }
.cmp-detail-label { font-size: 0.65rem; color: var(--t4); font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
.cmp-detail-value { font-size: 0.8rem; color: var(--t2); font-weight: 600; }

.cmp-detail-msg { display: flex; flex-direction: column; gap: 6px; }
.cmp-detail-body {
  font-size: 0.82rem; color: var(--t3); line-height: 1.7;
  background: var(--glass-2); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 12px 14px; margin: 0;
}
.cmp-detail-actions { display: flex; gap: 10px; }
.cmp-close-btn {
  padding: 7px 16px; border-radius: 9px;
  background: rgba(248,113,113,.08); border: 1px solid rgba(248,113,113,.2);
  color: #f87171; font-size: 0.78rem; font-weight: 700;
  cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.cmp-close-btn:hover { background: rgba(248,113,113,.18); }

.cmp-empty-filter {
  padding: 32px; text-align: center;
  font-size: 0.82rem; color: var(--t3);
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 16px;
}

/* ── Empty state ── */
.cmp-empty-wrap {
  flex: 1; display: flex; align-items: center; justify-content: center;
}
.cmp-empty {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px dashed var(--border); border-radius: 22px;
  padding: 64px 80px; display: flex; flex-direction: column;
  align-items: center; gap: 14px; text-align: center;
}
.cmp-empty-icon {
  width: 72px; height: 72px; border-radius: 20px;
  background: var(--glass-2); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center; color: var(--t4);
}
.cmp-empty-svg { color: var(--t4); }
.cmp-empty-text { font-size: 0.88rem; color: var(--t3); margin: 0; }
.cmp-first-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 24px; border-radius: 12px; background: #22c55e; border: none;
  font-size: 0.86rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.cmp-first-btn:hover { background: #16a34a; }

/* ── Modal overlay ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .cmp-modal, .modal-fade-leave-to .cmp-modal {
  transform: translateY(18px) scale(0.97);
}

.cmp-overlay {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,.65); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.cmp-modal {
  background: var(--modal-glass); backdrop-filter: blur(24px) saturate(180%); border: 1px solid var(--modal-border);
  border-radius: 22px; width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto; scrollbar-width: none;
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.cmp-modal::-webkit-scrollbar { display: none; }

/* Modal header */
.cmp-modal-hdr {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
  padding: 24px 24px 0;
}
.cmp-modal-title { font-size: 1.05rem; font-weight: 800; color: var(--t1); margin: 0 0 4px; }
.cmp-modal-sub   { font-size: 0.8rem; color: var(--t3); margin: 0; line-height: 1.5; }
.cmp-modal-close {
  width: 30px; height: 30px; border-radius: 8px;
  background: var(--glass); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--t2); flex-shrink: 0; transition: background 0.2s;
}
.cmp-modal-close:hover { background: var(--glass-hover); color: var(--t1); }

/* Modal body */
.cmp-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 18px; }

.cmp-field { display: flex; flex-direction: column; gap: 8px; }
.cmp-label { font-size: 0.77rem; font-weight: 700; color: var(--t2); }
.cmp-optional { font-weight: 400; color: var(--t4); }
.cmp-required { color: #f87171; }

/* Category grid */
.cmp-cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.cmp-cat-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  padding: 12px 12px 10px; border-radius: 12px;
  background: var(--glass); border: 1px solid var(--border-soft);
  cursor: pointer; font-family: inherit; text-align: left;
  transition: all 0.18s;
}
.cmp-cat-card:hover { border-color: var(--border); background: var(--glass-hover); }
.cmp-cat-card--active { border-color: #22c55e !important; background: rgba(34,197,94,.08) !important; }

.cmp-cat-card-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 2px;
}
.cmp-cat-card-icon--green  { background: rgba(34,197,94,.12);   color: #22c55e;  border: 1px solid rgba(34,197,94,.2);   }
.cmp-cat-card-icon--blue   { background: rgba(96,165,250,.12);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.2);  }
.cmp-cat-card-icon--red    { background: rgba(248,113,113,.12); color: #f87171;  border: 1px solid rgba(248,113,113,.2); }
.cmp-cat-card-icon--amber  { background: rgba(245,158,11,.12);  color: #f59e0b;  border: 1px solid rgba(245,158,11,.2);  }
.cmp-cat-card-icon--purple { background: rgba(167,139,250,.12); color: #a78bfa;  border: 1px solid rgba(167,139,250,.2); }
.cmp-cat-card--active .cmp-cat-card-icon { opacity: 1; }

.cmp-cat-card-name { font-size: 0.78rem; font-weight: 700; color: var(--t1); }
.cmp-cat-card-desc { font-size: 0.67rem; color: var(--t4); line-height: 1.3; }

/* Priority row */
.cmp-pri-row { display: flex; gap: 8px; flex-wrap: wrap; }
.cmp-pri-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 16px; border-radius: 10px;
  background: var(--glass); border: 1px solid var(--border-soft);
  font-size: 0.78rem; font-weight: 700; color: var(--t3);
  cursor: pointer; font-family: inherit; transition: all 0.18s;
}
.cmp-pri-btn:hover { border-color: var(--border); color: var(--t2); }
.cmp-pri-dot { width: 7px; height: 7px; border-radius: 50%; }
.cmp-pri-dot--low      { background: var(--t4); }
.cmp-pri-dot--medium   { background: #60a5fa; }
.cmp-pri-dot--high     { background: #f59e0b; }
.cmp-pri-dot--critical { background: #f87171; }

.cmp-pri-btn--active.cmp-pri-btn--low      { border-color: var(--border); color: var(--t1); background: var(--glass-hover); }
.cmp-pri-btn--active.cmp-pri-btn--medium   { border-color: rgba(96,165,250,.4);   color: #60a5fa;  background: rgba(96,165,250,.1);   }
.cmp-pri-btn--active.cmp-pri-btn--high     { border-color: rgba(245,158,11,.4);   color: #f59e0b;  background: rgba(245,158,11,.1);   }
.cmp-pri-btn--active.cmp-pri-btn--critical { border-color: rgba(248,113,113,.4);  color: #f87171;  background: rgba(248,113,113,.1);  }

/* Input / Textarea */
.cmp-input {
  background: var(--modal-input); border: 1px solid var(--modal-border);
  border-radius: 11px; padding: 11px 14px;
  font-family: inherit; font-size: 0.84rem; color: var(--t1);
  outline: none; transition: border-color 0.2s;
}
.cmp-input:focus { border-color: rgba(34,197,94,.45); }
.cmp-input::placeholder { color: var(--t4); }

.cmp-textarea-wrap { position: relative; }
.cmp-textarea-wrap--error .cmp-textarea { border-color: rgba(248,113,113,.5); }
.cmp-textarea {
  width: 100%; background: var(--modal-input); border: 1px solid var(--modal-border);
  border-radius: 11px; padding: 11px 14px; resize: vertical;
  font-family: inherit; font-size: 0.84rem; color: var(--t1);
  outline: none; transition: border-color 0.2s; box-sizing: border-box;
}
.cmp-textarea:focus { border-color: rgba(34,197,94,.45); }
.cmp-textarea::placeholder { color: var(--t4); }
.cmp-textarea-footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 5px;
}
.cmp-field-error { font-size: 0.72rem; color: #f87171; }
.cmp-char-count  { font-size: 0.7rem; color: var(--t4); margin-left: auto; }
.cmp-char-count--warn { color: #f59e0b; }

/* Drop zone */
.cmp-drop-zone {
  background: var(--glass); border: 1px dashed var(--border);
  border-radius: 12px; padding: 22px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer; transition: all 0.2s; text-align: center;
}
.cmp-drop-zone:hover { border-color: rgba(34,197,94,.35); background: rgba(34,197,94,.04); }
.cmp-drop-text  { font-size: 0.8rem; color: var(--t3); }
.cmp-drop-link  { color: #22c55e; font-weight: 700; cursor: pointer; }
.cmp-drop-hint  { font-size: 0.68rem; color: var(--t4); }
.cmp-file-list  { display: flex; flex-wrap: wrap; gap: 7px; width: 100%; justify-content: center; }
.cmp-file-chip {
  display: flex; align-items: center; gap: 6px;
  background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.2);
  border-radius: 8px; padding: 5px 10px;
  font-size: 0.73rem; font-weight: 600; color: #22c55e;
}
.cmp-file-remove {
  background: none; border: none; color: #f87171; font-size: 0.9rem;
  cursor: pointer; line-height: 1; padding: 0; margin-left: 2px;
}
.cmp-add-more {
  background: var(--glass); border: 1px dashed var(--border);
  border-radius: 8px; padding: 5px 10px; font-size: 0.73rem; font-weight: 600;
  color: var(--t3); cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.cmp-add-more:hover { color: var(--t2); }

/* Modal footer */
.cmp-modal-footer {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding: 16px 24px; border-top: 1px solid var(--border-soft);
}
.cmp-view-link {
  font-size: 0.78rem; color: var(--t3); background: none; border: none;
  cursor: pointer; font-family: inherit; text-decoration: underline; transition: color 0.2s;
}
.cmp-view-link:hover { color: #22c55e; }
.cmp-footer-btns { display: flex; gap: 10px; }

.cmp-cancel-btn {
  padding: 9px 20px; border-radius: 11px;
  background: var(--glass); border: 1px solid var(--border-soft);
  font-size: 0.82rem; font-weight: 700; color: var(--t2);
  cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.cmp-cancel-btn:hover { background: var(--glass-hover); color: var(--t1); }

.cmp-submit-btn {
  padding: 9px 24px; border-radius: 11px; background: #22c55e; border: none;
  font-size: 0.82rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s;
  display: flex; align-items: center; gap: 8px;
}
.cmp-submit-btn:hover:not(:disabled) { background: #16a34a; }
.cmp-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.cmp-submit-btn--loading { background: #16a34a; }

.cmp-spinner {
  width: 13px; height: 13px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  animation: spin 0.7s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Success state ── */
.cmp-success {
  padding: 40px 28px; display: flex; flex-direction: column;
  align-items: center; gap: 14px; text-align: center;
}
.cmp-success-ring {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(34,197,94,.1); border: 2px solid rgba(34,197,94,.3);
  display: flex; align-items: center; justify-content: center;
}
.cmp-success .cmp-modal-title { font-size: 1.2rem; }
.cmp-ticket-id { color: #22c55e; font-family: monospace; }

.cmp-success-info {
  display: flex; flex-direction: column; gap: 8px; padding: 14px 16px;
  background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 12px; width: 100%; max-width: 340px;
}
.cmp-sinfo-row {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.79rem; color: var(--t3);
}
.cmp-sinfo-row strong { color: var(--t2); }

.cmp-done-btn {
  padding: 11px 40px; border-radius: 12px; background: #22c55e; border: none;
  font-size: 0.88rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s; margin-top: 4px;
}
.cmp-done-btn:hover { background: #16a34a; }

/* ── Tablet ── */
@media (max-width: 1024px) and (min-width: 769px) {
  .cmp-cat-grid    { grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .cmp-detail-grid { grid-template-columns: repeat(3, auto); gap: 12px; }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .cmp { gap: 16px; }

  /* Header — stack button below title */
  .cmp-header  { flex-direction: column; align-items: flex-start; gap: 10px; }
  .cmp-title   { font-size: 1.3rem; }
  .cmp-new-btn { width: 100%; justify-content: center; }

  /* Tab bar — scrollable if needed */
  .cmp-tabs    { width: 100%; overflow-x: auto; scrollbar-width: none; }
  .cmp-tabs::-webkit-scrollbar { display: none; }

  /* Report rows — tighter */
  .cmp-row-main    { padding: 12px 14px; gap: 10px; }
  .cmp-row-subject { max-width: 100%; font-size: 0.82rem; }
  .cmp-row-id      { display: none; }
  .cmp-row-detail  { margin-left: 0; padding: 12px 14px; }

  /* Detail grid */
  .cmp-detail-grid { grid-template-columns: 1fr 1fr; gap: 10px; }

  /* Empty state — remove huge padding */
  .cmp-empty       { padding: 40px 24px; }
  .cmp-empty-icon  { width: 60px; height: 60px; border-radius: 16px; }
  .cmp-first-btn   { width: 100%; justify-content: center; }

  /* Modal — bottom sheet */
  .cmp-overlay     { padding: 0; align-items: flex-end; }
  .cmp-modal       { max-width: 100%; border-radius: 22px 22px 0 0; max-height: 92vh; }
  .cmp-modal-hdr   { padding: 20px 18px 0; }
  .cmp-modal-body  { padding: 16px 18px; gap: 14px; }

  /* Category cards — 2 cols */
  .cmp-cat-grid    { grid-template-columns: 1fr 1fr; gap: 8px; }
  .cmp-cat-card    { padding: 10px 10px 8px; }
  .cmp-cat-card-desc { display: none; }

  /* Modal footer — stack on mobile */
  .cmp-modal-footer { flex-direction: column; align-items: stretch; gap: 10px; padding: 14px 18px; }
  .cmp-footer-btns  { flex-direction: row; gap: 8px; }
  .cmp-submit-btn   { flex: 1; justify-content: center; }
  .cmp-cancel-btn   { flex: 1; }
  .cmp-view-link    { text-align: center; }

  /* Success state */
  .cmp-success      { padding: 30px 20px; }
  .cmp-done-btn     { width: 100%; }
}

/* ── Small Mobile ── */
@media (max-width: 480px) {
  .cmp-title       { font-size: 1.2rem; }

  /* Row meta — hide date too, keep only category pill */
  .cmp-row-meta    { gap: 6px; }
  .cmp-row-date    { display: none; }

  /* Category cards — single column */
  .cmp-cat-grid    { grid-template-columns: 1fr; gap: 6px; }
  .cmp-cat-card    { flex-direction: row; align-items: center; padding: 10px 12px; gap: 10px; }
  .cmp-cat-card-icon { flex-shrink: 0; margin-bottom: 0; }
  .cmp-cat-card-name { font-size: 0.8rem; }

  /* Detail grid — single column */
  .cmp-detail-grid { grid-template-columns: 1fr 1fr; }

  /* Priority — wrap naturally, no force-column */
  .cmp-pri-row     { gap: 6px; }
  .cmp-pri-btn     { padding: 6px 12px; font-size: 0.74rem; }

  /* Empty state */
  .cmp-empty       { padding: 32px 18px; border-radius: 18px; }
}
</style>
