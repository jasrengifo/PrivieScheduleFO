<template>
    <div class="text-center py-4">
      <div v-if="bookingResult">
        <!-- Resultado exitoso -->
        <div v-if="bookingResult.success" class="mb-4">
          <div class="bg-success text-white icon-circle mb-4">
            <i class="fas fa-check fa-3x"></i>
          </div>
          
          <h2 class="h3 mb-3">¡Reserva confirmada!</h2>
          <p class="mb-4">Tu cita ha sido agendada correctamente.</p>
          
          <div class="card mb-4">
            <div class="card-body">
              <p class="mb-1">
                <span class="fw-semibold">Código de reserva:</span> 
                <span class="text-primary">{{ bookingResult.bookingId }}</span>
              </p>
              <p class="text-muted mb-0 small">
                Guarda este código por si necesitas hacer cambios en tu reserva.
              </p>
            </div>
          </div>
          
          <p class="mb-4">
            Te hemos enviado un correo electrónico con todos los detalles de tu cita.
          </p>
          
          <div class="d-grid gap-2 col-md-8 mx-auto">
            <button class="btn btn-outline-primary" @click="returnToHome">
              <i class="fas fa-home me-2"></i>
              Volver al inicio
            </button>
            
            <button class="btn btn-outline-secondary" @click="makeAnotherBooking">
              <i class="fas fa-calendar-plus me-2"></i>
              Hacer otra reserva
            </button>
          </div>
        </div>
        
        <!-- Resultado con error -->
        <div v-else class="mb-4">
          <div class="bg-danger text-white icon-circle mb-4">
            <i class="fas fa-exclamation-triangle fa-3x"></i>
          </div>
          
          <h2 class="h3 mb-3">Ha ocurrido un error</h2>
          <p class="mb-4">{{ bookingResult.message || 'No se ha podido completar la reserva. Por favor, inténtalo de nuevo.' }}</p>
          
          <div class="d-grid gap-2 col-md-8 mx-auto">
            <button class="btn btn-primary" @click="tryAgain">
              <i class="fas fa-redo me-2"></i>
              Intentar de nuevo
            </button>
            
            <button class="btn btn-outline-secondary" @click="contactSupport">
              <i class="fas fa-headset me-2"></i>
              Contactar soporte
            </button>
          </div>
        </div>
      </div>
      
      <!-- Caso de carga o sin resultado -->
      <div v-else class="py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Procesando tu reserva...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BookingConfirmation',
    props: {
      bookingResult: {
        type: Object,
        default: null
      }
    },
    methods: {
      returnToHome() {
        // Navegar a la página de inicio (en una implementación real usaríamos Vue Router)
        window.location.href = '/';
      },
      makeAnotherBooking() {
        // Refrescar la página (en una implementación real resetearíamos el estado)
        window.location.reload();
      },
      tryAgain() {
        // Volver al paso anterior (en una implementación real usaríamos eventos)
        window.history.back();
      },
      contactSupport() {
        // Abrir ventana de soporte (simplificado para la demo)
        alert('Esta función abrirá un chat de soporte o formulario de contacto en la implementación final');
      }
    }
  };
  </script>
  
  <style scoped>
  .icon-circle {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
  </style>