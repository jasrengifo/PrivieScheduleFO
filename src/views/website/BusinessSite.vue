<template>
    <div class="container py-5">
      <div class="card">
        <div class="card-body text-center">
          <h1 class="h3 mb-4">Sitio Web del Negocio</h1>
          <p class="text-muted mb-4">Sitio personalizado para: {{ businessSlug }}</p>
          <p class="text-muted mb-4">Esta sección está en desarrollo.</p>
          <router-link to="/booking" class="btn btn-primary">
            Agendar Cita
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BusinessSite',
    props: {
      businessSlug: {
        type: String,
        default: ''
      }
    }
  }
  </script>