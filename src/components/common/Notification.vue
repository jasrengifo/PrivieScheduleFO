<template>
  <div 
    v-if="show" 
    class="notification" 
    :class="[type, { 'slide-out': isClosing }]"
  >
    <div class="notification-content">
      <p class="notification-message">{{ message }}</p>
    </div>
    <button class="notification-close" @click="close">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: value => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      show: true,
      isClosing: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.close();
    }, this.duration);
  },
  methods: {
    close() {
      this.isClosing = true;
      setTimeout(() => {
        this.show = false;
        this.$emit('close');
      }, 300); // Esperar a que termine la animación
    }
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.notification.slide-out {
  animation: slideOut 0.3s ease-out forwards;
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #f44336;
}

.notification.warning {
  background-color: #ff9800;
}

.notification.info {
  background-color: #2196f3;
}

.notification-content {
  flex: 1;
}

.notification-message {
  margin: 0;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.notification-close:hover {
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style> 