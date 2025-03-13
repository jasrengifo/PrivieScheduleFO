<template>
  <div v-if="scheduledSlots.length > 0" class="selected-times-list mt-3">
    <h6 class="mb-2">Horarios seleccionados:</h6>
    <div class="selected-time-items">
      <div 
        v-for="(slot, index) in scheduledSlots" 
        :key="index"
        class="selected-time-info mb-2 d-flex align-items-center"
      >
        <div class="flex-grow-1">
          <div class="d-flex align-items-center">
            <i class="fas fa-calendar-check me-2"></i>
            <div>
              <div class="fw-semibold">{{ formatDate(slot.date) }}</div>
              <div>{{ getServiceName(slot.serviceId) }} · {{ formatTime(slot.time) }} - {{ formatTime(slot.endTime) }}</div>
            </div>
          </div>
        </div>
        <button 
          class="btn btn-sm btn-icon btn-remove" 
          @click="removeSlot(index)"
          title="Eliminar esta cita"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduledTimesList',
  props: {
    scheduledSlots: {
      type: Array,
      required: true
    },
    selectedServices: {
      type: Array,
      required: true
    }
  },
  emits: ['remove-slot'],
  methods: {
    formatDate(date) {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    },
    formatTime(time) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    },
    getServiceName(serviceId) {
      const service = this.selectedServices.find(s => s.id === serviceId);
      return service ? service.name : 'Servicio';
    },
    removeSlot(index) {
      this.$emit('remove-slot', index);
    }
  }
};
</script>