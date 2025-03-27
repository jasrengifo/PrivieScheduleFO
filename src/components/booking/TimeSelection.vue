<template>
  <div class="time-selection-container">
    <h2 class="h5 mb-3 text-center">Selección de horario</h2>
    
    <Notification 
      v-if="notification.show"
      :key="notification.id"
      :message="notification.message"
      :type="notification.type"
    />
    
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
        :businessSchedule="businessSchedule"
        @time-click="handleTimeClick"
        @drop-service="handleDropService"
        @validate-availability="validateAvailability"
        @show-notification="showNotification"
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
import Notification from '../common/Notification.vue';
import { availability as mockAvailability } from '../../services/mockData.js';

export default {
  name: 'TimeSelection',
  components: {
    NavigationButtons,
    BookingSummary,
    DraggableServices,
    WeekSelector,
    CalendarGrid,
    ScheduledTimesList,
    Notification
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
    },
    businessSchedule: {
      type: Object,
      required: true,
      // Formato esperado:
      // {
      //   monday: { start: '09:00', end: '20:00' },
      //   tuesday: { start: '09:00', end: '20:00' },
      //   wednesday: { start: '09:00', end: '20:00' },
      //   thursday: { start: '09:00', end: '20:00' },
      //   friday: { start: '09:00', end: '20:00' },
      //   saturday: { start: '09:00', end: '14:00' },
      //   sunday: null // null significa que no se trabaja ese día
      // }
    }
  },
  emits: ['update-scheduled-slots', 'next', 'prev'],
  data() {
    return {
      currentWeekStart: this.getStartOfWeek(new Date()),
      businessHours: [], // Se inicializará en created
      currentDraggedService: null,
      scheduledSlots: [], // Guardamos múltiples slots
      touchSelectedService: null, // Para la interacción táctil
      isMobileView: this.checkIfMobile(),
      serviceColors: {}, // Para asignar colores distintos a cada servicio
      existingBookings: [], // Para almacenar las reservas existentes desde mockData
      loadingAvailability: true, // Para indicar cuando estamos cargando datos
      notification: {
        show: false,
        message: '',
        type: 'error'
      }
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    
    // Asignar colores a los servicios
    this.initServiceColors();
    
    // Cargar las reservas existentes desde mockData
    this.loadExistingBookings();
    
    // Generar el rango de horas basado en el horario de trabajo
    this.businessHours = this.generateHourRange();
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
    generateHourRange() {
      const hours = [];
      
      // Obtener el horario más temprano y más tardío de todos los días
      let earliestHour = 24;
      let latestHour = 0;
      
      Object.values(this.businessSchedule).forEach(daySchedule => {
        if (daySchedule) {
          const [startHour] = daySchedule.start.split(':').map(Number);
          const [endHour] = daySchedule.end.split(':').map(Number);
          
          earliestHour = Math.min(earliestHour, startHour);
          latestHour = Math.max(latestHour, endHour);
        }
      });
      
      // Generar el rango de horas
      for (let hour = earliestHour; hour < latestHour; hour++) {
        // Hora en punto
        hours.push({
          label: `${hour}:00`,
          value: `${hour.toString().padStart(2, '0')}:00`,
          isFullHour: true
        });
        
        // Media hora
        hours.push({
          label: '',
          value: `${hour.toString().padStart(2, '0')}:30`,
          isFullHour: false
        });
      }
      
      // Asegurarnos de añadir la última hora completa
      hours.push({
        label: `${latestHour}:00`,
        value: `${latestHour.toString().padStart(2, '0')}:00`,
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
    showNotification(message, type = 'error') {
      this.notification = {
        show: true,
        message,
        type,
        id: Date.now()
      };
    },
    handleTimeClick(date, time) {
      if (this.isMobileView && this.touchSelectedService) {
        const service = this.touchSelectedService;
        const totalDuration = this.calculateTotalServiceDuration(service);
        const endTime = this.calculateEndTime(time, totalDuration);
        
        // Verificar si el horario está disponible
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        if (date < todayStart) {
          this.showNotification('No se pueden agendar servicios en días pasados', 'error');
          return;
        }
        
        // Si es hoy, verificar que la hora no sea anterior a la hora actual
        if (this.formatDateISO(date) === this.formatDateISO(today)) {
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          const currentInMinutes = currentHour * 60 + currentMinute;
          
          const [timeHour, timeMinute] = time.split(':').map(Number);
          const timeInMinutes = timeHour * 60 + timeMinute;
          
          // Agregar un margen de 30 minutos para preparación
          if (timeInMinutes <= currentInMinutes + 30) {
            this.showNotification('No se pueden agendar servicios en horarios pasados', 'error');
            return;
          }

          // Verificar que el servicio no termine después del horario de cierre
          const [endHour, endMinute] = endTime.split(':').map(Number);
          const endInMinutes = endHour * 60 + endMinute;
          const closingTime = 20 * 60; // 20:00 en minutos

          if (endInMinutes > closingTime) {
            this.showNotification('El servicio terminaría después del horario de cierre', 'error');
            return;
          }
        }
        
        const bookingData = {
          date: this.formatDateISO(date),
          startTime: time,
          endTime: endTime,
          serviceId: service.id,
          aestheticianId: this.selectedAesthetician?.id
        };
        
        // Validar disponibilidad
        this.validateAvailability(bookingData, (isAvailable) => {
          if (isAvailable) {
            this.handleDropService(service, date, time);
            this.touchSelectedService = null; // Limpiar la selección después de agendar
          } else {
            this.showNotification('Este horario no está disponible', 'error');
          }
        });
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
        totalDuration: serviceData.duration, // Guardar la duración total para referencia
        isNewBooking: true // Marcar como nuevo agendamiento
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
        
        // Actualizar cuando cambia el esteticista seleccionado
        this.updateBookingsForAesthetician();
      }
    },
    
    // Método para actualizar las reservas según el esteticista seleccionado
    updateBookingsForAesthetician() {
      // Si no hay esteticista seleccionado, mostrar todas las reservas
      if (!this.selectedAesthetician) {
        return;
      }
      
      // Filtrar las reservas para mostrar solo las del esteticista seleccionado
      // Nota: No modificamos this.existingBookings directamente para mantener los datos originales
      console.log('Filtrando reservas para esteticista:', this.selectedAesthetician.name);
      
      // Verificar que tenemos datos de reservas
      if (!mockAvailability || !mockAvailability.bookedSlots) {
        return;
      }
      
      // Crear una copia filtrada de las reservas
      this.existingBookings = mockAvailability.bookedSlots.map(day => {
        // Crear una copia del día
        const filteredDay = { ...day };
        
        // Filtrar los slots para mostrar solo los del esteticista seleccionado
        filteredDay.slots = day.slots.filter(slot => 
          slot.aestheticianId === this.selectedAesthetician.id
        );
        
        return filteredDay;
      });
      
      console.log('Reservas filtradas:', this.existingBookings);
    },
    
    async validateAvailability(bookingData, callback) {
      try {
        const dateStr = bookingData.date;
        const timeStr = bookingData.startTime;
        const endTimeStr = bookingData.endTime;
        
        // Convertir tiempos a minutos para comparación
        const [startHour, startMinute] = timeStr.split(':').map(Number);
        const [endHour, endMinute] = endTimeStr.split(':').map(Number);
        const startInMinutes = startHour * 60 + startMinute;
        const endInMinutes = endHour * 60 + endMinute;
        
        // Verificar si la fecha es anterior a hoy
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          this.showNotification('No se pueden agendar citas en días pasados.');
          callback(false);
          return;
        }
        
        // Si es hoy, verificar que la hora no sea anterior a la hora actual
        if (selectedDate.getTime() === today.getTime()) {
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          const currentInMinutes = currentHour * 60 + currentMinute;
          
          if (startInMinutes < currentInMinutes) {
            this.showNotification('No se pueden agendar citas en horarios pasados.');
            callback(false);
            return;
          }
        }
        
        // Verificar horarios de trabajo
        const dayOfWeek = selectedDate.getDay(); // 0 es domingo, 1 es lunes, etc.
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const workingHours = this.businessSchedule[dayNames[dayOfWeek]];
        
        if (!workingHours) {
          this.showNotification('Este día no está disponible para agendar citas.');
          callback(false);
          return;
        }
        
        // Convertir horarios de trabajo a minutos
        const [workStartHour, workStartMinute] = workingHours.start.split(':').map(Number);
        const [workEndHour, workEndMinute] = workingHours.end.split(':').map(Number);
        const workStartInMinutes = workStartHour * 60 + workStartMinute;
        const workEndInMinutes = workEndHour * 60 + workEndMinute;
        
        // Verificar si el horario está dentro del horario de trabajo
        if (startInMinutes < workStartInMinutes || endInMinutes > workEndInMinutes) {
          this.showNotification(`El horario de atención es de ${workingHours.start} a ${workingHours.end} horas.`);
          callback(false);
          return;
        }
        
        // 1. Verificar contra las reservas existentes
        const bookedDay = this.existingBookings.find(day => {
          const dayValue = day._custom ? day._custom.value : day;
          return dayValue.date === dateStr;
        });
        
        if (bookedDay) {
          const dayValue = bookedDay._custom ? bookedDay._custom.value : bookedDay;
          const hasConflictWithExisting = dayValue.slots.some(slot => {
            // Verificar si el esteticista coincide
            if (this.selectedAesthetician && slot.aestheticianId !== this.selectedAesthetician.id) {
              return false;
            }
            
            const [slotStartHour, slotStartMinute] = slot.start.split(':').map(Number);
            const [slotEndHour, slotEndMinute] = slot.end.split(':').map(Number);
            const slotStartInMinutes = slotStartHour * 60 + slotStartMinute;
            const slotEndInMinutes = slotEndHour * 60 + slotEndMinute;
            
            // Verificar si hay superposición
            return (startInMinutes >= slotStartInMinutes && startInMinutes < slotEndInMinutes) || 
                   (endInMinutes > slotStartInMinutes && endInMinutes <= slotEndInMinutes) ||
                   (startInMinutes <= slotStartInMinutes && endInMinutes >= slotEndInMinutes) ||
                   (slotStartInMinutes <= startInMinutes && slotEndInMinutes >= endInMinutes);
          });
          
          if (hasConflictWithExisting) {
            this.showNotification('Este horario ya está reservado.');
            callback(false);
            return;
          }
        }
        
        // 2. Verificar contra los slots ya programados
        const hasConflictWithScheduled = this.scheduledSlots.some(slot => {
          const slotValue = slot._custom ? slot._custom.value : slot;
          const slotDate = slotValue.date._custom ? new Date(slotValue.date._custom.value) : new Date(slotValue.date);
          const slotDateStr = this.formatDateISO(slotDate);
          
          // Solo verificar si es el mismo día
          if (slotDateStr === dateStr) {
            const [slotStartHour, slotStartMinute] = slotValue.time.split(':').map(Number);
            const [slotEndHour, slotEndMinute] = slotValue.endTime.split(':').map(Number);
            const slotStartInMinutes = slotStartHour * 60 + slotStartMinute;
            const slotEndInMinutes = slotEndHour * 60 + slotEndMinute;
            
            // Verificar si hay superposición
            return (startInMinutes >= slotStartInMinutes && startInMinutes < slotEndInMinutes) || 
                   (endInMinutes > slotStartInMinutes && endInMinutes <= slotEndInMinutes) ||
                   (startInMinutes <= slotStartInMinutes && endInMinutes >= slotEndInMinutes) ||
                   (slotStartInMinutes <= startInMinutes && slotEndInMinutes >= endInMinutes);
          }
          
          return false;
        });
        
        if (hasConflictWithScheduled) {
          this.showNotification('Este horario ya está reservado.');
          callback(false);
          return;
        }
        
        // Si no hay conflictos, permitir la reserva
        callback(true);
      } catch (error) {
        console.error('Error validando disponibilidad:', error);
        this.showNotification('Error al validar la disponibilidad.');
        callback(false);
      }
    }
  },
  watch: {
    selectedAesthetician: {
      handler(newValue) {
        if (newValue) {
          console.log('Esteticista seleccionado cambiado:', newValue.name);
          this.updateBookingsForAesthetician();
        }
      },
      immediate: true
    }
  },
};
</script>

<style scoped>
.time-selection-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.calendar-container {
  width: 100%;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (min-width: 768px) {
  .calendar-container {
    padding: 16px;
  }
}

@media (max-width: 767px) {
  .calendar-container {
    padding: 8px;
  }
}
</style>