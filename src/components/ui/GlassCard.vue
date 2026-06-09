<!-- src/components/ui/GlassCard.vue -->
<template>
  <div :class="['glass-card', `glass-card--${variant}`, { 'glass-card--hover': hover }]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'blue', 'green', 'red', 'darkblue'].includes(v),
  },
  hover: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
.glass-card {
  background: var(--glass);
  backdrop-filter: var(--glass-filter);
  -webkit-backdrop-filter: var(--glass-filter);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.glass-card--hover:hover {
  background: var(--glass-hover);
  border-color: var(--border);
  transform: translateY(-2px);
}

.glass-card--blue {
  background: var(--accent-dim);
  border-color: var(--accent-border);
}
.glass-card--blue.glass-card--hover:hover {
  background: var(--accent-dim);
  border-color: var(--accent-border);
}

.glass-card--green {
  background: var(--green-dim);
  border-color: var(--green-border);
}
.glass-card--green.glass-card--hover:hover {
  background: var(--green-dim);
  border-color: var(--green-border);
}

.glass-card--red {
  background: var(--red-dim);
  border-color: var(--red-border);
}
.glass-card--red.glass-card--hover:hover {
  background: var(--red-dim);
  border-color: var(--red-border);
}

.glass-card--darkblue {
  background: var(--purple-dim);
  border-color: var(--purple-border);
}
.glass-card--darkblue.glass-card--hover:hover {
  background: var(--purple-dim);
  border-color: var(--purple-border);
}
</style>
