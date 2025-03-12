<template>
    <div>
      <h2 class="h4 mb-4 text-center">Tus datos</h2>
      
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Procesando...</span>
        </div>
        <p class="mt-2">Guardando información...</p>
      </div>
      
      <form v-else @submit.prevent="submitForm">
        <div class="mb-3 text-start">
          <label for="name" class="form-label">Nombre completo*</label>
          <input 
            type="text" 
            class="form-control" 
            id="name" 
            v-model="formData.name"
            :class="{ 'is-invalid': submitted && !formData.name }"
            required
          >
          <div v-if="submitted && !formData.name" class="invalid-feedback">
            El nombre es obligatorio
          </div>
        </div>
        
        <div class="mb-3">
          <label for="birthdate" class="form-label">Fecha de nacimiento*</label>
          <input 
            type="date" 
            class="form-control" 
            id="birthdate" 
            v-model="formData.birthdate"
            :class="{ 'is-invalid': submitted && !formData.birthdate }"
            required
          >
          <div v-if="submitted && !formData.birthdate" class="invalid-feedback">
            La fecha de nacimiento es obligatoria
          </div>
        </div>
        
        <div class="mb-3">
          <label for="nif" class="form-label">NIF/NIE*</label>
          <input 
            type="text" 
            class="form-control" 
            id="nif" 
            v-model="formData.nif"
            :class="{ 'is-invalid': submitted && !formData.nif }"
            placeholder="Ej: 12345678Z"
            required
          >
          <div v-if="submitted && !formData.nif" class="invalid-feedback">
            El NIF/NIE es obligatorio
          </div>
        </div>
        
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico*</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            v-model="formData.email"
            :class="{ 'is-invalid': submitted && !formData.email }"
            placeholder="ejemplo@correo.com"
            required
          >
          <div v-if="submitted && !formData.email" class="invalid-feedback">
            El correo electrónico es obligatorio
          </div>
          <div class="form-text">
            Recibirás un correo de confirmación con los detalles de tu cita
          </div>
        </div>
        
        <div class="mb-4">
          <label for="message" class="form-label">Mensaje (opcional)</label>
          <textarea 
            class="form-control" 
            id="message" 
            v-model="formData.message"
            rows="3"
            placeholder="Información adicional para el tratamiento"
          ></textarea>
        </div>
        
        <div class="form-check mb-4">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="privacy-policy" 
            v-model="formData.acceptedTerms"
            :class="{ 'is-invalid': submitted && !formData.acceptedTerms }"
            required
          >
          <label class="form-check-label" for="privacy-policy">
            Acepto la política de privacidad y los términos de servicio*
          </label>
          <div v-if="submitted && !formData.acceptedTerms" class="invalid-feedback">
            Debes aceptar la política de privacidad para continuar
          </div>
        </div>

        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-back" @click="prev">
            <i class="fas fa-arrow-left me-2"></i>
            Anterior
          </button>
          
          <button 
            class="btn btn-next" 
            :disabled="loading"
            type="submit"
          >
          Confirmar
          <i class="fas fa-check ms-2"></i>
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
          acceptedTerms: this.customerData.acceptedTerms || false
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
      submitForm() {
        this.submitted = true;
        
        // Validar campos obligatorios
        if (this.formData.name && 
            this.formData.birthdate && 
            this.formData.nif && 
            this.formData.email &&
            this.formData.acceptedTerms) {
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
  .form-control:focus {
    border-color: #6c757d;
    box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.25);
  }
  
  .form-check-input:checked {
    background-color: #198754;
    border-color: #198754;
  }
  
  .form-check-input:focus {
    border-color: #198754;
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
  }

  .btn-back {
    background-color: transparent;
    border: 1px solid #ddd;
    color: #555;
  }
  </style>