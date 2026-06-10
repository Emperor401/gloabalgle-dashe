<!-- src/views/CustomersView.vue  →  Email Services -->
<template>
  <div class="email-page">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-header__title">Email Services</h1>
      <p class="page-header__sub">Send branded emails, bills and bulk campaigns.</p>
    </div>

    <!-- Service Cards -->
    <div class="service-grid">
      <div v-for="s in services" :key="s.title" class="service-card" @click="$router.push(s.route)">
        <div class="service-card__icon" :style="{ background: s.iconBg }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            :stroke="s.iconColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"
            v-html="s.icon"
          />
        </div>
        <h2 class="service-card__title">{{ s.title }}</h2>
        <p class="service-card__desc">{{ s.desc }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
const services = [
  {
    title: 'Branded Emails',
    desc:  'Send branded wallet & transaction emails.',
    route: '/email-services/branded-emails',
    iconBg:    'rgba(34, 197, 94, 0.12)',
    iconColor: '#22c55e',
    icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  },
  {
    title: 'Branded Bills',
    desc:  'Generate branded bills and invoices.',
    route: '/email-services/branded-bills',
    iconBg:    'rgba(34, 197, 94, 0.12)',
    iconColor: '#22c55e',
    icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  },
  {
    title: 'Email Composer',
    desc:  'Write and send single or bulk email.',
    route: '/email-services/composer',
    iconBg:    'rgba(34, 197, 94, 0.12)',
    iconColor: '#22c55e',
    icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  },
]
</script>

<style scoped>
.email-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Header */
.page-header { display: flex; flex-direction: column; gap: 5px; }
.page-header__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.025em;
  margin: 0;
}
.page-header__sub {
  font-size: 0.82rem;
  color: var(--t3);
  margin: 0;
}

/* Grid */
.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

/* Card */
.service-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
 
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  padding: 28px 26px 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  cursor: pointer;
  transition: border-color 0.22s ease, transform 0.18s ease;
}
.service-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
}

.service-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--t1);
  margin: 0;
}

.service-card__desc {
  font-size: 0.8rem;
  color: var(--accent);
  line-height: 1.55;
  margin: 0;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .service-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
}
@media (max-width: 768px) {
  .service-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .service-card { padding: 20px 18px; }
}
@media (max-width: 480px) {
  .service-grid { grid-template-columns: 1fr; }
}
</style>
