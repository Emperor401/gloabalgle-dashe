<!-- src/views/ComingSoonView.vue -->
<template>
  <div class="coming-soon">
    <div class="cs-card">
      <div class="cs-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <h1 class="cs-title">Coming Soon</h1>
      <p class="cs-sub">This section is under construction and will be available shortly.</p>
      <router-link to="/" class="cs-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.cs-card {
  background: var(--glass);
  backdrop-filter: var(--glass-filter);
  -webkit-backdrop-filter: var(--glass-filter);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
  padding: 48px 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  max-width: 420px;
}

.cs-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.cs-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.03em;
  margin: 0;
}

.cs-sub {
  font-size: 0.875rem;
  color: var(--t3);
  line-height: 1.6;
  margin: 0;
}

.cs-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 22px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  border-radius: 10px;
  color: var(--accent);
  font-family: 'Satoshi', sans-serif;
  font-size: 0.825rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.22s ease;
}

.cs-btn:hover {
  background: rgba(34, 197, 94, 0.22);
  border-color: var(--accent);
  color: var(--t1);
}
</style>
