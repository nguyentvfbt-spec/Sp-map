import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light' as 'light' | 'dark'
  }),
  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
    }
  }
})

