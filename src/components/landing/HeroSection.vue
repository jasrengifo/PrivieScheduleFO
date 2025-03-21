<template>
  <section class="hero-section py-5">
    <div class="container">
      <div class="row align-items-center min-vh-75">
        <div class="col-lg-6 mb-5 mb-lg-0 text-center text-lg-start">
          <h1 class="display-4 fw-bold mb-3">Tu Negocio de Belleza, Simplificado</h1>
          <p class="lead mb-4">Sistema inteligente de agendamiento que automatiza tus citas y optimiza la experiencia de tus clientes.</p>
          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
            <button class="btn btn-primary btn-lg">Comenzar Ahora</button>
            <button class="btn btn-outline-light btn-lg">Ver Demo</button>
          </div>
        </div>
        <div class="col-lg-6">
          <!-- Añadida animación de entrada y rebote infinito al logo -->
          <img src="/img/logo.svg" 
               alt="Salón de belleza moderno" 
               class="img-fluid rounded-3 logo-animation"
               ref="logoElement">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  mounted() {
    // Cuando el componente se monte, aplicamos la animación de entrada
    const logo = this.$refs.logoElement;
    
    // Primero aplicamos la animación de entrada
    logo.classList.add('animate-entrance');
    
    // Después de que termine la animación de entrada, aplicamos el bounce infinito
    setTimeout(() => {
      logo.classList.remove('animate-entrance');
      logo.classList.add('animate-bounce');
    }, 1500); // 1.5 segundos para la animación de entrada
  }
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #351d3c 0%, #7e09c5 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.min-vh-75 {
  min-height: 75vh;
}

/* Animación de entrada para el logo */
.animate-entrance {
  animation: entrance 1.5s ease-out;
}

@keyframes entrance {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(6deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* Animación de rebote infinito para el logo */
.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 991.98px) {
  .min-vh-75 {
    min-height: auto;
  }
}
</style>