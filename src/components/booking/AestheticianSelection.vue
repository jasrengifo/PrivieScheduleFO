<template>
  <div>
    <h2 class="h4 mb-3 text-center elegant-title">Elige tu especialista</h2>
    
    <div v-if="loading" class="text-center py-4">
      <div class="spinner elegant-spinner" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando especialistas...</p>
    </div>
    
    <div v-else>
      <div v-if="aestheticians.length === 0" class="alert alert-light border">
        No hay especialistas disponibles en este momento.
      </div>
      
      <div v-else class="mb-3">
        <div 
          v-for="aesthetician in aestheticians" 
          :key="aesthetician.id"
          class="card mb-2 elegant-card"
          :class="{ 'border-selected': isSelected(aesthetician) }"
          @click="select(aesthetician)"
        >
          <div class="card-body p-2">
            <div class="d-flex align-items-center">
              <!-- Foto con manejo de errores de carga -->
              <div class="me-3">
                <div class="elegant-avatar" :class="{ 'avatar-selected': isSelected(aesthetician) }">
                  <img 
                    v-if="aesthetician.photo" 
                    :src="aesthetician.photo" 
                    :alt="aesthetician.name"
                    class="w-100 h-100 object-fit-cover"
                    @error="handleImageError($event, aesthetician.name)"
                    loading="lazy"
                  >
                  <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center">
                    <i class="fas fa-user-circle fa-2x text-secondary"></i>
                  </div>
                </div>
              </div>
              
              <!-- Información -->
              <div class="flex-grow-1">
                <h3 class="elegant-name mb-0">{{ aesthetician.name }}</h3>
                <p class="elegant-specialty mb-0">
                  <span v-if="aesthetician.specialties && aesthetician.specialties.length">
                    {{ aesthetician.specialties.join(' · ') }}
                  </span>
                  <span v-else>Servicios varios</span>
                </p>
              </div>
              
              <!-- Botón de selección minimalista -->
              <div>
                <button 
                  class="btn elegant-select-btn"
                  :class="isSelected(aesthetician) ? 'btn-selected' : ''"
                  @click.stop="select(aesthetician)"
                >
                  <i v-if="isSelected(aesthetician)" class="fas fa-check"></i>
                  <i v-else class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-end mt-4">
        <button 
          class="btn elegant-next-btn px-4" 
          :disabled="!canProceed"
          @click="next"
        >
          Siguiente
          <i class="fas fa-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AestheticianSelection',
  props: {
    aestheticians: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedAesthetician: {
      type: Object,
      default: null
    }
  },
  emits: ['select', 'next'],
  computed: {
    canProceed() {
      return this.selectedAesthetician !== null;
    }
  },
  methods: {
    isSelected(aesthetician) {
      return this.selectedAesthetician && this.selectedAesthetician.id === aesthetician.id;
    },
    select(aesthetician) {
      this.$emit('select', aesthetician);
    },
    next() {
      if (this.canProceed) {
        this.$emit('next');
      }
    },
    handleImageError(e, name) {
      // Si la imagen falla, usar un SVG más elegante con iniciales
      const initials = name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      
      // Colores elegantes para el avatar
      const bgColor = '%23f8f0ff';  // Lavanda muy suave
      const textColor = '%239c27b0'; // Morado elegante
      
      e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="${bgColor}"/><text x="50%" y="50%" font-size="22" font-family="Arial" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
    }
  }
};
</script>

<style scoped>
/* Estilos elegantes para el componente */
.elegant-title {
  font-weight: 300;
  letter-spacing: 0.5px;
  color: #555;
}

.elegant-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  cursor: pointer;
}

.elegant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.border-selected {
  border-color: #d6c6e1 !important;
  background-color: #faf6ff;
}

.elegant-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.avatar-selected {
  border: 2px solid #9c27b0;
}

.elegant-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
}

.elegant-specialty {
  font-size: 0.8rem;
  color: #888;
  font-weight: 300;
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

.elegant-next-btn {
  background-color: #9c27b0;
  border-color: #9c27b0;
  color: white;
  border-radius: 25px;
  font-size: 0.9rem;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 0 3px 5px rgba(156, 39, 176, 0.2);
  transition: all 0.3s ease;
}

.elegant-next-btn:hover:not(:disabled) {
  background-color: #7b1fa2;
  box-shadow: 0 4px 8px rgba(156, 39, 176, 0.3);
}

.elegant-next-btn:disabled {
  background-color: #e1bee7;
  border-color: #e1bee7;
}

.elegant-spinner {
  width: 1.8rem;
  height: 1.8rem;
  border-width: 0.2rem;
  color: #9c27b0;
}

.object-fit-cover {
  object-fit: cover;
}

.card {
  padding: 1em;
}
</style>