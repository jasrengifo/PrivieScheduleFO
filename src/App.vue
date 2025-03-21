<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  mounted() {
    // Establecer el ancho del #app al 100%
    document.getElementById('app').style.width = '100%';
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