<template>
  <section class="contact-section py-5" id="contact" ref="contactSection">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h2 class="section-title">{{ contactTitle }}</h2>
          <p class="section-subtitle">{{ contactSubtitle }}</p>
              </div>
            </div>
            
      <div class="row g-4">
        <div class="col-lg-5 mb-4 mb-lg-0 order-2 order-lg-1">
          <div class="contact-info" ref="contactInfo">
            <div class="info-card welcome-card">
              <div class="info-card-content">
                <h3>{{ welcomeTitle }}</h3>
                <p>{{ welcomeDescription }}</p>
                <div class="satisfaction-badge">
                  <div class="rating-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span>{{ satisfactionRating }}</span>
              </div>
              </div>
            </div>
            
            <div class="info-card" v-for="(item, index) in contactInfoItems" :key="index">
              <div class="info-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="info-content">
                <h4>{{ item.title }}</h4>
                <p>
                  {{ item.intro }}<br/>
                  {{ item.emailPrefix }}@{{ item.emailDomain }}<br/>
                  <template v-if="item.phone">{{ item.phone }}</template>
                </p>
            </div>
          </div>
          
          </div>
        </div>
        
        <div class="col-lg-7 order-1 order-lg-2">
          <div class="contact-form-container" ref="formContainer">
            <form v-if="!formSubmitted" class="contact-form" @submit.prevent="submitForm">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      type="text" 
                      class="form-control" 
                      id="name" 
                      :placeholder="formPlaceholders.name" 
                      v-model="formData.name"
                      :class="{'is-invalid': errors.name}"
                      required
                      @focus="trackFieldFocus('name')"
                    >
                    <label for="name">{{ formLabels.name }}</label>
                    <div class="invalid-feedback" v-if="errors.name">{{ formErrors.name }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      :placeholder="formPlaceholders.email" 
                      v-model="formData.email"
                      :class="{'is-invalid': errors.email}"
                      required
                      @focus="trackFieldFocus('email')"
                    >
                    <label for="email">{{ formLabels.email }}</label>
                    <div class="invalid-feedback" v-if="errors.email">{{ formErrors.email }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      :placeholder="formPlaceholders.phone" 
                      v-model="formData.phone"
                      :class="{'is-invalid': errors.phone}"
                      @focus="trackFieldFocus('phone')"
                    >
                    <label for="phone">{{ formLabels.phone }}</label>
                    <div class="invalid-feedback" v-if="errors.phone">{{ formErrors.phone }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-floating">
                    <select 
                      class="form-select" 
                      id="businessType" 
                      v-model="formData.business_type_id"
                      required
                      @change="trackFieldFocus('businessType')"
                    >
                      <option value="" disabled selected>{{ formPlaceholders.businessType }}</option>
                      <option 
                        v-for="type in businessTypes" 
                        :key="type.id" 
                        :value="type.id"
                      >
                        {{ type.translations[locale]?.name || type.translations['en'].name }}
                      </option>
                    </select>
                    <label for="businessType">{{ formLabels.businessType }}</label>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="form-floating">
                    <select 
                      class="form-select" 
                      id="interest" 
                      v-model="formData.interest_id"
                      required
                      @change="trackFieldFocus('interest')"
                    >
                      <option value="" disabled selected>{{ formPlaceholders.interest }}</option>
                      <option 
                        v-for="interest in interests" 
                        :key="interest.id" 
                        :value="interest.id"
                      >
                        {{ interest.translations[locale]?.name || interest.translations['en'].name }}
                      </option>
                    </select>
                    <label for="interest">{{ formLabels.interest }}</label>
                  </div>
              </div>
              
                <div class="col-12">
                  <div class="form-floating">
                    <textarea 
                      class="form-control" 
                      id="message" 
                      :placeholder="formPlaceholders.message" 
                      v-model="formData.message"
                      :class="{'is-invalid': errors.message}"
                      style="height: 120px"
                      required
                      @focus="trackFieldFocus('message')"
                    ></textarea>
                    <label for="message">{{ formLabels.message }}</label>
                    <div class="invalid-feedback" v-if="errors.message">{{ formErrors.message }}</div>
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
                      @change="trackFieldFocus('privacy')"
                    >
                    <label class="form-check-label" for="privacyPolicy" v-html="formLabels.privacy">
                    </label>
                    <div class="invalid-feedback" v-if="errors.privacy">{{ formErrors.privacy }}</div>
                  </div>
              </div>
              
                <div class="col-12">
                  <div class="form-buttons">
                    <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
                      <span v-if="!isSubmitting">{{ formSubmitButton }} <i class="fa-regular fa-paper-plane"></i></span>
                      <div v-else class="spinner-border spinner-border-sm text-light mx-2" role="status">
                        <span class="visually-hidden">{{ formSubmittingText }}</span>
                      </div>
                    </button>
                  </div>
                  <div class="response-message text-center mt-3" :class="responseStatus" v-html="responseMessage"></div>
                </div>
              </div>
            </form>
            <div v-else class="text-center py-5">
              <i class="fas fa-check-circle text-success mb-3" style="font-size: 3rem;"></i>
              <div class="response-message" :class="responseStatus" v-html="responseMessage"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mt-5">
        <div class="col-12">
          <div class="map-container">
            <div class="map-overlay">
              <h4>{{ mapTitle }}</h4>
              <p>{{ mapAddress }}</p>
              <button class="btn btn-sm btn-light mt-2" @click="loadMap">
                <i class="fas fa-map-marker-alt me-2"></i>{{ mapViewButton }}
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
import { useI18n } from 'vue-i18n'

export default {
  name: 'ContactSection',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        business_type_id: '',
        interest_id: '',
        message: '',
        privacyAccepted: false
      },
      isSubmitting: false,
      errors: {},
      responseMessage: '',
      responseStatus: '',
      mapLoaded: false,
      formSubmitted: false,
      interests: [],
      businessTypes: [],
      socialMedia: [
        { icon: 'fab fa-facebook-f', url: '#' },
        { icon: 'fab fa-instagram', url: '#' },
        { icon: 'fab fa-linkedin-in', url: '#' },
        { icon: 'fab fa-twitter', url: '#' }
      ],
      interestOptions: [
        'Saber mais sobre a plataforma',
        'Solicitar uma demonstração personalizada',
        'Informações sobre preços e planos',
        'Suporte técnico',
        'Outro'
      ]
    }
  },
  computed: {
    contactTitle() {
      const titles = {
        'pt': 'Vamos Falar Sobre o Seu Negócio',
        'es': 'Hablemos Sobre Tu Negocio',
        'en': 'Let\'s Talk About Your Business'
      };
      return titles[this.locale] || titles.pt;
    },
    contactSubtitle() {
      const subtitles = {
        'pt': 'Estamos aqui para responder às suas dúvidas e ajudar a potencializar o seu salão de beleza',
        'es': 'Estamos aquí para responder tus dudas y ayudarte a potenciar tu salón de belleza',
        'en': 'We\'re here to answer your questions and help boost your beauty salon'
      };
      return subtitles[this.locale] || subtitles.pt;
    },
    welcomeTitle() {
      const titles = {
        'pt': 'Bem-vindo à sua Transformação Digital!',
        'es': '¡Bienvenido a tu Transformación Digital!',
        'en': 'Welcome to Your Digital Transformation!'
      };
      return titles[this.locale] || titles.pt;
    },
    welcomeDescription() {
      const descriptions = {
        'pt': 'Preencha o formulário e um especialista entrará em contacto para mostrar como a nossa plataforma pode adaptar-se às suas necessidades específicas.',
        'es': 'Completa el formulario y un especialista se pondrá en contacto contigo para mostrarte cómo nuestra plataforma puede adaptarse a tus necesidades específicas.',
        'en': 'Fill out the form and a specialist will contact you to show how our platform can adapt to your specific needs.'
      };
      return descriptions[this.locale] || descriptions.pt;
    },
    satisfactionRating() {
      const ratings = {
        'pt': '98% de satisfação',
        'es': '98% de satisfacción',
        'en': '98% satisfaction'
      };
      return ratings[this.locale] || ratings.pt;
    },
    formLabels() {
      const labels = {
        'pt': {
          name: 'Nome completo',
          email: 'E-mail',
          phone: 'Telefone (opcional)',
          businessType: 'Tipo de negócio',
          interest: 'O que lhe interessa?',
          message: 'Como podemos ajudar?',
          privacy: 'Aceito a <a href="#">política de privacidade</a> e o tratamento dos meus dados'
        },
        'es': {
          name: 'Nombre completo',
          email: 'Correo electrónico',
          phone: 'Teléfono (opcional)',
          businessType: 'Tipo de negocio',
          interest: '¿Qué te interesa?',
          message: '¿Cómo podemos ayudarte?',
          privacy: 'Acepto la <a href="#">política de privacidad</a> y el tratamiento de mis datos'
        },
        'en': {
          name: 'Full name',
          email: 'Email',
          phone: 'Phone (optional)',
          businessType: 'Business type',
          interest: 'What are you interested in?',
          message: 'How can we help you?',
          privacy: 'I accept the <a href="#">privacy policy</a> and data processing'
        }
      };
      return labels[this.locale] || labels.pt;
    },
    formPlaceholders() {
      const placeholders = {
        'pt': {
          name: 'O seu nome',
          email: 'seu.email@exemplo.com',
          phone: '(+351) 900 000 000',
          businessType: 'Selecionar...',
          interest: 'Selecionar...',
          message: 'Escreva a sua mensagem aqui...'
        },
        'es': {
          name: 'Tu nombre',
          email: 'tu.email@ejemplo.com',
          phone: '(00) 00000-0000',
          businessType: 'Seleccionar...',
          interest: 'Seleccionar...',
          message: 'Escribe tu mensaje aquí...'
        },
        'en': {
          name: 'Your name',
          email: 'your.email@example.com',
          phone: '(000) 000-0000',
          businessType: 'Select...',
          interest: 'Select...',
          message: 'Type your message here...'
        }
      };
      return placeholders[this.locale] || placeholders.pt;
    },
    formErrors() {
      const errors = {
        'pt': {
          name: 'O nome é obrigatório',
          email: 'Por favor, insira um e-mail válido',
          phone: 'Por favor, insira um número de telefone válido',
          message: 'Por favor, escreva a sua mensagem',
          privacy: 'Deve aceitar a política de privacidade'
        },
        'es': {
          name: 'El nombre es obligatorio',
          email: 'Por favor, introduce un correo electrónico válido',
          phone: 'Por favor, introduce un número de teléfono válido',
          message: 'Por favor, escribe tu mensaje',
          privacy: 'Debes aceptar la política de privacidad'
        },
        'en': {
          name: 'Name is required',
          email: 'Please enter a valid email',
          phone: 'Please enter a valid phone number',
          message: 'Please write your message',
          privacy: 'You must accept the privacy policy'
        }
      };
      return errors[this.locale] || errors.pt;
    },
    formSubmitButton() {
      const buttons = {
        'pt': 'Enviar Mensagem',
        'es': 'Enviar Mensaje',
        'en': 'Send Message'
      };
      return buttons[this.locale] || buttons.pt;
    },
    formSubmittingText() {
      const texts = {
        'pt': 'A enviar...',
        'es': 'Enviando...',
        'en': 'Sending...'
      };
      return texts[this.locale] || texts.pt;
    },
    mapTitle() {
      const titles = {
        'pt': 'O Nosso Escritório Central',
        'es': 'Nuestra Oficina Central',
        'en': 'Our Headquarters'
      };
      return titles[this.locale] || titles.pt;
    },
    mapAddress() {
      const addresses = {
        'pt': 'Rua da Inovação 123, 1000-001 Lisboa, Portugal',
        'es': 'Calle Innovación 123, 28001 Madrid, España',
        'en': '123 Innovation Street, New York, NY 10001, USA'
      };
      return addresses[this.locale] || addresses.pt;
    },
    mapViewButton() {
      const buttons = {
        'pt': 'Ver no mapa',
        'es': 'Ver en el mapa',
        'en': 'View on map'
      };
      return buttons[this.locale] || buttons.pt;
    },
    interestOptions() {
      const options = {
        'pt': [
          'Saber mais sobre a plataforma',
          'Solicitar uma demonstração personalizada',
          'Informações sobre preços e planos',
          'Suporte técnico',
          'Outro'
        ],
        'es': [
          'Conocer más sobre la plataforma',
          'Solicitar una demostración personalizada',
          'Información sobre precios y planes',
          'Soporte técnico',
          'Otro'
        ],
        'en': [
          'Learn more about the platform',
          'Request a personalized demonstration',
          'Information about pricing and plans',
          'Technical support',
          'Other'
        ]
      };
      return options[this.locale] || options.pt;
    },
    contactInfoItems() {
      return [
        {
          icon: 'fas fa-headset',
          title: this.$t('contact.info.support.title'),
          intro: this.$t('contact.info.support.hours'),
          emailPrefix: this.$t('contact.info.support.emailPrefix'),
          emailDomain: this.$t('contact.info.support.emailDomain'),
          phone: this.$t('contact.info.support.phone')
        },
        {
          icon: 'fas fa-briefcase',
          title: this.$t('contact.info.sales.title'),
          intro: this.$t('contact.info.sales.intro'),
          emailPrefix: this.$t('contact.info.sales.emailPrefix'),
          emailDomain: this.$t('contact.info.sales.emailDomain'),
          phone: this.$t('contact.info.sales.phone')
        },
        {
          icon: 'fas fa-handshake',
          title: this.$t('contact.info.partners.title'),
          intro: this.$t('contact.info.partners.intro'),
          emailPrefix: this.$t('contact.info.partners.emailPrefix'),
          emailDomain: this.$t('contact.info.partners.emailDomain')
        }
      ];
    }
  },
  mounted() {
    this.animateElements();
    this.trackSectionView();
    this.fetchInterests();
    this.fetchBusinessTypes();
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
        this.errors.email = this.formErrors.email;
        isValid = false;
      }
      
      // Validación de teléfono (opcional)
      const phoneRegex = /^(\+\d{1,3})?\s?\d{9,}$/;
      if (this.formData.phone && !phoneRegex.test(this.formData.phone)) {
        this.errors.phone = this.formErrors.phone;
        isValid = false;
      }
      
      // Validación de campos requeridos
      if (!this.formData.name.trim()) {
        this.errors.name = this.formErrors.name;
        isValid = false;
      }
      
      if (!this.formData.message.trim()) {
        this.errors.message = this.formErrors.message;
        isValid = false;
      }
      
      if (!this.formData.privacyAccepted) {
        this.errors.privacy = this.formErrors.privacy;
        isValid = false;
      }
      
      // Registrar eventos de validación fallida
      if (Object.keys(this.errors).length > 0) {
        this.$analytics.event('form_validation_error', {
          form_id: 'contact_form',
          error_fields: Object.keys(this.errors).join(','),
          language: this.locale
        });
      }
      
      return isValid;
    },
    async fetchInterests() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/interests`, {
          headers: {
            'Accept': 'application/json',
            'X-API-KEY': import.meta.env.VITE_API_KEY
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los intereses');
        }

        const data = await response.json();
        this.interests = data.interests;
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    },
    async fetchBusinessTypes() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/business-types`, {
          headers: {
            'Accept': 'application/json',
            'X-API-KEY': import.meta.env.VITE_API_KEY
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los tipos de negocios');
        }

        const data = await response.json();
        this.businessTypes = data.business_types;
      } catch (error) {
        console.error('Error fetching business types:', error);
      }
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({
            full_name: this.formData.name,
            email: this.formData.email,
            phone: this.formData.phone,
            business_type_id: this.formData.business_type_id,
            interest_id: this.formData.interest_id,
            message: this.formData.message,
            language: this.locale,
            accept_terms: this.formData.privacyAccepted
          })
        });

        const data = await response.json();

        if (!response.ok) {
          // Manejo específico de errores de validación (422)
          if (response.status === 422 && data.errors) {
            const errorMessages = {
              'pt': 'Ops! Encontramos alguns erros no formulário:',
              'es': '¡Ups! Encontramos algunos errores en el formulario:',
              'en': 'Oops! We found some errors in the form:'
            };
            
            let errorList = '<div class="alert alert-danger mt-2">';
            Object.entries(data.errors).forEach(([field, messages]) => {
              errorList += `<div class="d-flex align-items-center mb-2">
                <i class="fas fa-exclamation-circle me-2"></i>
                <span>${messages[0]}</span>
              </div>`;
            });
            errorList += '</div>';
            
            this.responseMessage = `${errorMessages[this.locale] || errorMessages.pt}${errorList}`;
            this.responseStatus = 'text-danger';
            
            // Registrar el error de validación
            this.$analytics.event('form_validation_error', {
              form_id: 'contact_form',
              error_fields: Object.keys(data.errors).join(','),
              language: this.locale
            });
            
            return;
          }
          
          throw new Error(data.message || 'Error en el envío');
        }
        
        // Mensajes de éxito según el idioma
        const successMessages = {
          'pt': 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.',
          'es': '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
          'en': 'Message sent successfully! We\'ll contact you soon.'
        };
        
        this.responseMessage = successMessages[this.locale] || successMessages.pt;
        this.responseStatus = 'text-success';
        this.formSubmitted = true;
        
        // Registrar el envío exitoso del formulario
        this.$analytics.event('form_submission', {
          form_id: 'contact_form',
          business_type: this.formData.business_type_id,
          interest: this.formData.interest_id,
          has_phone: !!this.formData.phone,
          language: this.locale
        });
        
      } catch (error) {
        // Manejo de error
        const errorMessages = {
          'pt': 'Ocorreu um problema ao enviar a mensagem. Por favor, tente novamente.',
          'es': 'Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.',
          'en': 'There was a problem sending the message. Please try again.'
        };
        
        this.responseMessage = errorMessages[this.locale] || errorMessages.pt;
        this.responseStatus = 'text-danger';
        console.error('Error sending form:', error);
        
        // Registrar el error en el envío
        this.$analytics.event('form_submission_error', {
          form_id: 'contact_form',
          error_type: error.message || 'unknown',
          language: this.locale
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    loadMap() {
      // Cargar iframe de Google Maps solo cuando el usuario lo solicite
      this.$refs.mapFrame.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12144.53173462213!2d-3.7031!3d40.4169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sMadrid%2C%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1637300000000!5m2!1ses!2ses";
      this.mapLoaded = true;
    },
    trackFieldFocus(fieldName) {
      this.$analytics.event('form_field_focus', {
        form_id: 'contact_form',
        field_name: fieldName,
        language: this.locale
      });
    },
    trackSectionView() {
      // Crear un observer para detectar cuándo el usuario ve la sección de contacto
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.$analytics.event('section_view', {
              section_name: 'contact',
              language: this.locale
            });
            // Desconectar el observer después de registrar una vez
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(this.$refs.contactSection);
    },
    formatEmailContent(contentKey, emailUser, emailDomain) {
      // Obtener la cadena de texto base, sin direcciones de correo electrónico
      let baseContent = this.$t(contentKey, { email: '' });
      
      // Reemplazar todos los marcadores de posición del correo con el correo real
      // pero construido dinámicamente para evitar el símbolo @ en las traducciones
      return baseContent.replace(/Email: [^<]*/, 'Email: ' + emailUser + '@' + emailDomain);
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
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.form-check-input {
  margin-top: 3px;
  flex-shrink: 0;
}

.form-check-label {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
  flex-grow: 1;
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

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}

.alert-danger i {
  color: #842029;
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

.form-check .form-check-input {
  float: initial!important;
  margin-right: 10px;
}

.form-select {
  padding-top: 25px!important;
}
</style>