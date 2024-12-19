// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    snackbar: false,
    snackbarColor: '',
    snackbarText: '',
    snackbarTimeout: 3000,
    //
  }),
  actions: {
    showSnackbar(color: string, text: string, timeout?: number) {
      this.snackbarColor = color
      this.snackbarText = text
      this.snackbar = true
      if (timeout) {
        this.snackbarTimeout = timeout
      }
    },
    hideSnackbar() {
      this.snackbar = false
    },
    //
  },
})
