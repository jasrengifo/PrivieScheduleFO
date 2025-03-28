import { createI18n } from 'vue-i18n'

// Importa los archivos de mensajes para cada idioma
import es from './locales/es.json'
import en from './locales/en.json'
import pt from './locales/pt.json'

// Detectar el idioma preferido del navegador
function detectBrowserLanguage() {
  // Primero intentamos obtener el idioma guardado por el usuario
  const savedLocale = localStorage.getItem('userLocale')
  if (savedLocale) return savedLocale
  
  // Si no hay guardado, usamos el del navegador
  const browserLang = navigator.language.split('-')[0] // 'es-ES' -> 'es'
  return ['es', 'en', 'pt'].includes(browserLang) ? browserLang : 'es'
}

// Crea la instancia de i18n
const i18n = createI18n({
  legacy: false, // Usar el nuevo modo de composición de Vue 3
  locale: detectBrowserLanguage(), // Usar el idioma detectado
  fallbackLocale: 'es', // Español como idioma de respaldo
  messages: {
    es,
    en,
    pt
  },
  missingWarn: false, // Desactivar advertencias de claves faltantes
  fallbackWarn: false // Desactivar advertencias de fallback
})

export default i18n 