<!-- src/views/EmailComposerView.vue -->
<template>
  <div class="composer-page">

    <!-- Header -->
    <div class="comp-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div>
        <h1 class="comp-title">Email Composer</h1>
        <p class="comp-sub">Write and send single or bulk emails to your customers.</p>
      </div>
    </div>

    <div class="composer-layout">

      <!-- ── Compose Panel ── -->
      <div class="glass-panel compose-panel">
        <div class="compose-top">
          <h2 class="compose-heading">New Email</h2>
          <div class="mode-toggle">
            <button :class="['mtab', { 'mtab--active': mode === 'single' }]" @click="mode = 'single'">Single</button>
            <button :class="['mtab', { 'mtab--active': mode === 'bulk' }]"   @click="mode = 'bulk'">Bulk</button>
          </div>
        </div>

        <!-- To field -->
        <div class="field-group">
          <label class="field-label">To</label>
          <div class="to-field">
            <div v-for="(chip, i) in toChips" :key="i" class="chip">
              {{ chip }}
              <button class="chip__remove" @click="toChips.splice(i,1)">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <input v-if="mode === 'single'" v-model="toInput" class="to-input" placeholder="Enter email address…"
              @keydown.enter.prevent="addChip" @keydown.tab.prevent="addChip" @keydown.comma.prevent="addChip" />
            <span v-else class="bulk-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              All {{ bulkCount.toLocaleString() }} subscribers selected
            </span>
          </div>
        </div>

        <!-- Subject -->
        <div class="field-group">
          <label class="field-label">Subject</label>
          <input v-model="subject" type="text" class="field-input" placeholder="Email subject line…" />
        </div>

        <!-- Body toolbar -->
        <div class="field-group body-group">
          <label class="field-label">Message</label>
          <div class="toolbar">
            <button v-for="t in toolbar" :key="t.label" class="tool-btn" :title="t.label" @click="applyFormat(t.label)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" v-html="t.icon" />
            </button>
            <div class="toolbar-div" />
            <button class="tool-btn" title="Insert variable" @click="insertVariable">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </button>
          </div>
          <textarea ref="bodyRef" v-model="body" class="body-input" rows="9" placeholder="Write your email content here…" />
        </div>

        <!-- Attachment row -->
        <div class="attachment-row">
          <button class="btn-attach">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            Attach File
          </button>
          <span class="attach-hint">Max 10 MB per attachment</span>
        </div>

        <!-- Actions -->
        <div class="compose-actions">
          <button class="btn-save-draft" @click="saveDraft">Save as Draft</button>
          <div class="right-actions">
            <button class="btn-preview-email" @click="showPreview = !showPreview">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview
            </button>
            <button class="btn-send-email" @click="sendEmail">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send Email
            </button>
          </div>
        </div>
      </div>

      <!-- ── Right Panel ── -->
      <div class="right-col">

        <!-- Preview -->
        <Transition name="slide">
          <div v-if="showPreview" class="glass-panel preview-panel">
            <h3 class="side-title">Preview</h3>
            <div class="email-preview">
              <div class="ep-header">
                <div class="ep-logo">G</div>
                <span class="ep-brand">Globalgle</span>
              </div>
              <p class="ep-subject">{{ subject || 'Your subject line' }}</p>
              <p class="ep-body">{{ body || 'Your email content will appear here…' }}</p>
              <div class="ep-footer">© 2026 Globalgle Bank. All rights reserved.</div>
            </div>
          </div>
        </Transition>

        <!-- Drafts -->
        <div class="glass-panel drafts-panel">
          <div class="side-head">
            <h3 class="side-title">Drafts</h3>
            <span class="draft-count">{{ drafts.length }}</span>
          </div>
          <div class="drafts-list">
            <div v-for="d in drafts" :key="d.id" class="draft-item" @click="loadDraft(d)">
              <div class="draft-item__icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div class="draft-item__body">
                <p class="draft-item__subject">{{ d.subject }}</p>
                <p class="draft-item__meta">{{ d.time }} · {{ d.recipients }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="glass-panel quick-stats">
          <h3 class="side-title">This Month</h3>
          <div class="qs-list">
            <div v-for="q in quickStats" :key="q.label" class="qs-item">
              <span class="qs-label">{{ q.label }}</span>
              <span class="qs-val" :style="{ color: q.color }">{{ q.value }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast.js'
const { success: toastSuccess, error: toastError, info: toastInfo } = useToast()

const mode        = ref('single')
const toInput     = ref('')
const toChips     = ref([])
const subject     = ref('')
const body        = ref('')
const showPreview = ref(false)
const bulkCount   = 94210
const bodyRef     = ref(null)

function addChip() {
  const v = toInput.value.trim().replace(/,$/, '')
  if (v) { toChips.value.push(v); toInput.value = '' }
}

function applyFormat(type) {
  const el = bodyRef.value
  if (!el) return
  const start = el.selectionStart
  const end   = el.selectionEnd
  const sel   = body.value.slice(start, end) || 'text'
  const wrapMap = { Bold: `**${sel}**`, Italic: `*${sel}*`, Underline: `__${sel}__`, Link: `[${sel}](https://)`, List: `\n• ${sel}`, Image: null }
  if (type === 'Image') { toastInfo('Image Upload', 'Image attachment is coming soon. Use Attach File for now.'); return }
  const wrapped = wrapMap[type]
  if (!wrapped) return
  body.value = body.value.slice(0, start) + wrapped + body.value.slice(end)
  toastSuccess(`${type} applied`, '')
}

function insertVariable() {
  const vars = ['{{customer_name}}', '{{account_number}}', '{{balance}}', '{{transaction_id}}']
  const el = bodyRef.value
  if (!el) return
  const pos = el.selectionStart
  body.value = body.value.slice(0, pos) + vars[0] + body.value.slice(pos)
  toastInfo('Variable inserted', `Use ${vars.join(', ')} to personalise your email.`)
}

function saveDraft() {
  if (!subject.value.trim() && !body.value.trim()) {
    toastError('Nothing to save', 'Write a subject or message before saving as draft.')
    return
  }
  const now = new Date()
  const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
  drafts.value.unshift({
    id: Date.now(),
    subject: subject.value.trim() || '(No subject)',
    time: `Today, ${time}`,
    recipients: mode.value === 'bulk' ? `Bulk · ${(bulkCount / 1000).toFixed(0)}K` : toChips.value.length ? `${toChips.value.length} recipient${toChips.value.length > 1 ? 's' : ''}` : 'Single'
  })
  toastSuccess('Draft saved', 'Your email has been saved to drafts.')
}

const toolbar = [
  { label:'Bold',        icon:'<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>' },
  { label:'Italic',      icon:'<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>' },
  { label:'Underline',   icon:'<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/>' },
  { label:'Link',        icon:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },
  { label:'List',        icon:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
  { label:'Image',       icon:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>' },
]

const drafts = ref([
  { id:1, subject:'June Savings Offer — Earn More',    time:'2h ago',    recipients:'Bulk · 94K' },
  { id:2, subject:'Your April Statement is Ready',     time:'Yesterday', recipients:'Bulk · 48K' },
  { id:3, subject:'Upgrade Your Plan Today',           time:'Jun 3',     recipients:'Single'     },
])

function loadDraft(d) { subject.value = d.subject }

function sendEmail() {
  if (mode.value === 'single' && toChips.value.length === 0 && !toInput.value.trim()) {
    toastError('Recipient required', 'Please add at least one recipient email address.')
    return
  }
  if (!subject.value.trim()) {
    toastError('Subject required', 'Please enter an email subject.')
    return
  }
  if (!body.value.trim()) {
    toastError('Message required', 'Please write the email body before sending.')
    return
  }
  const count = mode.value === 'bulk' ? bulkCount.toLocaleString() : toChips.value.length || 1
  toastSuccess('Email sent!', `Successfully sent to ${count} recipient${mode.value === 'bulk' ? 's' : ''}.`)
  toChips.value = []
  toInput.value = ''
  subject.value = ''
  body.value    = ''
}

const quickStats = [
  { label:'Emails Sent',   value:'12,480', color:'var(--t1)'  },
  { label:'Open Rate',     value:'38.6%',  color:'var(--accent)' },
  { label:'Click Rate',    value:'14.2%',  color:'#60a5fa'    },
  { label:'Unsubscribed',  value:'214',    color:'#f87171'    },
]
</script>

<style scoped>
.composer-page { display:flex; flex-direction:column; gap:20px; }

/* Header */
.comp-header { display:flex; align-items:flex-start; gap:14px; flex-wrap:wrap; }
.back-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; background:var(--glass); border:1px solid var(--border-soft); border-radius:9px; color:var(--t3); font-family:'Satoshi',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; flex-shrink:0; margin-top:4px; }
.back-btn:hover { color:var(--t1); border-color:var(--border); }
.comp-title { font-size:1.4rem; font-weight:800; color:var(--t1); letter-spacing:-0.025em; margin:0 0 4px; }
.comp-sub { font-size:0.8rem; color:var(--t3); margin:0; }

/* Layout */
.composer-layout { display:grid; grid-template-columns:1fr 300px; gap:18px; align-items:start; }

/* Glass panel */
.glass-panel { background:var(--glass); border:1px solid var(--border-soft); border-radius:18px; padding:22px; }

/* Compose Panel */
.compose-panel { display:flex; flex-direction:column; gap:18px; }
.compose-top { display:flex; align-items:center; justify-content:space-between; }
.compose-heading { font-size:0.95rem; font-weight:700; color:var(--t1); margin:0; }
.mode-toggle { display:flex; gap:3px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:8px; padding:3px; }
.mtab { font-family:'Satoshi',sans-serif; font-size:0.75rem; font-weight:500; color:var(--t3); background:transparent; border:none; padding:5px 14px; border-radius:5px; cursor:pointer; transition:all 0.2s ease; }
.mtab--active { color:var(--t1); background:var(--glass-hover); font-weight:700; }

/* Fields */
.field-group { display:flex; flex-direction:column; gap:7px; }
.field-label { font-size:0.7rem; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:0.07em; }
.field-input { background:var(--glass-2); border:1px solid var(--border-soft); border-radius:10px; padding:11px 14px; color:var(--t1); font-family:'Satoshi',sans-serif; font-size:0.84rem; outline:none; transition:border-color 0.2s ease; }
.field-input::placeholder { color:var(--t4); }
.field-input:focus { border-color:var(--accent-border); }

.to-field { min-height:44px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:10px; padding:8px 12px; display:flex; flex-wrap:wrap; gap:6px; align-items:center; transition:border-color 0.2s ease; }
.to-field:focus-within { border-color:var(--accent-border); }
.chip { display:flex; align-items:center; gap:6px; background:var(--accent-dim); border:1px solid var(--accent-border); border-radius:6px; padding:3px 8px; font-size:0.76rem; color:var(--accent); }
.chip__remove { background:none; border:none; padding:0; cursor:pointer; color:var(--accent); display:flex; opacity:0.7; }
.chip__remove:hover { opacity:1; }
.to-input { background:none; border:none; outline:none; font-family:'Satoshi',sans-serif; font-size:0.82rem; color:var(--t1); min-width:160px; flex:1; }
.to-input::placeholder { color:var(--t4); }
.bulk-hint { display:flex; align-items:center; gap:7px; font-size:0.78rem; color:var(--accent); }

/* Toolbar */
.toolbar { display:flex; align-items:center; gap:2px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:8px 8px 0 0; padding:6px 8px; }
.tool-btn { width:28px; height:28px; border-radius:6px; background:transparent; border:none; color:var(--t3); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.18s ease; }
.tool-btn:hover { background:var(--glass-hover); color:var(--t1); }
.toolbar-div { width:1px; height:16px; background:var(--border-soft); margin:0 4px; }

.body-group { }
.body-input { background:var(--glass-2); border:1px solid var(--border-soft); border-top:none; border-radius:0 0 10px 10px; padding:14px; color:var(--t1); font-family:'Satoshi',sans-serif; font-size:0.84rem; line-height:1.6; outline:none; resize:vertical; transition:border-color 0.2s ease; width:100%; }
.body-input::placeholder { color:var(--t4); }
.body-input:focus { border-color:var(--accent-border); }

/* Attachment */
.attachment-row { display:flex; align-items:center; gap:12px; }
.btn-attach { display:flex; align-items:center; gap:7px; padding:8px 16px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:8px; color:var(--t3); font-family:'Satoshi',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; }
.btn-attach:hover { color:var(--t1); border-color:var(--border); }
.attach-hint { font-size:0.7rem; color:var(--t4); }

/* Compose actions */
.compose-actions { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding-top:4px; border-top:1px solid var(--border-soft); }
.btn-save-draft { padding:9px 18px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:9px; color:var(--t3); font-family:'Satoshi',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; }
.btn-save-draft:hover { color:var(--t1); border-color:var(--border); }
.right-actions { display:flex; gap:10px; }
.btn-preview-email { display:flex; align-items:center; gap:6px; padding:9px 16px; background:var(--glass-2); border:1px solid var(--border-soft); border-radius:9px; color:var(--t2); font-family:'Satoshi',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; }
.btn-preview-email:hover { color:var(--t1); }
.btn-send-email { display:flex; align-items:center; gap:7px; padding:9px 22px; background:linear-gradient(135deg,var(--accent),#14a04a); border:none; border-radius:9px; color:#fff; font-family:'Satoshi',sans-serif; font-size:0.82rem; font-weight:700; cursor:pointer; transition:opacity 0.2s ease; }
.btn-send-email:hover { opacity:0.88; }

/* Right col */
.right-col { display:flex; flex-direction:column; gap:14px; }

/* Preview */
.side-title { font-size:0.88rem; font-weight:700; color:var(--t1); margin:0 0 14px; }
.email-preview { background:rgba(255,255,255,0.04); border:1px solid var(--border-soft); border-radius:12px; padding:16px; }
.ep-header { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.ep-logo { width:26px; height:26px; border-radius:7px; background:var(--accent); color:#fff; font-size:0.75rem; font-weight:900; display:flex; align-items:center; justify-content:center; }
.ep-brand { font-size:0.8rem; font-weight:700; color:var(--t1); }
.ep-subject { font-size:0.82rem; font-weight:700; color:var(--t1); margin:0 0 8px; }
.ep-body { font-size:0.74rem; color:var(--t3); line-height:1.55; margin:0 0 14px; white-space:pre-wrap; }
.ep-footer { font-size:0.65rem; color:var(--t4); border-top:1px solid var(--border-soft); padding-top:10px; }

/* Drafts */
.side-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.draft-count { width:22px; height:22px; border-radius:6px; background:var(--accent-dim); border:1px solid var(--accent-border); color:var(--accent); font-size:0.72rem; font-weight:800; display:flex; align-items:center; justify-content:center; }
.drafts-list { display:flex; flex-direction:column; gap:4px; }
.draft-item { display:flex; align-items:flex-start; gap:10px; padding:9px 10px; border-radius:10px; cursor:pointer; transition:background 0.18s ease; }
.draft-item:hover { background:var(--glass-2); }
.draft-item__icon { width:28px; height:28px; border-radius:7px; background:var(--glass-2); border:1px solid var(--border-soft); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.draft-item__subject { font-size:0.78rem; font-weight:600; color:var(--t2); margin:0 0 2px; }
.draft-item__meta { font-size:0.65rem; color:var(--t4); margin:0; }

/* Quick stats */
.qs-list { display:flex; flex-direction:column; gap:10px; }
.qs-item { display:flex; align-items:center; justify-content:space-between; }
.qs-label { font-size:0.78rem; color:var(--t3); }
.qs-val { font-size:0.9rem; font-weight:700; }

/* Slide transition */
.slide-enter-active, .slide-leave-active { transition:all 0.25s ease; }
.slide-enter-from, .slide-leave-to { opacity:0; transform:translateY(-8px); }
@media (max-width: 1024px) and (min-width: 769px) {
  .ec-split { grid-template-columns: 1fr 1fr; gap: 14px; }
}

@media (max-width: 768px) {
  .ec-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .ec-split  { grid-template-columns: 1fr; gap: 12px; }
  .ec-overlay { padding: 12px; align-items: flex-end; }
  .ec-modal  { max-width: 100%; border-radius: 22px 22px 0 0; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .email-preview { background: var(--glass); }
</style>
