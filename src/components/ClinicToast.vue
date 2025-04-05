<template>
  <div class="toast-container">
    <v-snackbar
      v-for="(toast, index) in toastStore.messages"
      :key="index"
      v-model="toastStore.messages[index].show"
      :color="toast.type"
      :timeout="toast.timeout"
      location="top right"
      :class="`mt-${index * 2 + 2}`"
    >
      {{ toast.text }}
      <template #actions>
        <v-btn icon variant="text" @click="toastStore.hideToast(index)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import useToastStore from '@/stores/toast'

// Access the toast store
const toastStore = useToastStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 1000;
}
</style>
