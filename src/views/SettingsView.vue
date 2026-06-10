<!-- src/views/SettingsView.vue -->
<template>
  <div class="set-page">

    <!-- Mobile horizontal tab bar -->
    <div class="set-mobile-tabs">
      <button v-for="tab in tabs" :key="tab.id"
        :class="['set-mobile-tab', { 'set-mobile-tab--active': activeTab === tab.id }]"
        @click="activeTab = tab.id">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" v-html="tab.icon"/>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div class="set-layout">

      <!-- ── Left sub-nav ── -->
      <nav class="set-subnav set-left">
        <div class="set-subnav-user">
          <div class="set-avatar set-avatar--sm">{{ initials }}</div>
          <div>
            <div class="set-subnav-name">{{ profile.fullName }}</div>
            <div class="set-subnav-role">User account</div>
          </div>
        </div>
        <div class="set-subnav-divider"/>
        <button v-for="tab in tabs" :key="tab.id"
          :class="['set-nav-item', { 'set-nav-item--active': activeTab === tab.id }]"
          @click="activeTab = tab.id">
          <div class="set-nav-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" v-html="tab.icon"/>
          </div>
          <span>{{ tab.label }}</span>
          <svg v-if="activeTab === tab.id" width="11" height="11" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
            style="margin-left:auto;color:#22c55e">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </nav>

      <!-- ── Content ── -->
      <div class="set-content">

        <!-- ══════════ PROFILE ══════════ -->
        <template v-if="activeTab === 'profile'">

          <!-- User identity card -->
          <div class="set-id-card">
            <div class="set-id-avatar-wrap">
              <div class="set-avatar">{{ initials }}</div>
              <label class="set-avatar-edit" title="Change photo">
                <input type="file" accept="image/*" style="display:none" @change="showToast('success','Avatar updated.')"/>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </label>
            </div>
            <div class="set-id-body">
              <div class="set-id-name">{{ profile.fullName }}</div>
              <div class="set-id-handle">{{ profile.username }}</div>
              <div class="set-id-role">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                User
              </div>
            </div>
          </div>

          <!-- Info rows -->
          <div class="set-fields">

            <!-- Full Name -->
            <div class="set-field-row">
              <div class="set-field-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="set-field-body">
                <span class="set-field-label">FULL NAME</span>
                <template v-if="editing.fullName">
                  <input v-model="editVals.fullName" class="set-inline-input"
                    @keydown.enter="saveField('fullName')"
                    @keydown.esc="editing.fullName = false" />
                  <div class="set-inline-btns">
                    <button class="set-btn-save" @click="saveField('fullName')">Save</button>
                    <button class="set-btn-cancel" @click="editing.fullName = false">Cancel</button>
                  </div>
                </template>
                <span v-else class="set-field-val">{{ profile.fullName }}</span>
              </div>
              <button v-if="!editing.fullName" class="set-action-btn" @click="startEdit('fullName')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Edit
              </button>
            </div>

            <!-- Username -->
            <div class="set-field-row">
              <div class="set-field-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
                </svg>
              </div>
              <div class="set-field-body">
                <span class="set-field-label">USERNAME</span>
                <span class="set-field-val">{{ profile.username }}</span>
                <span class="set-field-note">Usernames are locked once set.</span>
              </div>
              <div class="set-locked-tag">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Locked
              </div>
            </div>

            <!-- Email -->
            <div class="set-field-row">
              <div class="set-field-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div class="set-field-body">
                <span class="set-field-label">EMAIL</span>
                <template v-if="editing.email">
                  <input v-model="editVals.email" class="set-inline-input" type="email"
                    @keydown.enter="saveField('email')"
                    @keydown.esc="editing.email = false" />
                  <div class="set-inline-btns">
                    <button class="set-btn-save" @click="saveField('email')">Save</button>
                    <button class="set-btn-cancel" @click="editing.email = false">Cancel</button>
                  </div>
                </template>
                <span v-else class="set-field-val">{{ profile.email }}</span>
              </div>
              <button v-if="!editing.email" class="set-action-btn" @click="startEdit('email')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Change
              </button>
            </div>

            <!-- Telegram -->
            <div class="set-field-row">
              <div class="set-field-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="set-field-body">
                <span class="set-field-label">TELEGRAM</span>
                <template v-if="editing.telegram">
                  <input v-model="editVals.telegram" class="set-inline-input" placeholder="@username"
                    @keydown.enter="saveField('telegram')"
                    @keydown.esc="editing.telegram = false" />
                  <div class="set-inline-btns">
                    <button class="set-btn-save" @click="saveField('telegram')">Save</button>
                    <button class="set-btn-cancel" @click="editing.telegram = false">Cancel</button>
                  </div>
                </template>
                <span v-else class="set-field-val">{{ profile.telegram || 'Not set' }}</span>
              </div>
              <button v-if="!editing.telegram" class="set-action-btn" @click="startEdit('telegram')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Change
              </button>
            </div>

            <!-- Phone -->
            <div class="set-field-row">
              <div class="set-field-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div class="set-field-body">
                <span class="set-field-label">PHONE</span>
                <template v-if="editing.phone">
                  <input v-model="editVals.phone" class="set-inline-input" placeholder="+2348012345678"
                    @keydown.enter="saveField('phone')"
                    @keydown.esc="editing.phone = false" />
                  <div class="set-inline-btns">
                    <button class="set-btn-save" @click="saveField('phone')">Save</button>
                    <button class="set-btn-cancel" @click="editing.phone = false">Cancel</button>
                  </div>
                </template>
                <span v-else class="set-field-val">{{ profile.phone || 'Not set' }}</span>
              </div>
              <button v-if="!editing.phone" class="set-action-btn" @click="startEdit('phone')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Change
              </button>
            </div>

          </div>
        </template>

        <!-- ══════════ SECURITY ══════════ -->
        <template v-else-if="activeTab === 'security'">

          <div class="set-card">
            <div class="set-card-title">Change Password</div>
            <div class="set-sec-form">
              <div class="set-fgroup">
                <label class="set-label">Current password</label>
                <div class="set-pw-wrap">
                  <input :type="showPw.current ? 'text' : 'password'" v-model="pwForm.current"
                    class="set-input" placeholder="Enter current password" />
                  <button class="set-pw-eye" @click="showPw.current = !showPw.current">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="set-fgroup">
                <label class="set-label">New password</label>
                <div class="set-pw-wrap">
                  <input :type="showPw.new ? 'text' : 'password'" v-model="pwForm.new"
                    class="set-input" placeholder="At least 8 characters" />
                  <button class="set-pw-eye" @click="showPw.new = !showPw.new">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
                <div v-if="pwForm.new" class="set-pw-strength">
                  <div class="set-pw-bars">
                    <div v-for="i in 4" :key="i"
                      :class="['set-pw-bar', { 'active': i <= pwStrength.score }]"
                      :style="i <= pwStrength.score ? { background: pwStrength.color } : {}"/>
                  </div>
                  <span class="set-pw-label" :style="{ color: pwStrength.color }">{{ pwStrength.label }}</span>
                </div>
              </div>
              <div class="set-fgroup">
                <label class="set-label">Confirm new password</label>
                <input type="password" v-model="pwForm.confirm" class="set-input"
                  :class="{ 'set-input--err': pwForm.confirm && pwForm.new !== pwForm.confirm }"
                  placeholder="Repeat new password" />
                <span v-if="pwForm.confirm && pwForm.new !== pwForm.confirm" class="set-err">Passwords do not match</span>
              </div>
              <button class="set-primary-btn" :disabled="!canChangePassword" @click="changePassword">
                Update Password
              </button>
            </div>
          </div>

          <div class="set-card">
            <div class="set-card-hdr">
              <div>
                <div class="set-card-title">Two-Factor Authentication</div>
                <p class="set-card-desc">Add an extra layer of security to your account.</p>
              </div>
              <div :class="['set-toggle', { 'set-toggle--on': twoFA }]" @click="twoFA = !twoFA">
                <div class="set-toggle-knob"/>
              </div>
            </div>
            <Transition name="slide-down">
              <div v-if="twoFA" class="set-2fa-notice">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
                  stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <p>2FA is active. A verification code will be required on every new login.</p>
              </div>
            </Transition>
          </div>

          <div class="set-card set-card--red">
            <div class="set-card-title" style="color:#f87171">Danger Zone</div>
            <p class="set-card-desc">These actions are permanent and cannot be undone.</p>
            <div class="set-danger-list">
              <div class="set-danger-item">
                <div>
                  <div class="set-danger-name">Deactivate account</div>
                  <div class="set-danger-sub">Temporarily disable your account. You can reactivate anytime.</div>
                </div>
                <button class="set-danger-btn set-danger-btn--amber"
                  @click="showToast('error','Account deactivation requires email confirmation.')">Deactivate</button>
              </div>
              <div class="set-danger-item">
                <div>
                  <div class="set-danger-name">Delete account</div>
                  <div class="set-danger-sub">Permanently delete your account and all associated data.</div>
                </div>
                <button class="set-danger-btn set-danger-btn--red"
                  @click="showToast('error','Account deletion requires email confirmation.')">Delete account</button>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════════ LOGIN HISTORY ══════════ -->
        <template v-else-if="activeTab === 'login'">
          <div class="set-card">
            <div class="set-card-hdr">
              <div class="set-card-title">Login History</div>
              <span class="set-count-badge">{{ loginHistory.length }} sessions</span>
            </div>
            <div class="set-login-table">
              <div class="set-login-head">
                <span>DATE & TIME</span>
                <span>DEVICE</span>
                <span>LOCATION</span>
                <span>IP ADDRESS</span>
                <span>STATUS</span>
              </div>
              <div v-for="log in loginHistory" :key="log.id" class="set-login-row">
                <span class="set-login-date">{{ log.date }}</span>
                <div class="set-login-device">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" v-html="log.deviceIcon"/>
                  {{ log.device }}
                </div>
                <span class="set-login-loc">{{ log.location }}</span>
                <span class="set-login-ip">{{ log.ip }}</span>
                <span :class="['set-status-tag', `set-status-tag--${log.status}`]">{{ log.status }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════════ MY SMTP ══════════ -->
        <template v-else-if="activeTab === 'smtp'">
          <div class="set-card">
            <div class="set-card-title">My SMTP</div>
            <p class="set-card-desc">
              Configure a custom SMTP server to send emails from your own domain.
              Leave blank to use Globalgle's default sending infrastructure.
            </p>
            <div class="set-smtp-form">
              <div class="set-smtp-row">
                <div class="set-fgroup" style="flex:1">
                  <label class="set-label">SMTP Host</label>
                  <input v-model="smtp.host" class="set-input" placeholder="mail.yourdomain.com" />
                </div>
                <div class="set-fgroup" style="width:120px;flex-shrink:0">
                  <label class="set-label">Port</label>
                  <input v-model="smtp.port" class="set-input" placeholder="587" type="number" />
                </div>
              </div>
              <div class="set-fgroup">
                <label class="set-label">Username / Email</label>
                <input v-model="smtp.username" class="set-input" placeholder="noreply@yourdomain.com" />
              </div>
              <div class="set-fgroup">
                <label class="set-label">Password</label>
                <div class="set-pw-wrap">
                  <input :type="showSmtpPw ? 'text' : 'password'" v-model="smtp.password"
                    class="set-input" placeholder="SMTP password or app password" />
                  <button class="set-pw-eye" @click="showSmtpPw = !showSmtpPw">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="set-smtp-row">
                <div class="set-fgroup" style="flex:1">
                  <label class="set-label">From Name</label>
                  <input v-model="smtp.fromName" class="set-input" placeholder="Your Company" />
                </div>
                <div class="set-fgroup" style="flex:1">
                  <label class="set-label">From Email</label>
                  <input v-model="smtp.fromEmail" class="set-input" placeholder="hello@yourdomain.com" />
                </div>
              </div>
              <div class="set-fgroup">
                <label class="set-label">Encryption</label>
                <div class="set-radio-row">
                  <label v-for="enc in ['TLS', 'SSL', 'None']" :key="enc" class="set-radio-opt">
                    <div :class="['set-radio', { 'set-radio--on': smtp.encryption === enc }]"
                      @click="smtp.encryption = enc">
                      <div v-if="smtp.encryption === enc" class="set-radio-dot"/>
                    </div>
                    {{ enc }}
                  </label>
                </div>
              </div>
              <div class="set-smtp-btns">
                <button class="set-ghost-btn" @click="showToast('success','Test email sent! Check your inbox.')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.5" stroke-linecap="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Send test email
                </button>
                <button class="set-primary-btn" @click="showToast('success','SMTP settings saved.')">
                  Save SMTP settings
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════════ REFERRALS ══════════ -->
        <template v-else>

          <!-- Stats row -->
          <div class="set-ref-stats">
            <div class="set-ref-stat" v-for="s in refStats" :key="s.label">
              <div :class="['set-ref-icon', `set-ref-icon--${s.color}`]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" v-html="s.icon"/>
              </div>
              <div>
                <div class="set-ref-val">{{ s.val }}</div>
                <div class="set-ref-lbl">{{ s.label }}</div>
              </div>
            </div>
          </div>

          <div class="set-card">
            <div class="set-card-title">Your Referral Code</div>
            <div class="set-ref-row">
              <div class="set-ref-code">{{ referralCode }}</div>
              <button class="set-copy-btn" @click="copyText(referralCode)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <div class="set-card-title" style="margin-top:16px">Your Referral Link</div>
            <div class="set-ref-row">
              <div class="set-ref-link">{{ referralLink }}</div>
              <button class="set-copy-btn" @click="copyText(referralLink)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
            <p class="set-card-desc" style="margin-top:10px">
              Earn <strong style="color:#22c55e">₦500</strong> for each friend who signs up and activates a paid plan using your code.
            </p>
          </div>

          <div class="set-card">
            <div class="set-card-hdr">
              <div class="set-card-title">Referred Users</div>
              <span class="set-count-badge">0 total</span>
            </div>
            <div class="set-empty-state">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,.08)" stroke-width="1.5" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p>No referrals yet. Share your code to start earning!</p>
            </div>
          </div>
        </template>

      </div>
    </div>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-up">
        <div v-if="toast" :class="['set-toast', `set-toast--${toast.type}`]">
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

/* ── Tabs ── */
const tabs = [
  { id: 'profile',  label: 'Profile',       icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { id: 'security', label: 'Security',      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { id: 'login',    label: 'Login history', icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
  { id: 'smtp',     label: 'My SMTP',       icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
  { id: 'referrals',label: 'Referrals',     icon: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' },
]
const activeTab = ref('profile')

/* ── Profile ── */
const profile = ref({
  fullName: 'EMPREROR SOLOS',
  username: '@refrer',
  email:    'emprerorsolos@gmail.com',
  telegram: '@emperor373',
  phone:    '',
})

const initials = computed(() =>
  profile.value.fullName.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
)

const editing  = ref({ fullName: false, email: false, telegram: false, phone: false })
const editVals = ref({ ...profile.value })

function startEdit(field) {
  editing.value[field]  = true
  editVals.value[field] = profile.value[field]
}
function saveField(field) {
  profile.value[field] = editVals.value[field]
  editing.value[field] = false
  showToast('success', 'Profile updated successfully.')
}

/* ── Security ── */
const pwForm = ref({ current: '', new: '', confirm: '' })
const showPw = ref({ current: false, new: false })
const twoFA  = ref(false)

const pwStrength = computed(() => {
  const pw = pwForm.value.new
  let score = 0
  if (pw.length >= 8)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#f87171', '#f59e0b', '#60a5fa', '#22c55e']
  return { score, label: labels[score] || '', color: colors[score] || '' }
})

const canChangePassword = computed(() =>
  pwForm.value.current &&
  pwForm.value.new.length >= 8 &&
  pwForm.value.new === pwForm.value.confirm
)

function changePassword() {
  pwForm.value = { current: '', new: '', confirm: '' }
  showToast('success', 'Password updated successfully.')
}

/* ── Login history ── */
const loginHistory = ref([
  { id: 1, date: 'Jun 9, 2026 · 10:24 AM', device: 'Chrome · Windows', location: 'Lagos, NG',  ip: '102.89.23.14',  status: 'current', deviceIcon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { id: 2, date: 'Jun 8, 2026 · 08:11 PM', device: 'Safari · iPhone',  location: 'Abuja, NG',  ip: '102.91.44.20',  status: 'success', deviceIcon: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>' },
  { id: 3, date: 'Jun 7, 2026 · 03:55 PM', device: 'Firefox · Linux',  location: 'London, UK', ip: '185.220.101.8', status: 'blocked', deviceIcon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { id: 4, date: 'Jun 5, 2026 · 11:00 AM', device: 'Chrome · Android', location: 'Lagos, NG',  ip: '102.89.50.66',  status: 'success', deviceIcon: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>' },
])

/* ── SMTP ── */
const smtp = ref({ host: '', port: '587', username: '', password: '', fromName: '', fromEmail: '', encryption: 'TLS' })
const showSmtpPw = ref(false)

/* ── Referrals ── */
const referralCode = 'GLOBAL-REFRER'
const referralLink = 'https://globalgle.app/ref/GLOBAL-REFRER'

const refStats = [
  { label: 'Total Referrals', val: '0',  color: 'green', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { label: 'Active Plans',    val: '0',  color: 'blue',  icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { label: 'Total Earned',    val: '₦0', color: 'amber', icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
]

/* ── Utilities ── */
const toast = ref(null)
function showToast(type, msg) {
  toast.value = { type, msg }
  setTimeout(() => { toast.value = null }, 3000)
}
function copyText(text) {
  navigator.clipboard?.writeText(text)
  showToast('success', 'Copied to clipboard!')
}
</script>

<style scoped>
.set-page {
  padding: 0;
}

/* ── Layout ── */
.set-layout {
  display: grid;
  grid-template-columns: 218px 1fr;
  gap: 20px;
  align-items: start;
}

/* ── Sub-nav ── */
.set-subnav {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  overflow: hidden;
  position: sticky;
  top: 90px;
}

.set-subnav-user {
  display: flex; align-items: center; gap: 11px;
  padding: 16px 14px 14px;
}
.set-subnav-name {
  font-size: 0.78rem; font-weight: 800; color: var(--t1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px;
}
.set-subnav-role { font-size: 0.65rem; color: var(--t3); margin-top: 1px; }
.set-subnav-divider { height: 1px; background: var(--border-soft); }

.set-nav-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; background: none; border: none; cursor: pointer;
  padding: 10px 12px; font-family: inherit; font-size: 0.82rem;
  font-weight: 600; color: var(--t3); transition: all 0.18s; text-align: left;
}
.set-nav-item:hover { background: rgba(255,255,255,.04); color: var(--t2); }
.set-nav-item--active {
  background: rgba(34,197,94,.09); color: #22c55e;
  border-left: 2px solid #22c55e;
}
.set-nav-icon {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center;
}
.set-nav-item--active .set-nav-icon {
  background: rgba(34,197,94,.12); border-color: rgba(34,197,94,.2);
}

/* ── Avatar ── */
.set-avatar {
  width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0;
  background: rgba(34,197,94,.1); border: 2px solid rgba(34,197,94,.3);
  font-size: 1.15rem; font-weight: 800; color: #22c55e;
  display: flex; align-items: center; justify-content: center;
}
.set-avatar--sm { width: 36px; height: 36px; font-size: 0.75rem; }

/* ── ID card ── */
.set-id-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 20px;
  padding: 20px 22px; display: flex; align-items: center; gap: 18px;
  position: relative;
}
.set-id-avatar-wrap { position: relative; }
.set-id-body { display: flex; flex-direction: column; gap: 3px; }
.set-id-name  { font-size: 1.1rem; font-weight: 800; color: var(--t1); letter-spacing: -0.01em; }
.set-id-handle{ font-size: 0.78rem; color: var(--t3); }
.set-id-role {
  display: inline-flex; align-items: center; gap: 5px; margin-top: 3px;
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--t3); background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  border-radius: 6px; padding: 2px 8px; width: fit-content;
}

.set-avatar-edit {
  position: absolute; bottom: 0; right: 0; width: 22px; height: 22px;
  border-radius: 50%; background: rgba(34,197,94,.2); border: 2px solid rgba(34,197,94,.4);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #22c55e; transition: background 0.2s;
}
.set-avatar-edit:hover { background: rgba(34,197,94,.35); }

/* ── Profile fields ── */
.set-content { display: flex; flex-direction: column; gap: 16px; }
.set-fields   { display: flex; flex-direction: column; gap: 3px; }

.set-field-row {
  display: flex; align-items: center; gap: 14px;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  padding: 15px 18px; transition: border-color 0.2s;
}
.set-field-row:first-child { border-radius: 14px 14px 5px 5px; }
.set-field-row:last-child  { border-radius: 5px 5px 14px 14px; }
.set-field-row:not(:first-child):not(:last-child) { border-radius: 5px; }
.set-field-row:hover { border-color: rgba(34,197,94,.22); }

.set-field-icon {
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  display: flex; align-items: center; justify-content: center; color: var(--t3);
}
.set-field-body { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.set-field-label {
  font-size: 0.61rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--t3);
}
.set-field-val  { font-size: 0.88rem; font-weight: 600; color: var(--t1); }
.set-field-note { font-size: 0.7rem; color: var(--t3); }

.set-inline-input {
  background: rgba(255,255,255,.06); border: 1px solid rgba(34,197,94,.3);
  border-radius: 8px; padding: 7px 11px; font-size: 0.87rem;
  color: var(--t1); font-family: inherit; outline: none; width: 100%;
  box-sizing: border-box; transition: border-color 0.2s;
}
.set-inline-input:focus { border-color: rgba(34,197,94,.55); }

.set-inline-btns { display: flex; gap: 6px; margin-top: 5px; }
.set-btn-save {
  background: rgba(34,197,94,.14); border: 1px solid rgba(34,197,94,.25);
  border-radius: 7px; padding: 5px 13px; font-size: 0.73rem; font-weight: 700;
  color: #22c55e; cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.set-btn-save:hover { background: rgba(34,197,94,.24); }
.set-btn-cancel {
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 7px; padding: 5px 13px; font-size: 0.73rem; font-weight: 600;
  color: var(--t3); cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.set-btn-cancel:hover { color: var(--t1); }

.set-action-btn {
  flex-shrink: 0; display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 8px; padding: 6px 12px; font-size: 0.74rem; font-weight: 600;
  color: var(--t2); cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.set-action-btn:hover { background: rgba(34,197,94,.1); border-color: rgba(34,197,94,.25); color: #22c55e; }

.set-locked-tag {
  flex-shrink: 0; display: flex; align-items: center; gap: 5px;
  font-size: 0.68rem; font-weight: 700; color: var(--t3);
  background: rgba(255,255,255,.04); border: 1px solid var(--border-soft);
  border-radius: 7px; padding: 5px 10px;
}

/* ── Cards ── */
.set-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft);
  border-radius: 20px; padding: 22px;
  display: flex; flex-direction: column; gap: 14px;
}
.set-card--red { border-color: rgba(248,113,113,.2); background: rgba(248,113,113,.03); }

.set-card-hdr   { display: flex; justify-content: space-between; align-items: flex-start; }
.set-card-title { font-size: 0.9rem; font-weight: 700; color: var(--t1); }
.set-card-desc  { font-size: 0.77rem; color: var(--t3); margin: 0; line-height: 1.5; }
.set-count-badge {
  font-size: 0.66rem; font-weight: 700; padding: 3px 9px; border-radius: 999px;
  background: rgba(34,197,94,.1); color: #22c55e; border: 1px solid rgba(34,197,94,.2);
}

/* ── Security form ── */
.set-sec-form  { display: flex; flex-direction: column; gap: 14px; }
.set-fgroup    { display: flex; flex-direction: column; gap: 6px; }
.set-label     { font-size: 0.73rem; font-weight: 700; color: var(--t2); }

.set-input {
  width: 100%; background: rgba(255,255,255,.05); border: 1px solid var(--border-soft);
  border-radius: 11px; padding: 10px 14px; font-size: 0.87rem;
  color: var(--t1); font-family: inherit; outline: none; box-sizing: border-box;
  transition: border-color 0.2s;
}
.set-input:focus { border-color: rgba(34,197,94,.4); }
.set-input--err  { border-color: rgba(248,113,113,.4); }

.set-err { font-size: 0.7rem; color: #f87171; }

.set-pw-wrap { position: relative; }
.set-pw-wrap .set-input { padding-right: 40px; }
.set-pw-eye {
  position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: var(--t3); padding: 3px;
  transition: color 0.2s;
}
.set-pw-eye:hover { color: var(--t1); }

.set-pw-strength { display: flex; align-items: center; gap: 8px; margin-top: 3px; }
.set-pw-bars { display: flex; gap: 4px; }
.set-pw-bar {
  width: 34px; height: 4px; border-radius: 2px;
  background: rgba(255,255,255,.09); transition: background 0.3s;
}
.set-pw-label { font-size: 0.7rem; font-weight: 700; }

.set-primary-btn {
  padding: 11px 22px; border-radius: 11px;
  background: #22c55e; border: none;
  font-size: 0.84rem; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit; transition: background 0.2s, opacity 0.2s;
}
.set-primary-btn:hover:not(:disabled) { background: #16a34a; }
.set-primary-btn:disabled { opacity: 0.38; cursor: not-allowed; }

/* Toggle */
.set-toggle {
  width: 42px; height: 24px; border-radius: 12px; flex-shrink: 0;
  background: rgba(255,255,255,.09); border: 1px solid var(--border-soft);
  position: relative; cursor: pointer; transition: all 0.25s;
}
.set-toggle--on { background: rgba(34,197,94,.22); border-color: rgba(34,197,94,.38); }
.set-toggle-knob {
  width: 18px; height: 18px; border-radius: 50%; background: var(--t3);
  position: absolute; top: 2px; left: 2px; transition: transform 0.25s, background 0.25s;
}
.set-toggle--on .set-toggle-knob { transform: translateX(18px); background: #22c55e; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.22s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

.set-2fa-notice {
  display: flex; gap: 9px; align-items: flex-start;
  background: rgba(34,197,94,.06); border: 1px solid rgba(34,197,94,.18);
  border-radius: 10px; padding: 12px 14px;
}
.set-2fa-notice p { font-size: 0.77rem; color: var(--t2); margin: 0; line-height: 1.5; }

/* Danger */
.set-danger-list { display: flex; flex-direction: column; gap: 10px; }
.set-danger-item {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 14px 16px; border-radius: 12px;
  background: rgba(255,255,255,.02); border: 1px solid rgba(248,113,113,.1);
}
.set-danger-name { font-size: 0.83rem; font-weight: 700; color: var(--t1); margin-bottom: 3px; }
.set-danger-sub  { font-size: 0.72rem; color: var(--t3); }
.set-danger-btn {
  flex-shrink: 0; padding: 7px 15px; border-radius: 9px;
  font-size: 0.77rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.set-danger-btn--amber { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.22); color: #f59e0b; }
.set-danger-btn--amber:hover { background: rgba(245,158,11,.2); }
.set-danger-btn--red  { background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.22); color: #f87171; }
.set-danger-btn--red:hover  { background: rgba(248,113,113,.2); }

/* ── Login history ── */
.set-login-table { display: flex; flex-direction: column; }
.set-login-head {
  display: grid; grid-template-columns: 175px 1fr 110px 125px 85px;
  gap: 12px; padding: 8px 0 10px;
  font-size: 0.61rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.09em; color: var(--t3);
  border-bottom: 1px solid var(--border-soft);
}
.set-login-row {
  display: grid; grid-template-columns: 175px 1fr 110px 125px 85px;
  gap: 12px; padding: 12px 0; align-items: center;
  border-bottom: 1px solid var(--border-soft);
}
.set-login-row:last-child { border-bottom: none; }
.set-login-date  { font-size: 0.75rem; color: var(--t3); }
.set-login-device{ font-size: 0.8rem; font-weight: 600; color: var(--t1); display: flex; align-items: center; gap: 6px; }
.set-login-loc   { font-size: 0.77rem; color: var(--t2); }
.set-login-ip    { font-size: 0.72rem; color: var(--t3); font-family: monospace; }

.set-status-tag {
  font-size: 0.63rem; font-weight: 700; text-transform: uppercase;
  padding: 3px 9px; border-radius: 999px; width: fit-content;
}
.set-status-tag--current { background: rgba(34,197,94,.1);   color: #22c55e;  border: 1px solid rgba(34,197,94,.2);  }
.set-status-tag--success { background: rgba(96,165,250,.1);  color: #60a5fa;  border: 1px solid rgba(96,165,250,.2); }
.set-status-tag--blocked { background: rgba(248,113,113,.1); color: #f87171;  border: 1px solid rgba(248,113,113,.2);}

/* ── SMTP ── */
.set-smtp-form  { display: flex; flex-direction: column; gap: 14px; }
.set-smtp-row   { display: flex; gap: 14px; }
.set-radio-row  { display: flex; gap: 18px; }
.set-radio-opt  { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 600; color: var(--t2); cursor: pointer; }
.set-radio {
  width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
  border: 2px solid var(--border-soft); display: flex; align-items: center;
  justify-content: center; transition: border-color 0.2s;
}
.set-radio--on  { border-color: #22c55e; }
.set-radio-dot  { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; }
.set-smtp-btns  { display: flex; gap: 10px; }
.set-ghost-btn {
  display: flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,.06); border: 1px solid var(--border-soft);
  border-radius: 11px; padding: 10px 16px; font-size: 0.83rem;
  font-weight: 600; color: var(--t2); cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.set-ghost-btn:hover { border-color: rgba(34,197,94,.3); color: #22c55e; }
.set-smtp-btns .set-primary-btn { flex: 1; }

/* ── Referrals ── */
.set-ref-stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}
.set-ref-stat {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-soft); border-radius: 16px;
  padding: 17px; display: flex; align-items: center; gap: 14px;
}
.set-ref-icon {
  width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.set-ref-icon--green { background: rgba(34,197,94,.1);   border: 1px solid rgba(34,197,94,.2);   color: #22c55e;  }
.set-ref-icon--blue  { background: rgba(96,165,250,.1);  border: 1px solid rgba(96,165,250,.2);  color: #60a5fa;  }
.set-ref-icon--amber { background: rgba(245,158,11,.1);  border: 1px solid rgba(245,158,11,.2);  color: #f59e0b;  }
.set-ref-val { font-size: 1.35rem; font-weight: 800; color: var(--t1); line-height: 1; }
.set-ref-lbl { font-size: 0.69rem; color: var(--t3); margin-top: 3px; }

.set-ref-row {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,.04); border: 1px solid var(--border-soft);
  border-radius: 12px; padding: 12px 16px;
}
.set-ref-code { flex: 1; font-size: 1.1rem; font-weight: 800; color: #22c55e; letter-spacing: 0.05em; font-family: monospace; }
.set-ref-link { flex: 1; font-size: 0.77rem; color: var(--t3); font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.set-copy-btn {
  flex-shrink: 0; display: flex; align-items: center; gap: 6px;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  border-radius: 8px; padding: 7px 13px; font-size: 0.75rem; font-weight: 700;
  color: #22c55e; cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.set-copy-btn:hover { background: rgba(34,197,94,.2); }

.set-empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 26px; color: var(--t3); font-size: 0.81rem; text-align: center;
}

/* ── Toast ── */
.toast-up-enter-active, .toast-up-leave-active { transition: all 0.3s ease; }
.toast-up-enter-from, .toast-up-leave-to       { opacity: 0; transform: translateY(18px); }
.set-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 9px;
  padding: 12px 20px; border-radius: 13px; font-size: 0.83rem; font-weight: 600;
  z-index: 9999; backdrop-filter: blur(20px); white-space: nowrap;
}
.set-toast--success { background: rgba(34,197,94,.18);   border: 1px solid rgba(34,197,94,.3);   color: #22c55e;  }
.set-toast--error   { background: rgba(248,113,113,.18); border: 1px solid rgba(248,113,113,.3); color: #f87171; }

/* ── Mobile horizontal tab bar ── */
.set-mobile-tabs {
  display: none;
  overflow-x: auto; gap: 6px; padding: 0 0 12px;
  scrollbar-width: none;
}
.set-mobile-tabs::-webkit-scrollbar { display: none; }
.set-mobile-tab {
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
  padding: 8px 14px; border-radius: 10px; border: 1px solid var(--border-soft);
  background: var(--glass); font-size: 0.78rem; font-weight: 600; color: var(--t3);
  cursor: pointer; font-family: inherit; transition: all 0.2s; flex-shrink: 0;
}
.set-mobile-tab--active {
  background: rgba(34,197,94,.1); border-color: rgba(34,197,94,.3); color: #22c55e;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .set-layout      { grid-template-columns: 200px 1fr; }
  .set-ref-stats   { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .set-layout      { grid-template-columns: 1fr; }
  .set-left        { display: none; }
  .set-mobile-tabs { display: flex; }

  /* ID card */
  .set-id-card     { padding: 16px 18px; gap: 14px; }
  .set-avatar      { width: 52px; height: 52px; font-size: 1rem; }
  .set-id-name     { font-size: 0.95rem; }

  /* Field rows */
  .set-field-row   { padding: 12px 14px; gap: 10px; }
  .set-field-icon  { width: 28px; height: 28px; border-radius: 7px; }
  .set-action-btn  { padding: 5px 10px; font-size: 0.7rem; }
  .set-locked-tag  { padding: 4px 8px; font-size: 0.64rem; }

  /* Cards */
  .set-card        { padding: 18px; gap: 12px; }

  /* Danger zone — stack on mobile */
  .set-danger-item { flex-direction: column; align-items: flex-start; gap: 12px; }
  .set-danger-btn  { width: 100%; text-align: center; justify-content: center; display: flex; }

  /* Ref stats */
  .set-ref-stats   { grid-template-columns: 1fr 1fr; }

  /* SMTP */
  .set-smtp-row    { flex-direction: column; }
  .set-smtp-btns   { flex-direction: column; }
  .set-smtp-btns .set-primary-btn { flex: unset; }

  /* Login history — card layout instead of table */
  .set-login-head  { display: none; }
  .set-login-row   {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 4px 10px;
    padding: 12px 0;
  }
  .set-login-date   { grid-column: 1; grid-row: 1; font-size: 0.72rem; }
  .set-login-device { grid-column: 1; grid-row: 2; font-size: 0.77rem; }
  .set-login-loc    { display: none; }
  .set-login-ip     { display: none; }
  .set-status-tag   { grid-column: 2; grid-row: 1 / 3; align-self: center; }
}

@media (max-width: 480px) {
  .set-mobile-tabs  { gap: 5px; }
  .set-mobile-tab   { padding: 7px 11px; font-size: 0.74rem; }
  .set-mobile-tab svg { display: none; }

  .set-id-card      { flex-direction: column; align-items: flex-start; gap: 12px; }
  .set-id-avatar-wrap { align-self: center; }

  .set-field-row    { padding: 11px 12px; gap: 8px; }
  .set-field-icon   { display: none; }
  .set-field-val    { font-size: 0.82rem; }

  .set-ref-stats    { grid-template-columns: 1fr; }
  .set-ref-stat     { padding: 14px; }
  .set-ref-val      { font-size: 1.1rem; }

  .set-ref-row      { flex-direction: column; align-items: stretch; gap: 8px; }
  .set-copy-btn     { width: 100%; justify-content: center; }

  .set-card         { padding: 16px; }
  .set-primary-btn  { width: 100%; }
}

/* ── Light mode surface fixes ── */
[data-theme="light"] .set-empty-state svg { stroke: var(--t4); }
[data-theme="light"] .set-nav-item:hover,
[data-theme="light"] .set-locked-tag,
[data-theme="light"] .set-danger-item,
[data-theme="light"] .set-ref-row { background: var(--glass-2); }
[data-theme="light"] .set-nav-icon,
[data-theme="light"] .set-field-icon,
[data-theme="light"] .set-btn-cancel,
[data-theme="light"] .set-action-btn,
[data-theme="light"] .set-input,
[data-theme="light"] .set-id-role,
[data-theme="light"] .set-inline-input,
[data-theme="light"] .set-ghost-btn { background: var(--glass); }
[data-theme="light"] .set-pw-bar,
[data-theme="light"] .set-toggle { background: var(--glass-hover); }
</style>
