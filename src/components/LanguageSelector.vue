<template>
  <div class="language-selector">
    <button 
      v-for="locale in availableLocales" 
      :key="locale"
      @click="changeLocale(locale)"
      :class="{ 'active': currentLocale === locale }"
      class="language-btn">
      {{ getLanguageLabel(locale) }}
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'LanguageSelector',
  setup() {
    const { locale, availableLocales } = useI18n()
    
    const languageLabels = {
      'pt': 'PT',
      'es': 'ES',
      'en': 'EN'
    }
    
    const getLanguageLabel = (locale) => {
      return languageLabels[locale] || locale.toUpperCase()
    }
    
    const changeLocale = (newLocale) => {
      locale.value = newLocale
      localStorage.setItem('userLocale', newLocale) // Guardar preferencia del usuario
    }
    
    return {
      currentLocale: locale,
      availableLocales,
      getLanguageLabel,
      changeLocale
    }
  }
}
</script>

<style scoped>
.language-selector {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.language-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.language-btn.active {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.6);
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 991.98px) {
  .language-selector {
    top: 10px;
    right: 10px;
  }
}
</style> 