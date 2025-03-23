<template>
  <section class="hero-section d-flex align-items-center" id="home">
    <!-- Selector de idioma -->

    
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <div class="hero-content" data-aos="fade-right">
            <h1>{{ $t('hero.title') }}</h1>
            <p>{{ $t('hero.subtitle') }}</p>
            <div class="hero-buttons">
              <button class="btn btn-primary me-0 me-md-3" @click="trackCtaClick('hero_start')">{{ $t('hero.buttons.start') }}</button>
              <button class="btn btn-outline-light" @click="trackCtaClick('hero_demo')">{{ $t('hero.buttons.demo') }}</button>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <!-- Mantener la animación de entrada y rebote infinito al logo -->
          <img src="/img/logo.svg" 
               alt="Salón de belleza moderno" 
               class="img-fluid mt-5 mt-lg-0 rounded-3 logo-animation"
               ref="logoElement">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'HeroSection',
  components: {
  },
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  mounted() {
    // Cuando el componente se monte, aplicamos la animación de entrada
    const logo = this.$refs.logoElement;
    
    // Primero aplicamos la animación de entrada
    logo.classList.add('animate-entrance');
    
    // Después de que termine la animación de entrada, aplicamos el bounce infinito
    setTimeout(() => {
      logo.classList.remove('animate-entrance');
      logo.classList.add('animate-bounce');
    }, 1500); // 1.5 segundos para la animación de entrada

    // Registrar visualización de la sección hero
    this.$analytics.event('section_view', {
      section_name: 'hero',
      language: this.locale
    });
  },
  methods: {
    trackCtaClick(buttonId) {
      this.$analytics.event('cta_click', {
        button_id: buttonId,
        section: 'hero',
        language: this.locale,
        page_position: 'top'
      });
    }
  }
};
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1f0064 0%, #6a11cb 50%, #2575fc 100%);
  color: white;
  overflow: hidden;
  padding: 100px 20px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 40%);
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
}

.hero-content {
  padding-right: 20px;
}

.hero-content h1 {
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(to right, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b6b, #ffa1a1);
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(255, 107, 107, 0.5);
}

.btn-outline-light {
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 12px 30px;
  font-weight: 600;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.min-vh-75 {
  min-height: 75vh;
}

/* Animación de entrada para el logo */
.animate-entrance {
  animation: entrance 1.5s ease-out;
}

@keyframes entrance {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(6deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* Animación de rebote infinito para el logo */
.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 991.98px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
  
  .min-vh-75 {
    min-height: auto;
  }
  
  .hero-buttons {
    justify-content: center;
  }
}

@media (max-width: 767.98px) {
  .hero-content {
    text-align: center;
    padding: 0 15px;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
}
</style>