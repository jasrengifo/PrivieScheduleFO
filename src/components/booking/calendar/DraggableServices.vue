<template>
  <div class="mb-3">
    <p class="small fw-semibold mb-2">Tus servicios (arrastrar al calendario):</p>
    <div class="services-drag-container">
      <div 
        v-for="service in selectedServices" 
        :key="service.id"
        class="service-drag-item"
        :class="{ 
          'service-dropped': isServiceAssigned(service.id), 
          'service-selected': touchSelectedService && touchSelectedService.id === service.id 
        }"
        :style="{ height: `${Math.max(40, calculateTotalServiceDuration(service) / 2)}px` }"
        draggable="true"
        @dragstart="onDragStart($event, service)"
        @dragend="onDragEnd"
        @click="handleServiceClick(service)"
      >
        <div class="service-content">
          <div class="service-name">{{ service.name }}</div>
          <div class="service-duration">
            {{ calculateTotalServiceDuration(service) }} min
            <span v-if="service.selectedExtras && service.selectedExtras.length" class="service-extras-info">
              ({{ service.duration }} + {{ calculateTotalServiceDuration(service) - service.duration }} extras)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modo táctil: instrucciones -->
  <div v-if="isMobileView && touchSelectedService" class="mobile-drag-instructions mb-2 p-2">
    <div class="d-flex align-items-center">
      <span class="me-2">✓</span>
      <strong>{{ touchSelectedService.name }}</strong>
      <span class="ms-2">seleccionado. Ahora toca donde quieres agendar.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DraggableServices',
  props: {
    selectedServices: {
      type: Array,
      required: true
    },
    scheduledSlots: {
      type: Array,
      required: true
    },
    isMobileView: {
      type: Boolean,
      default: false
    },
    touchSelectedService: {
      type: Object,
      default: null
    }
  },
  emits: ['service-drag-start', 'service-drag-end', 'service-click'],
  methods: {
    calculateTotalServiceDuration(service) {
      let totalDuration = service.duration || 0;
      
      // Sumar las duraciones de los extras seleccionados
      if (service.selectedExtras && Array.isArray(service.selectedExtras)) {
        totalDuration += service.selectedExtras.reduce((sum, extra) => {
          return sum + (extra.duration || 0);
        }, 0);
      }
      
      return totalDuration;
    },
    isServiceAssigned(serviceId) {
      return this.scheduledSlots.some(slot => slot.serviceId === serviceId);
    },
    onDragStart(event, service) {
      // Calcular duración total con extras
      const totalDuration = this.calculateTotalServiceDuration(service);
      
      // Almacenar datos del servicio
      event.dataTransfer.setData("text/plain", JSON.stringify({
        id: service.id,
        name: service.name,
        duration: totalDuration
      }));
      
      // Efecto visual
      event.target.classList.add('dragging');
      
      // Emitir evento al componente padre
      this.$emit('service-drag-start', service);
    },
    onDragEnd() {
      // Limpiar efectos visuales
      document.querySelectorAll('.service-drag-item').forEach(item => {
        item.classList.remove('dragging');
      });
      
      // Emitir evento al componente padre
      this.$emit('service-drag-end');
    },
    handleServiceClick(service) {
      if (this.isMobileView) {
        // Emitir evento al componente padre
        this.$emit('service-click', service);
      }
    }
  }
};
</script>