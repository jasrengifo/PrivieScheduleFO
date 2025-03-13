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
      <DraggableServices 
        :selectedServices="selectedServices"
        :scheduledSlots="scheduledSlots"
        :isMobileView="isMobileView"
        :touchSelectedService="touchSelectedService"
        @service-drag-start="onDragStart"
        @service-drag-end="onDragEnd"
        @service-click="handleServiceClick"
      />
      
      <!-- Selector de semana -->
      <WeekSelector 
        :currentWeekStart="currentWeekStart"
        @update-week="updateWeek"
      />
      
      <!-- Vista del calendario -->
      <CalendarGrid 
        :weekDays="weekDays"
        :businessHours="businessHours"
        :scheduledSlots="scheduledSlots"
        :selectedServices="selectedServices"
        :touchSelectedService="touchSelectedService"
        :serviceColors="serviceColors"
        :existingBookings="existingBookings"
        :availability="availability"
        :selectedAesthetician="selectedAesthetician"
        @time-click="handleTimeClick"
        @drop-service="handleDropService"
      />
      
      <!-- Horarios seleccionados -->
      <ScheduledTimesList 
        :scheduledSlots="scheduledSlots"
        :selectedServices="selectedServices"
        @remove-slot="removeSlot"
      />
      
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
import DraggableServices from './calendar/DraggableServices.vue';
import WeekSelector from './calendar/WeekSelector.vue';
import CalendarGrid from './calendar/CalendarGrid.vue';
import ScheduledTimesList from './calendar/ScheduledTimesList.vue';
import { availability as mockAvailability } from '../../services/mockData.js';

export default {
  name: 'TimeSelection',
  components: {
    NavigationButtons,
    BookingSummary,
    DraggableServices,
    WeekSelector,
    CalendarGrid,
    ScheduledTimesList
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
    },
    selectedAesthetician: {
      type: Object,
      default: null
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
      existingBookings: [], // Para almacenar las reservas existentes desde mockData
      loadingAvailability: true, // Para indicar cuando estamos cargando datos
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    
    // Asignar colores a los servicios
    this.initServiceColors();
    
    // Cargar las reservas existentes desde mockData
    this.loadExistingBookings();
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
    calculateEndTime(startTime, durationMinutes) {
      const [hours, minutes] = startTime.split(':').map(Number);
      
      let totalMinutes = hours * 60 + minutes + durationMinutes;
      
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      
      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    },
    formatDateISO(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    onDragStart(service) {
      this.currentDraggedService = service;
    },
    onDragEnd() {
      // Limpiar el servicio arrastrado
      this.currentDraggedService = null;
    },
    handleServiceClick(service) {
      if (this.isMobileView) {
        // En modo móvil, seleccionar este servicio para colocación posterior
        this.touchSelectedService = service;
      }
    },
    handleTimeClick(date, time) {
      if (this.isMobileView && this.touchSelectedService) {
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
    handleDropService(serviceData, date, time) {
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
    getServiceHeight(duration) {
      // Cada 30 minutos = 30px de altura
      return Math.max(30, (duration / 30) * 30); // Mínimo 30px para visibilidad
    },
    removeSlot(index) {
      // Eliminar un slot de la lista
      this.scheduledSlots.splice(index, 1);
      
      // Emitir evento con todos los slots actualizados
      this.$emit('update-scheduled-slots', this.scheduledSlots);
    },
    updateWeek(newDate) {
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
    },
    
    // Método para cargar las reservas existentes desde mockData
    loadExistingBookings() {
      if (mockAvailability && mockAvailability.bookedSlots) {
        this.existingBookings = mockAvailability.bookedSlots;
      }
    }
  }
};
</script>