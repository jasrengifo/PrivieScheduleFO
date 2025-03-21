<template>
  <div class="floating-cta" :class="{ 'visible': isVisible }">
    <div class="cta-content">
      <span class="discount-badge">30% Dto</span>
      <div class="cta-text">
        <strong>Oferta de lanzamiento</strong>
        <span>Precios especiales por tiempo limitado</span>
      </div>
    </div>
    <div class="cta-actions">
      <button class="btn-primary">Ver Planes</button>
      <button class="btn-close" @click.stop="closeFloatingCTA">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingCTA',
  data() {
    return {
      isVisible: false
    }
  },
  mounted() {
    // Animación de entrada
    setTimeout(() => {
      this.isVisible = true;
    }, 300);
  },
  methods: {
    closeFloatingCTA() {
      this.isVisible = false;
      setTimeout(() => {
        this.$emit('close');
      }, 300);
    }
  }
}
</script>

<style scoped>
.floating-cta {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 420px;
  max-width: calc(100vw - 40px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  border-left: 4px solid #f59e0b;
}

.floating-cta.visible {
  transform: translateY(0);
  opacity: 1;
}

.cta-content {
  display: flex;
  align-items: center;
}

.discount-badge {
  background: #f59e0b;
  color: white;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-right: 15px;
}

.cta-text {
  display: flex;
  flex-direction: column;
}

.cta-text strong {
  font-size: 0.95rem;
  color: #171717;
}

.cta-text span {
  font-size: 0.8rem;
  color: #64748b;
}

.cta-actions {
  display: flex;
  align-items: center;
}

.btn-primary {
  background: #7e22ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #6b21a8;
  transform: translateY(-2px);
}

.btn-close {
  background: transparent;
  border: none;
  color: #64748b;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #334155;
}

@media (max-width: 767.98px) {
  .floating-cta {
    flex-direction: column;
    padding: 15px;
    bottom: 15px;
    right: 15px;
    width: auto;
  }
  
  .cta-content {
    margin-bottom: 10px;
    width: 100%;
  }
  
  .cta-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .btn-primary {
    flex-grow: 1;
    margin-right: 10px;
  }
}
</style> 