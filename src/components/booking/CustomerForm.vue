<template>
  <div class="customer-form-container">
    <div class="form-header">
      <h2 class="form-title">Tus datos</h2>
      <p class="form-subtitle">Completa tus datos para confirmar la reserva</p>
    </div>

    <form @submit.prevent="handleSubmit" class="customer-form">
      <div class="form-section">
        <h3 class="section-title">Información personal</h3>
        <div class="form-group">
          <label for="name" class="form-label">Nombre completo</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            class="form-input"
            placeholder="Ingresa tu nombre completo"
            required
          >
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            class="form-input"
            placeholder="ejemplo@correo.com"
            required
          >
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Teléfono</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone" 
            class="form-input"
            placeholder="(123) 456-7890"
            required
          >
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Preferencias</h3>
        <div class="form-group">
          <label for="notes" class="form-label">Notas adicionales</label>
          <textarea 
            id="notes" 
            v-model="formData.notes" 
            class="form-textarea"
            placeholder="Alergias, preferencias o cualquier información relevante"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">¿Cómo te gustaría recibir la confirmación?</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="formData.notifications.email"
                class="checkbox-input"
              >
              <span class="checkbox-text">Correo electrónico</span>
            </label>
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="formData.notifications.sms"
                class="checkbox-input"
              >
              <span class="checkbox-text">SMS</span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="$emit('prev')">
          <i class="fas fa-arrow-left"></i> Volver
        </button>
        <button type="submit" class="btn btn-primary">
          Confirmar reserva <i class="fas fa-check"></i>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CustomerForm',
  props: {
    customerData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-customer', 'submit', 'prev'],
  data() {
    return {
      formData: {
        name: this.customerData.name || '',
        birthdate: this.customerData.birthdate || '',
        nif: this.customerData.nif || '',
        email: this.customerData.email || '',
        message: this.customerData.message || '',
        acceptedTerms: this.customerData.acceptedTerms || false,
        phone: this.customerData.phone || '',
        notes: this.customerData.notes || '',
        notifications: {
          email: this.customerData.notifications?.email || false,
          sms: this.customerData.notifications?.sms || false
        }
      },
      submitted: false
    };
  },
  watch: {
    formData: {
      handler(newVal) {
        this.$emit('update-customer', newVal);
      },
      deep: true
    }
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      
      // Validar campos obligatorios
      if (this.formData.name && 
          this.formData.birthdate && 
          this.formData.nif && 
          this.formData.email &&
          this.formData.acceptedTerms &&
          this.formData.phone &&
          this.formData.notifications.email) {
        this.$emit('submit');
      } else {
        // Scroll hasta el primer campo inválido
        this.$nextTick(() => {
          const invalidInput = document.querySelector('.is-invalid');
          if (invalidInput) {
            invalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            invalidInput.focus();
          }
        });
      }
    },
    prev() {
      this.$emit('prev');
    },
    // Método para validar NIF/NIE (implementación básica)
    isValidNIF(nif) {
      // Aquí podríamos implementar una validación más completa
      return nif && nif.length >= 8;
    },
    // Método para validar email (implementación básica)
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
};
</script>

<style scoped>
.customer-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-title {
  font-size: 2rem;
  color: #1a237e;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-subtitle {
  font-size: 1.1rem;
  color: #5c6bc0;
  margin: 0;
}

.form-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f5f6ff;
  border-radius: 8px;
  border: 1px solid #e8eaf6;
}

.section-title {
  font-size: 1.25rem;
  color: #1a237e;
  margin-bottom: 1.5rem;
  font-weight: 500;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e8eaf6;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.95rem;
  color: #3949ab;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #c5cae9;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  color: #1a237e;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #5c6bc0;
  box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  border: 2px solid #c5cae9;
  border-radius: 4px;
  cursor: pointer;
  accent-color: #5c6bc0;
}

.checkbox-text {
  font-size: 0.95rem;
  color: #3949ab;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background: #5c6bc0;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #3949ab;
}

.btn-secondary {
  background: #f5f6ff;
  color: #3949ab;
  border: 1px solid #c5cae9;
}

.btn-secondary:hover {
  background: #e8eaf6;
}

@media (max-width: 768px) {
  .customer-form-container {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .form-subtitle {
    font-size: 1rem;
  }

  .form-section {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .checkbox-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>