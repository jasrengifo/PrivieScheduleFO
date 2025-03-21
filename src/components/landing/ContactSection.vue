<template>
  <section class="contact-section py-5" ref="contactSection">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h2 class="section-title">Hablemos sobre tu Negocio</h2>
          <p class="section-subtitle">Estamos aquí para resolver tus dudas y ayudarte a potenciar tu salón de belleza</p>
        </div>
      </div>
      
      <div class="row g-4">
        <div class="col-lg-5 mb-4 mb-lg-0">
          <div class="contact-info" ref="contactInfo">
  
            
            <div class="info-card" v-for="(item, index) in contactInfo" :key="index">
              <div class="info-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="info-content">
                <h4>{{ item.title }}</h4>
                <p v-html="item.content"></p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-7">
          <div class="contact-form-container" ref="formContainer">
            <form class="contact-form" @submit.prevent="submitForm">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      type="text" 
                      class="form-control" 
                      id="name" 
                      placeholder="Tu nombre" 
                      v-model="formData.name"
                      :class="{'is-invalid': errors.name}"
                      required
                    >
                    <label for="name">Nombre completo</label>
                    <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      placeholder="Tu email" 
                      v-model="formData.email"
                      :class="{'is-invalid': errors.email}"
                      required
                    >
                    <label for="email">Correo electrónico</label>
                    <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      placeholder="Tu teléfono" 
                      v-model="formData.phone"
                      :class="{'is-invalid': errors.phone}"
                    >
                    <label for="phone">Teléfono (opcional)</label>
                    <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-floating">
                    <select 
                      class="form-select" 
                      id="businessType" 
                      v-model="formData.businessType"
                      required
                    >
                      <option value="" disabled selected>Seleccionar...</option>
                      <option v-for="(type, index) in businessTypes" :key="index" :value="type">
                        {{ type }}
                      </option>
                    </select>
                    <label for="businessType">Tipo de negocio</label>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="form-floating">
                    <select 
                      class="form-select" 
                      id="interest" 
                      v-model="formData.interest"
                      required
                    >
                      <option value="" disabled selected>Seleccionar...</option>
                      <option v-for="(option, index) in interestOptions" :key="index" :value="option">
                        {{ option }}
                      </option>
                    </select>
                    <label for="interest">¿Qué te interesa?</label>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="form-floating">
                    <textarea 
                      class="form-control" 
                      id="message" 
                      placeholder="Tu mensaje" 
                      v-model="formData.message"
                      :class="{'is-invalid': errors.message}"
                      style="height: 120px"
                      required
                    ></textarea>
                    <label for="message">¿Cómo podemos ayudarte?</label>
                    <div class="invalid-feedback" v-if="errors.message">{{ errors.message }}</div>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="form-check privacy-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="privacyPolicy" 
                      v-model="formData.privacyAccepted"
                      :class="{'is-invalid': errors.privacy}"
                      required
                    >
                    <label class="form-check-label" for="privacyPolicy">
                      Acepto la <a href="#">política de privacidad</a> y el tratamiento de mis datos
                    </label>
                    <div class="invalid-feedback" v-if="errors.privacy">{{ errors.privacy }}</div>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="form-buttons">
                    <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
                      <span v-if="!isSubmitting">Enviar Mensaje</span>
                      <div v-else class="spinner-border spinner-border-sm text-light mx-2" role="status">
                        <span class="visually-hidden">Enviando...</span>
                      </div>
                    </button>
                  </div>
                  <p class="response-message text-center mt-3" :class="responseStatus">{{ responseMessage }}</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div class="row mt-5">
        <div class="col-12">
          <div class="map-container">
            <div class="map-overlay">
              <h4>Nuestra Oficina Central</h4>
              <p>Calle Innovación 123, 28001 Madrid, España</p>
              <button class="btn btn-sm btn-light mt-2" @click="loadMap">
                <i class="fas fa-map-marker-alt me-2"></i>Ver en el mapa
              </button>
            </div>
            <iframe 
              class="location-map" 
              src="about:blank" 
              ref="mapFrame"
              width="100%" 
              height="300" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy"
              v-show="mapLoaded"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContactSection',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        businessType: '',
        interest: '',
        message: '',
        privacyAccepted: false
      },
      isSubmitting: false,
      errors: {},
      responseMessage: '',
      responseStatus: '',
      mapLoaded: false,
      contactInfo: [
        {
          icon: 'fas fa-headset',
          title: 'Soporte al Cliente',
          content: 'Lunes a Viernes: 9:00 - 18:00<br>Email: soporte@tuapp.com<br>Teléfono: +34 91 123 4567'
        },
        {
          icon: 'fas fa-briefcase',
          title: 'Departamento Comercial',
          content: 'Para consultas sobre planes y precios:<br>Email: ventas@tuapp.com<br>Teléfono: +34 91 123 4568'
        },
        {
          icon: 'fas fa-handshake',
          title: 'Alianzas y Colaboraciones',
          content: 'Interesado en ser partner:<br>Email: partners@tuapp.com'
        }
      ],
      socialMedia: [
        { icon: 'fab fa-facebook-f', url: '#' },
        { icon: 'fab fa-instagram', url: '#' },
        { icon: 'fab fa-linkedin-in', url: '#' },
        { icon: 'fab fa-twitter', url: '#' }
      ],
      businessTypes: [
        'Salón de belleza',
        'Spa',
        'Peluquería',
        'Barbería',
        'Centro de estética',
        'Uñas y manicura',
        'Centro de masajes',
        'Otro'
      ],
      interestOptions: [
        'Conocer más sobre la plataforma',
        'Solicitar una demostración personalizada',
        'Información sobre precios y planes',
        'Soporte técnico',
        'Otro'
      ]
    }
  },
  mounted() {
    this.animateElements();
  },
  methods: {
    animateElements() {
      // Animación para los elementos del formulario cuando entran en viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === this.$refs.contactInfo) {
              entry.target.classList.add('animated');
            } else if (entry.target === this.$refs.formContainer) {
              entry.target.classList.add('animated');
            }
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(this.$refs.contactInfo);
      observer.observe(this.$refs.formContainer);
    },
    validateForm() {
      this.errors = {};
      let isValid = true;
      
      // Validación de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.formData.email && !emailRegex.test(this.formData.email)) {
        this.errors.email = 'Por favor, introduce un correo electrónico válido';
        isValid = false;
      }
      
      // Validación de teléfono (opcional)
      const phoneRegex = /^(\+\d{1,3})?\s?\d{9,}$/;
      if (this.formData.phone && !phoneRegex.test(this.formData.phone)) {
        this.errors.phone = 'Por favor, introduce un número de teléfono válido';
        isValid = false;
      }
      
      // Validación de campos requeridos
      if (!this.formData.name.trim()) {
        this.errors.name = 'El nombre es obligatorio';
        isValid = false;
      }
      
      if (!this.formData.message.trim()) {
        this.errors.message = 'Por favor, escribe tu mensaje';
        isValid = false;
      }
      
      if (!this.formData.privacyAccepted) {
        this.errors.privacy = 'Debes aceptar la política de privacidad';
        isValid = false;
      }
      
      return isValid;
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        // Simulación de envío de formulario (reemplazar con llamada API real)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulación de respuesta exitosa
        this.responseMessage = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
        this.responseStatus = 'text-success';
        
        // Resetear formulario después de envío exitoso
        this.formData = {
          name: '',
          email: '',
          phone: '',
          businessType: '',
          interest: '',
          message: '',
          privacyAccepted: false
        };
        
      } catch (error) {
        // Manejo de error
        this.responseMessage = 'Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.';
        this.responseStatus = 'text-danger';
        console.error('Error sending form:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    loadMap() {
      // Cargar iframe de Google Maps solo cuando el usuario lo solicite
      this.$refs.mapFrame.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12144.53173462213!2d-3.7031!3d40.4169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sMadrid%2C%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1637300000000!5m2!1ses!2ses";
      this.mapLoaded = true;
    }
  }
}
</script>

<style scoped>
.contact-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e8f1fb 100%);
  position: relative;
  overflow: hidden;
  color: #334155;
}

.contact-section::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: 
    radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 85% 85%, rgba(192, 132, 252, 0.05) 0%, transparent 50%);
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  background: linear-gradient(90deg, #0284c7, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto 20px;
}

/* Información de contacto */
.contact-info {
  transform: translateX(-50px);
  opacity: 0;
  transition: all 0.8s ease;
}

.contact-info.animated {
  transform: translateX(0);
  opacity: 1;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: flex-start;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.welcome-card {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  color: white;
  display: block;
  padding: 30px;
  border: none;
}

.welcome-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.welcome-card p {
  opacity: 0.9;
  margin-bottom: 20px;
  font-size: 1.05rem;
}

.info-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  font-size: 22px;
  box-shadow: 0 8px 16px rgba(14, 165, 233, 0.2);
}

.info-content {
  flex-grow: 1;
}

.info-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #1e293b;
}

.info-content p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 0;
}

.satisfaction-badge {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  padding: 10px 15px;
  display: inline-flex;
  align-items: center;
  backdrop-filter: blur(8px);
}

.rating-stars {
  color: #fcd34d;
  margin-right: 10px;
}

.rating-stars i {
  margin-right: 2px;
}

.social-media {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
}

.social-media h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1e293b;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  width: 44px;
  height: 44px;
  background: #f1f5f9;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: #334155;
  font-size: 18px;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: #0ea5e9;
  color: white;
  transform: translateY(-3px);
}

/* Formulario de contacto */
.contact-form-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transform: translateY(50px);
  opacity: 0;
  transition: all 0.8s ease;
}

.contact-form-container.animated {
  transform: translateY(0);
  opacity: 1;
}

.form-floating {
  margin-bottom: 0;
}

.form-control, .form-select {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem 0.75rem;
  height: calc(3.5rem + 2px);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 0.2rem rgba(14, 165, 233, 0.15);
}

.form-control.is-invalid, .form-select.is-invalid {
  border-color: #ef4444;
  background-image: none;
}

.form-floating > label {
  padding: 1rem 0.75rem;
}

.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label,
.form-floating > .form-select ~ label {
  transform: scale(0.85) translateY(-0.75rem) translateX(0.15rem);
  color: #0ea5e9;
}

textarea.form-control {
  min-height: 120px;
}

.privacy-check {
  margin-top: 10px;
}

.form-check-label {
  font-size: 0.95rem;
  color: #64748b;
}

.form-check-label a {
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 500;
}

.form-check-label a:hover {
  text-decoration: underline;
}

.form-check-input:checked {
  background-color: #0ea5e9;
  border-color: #0ea5e9;
}

.form-buttons {
  margin-top: 20px;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
  border: none;
  padding: 12px 40px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  color: white;
  min-width: 200px;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(14, 165, 233, 0.2);
  background: linear-gradient(90deg, #0284c7, #7c3aed);
}

.btn-primary:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  transform: none;
}

.response-message {
  font-weight: 600;
  margin-top: 20px;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Mapa */
.map-container {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
}

.location-map {
  width: 100%;
  height: 300px;
  border: none;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  transition: all 0.5s ease;
  z-index: 10;
}

.map-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.map-overlay h4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.map-overlay p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 15px;
}

/* Estilos Responsive */
@media (max-width: 991.98px) {
  .section-title {
    font-size: 2.2rem;
  }
  
  .contact-form-container {
    padding: 30px;
  }
  
  .info-card, .social-media {
    padding: 20px;
  }
  
  .welcome-card {
    padding: 25px;
  }
  
  .info-icon {
    width: 45px;
    height: 45px;
    min-width: 45px;
    font-size: 20px;
  }
}

@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .contact-form-container {
    padding: 25px 20px;
  }
  
  .welcome-card h3 {
    font-size: 1.3rem;
  }
  
  .welcome-card p {
    font-size: 1rem;
  }
  
  .info-content h4 {
    font-size: 1.1rem;
  }
  
  .btn-primary {
    padding: 10px 30px;
    min-width: 180px;
  }
  
  .map-overlay h4 {
    font-size: 1.3rem;
  }
  
  .map-overlay p {
    font-size: 1rem;
  }
}
</style>