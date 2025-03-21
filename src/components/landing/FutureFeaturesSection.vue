<template>
  <section class="future-features-section py-5" ref="futureSection">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h2 class="section-title">El Futuro de la Belleza Está Aquí</h2>
          <p class="section-subtitle">Descubre las próximas funcionalidades que transformarán tu negocio</p>
        </div>
      </div>

      <div class="features-timeline">
        <div class="row gx-5">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <div class="timeline-image-container" ref="imageContainer">
              <div class="timeline-image" 
                  v-for="(feature, index) in features" 
                  :key="index"
                  :class="{ 'active': activeFeature === index }">
                <img :src="feature.image" :alt="feature.title" class="img-fluid">
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="accordion" id="futureFeatures">
              <div class="feature-card" 
                  v-for="(feature, index) in features" 
                  :key="index"
                  :class="{ 'active': activeFeature === index, 'feature-visible': featureInView[index] }"
                  ref="featureCards"
                  @mouseenter="setActiveFeature(index)"
                  @click="setActiveFeature(index)">
                <div class="feature-header" :id="`heading${index}`">
                  <button class="feature-button" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          :data-bs-target="`#collapse${index}`" 
                          :aria-expanded="activeFeature === index ? 'true' : 'false'" 
                          :aria-controls="`collapse${index}`">
                    <div class="feature-icon">
                      <i :class="feature.icon"></i>
                    </div>
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <i class="fas fa-chevron-down feature-arrow"></i>
                  </button>
                </div>
                <div :id="`collapse${index}`" 
                     class="collapse" 
                     :class="{ 'show': activeFeature === index }"
                     :aria-labelledby="`heading${index}`" 
                     data-bs-parent="#futureFeatures">
                  <div class="feature-body">
                    <p class="feature-description">{{ feature.description }}</p>
                    <div class="feature-tags">
                      <span class="feature-tag" v-for="(tag, tagIndex) in feature.tags" :key="tagIndex">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12 text-center">
          <p class="future-cta-text">¿Te gustaría priorizar alguna funcionalidad?</p>
          <button class="btn btn-gradient btn-lg">Cuéntanos tu Opinión</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FutureFeaturesSection',
  data() {
    return {
      activeFeature: 0,
      sectionObserver: null,
      featureObservers: [],
      featureInView: [false, false, false, false],
      autoplayActive: true,
      rotationInterval: null,
      features: [
        {
          title: "Inteligencia Predictiva de Clientes",
          description: "Analiza los patrones de tus clientes para predecir futuras visitas, preferencias y servicios que podrían interesarles. Anticipa necesidades y ofrece recomendaciones personalizadas para aumentar la satisfacción y el valor del cliente.",
          icon: "fas fa-brain",
          image: "https://picsum.photos/600/400?random=10",
          tags: ["IA Avanzada", "Próximamente", "Personalización"]
        },
        {
          title: "Inventario Inteligente y Alertas",
          description: "Gestión automatizada de inventario que se sincroniza con tus servicios. Recibe alertas predictivas cuando los productos estén por agotarse basadas en reservas futuras y tendencias de uso, eliminando el desperdicio y la falta de stock.",
          icon: "fas fa-box-open",
          image: "https://picsum.photos/600/400?random=11",
          tags: ["Automatización", "En desarrollo", "Gestión"]
        },
        {
          title: "Experiencia de Realidad Aumentada",
          description: "Permite a tus clientes probar virtualmente peinados, colores y tratamientos antes de su cita. Integra fotografías reales con simulación 3D para visualizar resultados, aumentando la seguridad en la decisión y reduciendo insatisfacciones.",
          icon: "fas fa-vr-cardboard",
          image: "https://picsum.photos/600/400?random=12",
          tags: ["Innovación", "Futuro cercano", "Experiencia cliente"]
        },
        {
          title: "Programa de Fidelización con IA",
          description: "Sistema de recompensas personalizado que aprende de las preferencias individuales de cada cliente. La IA sugiere las recompensas más efectivas para cada perfil, maximizando la retención y el valor del cliente a largo plazo.",
          icon: "fas fa-gift",
          image: "https://picsum.photos/600/400?random=13",
          tags: ["Fidelización", "Próximo trimestre", "Rentabilidad"]
        }
      ]
    }
  },
  mounted() {
    // Observer para detectar cuando la sección entra en el viewport
    this.sectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.autoplayActive) {
        this.initFeatureRotation();
      } else if (!entries[0].isIntersecting && this.rotationInterval) {
        // Detener rotación cuando la sección sale del viewport
        clearInterval(this.rotationInterval);
        this.rotationInterval = null;
      }
    }, { threshold: 0.2 });
    
    this.sectionObserver.observe(this.$refs.futureSection);
    
    // Observers individuales para cada feature card
    this.$nextTick(() => {
      if (this.$refs.featureCards) {
        this.$refs.featureCards.forEach((card, index) => {
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              this.featureInView[index] = true;
            }
          }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
          
          observer.observe(card);
          this.featureObservers.push(observer);
        });
      }
    });

    // Arreglar el problema de ancho del #app
    this.fixAppWidth();
  },
  beforeUnmount() {
    // Limpiar los observers cuando el componente se desmonte
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
    
    this.featureObservers.forEach(observer => {
      observer.disconnect();
    });
    
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  },
  methods: {
    setActiveFeature(index) {
      this.activeFeature = index;
      
      // Desactivar permanentemente el autoplay cuando el usuario interactúa
      this.autoplayActive = false;
      
      // Si hay un intervalo activo, lo detenemos
      if (this.rotationInterval) {
        clearInterval(this.rotationInterval);
        this.rotationInterval = null;
      }
    },
    initFeatureRotation() {
      // Solo iniciar rotación si está activo el autoplay
      if (this.autoplayActive) {
        // Limpiamos cualquier intervalo existente primero
        if (this.rotationInterval) {
          clearInterval(this.rotationInterval);
        }
        
        // Rotación automática cada 5 segundos
        this.rotationInterval = setInterval(() => {
          if (this.autoplayActive) {
            this.activeFeature = (this.activeFeature + 1) % this.features.length;
          } else {
            // Si el usuario ha interactuado, detenemos la rotación
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
          }
        }, 5000);
      }
    },
    fixAppWidth() {
      // Corregir el ancho del #app
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.style.width = '100%';
      }
    }
  }
}
</script>

<style scoped>
.future-features-section {
  background: linear-gradient(135deg, #2b32b2 0%, #1488cc 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.future-features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
    radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
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
  background: linear-gradient(90deg, #ffffff, #b3e5fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 700px;
  margin: 0 auto;
}

.features-timeline {
  margin: 40px 0;
}

.timeline-image-container {
  position: relative;
  height: 400px;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.timeline-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 0.8s ease, transform 1.2s ease;
}

.timeline-image.active {
  opacity: 1;
  transform: scale(1);
}

.timeline-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  transform: translateY(30px);
  opacity: 0;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.feature-card.feature-visible {
  transform: translateY(0);
  opacity: 1;
}

.feature-card:nth-child(1).feature-visible { transition-delay: 0.1s; }
.feature-card:nth-child(2).feature-visible { transition-delay: 0.2s; }
.feature-card:nth-child(3).feature-visible { transition-delay: 0.3s; }
.feature-card:nth-child(4).feature-visible { transition-delay: 0.4s; }

.feature-card.active {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

.feature-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px;
  background: transparent;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-button:hover {
  background: rgba(255, 255, 255, 0.05);
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #00a8ff, #1a8cff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.feature-icon i {
  font-size: 22px;
  color: white;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  flex-grow: 1;
}

.feature-arrow {
  transition: transform 0.3s ease;
  margin-left: 15px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.active .feature-arrow {
  transform: rotate(180deg);
}

.feature-body {
  padding: 0 20px 20px 20px;
}

.feature-description {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 15px;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  display: inline-block;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
}

.future-cta-text {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.btn-gradient {
  background: linear-gradient(45deg, #00a8ff, #1a8cff);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.btn-gradient:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #1a8cff, #00a8ff);
}

@media (max-width: 991.98px) {
  .timeline-image-container {
    height: 300px;
    margin-bottom: 30px;
  }
  
  .section-title {
    font-size: 2.2rem;
  }
  
  .feature-button {
    padding: 15px;
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
  }
  
  .feature-icon i {
    font-size: 18px;
  }
}

@media (max-width: 767.98px) {
  .timeline-image-container {
    height: 250px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .feature-title {
    font-size: 1.1rem;
  }
  
  .future-cta-text {
    font-size: 1.1rem;
  }
}

/* Animación para los elementos cuando entran al viewport */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>