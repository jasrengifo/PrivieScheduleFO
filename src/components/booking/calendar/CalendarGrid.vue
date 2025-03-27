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
          :data-day="day.date.getDay()"
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
              'half-hour': !hour.isFullHour,
              'out-of-hours': !isTimeAvailable(day.date, hour.value)
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
                backgroundColor: getServiceColor(slot)
              }"
            >
              <div class="selected-service-name">
                {{ isSlotFromExistingBookings(slot) ? 'Ocupado' : getServiceName(slot.serviceId) }}
              </div>
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
    },
    locale: {
      type: String,
      default: 'pt'
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
  emits: ['time-click', 'drop-service', 'validate-availability', 'show-notification'],
  methods: {
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear();
    },
    isTimeAvailable(date, time) {
      // Verificar si la fecha es anterior a hoy
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (date < todayStart) {
        return false;
      }
      
      // Obtener el día de la semana (0 = domingo, 1 = lunes, etc.)
      const dayOfWeek = date.getDay();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const daySchedule = this.businessSchedule[dayNames[dayOfWeek]];
      
      // Si no hay horario para este día, no está disponible
      if (!daySchedule) {
        return false;
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
          return false;
        }
      }

      // Verificar si la hora está dentro del horario de trabajo
      const [timeHour, timeMinute] = time.split(':').map(Number);
      const timeInMinutes = timeHour * 60 + timeMinute;
      
      const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
      const [endHour, endMinute] = daySchedule.end.split(':').map(Number);
      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      
      // Obtener la duración del servicio seleccionado (si hay uno)
      let serviceDuration = 0;
      if (this.touchSelectedService) {
        serviceDuration = this.touchSelectedService.duration || 60;
      }
      
      // Verificar que el servicio no termine después del horario de cierre
      const serviceEndInMinutes = timeInMinutes + serviceDuration;
      if (serviceEndInMinutes > endInMinutes) {
        return false;
      }

      // Verificar en las reservas existentes
      const dateStr = this.formatDateISO(date);
      const dataSource = (this.availability && this.availability.bookedSlots) ? 
                         this.availability.bookedSlots : this.existingBookings;
      
      // Encontrar el día en las reservas existentes
      const bookedDay = dataSource.find(day => {
        const dayValue = day._custom ? day._custom.value : day;
        return dayValue.date === dateStr;
      });
      
      if (bookedDay) {
        const dayValue = bookedDay._custom ? bookedDay._custom.value : bookedDay;
        if (dayValue.slots) {
          for (const bookedSlot of dayValue.slots) {
            // Verificar si el esteticista seleccionado coincide
            if (this.selectedAesthetician && bookedSlot.aestheticianId !== this.selectedAesthetician.id) {
              continue;
            }
            
            // Convertir hora de inicio a minutos
            const [bookedStartHours, bookedStartMinutes] = bookedSlot.start.split(':').map(Number);
            const bookedStartInMinutes = bookedStartHours * 60 + bookedStartMinutes;
            
            // Convertir hora de fin a minutos
            const [bookedEndHours, bookedEndMinutes] = bookedSlot.end.split(':').map(Number);
            const bookedEndInMinutes = bookedEndHours * 60 + bookedEndMinutes;
            
            // Verificar si hay superposición
            if (
              (timeInMinutes >= bookedStartInMinutes && timeInMinutes < bookedEndInMinutes) ||
              (serviceEndInMinutes > bookedStartInMinutes && serviceEndInMinutes <= bookedEndInMinutes) ||
              (timeInMinutes <= bookedStartInMinutes && serviceEndInMinutes >= bookedEndInMinutes)
            ) {
              return false;
            }
          }
        }
      }
      
      return true;
    },
    getAssignedServicesForTimeSlot(date, time) {
      const slots = [];
      const dateStr = this.formatDateISO(date);
      const timeValue = time;
      
      // Convertir el tiempo a minutos desde el inicio del día para comparación más fácil
      const [timeHours, timeMinutes] = timeValue.split(':').map(Number);
      const slotTimeInMinutes = timeHours * 60 + timeMinutes;
      
      // Primero, agregar las reservas existentes de la API
      const dataSource = (this.availability && this.availability.bookedSlots) ? 
                         this.availability.bookedSlots : this.existingBookings;
      
      if (dataSource && dataSource.length > 0) {
        const bookedDay = dataSource.find(day => {
          const dayValue = day._custom ? day._custom.value : day;
          return dayValue.date === dateStr;
        });
        
        if (bookedDay) {
          const dayValue = bookedDay._custom ? bookedDay._custom.value : bookedDay;
          if (dayValue.slots) {
            for (const bookedSlot of dayValue.slots) {
              // Verificar si el esteticista seleccionado coincide
              if (this.selectedAesthetician && bookedSlot.aestheticianId !== this.selectedAesthetician.id) {
                continue;
              }
              
              // Convertir hora de inicio a minutos
              const [bookedStartHours, bookedStartMinutes] = bookedSlot.start.split(':').map(Number);
              const bookedStartInMinutes = bookedStartHours * 60 + bookedStartMinutes;
              
              // Verificar si este es el tiempo de inicio del slot reservado
              if (slotTimeInMinutes === bookedStartInMinutes) {
                // Crear un slot visual para la reserva existente
                const visualSlot = {
                  ...bookedSlot,
                  time: bookedSlot.start,
                  endTime: bookedSlot.end,
                  duration: this.getServiceHeight(this.calculateDurationMinutes(bookedSlot.start, bookedSlot.end)),
                  isExistingBooking: true, // Marcar como reserva existente
                  isNewBooking: false // Asegurar que no es un nuevo agendamiento
                };
                slots.push(visualSlot);
              }
            }
          }
        }
      }
      
      // Luego, agregar los slots programados por el usuario
      for (const slot of this.scheduledSlots) {
        const slotValue = slot._custom ? slot._custom.value : slot;
        // Manejar la fecha anidada en scheduledSlots
        const slotDate = slotValue.date._custom ? new Date(slotValue.date._custom.value) : new Date(slotValue.date);
        const slotDateStr = this.formatDateISO(slotDate);
        
        // Solo verificar si es el mismo día
        if (slotDateStr === dateStr) {
          // Convertir hora de inicio del servicio a minutos
          const [slotHours, slotMinutes] = slotValue.time.split(':').map(Number);
          const slotStartInMinutes = slotHours * 60 + slotMinutes;
          
          // Calcular hora de fin del servicio en minutos
          const [endHours, endMinutes] = slotValue.endTime.split(':').map(Number);
          const slotEndInMinutes = endHours * 60 + endMinutes;
          
          // Verificar si el tiempo actual está dentro del rango del servicio
          if (slotTimeInMinutes >= slotStartInMinutes && slotTimeInMinutes < slotEndInMinutes) {
            // Si coincide, agregar el servicio a la lista de slots
            // Solo si es el tiempo de inicio, para evitar duplicados
            if (slotTimeInMinutes === slotStartInMinutes) {
              // Asegurarse de que la duración visual sea correcta
              if (!slotValue.visualHeight) {
                // Calcular la altura visual basada en la duración total
                const totalDurationMinutes = slotValue.totalDuration || 
                  (slotValue.endTime ? this.calculateDurationMinutes(slotValue.time, slotValue.endTime) : 0);
                
                // Crear una copia del slot con la altura visual correcta
                const slotWithHeight = { 
                  ...slotValue,
                  duration: this.getServiceHeight(totalDurationMinutes),
                  isExistingBooking: false, // Asegurar que no es una reserva existente
                  isNewBooking: true // Marcar como nuevo agendamiento
                };
                slots.push(slotWithHeight);
              } else {
                slots.push({
                  ...slotValue,
                  isExistingBooking: false,
                  isNewBooking: true
                });
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
    getServiceColor(slot) {
      // Si es un agendamiento existente (de la API), usar el color morado
      if (slot.isExistingBooking) {
        return '#673ab7'; // Color morado para agendamientos existentes
      }
      
      // Para nuevos agendamientos (que está creando el usuario), usar el color azul
      return '#2196f3'; // Color azul del tema para nuevos agendamientos
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
      // Verificar si el horario está disponible
      if (!this.isTimeAvailable(date, time)) {
        const messages = {
          'pt': 'Este horário não está disponível para agendamento.',
          'es': 'Este horario no está disponible para agendar.',
          'en': 'This time slot is not available for booking.'
        };
        this.$emit('show-notification', messages[this.locale] || messages.pt, 'error');
        return;
      }
      
      this.$emit('time-click', date, time);
    },
    onDrop(event, date, time) {
      event.preventDefault();
      
      // Obtener datos del servicio
      const serviceData = JSON.parse(event.dataTransfer.getData("text/plain"));
      
      // Calcular la hora de fin basada en la duración
      const [startHour, startMinute] = time.split(':').map(Number);
      const endTime = this.calculateEndTime(time, serviceData.duration);
      
      // Verificar si el horario está disponible
      if (!this.isTimeAvailable(date, time)) {
        const messages = {
          'pt': 'Não é possível agendar neste horário porque já está ocupado.',
          'es': 'No se puede agendar en este horario porque ya está ocupado.',
          'en': 'Cannot schedule at this time because it is already booked.'
        };
        this.$emit('show-notification', messages[this.locale] || messages.pt, 'error');
        return;
      }
      
      // Crear objeto con los datos de la reserva
      const bookingData = {
        date: this.formatDateISO(date),
        startTime: time,
        endTime: endTime,
        serviceId: serviceData.id,
        aestheticianId: this.selectedAesthetician?.id
      };
      
      // Emitir evento para validar disponibilidad
      this.$emit('validate-availability', bookingData, (isAvailable) => {
        if (isAvailable) {
          // Si está disponible, permitir el drop
          this.$emit('drop-service', serviceData, date, time);
        } else {
          const messages = {
            'pt': 'Não é possível agendar neste horário porque já está ocupado.',
            'es': 'No se puede agendar en este horario porque ya está ocupado.',
            'en': 'Cannot schedule at this time because it is already booked.'
          };
          this.$emit('show-notification', messages[this.locale] || messages.pt, 'error');
        }
      });
    },
    
    calculateEndTime(startTime, durationMinutes) {
      const [hours, minutes] = startTime.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes + durationMinutes;
      
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      
      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    },
    isSlotFromExistingBookings(slot) {
      // Un slot es existente si tiene la propiedad isExistingBooking y NO es un nuevo agendamiento
      return slot.isExistingBooking === true && slot.isNewBooking !== true;
    }
  }
};
</script>

<style scoped>
.calendar-mobile-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}

.calendar-days-header {
  display: grid;
  grid-template-columns: 60px repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
}

.calendar-day-header {
  padding: 8px 4px;
  text-align: center;
  border-right: 1px solid #d8cded;
  font-size: 0.9rem;
}

.calendar-scroll-container {
  display: grid;
  grid-template-columns: 60px 1fr;
  height: 600px;
  overflow-y: auto;
  min-width: 0; /* Importante para que el contenido se ajuste */
}

.calendar-hours {
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

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  min-width: 0; /* Importante para que el contenido se ajuste */
  width: 100%;
}

.calendar-day-column {
  border-right: 1px solid #d8cded;
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
  pointer-events: none;
}

/* Estilos dinámicos para días no disponibles */
.calendar-day-column[data-day="0"] .calendar-time-cell {
  background-color: rgba(0, 0, 0, 0.05);
}

.calendar-day-column[data-day="0"] .calendar-time-cell::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.05) 5px,
    rgba(0, 0, 0, 0.05) 10px
  );
  pointer-events: none;
}

/* Estilos para horarios fuera de rango */
.calendar-time-cell.out-of-hours {
  background-color: rgba(0, 0, 0, 0.05);
}

.calendar-time-cell.out-of-hours::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.05) 5px,
    rgba(0, 0, 0, 0.05) 10px
  );
  pointer-events: none;
}

.calendar-selected-service {
  position: absolute;
  top: 0;
  left: 1px;
  right: 1px;
  background-color: #673ab7;
  color: white;
  border-radius: 4px;
  padding: 2px 4px;
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

.selected-service-time,
.selected-service-duration {
  font-size: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .calendar-days-header {
    grid-template-columns: 40px repeat(7, minmax(0, 1fr));
  }

  .calendar-scroll-container {
    grid-template-columns: 40px 1fr;
  }

  .calendar-day-header {
    font-size: 0.8rem;
    padding: 4px 2px;
  }

  .selected-service-name {
    font-size: 0.65rem;
  }

  .selected-service-time,
  .selected-service-duration {
    font-size: 0.55rem;
  }
}
</style>