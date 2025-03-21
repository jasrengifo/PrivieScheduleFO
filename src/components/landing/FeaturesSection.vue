<template>
  <section class="features-section py-5">
    <div class="container">
      <div class="row text-center mb-5">
        <div class="col-lg-8 mx-auto">
          <h2 class="fw-bold mb-3">Funcionalidades Destacadas</h2>
          <p class="lead text-muted">Todo lo que necesitas para gestionar tu negocio de estética</p>
        </div>
      </div>
      
      <div class="row align-items-center mb-5">
        <div class="col-md-6 order-md-2">
          <img src="https://picsum.photos/600/400?random=3" 
               alt="Calendario inteligente" 
               class="img-fluid rounded-3 shadow">
        </div>
        <div class="col-md-6 order-md-1 mt-4 mt-md-0">
          <h3>Agendamiento Inteligente</h3>
          <p>Nuestro sistema aprende los patrones de tu negocio para optimizar automáticamente tu calendario, asegurando la distribución ideal de citas y maximizando los ingresos.</p>
          <ul class="list-unstyled">
            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Evita huecos improductivos</li>
            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Prioriza servicios más rentables</li>
            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Reducción de tiempo muerto entre citas</li>
          </ul>
        </div>
      </div>
      
      <div class="row align-items-center mb-5">
        <div class="col-md-6">
          <img src="https://picsum.photos/600/400?random=4" 
               alt="Chat de WhatsApp" 
               class="img-fluid rounded-3 shadow">
        </div>
        <div class="col-md-6 mt-4 mt-md-0">
          <h3>Asistente de WhatsApp con IA</h3>
          <p>Automatiza la comunicación con tus clientes a través de un asistente inteligente que entiende lenguaje natural y gestiona todo el proceso de reservas.</p>
          <ul class="list-unstyled">
            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Respuestas instantáneas 24/7</li>
            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Permite agendar, modificar o cancelar citas</li>
            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Envío automático de recordatorios</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturesSection'
};
</script>

<style scoped>
.features-section {
  background-color: var(--bg-white);
  position: relative;
  overflow: hidden;
}

.feature-card {
  background-color: var(--bg-white);
  transition: var(--transition-normal);
  border: 1px solid var(--border-light);
  border-top: 3px solid var(--primary);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  width: 60px;
  height: 60px;
  background-color: var(--primary-transparent);
  border-radius: 50%;
  z-index: -1;
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: var(--border-radius-full);
  background-color: var(--primary-transparent);
  margin: 0 auto;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(156, 39, 176, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(156, 39, 176, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(156, 39, 176, 0);
  }
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  margin: 1.5rem auto;
  border-radius: var(--border-radius-full);
}
</style>