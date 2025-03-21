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
  return ['pt', 'es', 'en'].includes(browserLang) ? browserLang : 'pt'
}

// Crea la instancia de i18n
const i18n = createI18n({
  legacy: false, // Esto es importante para Vue 3
  locale: 'pt', // Portugués como idioma inicial
  fallbackLocale: 'pt', // Portugués como idioma de respaldo
  messages: {
    pt,
    es,
    en
  }
})

export default i18n 