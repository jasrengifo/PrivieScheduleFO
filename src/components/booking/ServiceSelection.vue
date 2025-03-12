<template>
  <div class="service-selection-container">
    <h2 class="h4 mb-3 text-center elegant-title">Elige tus servicios</h2>
    
    <div v-if="loading" class="text-center py-4">
      <div class="spinner elegant-spinner" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando servicios...</p>
    </div>
    
    <div v-else>
      <div v-if="services.length === 0" class="alert alert-light border text-center">
        No hay servicios disponibles en este momento.
      </div>
      
      <div v-else>
        <div class="row row-cols-1 row-cols-md-2 g-3 mb-4">
          <div 
            v-for="service in services" 
            :key="service.id"
            class="col-md-12"
          >
            <div 
              class="card h-100 elegant-card"
              :class="{ 'border-selected': isSelected(service) }"
              @click="toggleService(service)"
            >
              <div class="service-image-container">
                <img 
                  v-if="service.photo" 
                  :src="service.photo" 
                  :alt="service.name"
                  class="service-image"
                  @error="handleImageError($event, service.name)"
                  loading="lazy"
                >
                <div v-else class="service-image-placeholder">
                  <i class="fas fa-spa fa-2x text-secondary"></i>
                </div>
                
                <div v-if="isSelected(service)" class="service-selected-badge">
                  <i class="fas fa-check"></i>
                </div>
              </div>
              
              <div class="card-body">
                <div class="d-flex flex-column h-100">
                  <div class="flex-grow-1">
                    <h3 class="elegant-service-name">{{ service.name }}</h3>
                    <p class="elegant-service-desc" v-if="service.description">
                      {{ service.description }}
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                      <span class="elegant-price">€{{ service.price }}</span>
                      <button 
                        class="btn elegant-select-btn"
                        :class="isSelected(service) ? 'btn-selected' : ''"
                        @click.stop="toggleService(service)"
                      >
                        <i v-if="isSelected(service)" class="fas fa-check"></i>
                        <i v-else class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Panel de resumen -->
        <BookingSummary :selectedServices="selectedServices" />
      </div>

      <NavigationButtons 
          @next="next" 
          @prev="prev" 
          :disabled="!canProceed" 
        />
    </div>
  </div>
</template>

<script>
import BookingSummary from './BookingSummary.vue';
import NavigationButtons from './NavigationButtons.vue';

export default {
  components: {
    BookingSummary,
    NavigationButtons
  },
  name: 'ServiceSelection',
  props: {
    services: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedServices: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select', 'next', 'prev'],
  computed: {
    canProceed() {
      return this.selectedServices.length > 0;
    },
    totalPrice() {
      return this.selectedServices.reduce((sum, service) => sum + service.price, 0);
    }
  },
  methods: {
    isSelected(service) {
      return this.selectedServices.some(s => s.id === service.id);
    },
    toggleService(service) {
      this.$emit('select', service);
    },
    next() {
      if (this.canProceed) {
        this.$emit('next');
      }
    },
    prev() {
      this.$emit('prev');
    },
    handleImageError(e, name) {
      // Si la imagen falla, usar un SVG elegante con el nombre del servicio
      const shortName = name.substring(0, 1).toUpperCase();
      
      // Colores elegantes para el placeholder
      const bgColor = '%23f9f4ff';  // Lavanda muy suave
      const textColor = '%238e24aa'; // Morado elegante
      
      e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="${bgColor}"/><text x="50%" y="50%" font-size="48" font-family="Arial" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${shortName}</text></svg>`;
    }
  }
};
</script>

<style scoped>
/* Contenedor principal con control de ancho */
.service-selection-container {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
}

/* Estilos elegantes para el componente */
.elegant-title {
  font-weight: 300;
  letter-spacing: 0.5px;
  color: #555;
}

.elegant-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  background-color: #ffffff;
}

.elegant-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.border-selected {
  border-color: #d6c6e1 !important;
  background-color: #fdfaff;
}

.service-image-container {
  position: relative;
  height: 160px;
  overflow: hidden;
  background-color: #f9f4ff;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.elegant-card:hover .service-image {
  transform: scale(1.05);
}

.service-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9c27b0;
}

.service-selected-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #9c27b0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.elegant-service-name {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.elegant-service-desc {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.elegant-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #9c27b0;
}

.elegant-select-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  color: #9e9e9e;
  background: white;
  transition: all 0.2s ease;
}

.elegant-select-btn:hover {
  background-color: #f5f5f5;
}

.elegant-select-btn.btn-selected {
  background-color: #9c27b0;
  border-color: #9c27b0;
  color: white;
}

.elegant-summary-card {
  border-radius: 12px;
  background-color: #f3e5f5;
  border: 1px solid #e8d8f3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.elegant-summary-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #7b1fa2;
}

.elegant-summary-list {
  margin-bottom: 1rem;
}

.elegant-summary-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #efe5f9;
}

.elegant-summary-name {
  font-size: 0.85rem;
  color: #555;
}

.elegant-summary-price {
  font-weight: 500;
  color: #555;
}

.elegant-summary-total {
  padding-top: 0.75rem;
  border-top: 1px solid #d6c6e1;
  font-weight: 500;
}

.elegant-total-price {
  font-size: 1.1rem;
  color: #9c27b0;
  font-weight: 600;
}

.elegant-next-btn, .elegant-back-btn {
  border-radius: 25px;
  font-size: 0.9rem;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.elegant-next-btn {
  background-color: #9c27b0;
  border-color: #9c27b0;
  color: white;
  box-shadow: 0 3px 5px rgba(156, 39, 176, 0.2);
}

.elegant-next-btn:hover:not(:disabled) {
  background-color: #7b1fa2;
  box-shadow: 0 4px 8px rgba(156, 39, 176, 0.3);
}

.elegant-next-btn:disabled {
  background-color: #e1bee7;
  border-color: #e1bee7;
}

.elegant-back-btn {
  background-color: transparent;
  border-color: #e0e0e0;
  color: #757575;
}

.elegant-back-btn:hover {
  background-color: #f5f5f5;
  color: #616161;
}

.elegant-spinner {
  width: 1.8rem;
  height: 1.8rem;
  border-width: 0.2rem;
  color: #9c27b0;
}

.card-body {
  padding: 0.75rem;
  background-color: #ffffff;
}

.summary-card-body {
  padding: 1rem;
}

/* Media queries para asegurar responsividad */
@media (max-width: 767.98px) {
  .card-body {
    padding: 0.5rem;
  }
}

/* Prevenir overflow horizontal en dispositivos pequeños */
@media (max-width: 575.98px) {
  .row {
    margin-right: 0;
    margin-left: 0;
  }
}
</style>