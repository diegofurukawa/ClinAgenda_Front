import { defineStore } from 'pinia'

interface Toast {
  show: boolean
  text: string
  type: 'success' | 'error' | 'info' | 'warning'
  timeout: number
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages: [] as Toast[] // Array to store multiple toasts
  }),

  actions: {
    setToast({ type, text }: { type: 'success' | 'error' | 'info' | 'warning'; text: string }) {
      this.messages.push({
        show: true,
        text,
        type,
        timeout: 3000 // Default timeout, can be made configurable if needed
      })
    },

    hideToast(index: number) {
      if (this.messages[index]) {
        this.messages[index].show = false
        // Optionally remove the toast from the array after hiding to clean up
        setTimeout(() => {
          this.messages.splice(index, 1)
        }, 300) // Small delay to allow the hide animation to play
      }
    },

    // Optional: If you still want a showToast method for flexibility
    showToast(
      message: string,
      type: 'success' | 'error' | 'info' | 'warning' = 'info'
      // ,timeout = 3000
    ) {
      this.setToast({ type, text: message })
    }
  }
})

export default useToastStore

