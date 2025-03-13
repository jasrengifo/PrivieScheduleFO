<template>
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
</template>

<script>
export default {
  name: 'CalendarGrid',
  props: {
    weekDays: {
      type: Array,
      required: true
    },
    businessHours: {
      type: Array,
      required: true
    },
    scheduledSlots: {
      type: Array,
      required: true
    },
    selectedServices: {
      type: Array,
      required: true
    },
    touchSelectedService: {
      type: Object,
      default: null
    },
    serviceColors: {
      type: Object,
      default: () => ({})
    },
    existingBookings: {
      type: Array,
      default: () => []
    },
    availability: {
      type: Object,
      default: null
    },
    selectedAesthetician: {
      type: Object,
      default: null
    }
  },
  emits: ['time-click', 'drop-service'],
  methods: {
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
      
      // Verificar si el horario está ocupado según los datos
      const dateStr = this.formatDateISO(date);
      const timeHour = parseInt(time.split(':')[0]);
      const timeMinutes = parseInt(time.split(':')[1]);
      const timeInMinutes = timeHour * 60 + timeMinutes;
      
      // Verificar en las reservas existentes
      const bookedDay = this.existingBookings.find(day => day.date === dateStr);
      
      if (bookedDay) {
        // Comprobar si alguna reserva cae en esta hora
        const isBooked = bookedDay.slots.some(slot => {
          // Verificar si el esteticista seleccionado coincide (si hay uno seleccionado)
          if (this.selectedAesthetician && slot.aestheticianId !== this.selectedAesthetician.id) {
            return false; // No es el mismo esteticista, así que no afecta la disponibilidad
          }
          
          const slotStartHour = parseInt(slot.start.split(':')[0]);
          const slotStartMinutes = parseInt(slot.start.split(':')[1] || '0');
          const slotStartInMinutes = slotStartHour * 60 + slotStartMinutes;
          
          const slotEndHour = parseInt(slot.end.split(':')[0]);
          const slotEndMinutes = parseInt(slot.end.split(':')[1] || '0');
          const slotEndInMinutes = slotEndHour * 60 + slotEndMinutes;
          
          // Verificar si hay superposición
          return timeInMinutes >= slotStartInMinutes && timeInMinutes < slotEndInMinutes;
        });
        
        if (isBooked) {
          return false;
        }
      }
      
      // También verificar en los datos de disponibilidad proporcionados
      if (this.availability && this.availability.bookedSlots) {
        const bookedDay = this.availability.bookedSlots.find(day => day.date === dateStr);
        
        if (bookedDay) {
          // Comprobar si alguna reserva cae en esta hora
          const isBooked = bookedDay.slots.some(slot => {
            const slotStartHour = parseInt(slot.start.split(':')[0]);
            const slotStartMinutes = parseInt(slot.start.split(':')[1] || '0');
            const slotStartInMinutes = slotStartHour * 60 + slotStartMinutes;
            
            const slotEndHour = parseInt(slot.end.split(':')[0]);
            const slotEndMinutes = parseInt(slot.end.split(':')[1] || '0');
            const slotEndInMinutes = slotEndHour * 60 + slotEndMinutes;
            
            // Verificar si hay superposición
            return timeInMinutes >= slotStartInMinutes && timeInMinutes < slotEndInMinutes;
          });
          
          if (isBooked) {
            return false;
          }
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
            // Solo si es el tiempo de inicio, para evitar duplicados
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
    getServiceHeight(duration) {
      // Cada 30 minutos = 30px de altura
      return Math.max(30, (duration / 30) * 30); // Mínimo 30px para visibilidad
    },
    getServiceName(serviceId) {
      const service = this.selectedServices.find(s => s.id === serviceId);
      return service ? service.name : 'Servicio';
    },
    getServiceColor(serviceId) {
      return this.serviceColors[serviceId] || '#673ab7'; // Color por defecto
    },
    formatTime(time) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    },
    formatDateISO(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    calculateDurationMinutes(startTime, endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      return endTotalMinutes - startTotalMinutes;
    },
    handleTimeClick(date, time) {
      this.$emit('time-click', date, time);
    },
    onDrop(event, date, time) {
      event.preventDefault();
      
      // Comprobar si la hora es válida
      if (!this.isTimeAvailable(date, time)) {
        return;
      }
      
      // Obtener datos del servicio
      const serviceData = JSON.parse(event.dataTransfer.getData("text/plain"));
      
      // Emitir evento al componente padre
      this.$emit('drop-service', serviceData, date, time);
    }
  }
};
</script>