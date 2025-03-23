<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue'
import scrollTracking from '@/mixins/scrollTracking';

export default {
  name: 'App',
  components: {
    Header
  },
  mixins: [scrollTracking],
  mounted() {
    // Establecer el ancho del #app al 100%
    document.getElementById('app').style.width = '100%';
    
    // Registrar el inicio de sesión de la página
    this.$analytics.event('page_load', {
      page_title: document.title,
      url: window.location.href,
      language: this.$i18n.locale,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight
    });
    
    // Registrar tiempo de permanencia en la página cuando el usuario se va
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((new Date() - this.$options.pageLoadTime) / 1000);
      this.$analytics.event('page_exit', {
        time_on_page_seconds: timeOnPage,
        language: this.$i18n.locale
      });
    });
  },
  created() {
    // Almacenar el tiempo de carga para calcular la duración de la visita
    this.$options.pageLoadTime = new Date();
  }
}
</script>

<style>
#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>