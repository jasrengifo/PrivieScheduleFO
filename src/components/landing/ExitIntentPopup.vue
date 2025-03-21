<template>
  <div class="exit-popup-overlay" @click="closePopup">
    <div class="exit-popup" @click.stop>
      <button class="close-btn" @click="closePopup">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="popup-content">
        <img src="https://picsum.photos/id/180/200/200" alt="Oferta especial" class="popup-image">
        <h3>¡Espera un momento!</h3>
        <h4>No pierdas esta oportunidad</h4>
        <p>Regístrate ahora y recibe un <strong>15% de descuento</strong> en tu primer mes de suscripción.</p>
        
        <form class="popup-form" @submit.prevent="submitForm">
          <div class="form-group">
            <input type="email" v-model="email" placeholder="Tu correo electrónico" required>
          </div>
          <button type="submit" class="submit-btn">
            <span v-if="!isSubmitting">Obtener mi descuento</span>
            <div v-else class="spinner"></div>
          </button>
        </form>
        
        <div class="guarantee">
          <i class="fas fa-shield-alt"></i>
          <span>Sin compromisos. Cancela cuando quieras.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExitIntentPopup',
  data() {
    return {
      email: '',
      isSubmitting: false
    }
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    async submitForm() {
      this.isSubmitting = true;
      
      try {
        // Simular envío de formulario
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Almacenar el lead en local storage
        localStorage.setItem('leadCaptured', 'true');
        localStorage.setItem('leadEmail', this.email);
        
        // Mostrar mensaje de éxito
        alert('¡Gracias! Tu código de descuento ha sido enviado a tu correo.');
        this.closePopup();
      } catch (error) {
        console.error('Error submitting form', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>
.exit-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.exit-popup {
  background: white;
  width: 500px;
  max-width: 90%;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: scaleIn 0.4s ease;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #0f172a;
}

.popup-content {
  padding: 30px;
  text-align: center;
}

.popup-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 5px solid #f8fafc;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.popup-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #7e22ce;
  margin-bottom: 10px;
}

.popup-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 15px;
}

.popup-content p {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 25px;
  padding: 0 15px;
}

.popup-content p strong {
  color: #f59e0b;
  font-weight: 700;
}

.popup-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  border-color: #7e22ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(126, 34, 206, 0.15);
}

.submit-btn {
  width: 100%;
  padding: 12px 15px;
  background: linear-gradient(90deg, #f59e0b, #ea580c);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(245, 158, 11, 0.2);
}

.guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.85rem;
}

.guarantee i {
  margin-right: 8px;
  color: #10b981;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 