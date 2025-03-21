<template>
  <header class="site-header">
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

export default {
  name: 'SiteHeader',
  components: {
    LanguageSelector
  }
}
</script>

<style scoped>
.top-logo {
  width: 200px;
  margin-left: 10px;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 6px 0;
  background: rgb(10 89 122 / 14%);
  backdrop-filter: blur(3px);
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}
</style> 