<template>
  <div class="initial-setup">
    <div class="setup-container">
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>
        <div class="step-indicator">
          Paso {{ currentStep }} de {{ totalSteps }}
        </div>
      </div>

      <div class="setup-content">
        <div class="welcome-section" v-if="currentStep === 1">
          <h1 class="welcome-title">¡Bienvenido a Privie!</h1>
          <p class="welcome-subtitle">Vamos a configurar tu cuenta para que puedas comenzar a gestionar tu negocio</p>
        </div>

        <div class="form-section">
          <!-- Paso 1: Nombre del negocio y NIF/NIB -->
          <div v-if="currentStep === 1" class="form-step">
            <h2>¿Cómo se llama tu negocio?</h2>
            <div class="input-group">
              <input 
                type="text" 
                v-model="formData.businessName" 
                class="form-control" 
                placeholder="Ej: Estética María"
                :class="{ 'is-invalid': errors.businessName }"
              >
              <div class="invalid-feedback" v-if="errors.businessName">
                {{ errors.businessName }}
              </div>
            </div>

            <h2 class="mt-4">NIF/NIB</h2>
            <div class="input-group">
              <input 
                type="text" 
                v-model="formData.nif" 
                class="form-control" 
                placeholder="Ej: B12345678"
              >
            </div>
          </div>

          <!-- Paso 2: Logo horizontal -->
          <div v-if="currentStep === 2" class="form-step">
            <h2>Logo horizontal de tu negocio</h2>
            <p class="help-text">Sube un logo en formato horizontal (recomendado: 800x200px)</p>
            <div class="logo-upload-container">
              <div class="logo-preview" v-if="formData.horizontalLogo">
                <img :src="formData.horizontalLogo" alt="Logo horizontal">
              </div>
              <div class="logo-upload" @click="triggerFileInput('horizontal')">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Haz clic para subir tu logo</p>
              </div>
              <input 
                type="file" 
                ref="horizontalLogoInput" 
                @change="handleLogoUpload($event, 'horizontal')" 
                accept="image/*" 
                class="d-none"
              >
              <div class="logo-example">
                <img src="/img/logo-example-horizontal.svg" alt="Ejemplo de logo horizontal">
              </div>
            </div>
          </div>

          <!-- Paso 3: Logo cuadrado -->
          <div v-if="currentStep === 3" class="form-step">
            <h2>Logo cuadrado de tu negocio</h2>
            <p class="help-text">Sube un logo en formato cuadrado (recomendado: 400x400px)</p>
            <div class="logo-upload-container">
              <div class="logo-preview" v-if="formData.squareLogo">
                <img :src="formData.squareLogo" alt="Logo cuadrado">
              </div>
              <div class="logo-upload" @click="triggerFileInput('square')">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Haz clic para subir tu logo</p>
              </div>
              <input 
                type="file" 
                ref="squareLogoInput" 
                @change="handleLogoUpload($event, 'square')" 
                accept="image/*" 
                class="d-none"
              >
              <div class="logo-example">
                <img src="/img/logo-example-square.svg" alt="Ejemplo de logo cuadrado">
              </div>
            </div>
          </div>

          <!-- Paso 4: País -->
          <div v-if="currentStep === 4" class="form-step">
            <h2>País de tu negocio</h2>
            <div class="input-group">
              <select 
                v-model="formData.country" 
                class="form-select"
                :class="{ 'is-invalid': errors.country }"
              >
                <option value="">Selecciona un país</option>
                <option v-for="country in countries" :key="country.code" :value="country.code">
                  {{ country.name }}
                </option>
              </select>
              <div class="invalid-feedback" v-if="errors.country">
                {{ errors.country }}
              </div>
            </div>
          </div>

          <!-- Paso 5: Idioma principal -->
          <div v-if="currentStep === 5" class="form-step">
            <h2>Idioma principal de tu negocio</h2>
            <div class="language-options">
              <div 
                v-for="lang in availableLanguages" 
                :key="lang.code"
                class="language-option"
                :class="{ 'selected': formData.primaryLanguage === lang.code }"
                @click="formData.primaryLanguage = lang.code"
              >
                <img :src="lang.flag" :alt="lang.name">
                <span>{{ lang.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="navigation-buttons">
          <div class="button-group">
            <button 
              v-if="currentStep > 1" 
              class="btn btn-back" 
              @click="prevStep"
            >
              <i class="fas fa-arrow-left"></i>
              <span>Anterior</span>
            </button>
            <button 
              class="btn btn-skip" 
              @click="skipSetup"
            >
              <i class="fas fa-clock"></i>
              <span>Configurar más tarde</span>
            </button>
          </div>
          <button 
            class="btn btn-next" 
            @click="nextStep"
            :disabled="!canProceed"
          >
            <span>{{ currentStep === totalSteps ? 'Finalizar' : 'Siguiente' }}</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InitialSetup',
  data() {
    return {
      currentStep: 1,
      totalSteps: 5,
      formData: {
        businessName: '',
        horizontalLogo: null,
        squareLogo: null,
        nif: '',
        country: '',
        primaryLanguage: ''
      },
      errors: {},
      countries: [
        { code: 'ES', name: 'España' },
        { code: 'PT', name: 'Portugal' },
        { code: 'FR', name: 'Francia' },
        { code: 'DE', name: 'Alemania' },
        { code: 'IT', name: 'Italia' },
        { code: 'UK', name: 'Reino Unido' }
      ],
      availableLanguages: [
        { code: 'es', name: 'Español', flag: '/img/flags/es.png' },
        { code: 'en', name: 'English', flag: '/img/flags/en.png' },
        { code: 'pt', name: 'Português', flag: '/img/flags/pt.png' }
      ]
    }
  },
  computed: {
    canProceed() {
      switch(this.currentStep) {
        case 1:
          return this.formData.businessName.length >= 3
        case 2:
          return !!this.formData.horizontalLogo
        case 3:
          return !!this.formData.squareLogo
        case 4:
          return !!this.formData.country
        case 5:
          return !!this.formData.primaryLanguage
        default:
          return false
      }
    }
  },
  methods: {
    triggerFileInput(type) {
      this.$refs[`${type}LogoInput`].click()
    },
    handleLogoUpload(event, type) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = e => {
          this.formData[`${type}Logo`] = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
      } else {
        this.completeSetup()
      }
    },
    completeSetup() {
      // Aquí iría la lógica para guardar los datos
      this.$router.push('/business-profile')
    },
    skipSetup() {
      // Aquí podrías mostrar un modal de confirmación
      if (confirm('¿Estás seguro? Podrás configurar estos detalles más tarde desde tu panel de control.')) {
        this.$router.push('/business-profile')
      }
    }
  }
}
</script>

<style scoped>
.initial-setup {
  min-height: 100vh;
  background: linear-gradient(135deg, #7e22ce 0%, #581c87 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.setup-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.progress-section {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #7e22ce, #581c87);
  transition: width 0.3s ease;
}

.step-indicator {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-title {
  color: #1a237e;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.welcome-subtitle {
  color: #5c6bc0;
  font-size: 1.2rem;
}

.form-step {
  margin-bottom: 2rem;
}

.form-step h2 {
  color: #1a237e;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.help-text {
  color: #5c6bc0;
  margin-bottom: 1rem;
}

.logo-upload-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.logo-upload {
  border: 2px dashed #5c6bc0;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-upload:hover {
  background: #f5f6ff;
  border-color: #7e22ce;
}

.logo-upload i {
  font-size: 2rem;
  color: #5c6bc0;
  margin-bottom: 1rem;
}

.logo-preview {
  border-radius: 10px;
  overflow: hidden;
  background: #f5f6ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.logo-example {
  grid-column: 1 / -1;
  text-align: center;
}

.logo-example img {
  max-width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.language-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.language-option {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-option:hover {
  border-color: #5c6bc0;
  background: #f5f6ff;
}

.language-option.selected {
  border-color: #7e22ce;
  background: #f5f6ff;
}

.language-option img {
  width: 40px;
  height: 40px;
  margin-bottom: 0.5rem;
  border-radius: 50%;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.6rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn i {
  font-size: 0.9rem;
}

.btn-back {
  background: transparent;
  border: 1px solid #5c6bc0;
  color: #5c6bc0;
}

.btn-back:hover {
  background: #f5f6ff;
}

.btn-skip {
  background: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-skip:hover {
  background: #f8f9fa;
  border-color: #5a6268;
  color: #5a6268;
}

.btn-next {
  background: linear-gradient(90deg, #7e22ce, #581c87);
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
}

.btn-next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(126, 34, 206, 0.3);
}

.btn-next:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .initial-setup {
    padding: 1rem;
  }

  .setup-container {
    padding: 1.5rem;
  }

  .logo-upload-container {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .navigation-buttons {
    flex-direction: column;
    gap: 0.8rem;
  }

  .button-group {
    width: 100%;
    justify-content: space-between;
  }

  .btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }

  .btn-next {
    width: 100%;
    justify-content: center;
  }
}
</style> 