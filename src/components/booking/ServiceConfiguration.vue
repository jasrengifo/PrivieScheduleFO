<template>
    <div class="service-config-container">
      <h2 class="h4 mb-4 text-center">Configuración de servicios</h2>
      
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Procesando...</p>
      </div>
      
      <div v-else>
        <div v-if="selectedServices.length === 0" class="alert alert-warning">
          No has seleccionado ningún servicio. Por favor, vuelve atrás y selecciona al menos uno.
        </div>
        
        <div v-else>
          <!-- Servicios seleccionados -->
          <div v-for="(service, index) in selectedServices" :key="service.id" class="mb-4">
            <div class="card">
              <div class="card-header bg-white py-3">
                <div class="d-flex align-items-center">
                  <!-- Imagen miniatura -->
                  <div class="me-3">
                    <div class="rounded overflow-hidden" style="width: 50px; height: 50px;">
                      <img 
                        v-if="service.photo" 
                        :src="service.photo" 
                        :alt="service.name"
                        class="w-100 h-100 object-fit-cover"
                        @error="handleImageError($event, service.name)"
                      >
                      <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center beauty-placeholder">
                        <span class="initial-letter">{{ getInitials(service.name) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Información del servicio -->
                  <div class="service-info">
                    <h3 class="h5 mb-1">{{ service.name }}</h3>
                    <div class="d-flex small text-muted">
                      <span class="me-3">
                        <i class="far fa-clock me-1"></i>
                        {{ service.duration }} min
                      </span>
                      <span>
                        <i class="fas fa-euro-sign me-1"></i>
                        {{ service.price }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card-body custom-card-body">
                <!-- Extras disponibles -->
                <div v-if="service.extras && service.extras.length > 0">
                  <h4 class="h6 mb-3">Extras disponibles:</h4>
                  <div class="list-group mb-3">
                    <div 
                      v-for="extra in service.extras" 
                      :key="extra.id"
                      class="list-group-item list-group-item-action d-flex align-items-center p-3 flex-wrap"
                      :class="{ 'active': isExtraSelected(service, extra) }"
                      @click="toggleExtra(service, extra)"
                    >
                      <!-- Imagen miniatura del extra -->
                      <!-- <div class="me-3">
                        <div class="rounded overflow-hidden" style="width: 40px; height: 40px;">
                          <img 
                            v-if="extra.photo" 
                            :src="extra.photo" 
                            :alt="extra.name"
                            class="w-100 h-100 object-fit-cover"
                            @error="handleImageError($event, extra.name)"
                          >
                          <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center beauty-placeholder extra-placeholder">
                            <span class="initial-letter small">{{ getInitials(extra.name) }}</span>
                          </div>
                        </div>
                      </div> -->
                      
                      <!-- Información del extra -->
                      <div class="flex-grow-1 extra-info">
                        <h5 class="mb-0 h6 text-break">{{ extra.name }}</h5>
                        <p class="mb-0 small text-break" v-if="extra.description">{{ extra.description }}</p>
                      </div>
                      
                      <!-- Precio y duración -->
                      <div class="text-end me-3 w-100 extra-price">
                        <div class="d-flex w-100 justify-content-around text-muted">
                          <small class=""><i class="far fa-clock me-1"></i> {{ extra.duration }} min</small>
                          <span class=""><i class="fas fa-euro-sign me-1"></i>{{ extra.price }}</span>
                        </div>
                      </div>
                      
                      <!-- Checkbox -->
                      <div class="d-none">
                        <div class="form-check">
                          <input 
                            type="checkbox" 
                            class="form-check-input" 
                            :checked="isExtraSelected(service, extra)"
                            @click.stop="toggleExtra(service, extra)"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-muted text-center py-2 small">
                  No hay extras disponibles para este servicio
                </div>
              </div>
            </div>
          </div>
          
          <!-- Resumen total -->
          <BookingSummary :selectedServices="selectedServices" />
        </div>


        <NavigationButtons @next="next" @prev="prev" />
        
        
      </div>
    </div>
  </template>
  
  <script>
  import BookingSummary from './BookingSummary.vue';
  import NavigationButtons from './NavigationButtons.vue';
  
  export default {
    name: 'ServiceConfiguration',
    components: {
      BookingSummary,
      NavigationButtons
    },
    props: {
      selectedServices: {
        type: Array,
        required: true
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update-service', 'next', 'prev'],
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
    },
    methods: {
      isExtraSelected(service, extra) {
        return service.selectedExtras && service.selectedExtras.some(e => e.id === extra.id);
      },
      toggleExtra(service, extra) {
        // Crear una copia profunda de selectedExtras (o array vacío si no existe)
        const selectedExtras = service.selectedExtras ? [...service.selectedExtras] : [];
        
        // Buscar si el extra ya está seleccionado
        const index = selectedExtras.findIndex(e => e.id === extra.id);
        
        if (index === -1) {
          // Añadir el extra
          selectedExtras.push(extra);
        } else {
          // Quitar el extra
          selectedExtras.splice(index, 1);
        }
        
        // Actualizar el servicio
        this.$emit('update-service', service.id, { selectedExtras });
      },
      next() {
        this.$emit('next');
      },
      prev() {
        this.$emit('prev');
      },
      getInitials(name) {
        if (!name) return '';
        
        // Obtener las primeras letras de cada palabra (máximo 2)
        const words = name.split(' ');
        if (words.length === 1) {
          return name.substring(0, 2).toUpperCase();
        }
        
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
      },
      handleImageError(event, name) {
        const initials = this.getInitials(name);
        const colors = [
          { bg: '#f3e5f5', text: '#9c27b0' }, // Morado claro/oscuro
          { bg: '#e8f5e9', text: '#4caf50' }, // Verde claro/oscuro
          { bg: '#e1f5fe', text: '#03a9f4' }, // Azul claro/oscuro
          { bg: '#fff3e0', text: '#ff9800' }, // Naranja claro/oscuro
          { bg: '#fce4ec', text: '#e91e63' }  // Rosa claro/oscuro
        ];
        
        // Seleccionar un color basado en el nombre para mantener consistencia
        const colorIndex = name.charCodeAt(0) % colors.length;
        const { bg, text } = colors[colorIndex];
        
        // Codificar colores para SVG
        const bgHex = bg.replace('#', '%23');
        const textHex = text.replace('#', '%23');
        
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
            <rect width="300" height="300" fill="${bgHex}" />
            <text x="150" y="150" font-size="100" font-family="Arial, sans-serif" fill="${textHex}" 
                  text-anchor="middle" dominant-baseline="middle" font-weight="bold">${initials}</text>
          </svg>
        `;
        
        event.target.src = `data:image/svg+xml;utf8,${svg.trim()}`;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Contenedor principal con control de ancho */
  .service-config-container {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 12px;
  }

  .card {
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    overflow: hidden;
    background-color: #ffffff;
    padding: 0;
    margin-bottom: 1rem;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
  
  .object-fit-cover {
    object-fit: cover;
  }
  
  .list-group-item {
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin-bottom: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    background-color: #ffffff;
  }
  
  .list-group-item:hover {
    background-color: #fcf9ff;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(156, 39, 176, 0.15);
  }
  
  .list-group-item.active {
    background-color: #f3e5f5;
    border-color: #d6c6e1;
    color: #9c27b0;
  }
  
  .custom-card-body {
    padding: 1rem;
    overflow-x: hidden;
    background-color: #ffffff;
  }
  
  .text-break {
    word-wrap: break-word;
    word-break: break-word;
  }
  
  .service-info {
    max-width: calc(100% - 70px);
  }
  
  .extra-info {
    min-width: 0;
    max-width: calc(100% - 150px);
  }
  
  .extra-price {
    min-width: 60px;
  }
  
  .summary-item-name {
    max-width: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  /* Estilos para placeholders de imágenes */
  .beauty-placeholder {
    background: linear-gradient(135deg, #f8bbd0, #e1bee7);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .extra-placeholder {
    background: linear-gradient(135deg, #e1bee7, #bbdefb);
  }
  
  .initial-letter {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  

  .initial-letter.small {
    font-size: 1rem;
  }
  
  /* Estilos elegantes para el componente */
  .card-header {
    border-bottom: none;
    background-color: #f9f4ff;
    padding: 1rem;
  }
  
  h2, h3, h4, h5, h6 {
    font-weight: 500;
    color: #444;
  }
  
  .elegant-price {
    color: #9c27b0;
    font-weight: 600;
  }
  
  .btn-success {
    background-color: #9c27b0;
    border-color: #9c27b0;
    transition: all 0.3s ease;
    box-shadow: 0 3px 5px rgba(156, 39, 176, 0.2);
  }
  
  .btn-success:hover, .btn-success:focus {
    background-color: #7b1fa2;
    border-color: #7b1fa2;
    box-shadow: 0 4px 8px rgba(156, 39, 176, 0.3);
  }
  
  .btn-outline-secondary:hover, .btn-outline-secondary:focus {
    background-color: #f3e5f5;
    color: #9c27b0;
    border-color: #ce93d8;
  }
  
  /* Asegurar que los elementos flexibles se puedan ajustar en dispositivos pequeños */
  @media (max-width: 576px) {
    .list-group-item {
      padding: 0.75rem;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .list-group-item > div:first-child {
      margin-bottom: 0.75rem;
      align-self: center;
    }
    
    .extra-info {
      max-width: 100%;
      width: 100%;
      margin-bottom: 0.75rem;
    }
    
    .extra-price {
      margin-right: 0;
      margin-bottom: 0.75rem;
      align-self: flex-end;
    }
    
    .form-check {
      align-self: flex-end;
    }
    
    .card-header .d-flex {
      flex-wrap: wrap;
    }
    
    .service-info {
      max-width: 100%;
      margin-top: 0.5rem;
    }
    
    /* Ajustes para elementos de resumen */
    .summary-item-name {
      max-width: 60%;
    }
    

  }
  </style>