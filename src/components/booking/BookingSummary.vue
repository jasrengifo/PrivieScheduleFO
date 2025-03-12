<template>
  <div class="card bg-light mb-4">
    <div class="card-body custom-card-body">
      <h4 class="h5 mb-3">Resumen:</h4>
      
      <div v-if="selectedServices.length === 0" class="text-center text-muted py-2">
        No hay servicios seleccionados
      </div>
      
      <template v-else>
        <div v-for="service in selectedServices" :key="service.id" class="mb-3">
          <div class="fw-semibold text-break">{{ service.name }}</div>
          <div class="ms-3 small">
            <div class="d-flex justify-content-between">
              <span class="summary-item-name">Servicio base</span>
              <span>€{{ service.price }}</span>
            </div>
            
            <div 
              v-for="extra in service.selectedExtras" 
              :key="extra.id"
              class="d-flex justify-content-between"
            >
              <span class="summary-item-name">{{ extra.name }}</span>
              <span>€{{ extra.price }}</span>
            </div>
          </div>
        </div>
        
        <hr>
        <div class="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span class="text-primary">€{{ totalPrice }}</span>
        </div>
        
        <div class="d-flex justify-content-between small mt-1">
          <span>Duración total:</span>
          <span>{{ totalDuration }} min</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingSummary',
  props: {
    selectedServices: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    totalPrice() {
      let total = 0;
      
      for (const service of this.selectedServices) {
        // Sumar precio base del servicio
        total += service.price;
        
        // Sumar precio de extras seleccionados
        if (service.selectedExtras) {
          for (const extra of service.selectedExtras) {
            total += extra.price;
          }
        }
      }
      
      return total;
    },
    totalDuration() {
      let total = 0;
      
      for (const service of this.selectedServices) {
        // Sumar duración base del servicio
        total += service.duration;
        
        // Sumar duración de extras seleccionados
        if (service.selectedExtras) {
          for (const extra of service.selectedExtras) {
            total += extra.duration;
          }
        }
      }
      
      return total;
    }
  }
};
</script>

<style scoped>
.custom-card-body {
  padding: 1rem;
  overflow-x: hidden;
}

.summary-item-name {
  max-width: 70%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .summary-item-name {
    max-width: 60%;
  }
}
</style>