<template>
  <div class="time-selection-container">
    <h2 class="h5 mb-3 text-center">Selección de horario</h2>
    
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando disponibilidad...</p>
    </div>
    
    <div v-else>
      <!-- Servicios arrastrables -->
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
      
      <!-- Selector de semana -->
      <div class="week-selector mb-2">
        <div class="d-flex align-items-center justify-content-between">
          <button 
            class="btn btn-sm btn-icon" 
            @click="previousWeek"
            :disabled="!canNavigatePrevious"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <h5 class="week-date-range mb-0">{{ formattedDateRange }}</h5>
          
          <button 
            class="btn btn-sm btn-icon" 
            @click="nextWeek"
            :disabled="!canNavigateNext"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <!-- Vista del calendario adaptada a móvil -->
      <div class="calendar-mobile-wrapper">
        <!-- Días de la semana -->
        <div class="calendar-days-header">
          <div class="calendar-day-header time-header"></div>
          <div 
            v-for="(day, index) in weekDays" 
            :key="index"
            class="calendar-day-header text-center"
            :class="{'text-primary fw-bold': isToday(day.date)}"
          >
            <div class="day-name">{{ day.dayName }}</div>
            <div class="day-number">{{ day.dayNumber }}</div>
          </div>
        </div>
        
        <!-- Contenedor principal del calendario -->
        <div class="calendar-scroll-container">
          <!-- Horas -->
          <div class="calendar-hours">
            <div 
              v-for="hour in businessHours" 
              :key="hour.value"
              class="calendar-hour-cell"
              :class="{ 'hour-label': hour.isFullHour, 'half-hour': !hour.isFullHour }"
            >
              {{ hour.label }}
            </div>
          </div>
          
          <!-- Días de la semana -->
          <div class="calendar-grid">
            <div 
              v-for="(day, dayIndex) in weekDays" 
              :key="dayIndex"
              class="calendar-day-column"
            >
              <!-- Celdas de hora para cada día -->
              <div 
                v-for="(hour, hourIndex) in businessHours" 
                :key="`${dayIndex}-${hourIndex}`"
                class="calendar-time-cell"
                :class="{ 
                  'calendar-time-available': isTimeAvailable(day.date, hour.value),
                  'calendar-time-highlight': touchSelectedService && isTimeAvailable(day.date, hour.value),
                  'full-hour': hour.isFullHour,
                  'half-hour': !hour.isFullHour
                }"
                @click="handleTimeClick(day.date, hour.value)"
                @dragover.prevent
                @drop="onDrop($event, day.date, hour.value)"
              >
                <!-- Visualización de horarios no disponibles -->
                <div 
                  v-if="!isTimeAvailable(day.date, hour.value)"
                  class="calendar-unavailable-indicator"
                ></div>
                
                <!-- Visualización de servicios asignados -->
                <div 
                  v-for="(slot, slotIndex) in getAssignedServicesForTimeSlot(day.date, hour.value)"
                  :key="`slot-${slotIndex}`"
                  class="calendar-selected-service"
                  :style="{ 
                    height: `${slot.duration}px`,
                    backgroundColor: getServiceColor(slot.serviceId)
                  }"
                >
                  <div class="selected-service-name">{{ getServiceName(slot.serviceId) }}</div>
                  <div class="selected-service-time">{{ formatTime(slot.time) }} - {{ formatTime(slot.endTime) }}</div>
                  <div class="selected-service-duration" v-if="slot.totalDuration">
                    {{ slot.totalDuration }} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Horarios seleccionados -->
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
      
      <!-- Resumen de servicios seleccionados -->
      <BookingSummary :selectedServices="selectedServices" class="mt-3" style="border: 1px solid #000;" />
      
      <NavigationButtons 
        @next="next" 
        @prev="prev" 
        :disabled="scheduledSlots.length === 0" 
      />
    </div>
  </div>
</template>

<script>
import NavigationButtons from './NavigationButtons.vue';
import BookingSummary from './BookingSummary.vue';

export default {
  name: 'TimeSelection',
  components: {
    NavigationButtons,
    BookingSummary
  },
  props: {
    selectedServices: {
      type: Array,
      required: true
    },
    availability: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    businessId: {
      type: Number,
      default: 1
    }
  },
  emits: ['update-scheduled-slots', 'next', 'prev'],
  data() {
    return {
      currentWeekStart: this.getStartOfWeek(new Date()),
      businessHours: this.generateHourRange(9, 18),
      currentDraggedService: null,
      scheduledSlots: [], // Guardamos múltiples slots
      touchSelectedService: null, // Para la interacción táctil
      isMobileView: this.checkIfMobile(),
      serviceColors: {}, // Para asignar colores distintos a cada servicio
      existingBookings: [], // Para almacenar las reservas existentes
      loadingAvailability: true, // Para indicar cuando estamos cargando datos
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    
    // Asignar colores a los servicios
    this.initServiceColors();
    

  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    weekDays() {
      const days = [];
      const dayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(this.currentWeekStart);
        date.setDate(date.getDate() + i);
        
        days.push({
          date: date,
          dayName: dayNames[i],
          dayNumber: date.getDate()
        });
      }
      
      return days;
    },
    formattedDateRange() {
      const endDate = new Date(this.currentWeekStart);
      endDate.setDate(endDate.getDate() + 6);
      
      const options = { month: 'short' };
      const startMonth = this.currentWeekStart.toLocaleDateString('es-ES', options);
      const endMonth = endDate.toLocaleDateString('es-ES', options);
      
      return `${this.currentWeekStart.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth}`;
    },
    canNavigatePrevious() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return this.currentWeekStart > today;
    },
    canNavigateNext() {
      // Permitir navegar hasta 3 meses en el futuro
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      
      return this.currentWeekStart < maxDate;
    }
  },
  methods: {
    checkIfMobile() {
      return ('ontouchstart' in window) || 
            navigator.maxTouchPoints > 0 || 
            window.innerWidth < 768;
    },
    handleResize() {
      this.isMobileView = this.checkIfMobile();
    },
    initServiceColors() {
      // Colores predefinidos para servicios
      const colorPalette = [
        '#673ab7', // Morado (primario)
        '#2196f3', // Azul
        '#009688', // Verde azulado
        '#ff5722', // Naranja
        '#e91e63', // Rosa
        '#4caf50', // Verde
        '#ff9800', // Ámbar
        '#795548', // Marrón
        '#607d8b'  // Gris azulado
      ];
      
      // Asignar un color a cada servicio
      this.selectedServices.forEach((service, index) => {
        this.serviceColors[service.id] = colorPalette[index % colorPalette.length];
      });
    },
    getServiceColor(serviceId) {
      return this.serviceColors[serviceId] || '#673ab7'; // Color por defecto
    },
    getServiceName(serviceId) {
      const service = this.selectedServices.find(s => s.id === serviceId);
      return service ? service.name : 'Servicio';
    },
    getStartOfWeek(date) {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajustar cuando el día es domingo
      
      const monday = new Date(date);
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      
      return monday;
    },
    generateHourRange(startHour, endHour) {
      const hours = [];
      
      for (let hour = startHour; hour < endHour; hour++) {
        // Hora en punto
        hours.push({
          label: `${hour}:00`, // Solo mostramos etiqueta para las horas completas
          value: `${hour.toString().padStart(2, '0')}:00`,
          isFullHour: true
        });
        
        // Media hora
        hours.push({
          label: '', // Sin etiqueta para las medias horas
          value: `${hour.toString().padStart(2, '0')}:30`,
          isFullHour: false
        });
      }
      
      // Asegurarnos de añadir la última hora completa
      hours.push({
        label: `${endHour}:00`,
        value: `${endHour.toString().padStart(2, '0')}:00`,
        isFullHour: true
      });
      
      return hours;
    },
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear();
    },
    isTimeAvailable(date, time) {
      // Si la fecha es anterior a hoy, no está disponible
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        return false;
      }
      
      // Para el demo, hacer que algunas horas aparezcan como no disponibles
      if (this.availability && this.availability.bookedSlots) {
        const dateStr = this.formatDateISO(date);
        
        const bookedDay = this.availability.bookedSlots.find(day => day.date === dateStr);
        
        if (bookedDay) {
          const timeHour = parseInt(time.split(':')[0]);
          const timeMinutes = parseInt(time.split(':')[1]);
          const timeInMinutes = timeHour * 60 + timeMinutes;
          
          // Comprobar si alguna reserva cae en esta hora
          return !bookedDay.slots.some(slot => {
            const slotStartHour = parseInt(slot.start.split(':')[0]);
            const slotStartMinutes = parseInt(slot.start.split(':')[1] || '0');
            const slotStartInMinutes = slotStartHour * 60 + slotStartMinutes;
            
            const slotEndHour = parseInt(slot.end.split(':')[0]);
            const slotEndMinutes = parseInt(slot.end.split(':')[1] || '0');
            const slotEndInMinutes = slotEndHour * 60 + slotEndMinutes;
            
            // Verificar si hay superposición
            return timeInMinutes >= slotStartInMinutes && timeInMinutes < slotEndInMinutes;
          });
        }
      }
      
      // Domingos no disponibles
      if (date.getDay() === 0) {
        return false;
      }
      
      // Sábados solo por la mañana
      if (date.getDay() === 6) {
        const hour = parseInt(time.split(':')[0]);
        return hour < 14;
      }
      
      // Verificar si ya hay un servicio asignado para esta hora
      const conflicts = this.getAssignedServicesForTimeSlot(date, time);
      return conflicts.length === 0;
    },
    isServiceAssigned(serviceId) {
      return this.scheduledSlots.some(slot => slot.serviceId === serviceId);
    },
    getServiceHeight(duration) {
      // Cada 30 minutos = 30px de altura
      // Asegurarnos de que la altura sea proporcional a la duración
      return Math.max(30, (duration / 30) * 30); // Mínimo 30px para visibilidad
    },
    getAssignedServicesForTimeSlot(date, time) {
      const slots = [];
      const dateStr = this.formatDateISO(date);
      const timeValue = time;
      
      // Convertir el tiempo a minutos desde el inicio del día para comparación más fácil
      const [timeHours, timeMinutes] = timeValue.split(':').map(Number);
      const slotTimeInMinutes = timeHours * 60 + timeMinutes;
      
      // Buscar servicios asignados que coincidan con esta franja de tiempo
      for (const slot of this.scheduledSlots) {
        const slotDate = new Date(slot.date);
        const slotDateStr = this.formatDateISO(slotDate);
        
        // Solo verificar si es el mismo día
        if (slotDateStr === dateStr) {
          // Convertir hora de inicio del servicio a minutos
          const [slotHours, slotMinutes] = slot.time.split(':').map(Number);
          const slotStartInMinutes = slotHours * 60 + slotMinutes;
          
          // Calcular hora de fin del servicio en minutos
          const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
          const slotEndInMinutes = endHours * 60 + endMinutes;
          
          // Verificar si el tiempo actual está dentro del rango del servicio
          if (slotTimeInMinutes >= slotStartInMinutes && slotTimeInMinutes < slotEndInMinutes) {
            // Si coincide, agregar el servicio a la lista de slots
            // Solo si es el tiempo de inicio, para evitar duplicados y asegurar visualización correcta
            if (slotTimeInMinutes === slotStartInMinutes) {
              // Asegurarse de que la duración visual sea correcta
              if (!slot.visualHeight) {
                // Calcular la altura visual basada en la duración total
                const totalDurationMinutes = slot.totalDuration || 
                  (slot.endTime ? this.calculateDurationMinutes(slot.time, slot.endTime) : 0);
                
                // Crear una copia del slot con la altura visual correcta
                const slotWithHeight = { ...slot };
                slotWithHeight.duration = this.getServiceHeight(totalDurationMinutes);
                slots.push(slotWithHeight);
              } else {
                slots.push(slot);
              }
            }
          }
        }
      }
      
      return slots;
    },
    
    // Método para calcular la duración en minutos entre dos horas
    calculateDurationMinutes(startTime, endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      return endTotalMinutes - startTotalMinutes;
    },
    // Método para calcular la duración total de un servicio con sus extras
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
    
    onDragStart(event, service) {
      this.currentDraggedService = service;
      
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
    },
    onDragEnd() {
      // Limpiar efectos visuales
      document.querySelectorAll('.service-drag-item').forEach(item => {
        item.classList.remove('dragging');
      });
    },
    onDrop(event, date, time) {
      event.preventDefault();
      
      // Comprobar si la hora es válida
      if (!this.isTimeAvailable(date, time)) {
        return;
      }
      
      // Obtener datos del servicio
      const serviceData = JSON.parse(event.dataTransfer.getData("text/plain"));
      
      // Calcular la hora de fin basada en la duración
      const endTime = this.calculateEndTime(time, serviceData.duration);
      
      // Crear nuevo slot
      const newSlot = {
        date: new Date(date),
        time: time,
        endTime: endTime,
        duration: this.getServiceHeight(serviceData.duration),
        serviceId: serviceData.id,
        totalDuration: serviceData.duration // Guardar la duración total para referencia
      };
      
      // Verificar si ya existe una asignación para este servicio
      const existingIndex = this.scheduledSlots.findIndex(slot => slot.serviceId === serviceData.id);
      
      if (existingIndex !== -1) {
        // Actualizar slot existente
        this.scheduledSlots.splice(existingIndex, 1, newSlot);
      } else {
        // Agregar nuevo slot
        this.scheduledSlots.push(newSlot);
      }
      
      // Emitir evento con todos los slots actualizados
      this.$emit('update-scheduled-slots', this.scheduledSlots);
    },
    handleServiceClick(service) {
      if (this.isMobileView) {
        // En modo móvil, seleccionar este servicio para colocación posterior
        this.touchSelectedService = service;
      }
    },
    handleTimeClick(date, time) {
      if (this.isMobileView && this.touchSelectedService && this.isTimeAvailable(date, time)) {
        // En modo móvil, si hay un servicio seleccionado, colocarlo en esta celda
        const service = this.touchSelectedService;
        
        // Calcular duración total con extras usando el método centralizado
        const totalDuration = this.calculateTotalServiceDuration(service);
        
        // Calcular la hora de fin
        const endTime = this.calculateEndTime(time, totalDuration);
        
        // Crear nuevo slot
        const newSlot = {
          date: new Date(date),
          time: time,
          endTime: endTime,
          duration: this.getServiceHeight(totalDuration),
          serviceId: service.id,
          totalDuration: totalDuration // Guardar la duración total para referencia
        };
        
        // Verificar si ya existe una asignación para este servicio
        const existingIndex = this.scheduledSlots.findIndex(slot => slot.serviceId === service.id);
        
        if (existingIndex !== -1) {
          // Actualizar slot existente
          this.scheduledSlots.splice(existingIndex, 1, newSlot);
        } else {
          // Agregar nuevo slot
          this.scheduledSlots.push(newSlot);
        }
        
        // Emitir evento con todos los slots actualizados
        this.$emit('update-scheduled-slots', this.scheduledSlots);
        
        // Limpiar selección
        this.touchSelectedService = null;
      }
    },
    removeSlot(index) {
      // Eliminar un slot de la lista
      this.scheduledSlots.splice(index, 1);
      
      // Emitir evento con todos los slots actualizados
      this.$emit('update-scheduled-slots', this.scheduledSlots);
    },
    calculateEndTime(startTime, durationMinutes) {
      const [hours, minutes] = startTime.split(':').map(Number);
      
      let totalMinutes = hours * 60 + minutes + durationMinutes;
      
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      
      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    },
    formatDate(date) {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    },
    formatDateISO(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    formatTime(time) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    },
    previousWeek() {
      const newDate = new Date(this.currentWeekStart);
      newDate.setDate(newDate.getDate() - 7);
      
      this.currentWeekStart = newDate;
    },
    nextWeek() {
      const newDate = new Date(this.currentWeekStart);
      newDate.setDate(newDate.getDate() + 7);
      
      this.currentWeekStart = newDate;
    },
    next() {
      if (this.scheduledSlots.length > 0) {
        // Emitir evento con todos los slots actualizados al avanzar
        this.$emit('update-scheduled-slots', this.scheduledSlots);
        this.$emit('next');
      }
    },
    prev() {
      this.$emit('prev');
    }
  }
};
</script>

<style scoped>
.time-selection-container {
  max-width: 100%;
  overflow-x: hidden;
}

/* Servicios arrastrables */
.services-drag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.service-drag-item {
  background: #f0f4ff;
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 80px;
  flex-grow: 1;
  cursor: grab;
  border-left: 4px solid #5c6bc0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;
  user-select: none;
  display: flex;
  align-items: center;
}

.service-drag-item:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.service-drag-item.dragging {
  opacity: 0.6;
}

.service-drag-item.service-dropped {
  opacity: 0.5;
  background: #e8eaf6;
}

.service-drag-item.service-selected {
  background-color: #d1c4e9;
  border-left: 4px solid #673ab7;
  box-shadow: 0 0 0 2px #673ab7;
}

.service-content {
  width: 100%;
}

.service-name {
  font-weight: 500;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.service-duration {
  font-size: 0.75rem;
  color: #666;
}

.service-extras-info {
  font-size: 0.7rem;
  color: #5c6bc0;
  font-style: italic;
}

/* Instrucciones para móviles */
.mobile-drag-instructions {
  background-color: #e8f5e9;
  border-radius: 8px;
  font-size: 0.85rem;
}

/* Selector de semana */
.week-selector {
  border-radius: 8px;
  background: #f5f5f5;
  padding: 8px 12px;
}

.week-date-range {
  font-size: 0.95rem;
  font-weight: 500;
}

.btn-icon {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Calendario adaptado a móvil */
.calendar-mobile-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.calendar-days-header {
  display: flex;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.calendar-day-header {
  flex: 1;
  min-width: 40px;
  max-width: 50px;
  padding: 8px 4px;
  font-size: 0.75rem;
  text-align: center;
}

.time-header {
  min-width: 40px;
  max-width: 40px;
}

.day-name {
  font-weight: 500;
}

.day-number {
  font-size: 0.85rem;
}

.calendar-scroll-container {
  display: flex;
  overflow-x: auto;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  height: 600px;
  overflow-y: auto;
}

.calendar-hours {
  min-width: 40px;
  max-width: 40px;
  border-right: 1px solid #eee;
  background: #f9f9f9;
}

.calendar-hour-cell {
  height: 30px;
  padding: 2px;
  text-align: center;
  font-size: 0.7rem;
  color: #666;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-hour-cell.hour-label {
  font-weight: 500;
}

.calendar-hour-cell.half-hour {
  border-bottom: 1px dashed #eee;
}

.calendar-grid {
  display: flex;
  flex-grow: 1;
}

.calendar-day-column {
  flex: 1;
  min-width: 40px;
  max-width: 50px;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.calendar-time-cell {
  height: 30px;
  position: relative;
  box-sizing: border-box;
}

.calendar-time-cell.full-hour {
  border-bottom: 1px solid #eee;
}

.calendar-time-cell.half-hour {
  border-bottom: 1px dashed #eee;
}

.calendar-time-available {
  background-color: #f0f4ff;
  cursor: pointer;
}

.calendar-time-available:hover {
  background-color: #e3f2fd;
}

.calendar-time-highlight {
  background-color: rgba(103, 58, 183, 0.15);
}

.calendar-unavailable-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.05) 5px,
    rgba(0, 0, 0, 0.05) 10px
  );
}

.calendar-selected-service {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #673ab7;
  color: white;
  border-radius: 4px;
  margin: 2px;
  padding: 4px;
  z-index: 2;
  font-size: 0.7rem;
  overflow: hidden;
}

.selected-service-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-service-time {
  font-size: 0.65rem;
  opacity: 0.9;
}

.selected-service-duration {
  font-size: 0.6rem;
  opacity: 0.8;
  font-style: italic;
}

/* Lista de horarios seleccionados */
.selected-times-list {
  background: #f5f7ff;
  border-radius: 8px;
  padding: 12px;
}

.selected-time-info {
  background: #e8f5e9;
  border-radius: 8px;
  padding: 10px;
  font-size: 0.9rem;
  position: relative;
}

.btn-remove {
  background-color: #f5f5f5;
  color: #666;
}

.btn-remove:hover {
  background-color: #ffebee;
  color: #e53935;
}

/* Adaptaciones específicas para móviles */
@media (max-width: 576px) {
  .calendar-day-header, .calendar-day-column {
    min-width: 38px;
  }
  
  .time-header, .calendar-hours {
    min-width: 30px;
    max-width: 30px;
  }
  
  .calendar-hour-cell {
    padding: 2px;
    font-size: 0.65rem;
    height: 30px; /* Mantener consistente */
  }
  
  .calendar-time-cell {
    height: 30px; /* Mantener consistente */
  }
  
  .calendar-scroll-container {
    height: 600px; /* Altura consistente */
  }
  
  .service-drag-item {
    min-height: 44px;
    touch-action: none; /* Prevenir gestos de desplazamiento durante el arrastre */
  }
}</style>