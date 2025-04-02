<template>
  <div v-if="loading" class="loading-overlay">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    <div class="loading-text mt-4">{{ message || 'Carregando...' }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
}

.loading-text {
  color: white;
  font-size: 1.2rem;
}
</style>
