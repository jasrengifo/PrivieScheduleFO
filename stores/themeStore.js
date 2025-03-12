// stores/themeStore.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'default',
    businessConfig: {},
    themeConfig: {}
  }),
  actions: {
    async loadBusinessTheme(businessSlug) {
      // Aquí cargarías la configuración desde tu API
      // Por ahora usamos datos de ejemplo
      const themes = {
        'elegante': {
          primaryColor: '#9c27b0',
          secondaryColor: '#f48fb1',
          fontFamily: 'Roboto, sans-serif'
        },
        'moderno': {
          primaryColor: '#2196f3',
          secondaryColor: '#bbdefb',
          fontFamily: 'Montserrat, sans-serif'
        }
      }
      
      this.currentTheme = 'elegante' // O el que corresponda al negocio
      this.themeConfig = themes[this.currentTheme]
    }
  }
})