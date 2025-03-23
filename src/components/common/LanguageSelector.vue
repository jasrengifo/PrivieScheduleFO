<template>
  <div class="language-selector">
    <button 
      v-for="lang in availableLocales" 
      :key="lang" 
      class="lang-button" 
      :class="{ active: locale === lang }" 
      @click="changeLocale(lang)"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'LanguageSelector',
  setup() {
    const { locale, availableLocales } = useI18n();
    
    return {
      locale,
      availableLocales
    };
  },
  methods: {
    changeLocale(newLocale) {
      const oldLocale = this.locale;
      this.locale = newLocale;
      localStorage.setItem('user-locale', newLocale);
      
      // Registrar el cambio de idioma en Analytics
      this.$analytics.event('language_change', {
        from_language: oldLocale,
        to_language: newLocale,
        page: window.location.pathname
      });
    }
  }
}
</script> 