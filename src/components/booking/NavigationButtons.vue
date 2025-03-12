<template>
  <div class="d-flex justify-content-between mt-3">
    <button 
      class="btn btn-back" 
      @click="prev"
      v-if="showPrevButton"
    >
      <i class="fas fa-arrow-left me-2"></i>
      {{ prevText }}
    </button>
    <div v-else></div>
    
    <button 
      class="btn btn-next" 
      :disabled="disabled"
      @click="next"
    >
      {{ nextText }}
      <i class="fas fa-arrow-right ms-2" v-if="!isConfirmButton"></i>
      <i class="fas fa-check ms-2" v-else></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NavigationButtons',
  props: {
    prevText: {
      type: String,
      default: 'Anterior'
    },
    nextText: {
      type: String,
      default: 'Siguiente'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showPrevButton: {
      type: Boolean,
      default: true
    },
    isConfirmButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['next', 'prev'],
  methods: {
    next() {
      this.$emit('next');
    },
    prev() {
      this.$emit('prev');
    }
  }
};
</script>

<style scoped>
.btn-back {
  background-color: transparent;
  border: 1px solid #e0e0e0;
  color: #666;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background-color: #f5f5f5;
  color: #333;
}

.btn-next {
  background-color: #9c27b0;
  border-color: #9c27b0;
  color: white;
  transition: all 0.3s ease;
}

.btn-next:hover:not(:disabled) {
  background-color: #7b1fa2;
  border-color: #7b1fa2;
  box-shadow: 0 4px 8px rgba(156, 39, 176, 0.3);
}

.btn-next:disabled {
  background-color: #e1bee7;
  border-color: #e1bee7;
  cursor: not-allowed;
}
</style>