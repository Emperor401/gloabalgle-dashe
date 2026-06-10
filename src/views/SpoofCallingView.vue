<!-- src/views/SpoofCallingView.vue -->
<template>
  <div class="sc-page">

    <!-- Back -->
    <button class="sc-back" @click="router.push('/tools')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      Back to Tools
    </button>

    <!-- Header -->
    <div class="sc-hdr">
      <div class="sc-hdr__inner">
        <div class="sc-hdr-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa"
            stroke-width="2" stroke-linecap="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <div>
          <h1 class="sc-hdr-title">Spoof Calling</h1>
          <p class="sc-hdr-sub">
            Place calls with voice replacement, prompted AI conversation, scripted voices, or live-operator typing.
          </p>
        </div>
      </div>
      <button class="sc-refresh-btn" @click="refreshCalls">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Stats -->
    <div class="sc-stats">
      <div class="sc-stat">
        <span class="sc-stat__label">PLAN TIME REMAINING</span>
        <span class="sc-stat__val">0 secs</span>
        <span class="sc-stat__note">Resets monthly. <span class="sc-link" @click="router.push('/billing')">Upgrade your plan for more.</span></span>
      </div>
      <div class="sc-stat">
        <span class="sc-stat__label">WALLET BALANCE</span>
        <span class="sc-stat__val">₦0</span>
        <span class="sc-stat__note">Used for overage after plan minutes are spent.</span>
      </div>
      <div class="sc-stat">
        <span class="sc-stat__label">PER-MINUTE RATE</span>
        <span class="sc-stat__val">₦2,750</span>
        <span class="sc-stat__note">≈ $2.023 / min</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="sc-tab-bar">
      <button v-for="t in tabs" :key="t.id"
        :class="['sc-tab', { 'sc-tab--active': activeTab === t.id }]"
        @click="activeTab = t.id">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" v-html="t.icon"/>
        {{ t.label }}
      </button>
    </div>

    <!-- ═════════════ SHARED PHONE INPUTS ═════════════ -->
    <div class="sc-form-card">
      <div class="sc-phone-row">
        <div class="sc-field">
          <label class="sc-label">Recipient phone <span class="sc-label-hint">(with country code)</span></label>
          <input v-model="recipientPhone" class="sc-input" placeholder="+15551234567" type="tel" />
        </div>
        <div class="sc-field">
          <label class="sc-label">Caller ID to display</label>
          <input v-model="callerID" class="sc-input" placeholder="+15559876543" type="tel" />
          <p class="sc-hint">The number shown on the recipient's screen.</p>
        </div>
      </div>

      <!-- ═════ SPEAK MYSELF ═════ -->
      <template v-if="activeTab === 'speak'">
        <div class="sc-section-label">VOICE</div>
        <div class="sc-voices">
          <label v-for="v in voices" :key="v.id"
            :class="['sc-voice-row', { 'sc-voice-row--active': selectedVoice === v.id }]"
            @click="selectedVoice = v.id">
            <div class="sc-radio" :class="{ 'sc-radio--on': selectedVoice === v.id }">
              <div v-if="selectedVoice === v.id" class="sc-radio-dot"/>
            </div>
            <div class="sc-voice-info">
              <span class="sc-voice-name">{{ v.label }}</span>
              <span class="sc-voice-desc">{{ v.desc }}</span>
            </div>
            <button v-if="v.id !== 'own'" class="sc-play-btn"
              @click.stop="playVoice(v)" :title="`Preview ${v.label}`">
              <svg v-if="playingVoice !== v.id" width="12" height="12" viewBox="0 0 24 24"
                fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
          </label>
        </div>

        <!-- Upload sample -->
        <div class="sc-upload-zone" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
          <input ref="fileInput" type="file" accept=".m4a,.mp3,.webm" style="display:none"
            @change="handleFileSelect" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p class="sc-upload-text">
            Or upload a voice sample <strong>(m4a / mp3 / webm, ≥ 6 seconds)</strong>.
            It's cloned for this call and auto-deleted after hangup.
          </p>
          <button class="sc-upload-btn" @click.stop="triggerUpload">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {{ uploadedFile ? uploadedFile.name : 'Upload sample' }}
          </button>
          <span v-if="uploadedFile" class="sc-upload-clear" @click.stop="uploadedFile = null">✕</span>
        </div>
      </template>

      <!-- ═════ CONVERSATIONAL (AI) ═════ -->
      <template v-else-if="activeTab === 'conversational'">
        <div class="sc-field">
          <label class="sc-label">AI Goal / Prompt</label>
          <textarea v-model="aiPrompt" class="sc-textarea" rows="4"
            placeholder="e.g. You are calling to confirm a delivery appointment for [customer name]. Be polite, professional, and confirm the address and delivery time."/>
          <p class="sc-hint">The AI will drive the conversation toward this goal.</p>
        </div>
        <div class="sc-field">
          <label class="sc-label">Opening line (optional)</label>
          <input v-model="openingLine" class="sc-input"
            placeholder="e.g. Hello, am I speaking with John? This is Sarah from DHL." />
        </div>
        <div class="sc-section-label">AI VOICE</div>
        <div class="sc-voices">
          <label v-for="v in aiVoices" :key="v.id"
            :class="['sc-voice-row', { 'sc-voice-row--active': selectedAIVoice === v.id }]"
            @click="selectedAIVoice = v.id">
            <div class="sc-radio" :class="{ 'sc-radio--on': selectedAIVoice === v.id }">
              <div v-if="selectedAIVoice === v.id" class="sc-radio-dot"/>
            </div>
            <div class="sc-voice-info">
              <span class="sc-voice-name">{{ v.label }}</span>
              <span class="sc-voice-desc">{{ v.desc }}</span>
            </div>
            <button v-if="true" class="sc-play-btn" @click.stop="playVoice(v)">
              <svg v-if="playingVoice !== v.id" width="12" height="12" viewBox="0 0 24 24"
                fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
          </label>
        </div>
        <!-- Quick prompts -->
        <div class="sc-section-label">QUICK PROMPTS</div>
        <div class="sc-quick-prompts">
          <button v-for="qp in quickPrompts" :key="qp" class="sc-qp-btn" @click="aiPrompt = qp">
            {{ qp.slice(0, 48) }}…
          </button>
        </div>
      </template>

      <!-- ═════ SCRIPT ═════ -->
      <template v-else-if="activeTab === 'script'">
        <div class="sc-field">
          <label class="sc-label">Script</label>
          <textarea v-model="scriptText" class="sc-textarea sc-textarea--lg" rows="7"
            placeholder="Type the full script here. This will be read aloud by the selected voice on the call.&#10;&#10;e.g. Hello, my name is James and I'm calling on behalf of Global Bank. We noticed unusual activity on your account and wanted to verify a few details. Is this a good time to speak?"/>
          <div class="sc-char-row">
            <span>{{ scriptText.length }} characters</span>
            <span class="sc-char-est">≈ {{ Math.ceil(scriptText.split(' ').filter(Boolean).length / 150) }} min read</span>
          </div>
        </div>
        <div class="sc-section-label">SCRIPT VOICE</div>
        <div class="sc-voices">
          <label v-for="v in aiVoices" :key="v.id"
            :class="['sc-voice-row', { 'sc-voice-row--active': selectedScriptVoice === v.id }]"
            @click="selectedScriptVoice = v.id">
            <div class="sc-radio" :class="{ 'sc-radio--on': selectedScriptVoice === v.id }">
              <div v-if="selectedScriptVoice === v.id" class="sc-radio-dot"/>
            </div>
            <div class="sc-voice-info">
              <span class="sc-voice-name">{{ v.label }}</span>
              <span class="sc-voice-desc">{{ v.desc }}</span>
            </div>
            <button class="sc-play-btn" @click.stop="playVoice(v)">
              <svg v-if="playingVoice !== v.id" width="12" height="12" viewBox="0 0 24 24"
                fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
          </label>
        </div>
      </template>

      <!-- ═════ LIVE ═════ -->
      <template v-else>
        <div class="sc-live-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa"
            stroke-width="2" stroke-linecap="round" style="flex-shrink:0;margin-top:1px">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>In <strong>Live mode</strong>, once the call connects you'll type lines and they'll be spoken in real time via the selected voice. You control every word.</p>
        </div>
        <div class="sc-section-label">LIVE VOICE</div>
        <div class="sc-voices">
          <label v-for="v in aiVoices" :key="v.id"
            :class="['sc-voice-row', { 'sc-voice-row--active': selectedLiveVoice === v.id }]"
            @click="selectedLiveVoice = v.id">
            <div class="sc-radio" :class="{ 'sc-radio--on': selectedLiveVoice === v.id }">
              <div v-if="selectedLiveVoice === v.id" class="sc-radio-dot"/>
            </div>
            <div class="sc-voice-info">
              <span class="sc-voice-name">{{ v.label }}</span>
              <span class="sc-voice-desc">{{ v.desc }}</span>
            </div>
            <button class="sc-play-btn" @click.stop="playVoice(v)">
              <svg v-if="playingVoice !== v.id" width="12" height="12" viewBox="0 0 24 24"
                fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
          </label>
        </div>
        <div class="sc-field">
          <label class="sc-label">Live typing preset (optional)</label>
          <input v-model="livePreset" class="sc-input"
            placeholder="Type a default opener to say when call connects..." />
        </div>
      </template>

      <!-- Start Call button -->
      <button class="sc-start-btn" :disabled="!canCall" @click="startCall">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        Start call
      </button>
    </div>

    <!-- Recent Calls -->
    <div class="sc-recent-card">
      <div class="sc-recent-hdr">
        <div>
          <div class="sc-recent-title">Recent calls</div>
          <p class="sc-recent-sub">
            Click any call to see the full transcript — what the AI said, what the recipient said, every line you typed.
          </p>
        </div>
        <button class="sc-refresh-btn" @click="refreshCalls">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
          </svg>
          Refresh
        </button>
      </div>

      <div v-if="recentCalls.length === 0" class="sc-empty">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.12)"
          stroke-width="1.5" stroke-linecap="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <p class="sc-empty-text">No calls yet — start one above.</p>
      </div>

      <div v-else class="sc-call-list">
        <div v-for="call in recentCalls" :key="call.id"
          class="sc-call-row" @click="viewTranscript(call)">
          <div :class="['sc-call-icon', `sc-call-icon--${call.status}`]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div class="sc-call-info">
            <span class="sc-call-to">{{ call.recipient }}</span>
            <span class="sc-call-meta">Caller ID: {{ call.callerID || 'Hidden' }} · {{ call.mode }} · {{ call.voice }}</span>
          </div>
          <div class="sc-call-right">
            <span :class="['sc-call-status', `sc-call-status--${call.status}`]">{{ call.status }}</span>
            <span class="sc-call-duration">{{ call.duration }}</span>
            <span class="sc-call-date">{{ call.date }}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round" class="sc-call-chevron">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- ═════ ACTIVE CALL MODAL ═════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="callState" class="sc-call-overlay">
          <div class="sc-call-modal">
            <!-- Ripple rings -->
            <div class="sc-ripple-wrap" v-if="callState === 'ringing'">
              <div class="sc-ripple sc-ripple--1"/>
              <div class="sc-ripple sc-ripple--2"/>
              <div class="sc-ripple sc-ripple--3"/>
            </div>

            <!-- Avatar -->
            <div :class="['sc-call-avatar', callState === 'connected' ? 'sc-call-avatar--live' : '']">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>

            <div class="sc-call-modal-status">{{ callStateLabel }}</div>
            <div class="sc-call-modal-number">{{ recipientPhone }}</div>
            <div class="sc-call-modal-cid">
              Showing as <strong>{{ callerID || 'Private number' }}</strong>
            </div>
            <div v-if="callState === 'connected'" class="sc-call-timer">
              {{ formatDuration(callTimer) }}
            </div>

            <!-- Live typing (live mode only) -->
            <div v-if="activeTab === 'live' && callState === 'connected'" class="sc-live-type">
              <input v-model="liveTyping" class="sc-live-input"
                placeholder="Type what to say and press Enter..."
                @keydown.enter="sendLiveLine" />
              <button class="sc-live-send" @click="sendLiveLine">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>

            <!-- Controls -->
            <div class="sc-call-controls">
              <button :class="['sc-ctrl-btn', { 'sc-ctrl-btn--active': isMuted }]" @click="isMuted = !isMuted">
                <svg v-if="!isMuted" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="1" y1="1" x2="23" y2="23"/>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                  <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                <span>{{ isMuted ? 'Unmute' : 'Mute' }}</span>
              </button>
              <button class="sc-ctrl-btn sc-ctrl-btn--end" @click="endCall">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.45-2.94"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <span>End call</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Transcript modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="transcriptCall" class="sc-call-overlay" @click.self="transcriptCall = null">
          <div class="sc-transcript-modal">
            <div class="sc-transcript-hdr">
              <div>
                <div class="sc-transcript-title">Call Transcript</div>
                <div class="sc-transcript-meta">
                  {{ transcriptCall.recipient }} · {{ transcriptCall.duration }} · {{ transcriptCall.date }}
                </div>
              </div>
              <button class="sc-modal-close" @click="transcriptCall = null">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="sc-transcript-body">
              <p class="sc-transcript-empty">No transcript available for this call.</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-up">
        <div v-if="toast" :class="['sc-toast', `sc-toast--${toast.type}`]">
          <svg v-if="toast.type === 'success'" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round">
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
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'
const { success: toastSuccess, error: toastError } = useToast()

const router = useRouter()

/* ── Tabs ── */
const tabs = [
  { id: 'speak',          label: 'Speak Myself',  icon: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>' },
  { id: 'conversational', label: 'Conversational', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { id: 'script',         label: 'Script',         icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
  { id: 'live',           label: 'Live',           icon: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>' },
]

/* ── Voices ── */
const voices = [
  { id: 'own',    label: 'Use my own voice (no replacement)',  desc: 'The recipient hears you exactly as you speak.',                      type: null    },
  { id: 'james',  label: 'James (Male)',                       desc: 'male',                                                                type: 'male'  },
  { id: 'rachel', label: 'Rachel (Female)',                    desc: 'female · ElevenLabs default voice · professional female',             type: 'female'},
]
const aiVoices = [
  { id: 'james',   label: 'James (Male)',    desc: 'male · deep and authoritative',                         type: 'male'    },
  { id: 'rachel',  label: 'Rachel (Female)', desc: 'female · ElevenLabs default voice · professional female', type: 'female'  },
  { id: 'alex',    label: 'Alex (Neutral)',  desc: 'neutral · clear and articulate · ElevenLabs',           type: 'neutral' },
  { id: 'maria',   label: 'Maria (Female)',  desc: 'female · warm and friendly · Spanish-accented English', type: 'female'  },
]
const quickPrompts = [
  'You are calling to confirm a delivery appointment. Be professional and confirm address and time.',
  'You are calling from the bank fraud department to verify a recent transaction on the account.',
  'You are calling to schedule a follow-up meeting after a recent business proposal.',
]

/* ── State ── */
const activeTab         = ref('speak')
const recipientPhone    = ref('')
const callerID          = ref('')
const selectedVoice     = ref('own')
const selectedAIVoice   = ref('james')
const selectedScriptVoice = ref('james')
const selectedLiveVoice = ref('james')
const playingVoice      = ref(null)
const uploadedFile      = ref(null)
const fileInput         = ref(null)
const aiPrompt          = ref('')
const openingLine       = ref('')
const scriptText        = ref('')
const livePreset        = ref('')
const liveTyping        = ref('')
const recentCalls       = ref([])
const transcriptCall    = ref(null)
const toast             = ref(null)

/* ── Call state ── */
const callState  = ref(null)   // null | 'ringing' | 'connected'
const callTimer  = ref(0)
const isMuted    = ref(false)
let   callInterval = null
let   ringingTimeout = null

const callStateLabel = computed(() => {
  if (callState.value === 'ringing') return 'Ringing...'
  if (callState.value === 'connected') return 'Connected'
  return ''
})

/* ── Computed ── */
const canCall = computed(() => {
  if (!recipientPhone.value.trim()) return false
  if (activeTab.value === 'conversational' && !aiPrompt.value.trim()) return false
  if (activeTab.value === 'script' && !scriptText.value.trim()) return false
  return true
})

/* ── Methods ── */
function refreshCalls() {
  showToast('success', 'Call history refreshed.')
}

function playVoice(v) {
  if (playingVoice.value === v.id) {
    playingVoice.value = null
  } else {
    playingVoice.value = v.id
    setTimeout(() => { playingVoice.value = null }, 3000)
  }
}

function triggerUpload() { fileInput.value?.click() }
function handleDrop(e)   { uploadedFile.value = e.dataTransfer.files[0] ?? null }
function handleFileSelect(e) { uploadedFile.value = e.target.files[0] ?? null }

function startCall() {
  if (!recipientPhone.value.trim())                                        { toastError('Recipient required',  'Enter the phone number to call.');                    return }
  if (activeTab.value === 'conversational' && !aiPrompt.value.trim())      { toastError('AI Goal required',   'Enter the AI goal/prompt for the call.');              return }
  if (activeTab.value === 'script' && !scriptText.value.trim())            { toastError('Script required',    'Please write a script before starting the call.');     return }
  if (activeTab.value === 'speak' && !uploadedFile.value)                  { toastError('Voice file required','Please upload a voice sample.');                       return }
  if (!canCall.value) return
  callState.value = 'ringing'
  isMuted.value   = false
  callTimer.value = 0
  ringingTimeout = setTimeout(() => {
    callState.value = 'connected'
    callInterval = setInterval(() => callTimer.value++, 1000)
  }, 2800)
}

function endCall() {
  clearTimeout(ringingTimeout)
  clearInterval(callInterval)
  const duration = callTimer.value
  const voiceLabel = {
    speak:          voices.find(v => v.id === selectedVoice.value)?.label,
    conversational: aiVoices.find(v => v.id === selectedAIVoice.value)?.label,
    script:         aiVoices.find(v => v.id === selectedScriptVoice.value)?.label,
    live:           aiVoices.find(v => v.id === selectedLiveVoice.value)?.label,
  }[activeTab.value] ?? 'Own voice'

  if (callState.value === 'connected') {
    recentCalls.value.unshift({
      id:        Date.now(),
      recipient: recipientPhone.value,
      callerID:  callerID.value || null,
      voice:     voiceLabel,
      mode:      tabs.find(t => t.id === activeTab.value)?.label ?? activeTab.value,
      duration:  formatDuration(duration),
      status:    'completed',
      date:      new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    })
  }
  callState.value = null
  callTimer.value = 0
  liveTyping.value = ''
}

function sendLiveLine() {
  if (!liveTyping.value.trim()) return
  liveTyping.value = ''
}

function formatDuration(secs) {
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}m ${s}s`
}

function viewTranscript(call) { transcriptCall.value = call }

function showToast(type, msg) {
  toast.value = { type, msg }
  setTimeout(() => { toast.value = null }, 3000)
}

onBeforeUnmount(() => {
  clearTimeout(ringingTimeout)
  clearInterval(callInterval)
})
</script>

<style scoped>
.sc-page {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 100vh;
}

/* back */
.sc-back {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--t3); font-size: 0.82rem; font-family: inherit;
  padding: 0; transition: color 0.2s; width: fit-content;
}
.sc-back:hover { color: var(--t1); }

/* ── Header ── */
.sc-hdr {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px;
}
.sc-hdr__inner { display: flex; align-items: center; gap: 16px; }
.sc-hdr-icon {
  width: 52px; height: 52px; border-radius: 16px;
  background: rgba(167,139,250,.1); border: 1px solid rgba(167,139,250,.2);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sc-hdr-title { font-size: 1.5rem; font-weight: 800; color: var(--t1); margin: 0 0 4px; letter-spacing: -0.02em; }
.sc-hdr-sub   { font-size: 0.8rem; color: var(--t3); margin: 0; line-height: 1.5; max-width: 560px; }

.sc-refresh-btn {
  display: flex; align-items: center; gap: 7px; flex-shrink: 0;
  background: var(--glass); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 9px 16px; font-size: 0.82rem;
  font-weight: 600; color: var(--t2); cursor: pointer;
  font-family: inherit; transition: border-color 0.2s, color 0.2s;
  backdrop-filter: blur(20px) saturate(180%);
}
.sc-refresh-btn:hover { border-color: rgba(167,139,250,.35); color: var(--t1); }

/* ── Stats ── */
.sc-stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}
.sc-stat {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 16px; padding: 18px 22px;
  display: flex; flex-direction: column; gap: 6px;
}
.sc-stat__label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--t3); }
.sc-stat__val   { font-size: 1.5rem; font-weight: 800; color: var(--t1); }
.sc-stat__note  { font-size: 0.73rem; color: var(--t3); }
.sc-link { color: #a78bfa; cursor: pointer; }
.sc-link:hover { text-decoration: underline; }

/* ── Tabs ── */
.sc-tab-bar {
  display: flex; gap: 4px;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 14px; padding: 5px; width: fit-content;
}
.sc-tab {
  display: flex; align-items: center; gap: 7px;
  background: none; border: none; border-radius: 10px;
  padding: 9px 18px; font-size: 0.82rem; font-weight: 600;
  color: var(--t3); cursor: pointer; font-family: inherit; transition: all 0.18s;
  white-space: nowrap; flex-shrink: 0;
}
.sc-tab:hover    { color: var(--t1); background: rgba(255,255,255,.05); }
.sc-tab--active  { background: rgba(167,139,250,.12); color: #a78bfa; border: 1px solid rgba(167,139,250,.25); }
/* hide scrollbar on the tab bar when overflowing */
.sc-tab-bar::-webkit-scrollbar { display: none; }

/* ── Form card ── */
.sc-form-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; padding: 28px;
  display: flex; flex-direction: column; gap: 20px;
}

/* phone row */
.sc-phone-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* fields */
.sc-field { display: flex; flex-direction: column; gap: 7px; }
.sc-label {
  font-size: 0.78rem; font-weight: 700; color: var(--t2);
  display: flex; align-items: center; gap: 6px;
}
.sc-label-hint { font-weight: 400; color: var(--t3); }
.sc-input {
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 12px 16px; font-size: 0.88rem;
  color: var(--t1); font-family: inherit; outline: none; transition: border-color 0.2s;
}
.sc-input:focus       { border-color: rgba(167,139,250,.4); }
.sc-input::placeholder{ color: var(--t3); }

.sc-textarea {
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 12px 16px; font-size: 0.88rem;
  color: var(--t1); font-family: inherit; outline: none; resize: vertical;
  transition: border-color 0.2s; line-height: 1.6;
}
.sc-textarea:focus       { border-color: rgba(167,139,250,.4); }
.sc-textarea::placeholder{ color: var(--t3); }
.sc-textarea--lg         { min-height: 140px; }

.sc-hint { font-size: 0.73rem; color: var(--t3); line-height: 1.4; margin: 0; }
.sc-char-row {
  display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--t3);
}
.sc-char-est { color: #a78bfa; }

/* section label */
.sc-section-label {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--t3);
}

/* ── Voices ── */
.sc-voices { display: flex; flex-direction: column; gap: 6px; }
.sc-voice-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border-radius: 14px;
  border: 1px solid var(--border-soft);
  cursor: pointer; transition: all 0.18s;
  background: rgba(255,255,255,.03);
}
.sc-voice-row:hover      { border-color: rgba(167,139,250,.3); background: rgba(167,139,250,.04); }
.sc-voice-row--active    { background: rgba(167,139,250,.07); border-color: rgba(167,139,250,.35); }

.sc-radio {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--border-soft); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s;
}
.sc-radio--on  { border-color: #a78bfa; }
.sc-radio-dot  { width: 8px; height: 8px; border-radius: 50%; background: #a78bfa; }

.sc-voice-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.sc-voice-name { font-size: 0.88rem; font-weight: 700; color: var(--t1); }
.sc-voice-desc { font-size: 0.72rem; color: var(--t3); }

.sc-play-btn {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(167,139,250,.1); border: 1px solid rgba(167,139,250,.2);
  display: flex; align-items: center; justify-content: center;
  color: #a78bfa; cursor: pointer; flex-shrink: 0; transition: background 0.2s;
}
.sc-play-btn:hover { background: rgba(167,139,250,.2); }

/* upload zone */
.sc-upload-zone {
  border: 1.5px dashed var(--border-soft);
  border-radius: 14px; padding: 18px 20px;
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  cursor: pointer; transition: border-color 0.2s;
  background: rgba(255,255,255,.02);
}
.sc-upload-zone:hover { border-color: rgba(167,139,250,.3); }
.sc-upload-text {
  font-size: 0.78rem; color: var(--t3); flex: 1; margin: 0; line-height: 1.5;
}
.sc-upload-text strong { color: var(--t2); }
.sc-upload-btn {
  display: flex; align-items: center; gap: 7px;
  background: rgba(167,139,250,.1); border: 1px solid rgba(167,139,250,.2);
  border-radius: 9px; padding: 8px 14px; font-size: 0.78rem; font-weight: 700;
  color: #a78bfa; cursor: pointer; font-family: inherit; transition: background 0.2s;
  white-space: nowrap; flex-shrink: 0;
}
.sc-upload-btn:hover { background: rgba(167,139,250,.2); }
.sc-upload-clear {
  color: var(--t3); cursor: pointer; font-size: 0.9rem; flex-shrink: 0;
  transition: color 0.2s;
}
.sc-upload-clear:hover { color: #f87171; }

/* conversational extras */
.sc-quick-prompts { display: flex; flex-direction: column; gap: 8px; }
.sc-qp-btn {
  background: rgba(255,255,255,.04); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 10px 14px; font-size: 0.78rem; color: var(--t3);
  text-align: left; cursor: pointer; font-family: inherit; transition: all 0.18s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sc-qp-btn:hover { border-color: rgba(167,139,250,.3); color: var(--t1); background: rgba(167,139,250,.05); }

/* live info */
.sc-live-info {
  display: flex; gap: 10px; align-items: flex-start;
  background: rgba(96,165,250,.07); border: 1px solid rgba(96,165,250,.18);
  border-radius: 12px; padding: 14px 16px;
}
.sc-live-info p { font-size: 0.8rem; color: var(--t2); margin: 0; line-height: 1.55; }
.sc-live-info strong { color: var(--t1); }

/* start btn */
.sc-start-btn {
  display: flex; align-items: center; justify-content: center; gap: 9px;
  width: 100%; padding: 15px; border-radius: 14px;
  background: #22c55e; border: none;
  font-size: 0.92rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s, opacity 0.2s;
}
.sc-start-btn:hover:not(:disabled) { background: #16a34a; }
.sc-start-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Recent calls ── */
.sc-recent-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; overflow: hidden;
}
.sc-recent-hdr {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 20px 24px 16px; border-bottom: 1px solid var(--border-soft);
}
.sc-recent-title { font-size: 0.92rem; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
.sc-recent-sub   { font-size: 0.75rem; color: var(--t3); margin: 0; line-height: 1.4; max-width: 480px; }

.sc-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 40px 24px;
}
.sc-empty-text { font-size: 0.84rem; color: var(--t3); margin: 0; }

.sc-call-list { display: flex; flex-direction: column; }
.sc-call-row {
  display: flex; align-items: center; gap: 14px; padding: 15px 24px;
  border-bottom: 1px solid var(--border-soft); cursor: pointer;
  transition: background 0.15s;
}
.sc-call-row:last-child { border-bottom: none; }
.sc-call-row:hover      { background: rgba(255,255,255,.03); }

.sc-call-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.sc-call-icon--completed { background: rgba(34,197,94,.12);  color: #22c55e;  border: 1px solid rgba(34,197,94,.2);  }
.sc-call-icon--missed    { background: rgba(248,113,113,.12); color: #f87171;  border: 1px solid rgba(248,113,113,.2);}
.sc-call-icon--failed    { background: rgba(251,191,36,.12);  color: #fbbf24;  border: 1px solid rgba(251,191,36,.2); }

.sc-call-info { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.sc-call-to   { font-size: 0.88rem; font-weight: 700; color: var(--t1); }
.sc-call-meta { font-size: 0.72rem; color: var(--t3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sc-call-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.sc-call-status {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px;
  border-radius: 999px;
}
.sc-call-status--completed { background: rgba(34,197,94,.12);  color: #22c55e;  border: 1px solid rgba(34,197,94,.2);  }
.sc-call-status--missed    { background: rgba(248,113,113,.12); color: #f87171;  border: 1px solid rgba(248,113,113,.2);}
.sc-call-duration { font-size: 0.78rem; font-weight: 700; color: var(--t1); }
.sc-call-date     { font-size: 0.68rem; color: var(--t3); }
.sc-call-chevron  { color: var(--t3); flex-shrink: 0; }

/* ── Active call modal ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from,  .modal-fade-leave-to     { opacity: 0; }

.sc-call-overlay {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,.7); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.sc-call-modal {
  position: relative;
  background: var(--modal-glass); backdrop-filter: blur(24px) saturate(180%); border: 1px solid var(--modal-border);
  border-radius: 28px; padding: 44px 40px 36px;
  width: 100%; max-width: 380px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  text-align: center; overflow: hidden;
}

/* ripple */
.sc-ripple-wrap {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.sc-ripple {
  position: absolute; border-radius: 50%;
  background: rgba(34,197,94,.07);
  animation: ripple 2.2s ease-out infinite;
}
.sc-ripple--1 { width: 100px; height: 100px; animation-delay: 0s;    }
.sc-ripple--2 { width: 160px; height: 160px; animation-delay: 0.55s; }
.sc-ripple--3 { width: 220px; height: 220px; animation-delay: 1.1s;  }
@keyframes ripple {
  0%   { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0;   }
}

.sc-call-avatar {
  width: 72px; height: 72px; border-radius: 50%; z-index: 1;
  background: rgba(34,197,94,.12); border: 2px solid rgba(34,197,94,.3);
  display: flex; align-items: center; justify-content: center;
  color: #22c55e; transition: all 0.5s;
}
.sc-call-avatar--live {
  background: rgba(34,197,94,.2); border-color: rgba(34,197,94,.5);
  animation: pulse-live 1.6s ease-in-out infinite;
}
@keyframes pulse-live {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

.sc-call-modal-status { font-size: 0.78rem; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: 0.1em; }
.sc-call-modal-number { font-size: 1.3rem; font-weight: 800; color: var(--t1); }
.sc-call-modal-cid    { font-size: 0.78rem; color: var(--t3); }
.sc-call-timer {
  font-size: 2rem; font-weight: 800; color: #22c55e;
  font-variant-numeric: tabular-nums; letter-spacing: -0.02em;
}

/* live typing in modal */
.sc-live-type {
  display: flex; gap: 8px; width: 100%;
}
.sc-live-input {
  flex: 1; background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  border-radius: 10px; padding: 10px 14px; font-size: 0.84rem;
  color: var(--t1); font-family: inherit; outline: none; transition: border-color 0.2s;
}
.sc-live-input:focus { border-color: rgba(34,197,94,.4); }
.sc-live-send {
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.25);
  color: #22c55e; cursor: pointer;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: background 0.2s;
}
.sc-live-send:hover { background: rgba(34,197,94,.25); }

/* call controls */
.sc-call-controls { display: flex; gap: 14px; margin-top: 8px; }
.sc-ctrl-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: rgba(255,255,255,.07); border: 1px solid var(--border-soft);
  border-radius: 14px; padding: 14px 22px; cursor: pointer;
  color: var(--t2); font-size: 0.72rem; font-weight: 600; font-family: inherit;
  transition: all 0.2s;
}
.sc-ctrl-btn:hover        { background: rgba(255,255,255,.12); color: var(--t1); }
.sc-ctrl-btn--active      { background: rgba(167,139,250,.12); border-color: rgba(167,139,250,.3); color: #a78bfa; }
.sc-ctrl-btn--end {
  background: rgba(248,113,113,.12); border-color: rgba(248,113,113,.25); color: #f87171;
}
.sc-ctrl-btn--end:hover { background: rgba(248,113,113,.22); }

/* transcript modal */
.sc-transcript-modal {
  background: var(--bg-card); border: 1px solid var(--border-soft);
  border-radius: 24px; padding: 24px; width: 100%; max-width: 480px;
  display: flex; flex-direction: column; gap: 16px;
}
.sc-transcript-hdr {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding-bottom: 14px; border-bottom: 1px solid var(--border-soft);
}
.sc-transcript-title { font-size: 1rem; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
.sc-transcript-meta  { font-size: 0.72rem; color: var(--t3); }
.sc-modal-close {
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  color: var(--t2); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: background 0.15s;
}
.sc-modal-close:hover { background: rgba(248,113,113,.12); color: #f87171; }
.sc-transcript-body  { min-height: 80px; display: flex; align-items: center; justify-content: center; }
.sc-transcript-empty { font-size: 0.82rem; color: var(--t3); text-align: center; }

/* ── Toast ── */
.toast-up-enter-active, .toast-up-leave-active { transition: all 0.3s ease; }
.toast-up-enter-from, .toast-up-leave-to       { opacity: 0; transform: translateY(20px); }
.sc-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px;
  padding: 13px 22px; border-radius: 14px;
  font-size: 0.84rem; font-weight: 600; z-index: 9999;
  backdrop-filter: blur(20px); white-space: nowrap;
}
.sc-toast--success { background: rgba(34,197,94,.18);  border: 1px solid rgba(34,197,94,.3);  color: #22c55e;  }
.sc-toast--error   { background: rgba(248,113,113,.18); border: 1px solid rgba(248,113,113,.3); color: #f87171; }

/* ── Tablet ── */
@media (max-width: 1024px) and (min-width: 769px) {
  .sc-stats      { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .sc-phone-row  { grid-template-columns: 1fr 1fr; gap: 14px; }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .sc-page       { padding: 0; gap: 16px; }
  .sc-hdr        { flex-direction: column; align-items: flex-start; gap: 10px; }
  .sc-hdr-title  { font-size: 1.3rem; }
  .sc-refresh-btn { align-self: flex-start; }

  /* tab bar: full-width, horizontally scrollable, no scrollbar visible */
  .sc-tab-bar    { width: 100%; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
  .sc-tab        { padding: 8px 14px; font-size: 0.78rem; }

  .sc-stats      { grid-template-columns: 1fr 1fr; gap: 10px; }
  .sc-phone-row  { grid-template-columns: 1fr; gap: 12px; }
  .sc-form-card  { padding: 18px 16px; }
  .sc-overlay    { padding: 0; align-items: flex-end; }
  .sc-call-modal { max-width: 100%; border-radius: 22px 22px 0 0; max-height: 90vh; overflow-y: auto; }
  .sc-toast      { bottom: 90px; max-width: calc(100vw - 32px); white-space: normal; }
}

/* ── Small Mobile ── */
@media (max-width: 480px) {
  .sc-stats      { grid-template-columns: 1fr; }
  .sc-hdr-title  { font-size: 1.15rem; }
  .sc-tab        { padding: 8px 12px; gap: 5px; }
  .sc-tab svg    { display: none; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .sc-empty svg { stroke: var(--t4); }
[data-theme="light"] .sc-upload-zone,
[data-theme="light"] .sc-voice-row,
[data-theme="light"] .sc-call-row:hover,
[data-theme="light"] .sc-qp-btn { background: var(--glass-2); }
[data-theme="light"] .sc-tab:hover,
[data-theme="light"] .sc-input,
[data-theme="light"] .sc-textarea,
[data-theme="light"] .sc-live-input,
[data-theme="light"] .sc-modal-close,
[data-theme="light"] .sc-ctrl-btn { background: var(--glass); }
[data-theme="light"] .sc-ctrl-btn:hover { background: var(--glass-hover); }
</style>
