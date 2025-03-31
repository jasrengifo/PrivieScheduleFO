<template>
  <header class="site-header" :class="{ 'fixed': isLandingPage }">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-auto">
          <a href="/" class="logo"><img src="/img/logo.svg" 
               alt="Salón de belleza moderno" 
               class="img-fluid top-logo"
               ref="logoElement"></a>
        </div>
        <div class="col text-end">
          <LanguageSelector />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import LanguageSelector from '../LanguageSelector.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'SiteHeader',
  components: {
    LanguageSelector
  },
  setup() {
    const route = useRoute()
    const isLandingPage = computed(() => route.path === '/')
    return { isLandingPage }
  }
}
</script>

<style scoped>
.top-logo {
  width: 200px;
  margin-left: 10px;
}

.site-header {
  width: 100%;
  z-index: 1000;
  padding: 6px 0;
  background: linear-gradient(135deg, #7e22ce 0%, #581c87 100%);
  backdrop-filter: blur(3px);
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0px 0px 13px #2b0b4f;
}

.site-header.fixed {
  position: fixed;
  top: 0;
  left: 0;
  background: rgb(10 89 122 / 14%);
  box-shadow: none;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}
</style> 