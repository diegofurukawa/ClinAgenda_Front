<template>
  <div class="toast-container">
    <v-snackbar
      v-for="(toast, index) in toastStore.messages"
      :key="index"
      v-model="visibleToasts[index]"
      :color="toast.type"
      timeout="3000"
      location="top right"
      :class="`mt-${index * 2 + 2}`"
    >
      {{ toast.text }}
      <template #actions>
        <v-btn icon variant="text" @click="visibleToasts[index] = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import { watch, ref } from 'vue'

const toastStore = useToastStore()

// Track visibility of each toast
const visibleToasts = ref<Record<number, boolean>>({})

// Initialize visibility of toasts
watch(
  () => toastStore.messages,
  (messages) => {
    messages.forEach((_, index) => {
      visibleToasts.value[index] = true
    })
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 1000;
}
</style>

