<template>
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
</template>

<script>
export default {
  name: 'WeekSelector',
  props: {
    currentWeekStart: {
      type: Date,
      required: true
    }
  },
  emits: ['update-week'],
  computed: {
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
    previousWeek() {
      const newDate = new Date(this.currentWeekStart);
      newDate.setDate(newDate.getDate() - 7);
      
      this.$emit('update-week', newDate);
    },
    nextWeek() {
      const newDate = new Date(this.currentWeekStart);
      newDate.setDate(newDate.getDate() + 7);
      
      this.$emit('update-week', newDate);
    }
  }
};
</script>