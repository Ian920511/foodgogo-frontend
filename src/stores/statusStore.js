import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', () => {

  const isLoading = ref(true)
  const isProcessing = ref(false)
  

  return {
    isLoading,
    isProcessing,
  }
})