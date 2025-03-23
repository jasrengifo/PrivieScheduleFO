<template>
  <!-- ... existing navbar template ... -->
  <ul class="navbar-nav ms-auto">
    <li class="nav-item" v-for="(item, index) in navItems" :key="index">
      <a class="nav-link" :href="item.url" @click="trackNavClick(item.text)">{{ item.text }}</a>
    </li>
    <li class="nav-item">
      <a href="#contact" class="btn btn-primary btn-sm" @click="trackNavClick('CTA Button')">{{ ctaButton }}</a>
    </li>
  </ul>
  <!-- ... -->
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Navbar',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  // ... existing data and computed properties
  methods: {
    // ... existing methods
    
    trackNavClick(itemName) {
      this.$analytics.event('nav_click', {
        item_name: itemName,
        language: this.locale,
        page: window.location.pathname
      });
    }
  }
}
</script> 