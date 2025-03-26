<template>
  <section class="ai-section py-5" id="ai-features">
    <div class="container">
      <div class="row justify-content-center mb-4">
        <div class="col-lg-8 text-center" data-animation="animate__fadeInDown">
          <h2 class="section-title">Potencia tu Salón con Inteligencia Artificial</h2>
          <p class="section-subtitle">Nuestras herramientas inteligentes automatizan tareas y maximizan tu productividad</p>
        </div>
      </div>
      
      <div class="ai-features-container" data-animation="animate__zoomIn">
        <div class="row g-0">
          <!-- Imagen lateral de IA con animación -->
          <div class="col-lg-4 d-none d-lg-block">
            <div class="ai-image-container">
              <img src="https://picsum.photos/id/119/600/800" alt="Inteligencia Artificial" class="ai-image">
              <div class="ai-pulse"></div>
              
              <!-- Elementos decorativos animados -->
              <div class="floating-elements">
                <div class="floating-element e1"></div>
                <div class="floating-element e2"></div>
                <div class="floating-element e3"></div>
              </div>
            </div>
          </div>
          
          <!-- Features de IA en layout compacto con animaciones -->
          <div class="col-lg-8">
            <div class="ai-cards-container">
              <div class="row g-3 staggered-fade" ref="featuresContainer">
                <div class="col-md-6" v-for="(feature, index) in features" :key="index">
                  <div class="ai-card" 
                       :class="['ai-card-' + (index + 1)]" 
                       @mouseenter="activateFeature(index)" 
                       @mouseleave="deactivateFeature(index)">
                    <div class="ai-card-icon">
                      <i :class="feature.icon"></i>
                    </div>
                    <div class="ai-card-content">
                      <h3>{{ feature.title }}</h3>
                      <p>{{ feature.description }}</p>
                      <div class="ai-metrics" v-if="feature.metrics">
                        <div class="metric" ref="metrics">
                          <transition name="count" mode="out-in">
                            <span class="metric-value" :key="activeFeature === index">
                              {{ activeFeature === index ? feature.metrics.value : '0%' }}
                            </span>
                          </transition>
                          <span class="metric-label">{{ feature.metrics.label }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Particles background effect when hovered -->
                    <div class="particles-container" v-if="activeFeature === index">
                      <div class="particle" v-for="n in 10" :key="n"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- CTA Banner compacto con animación -->
        <div class="ai-cta-banner mt-4" data-animation="animate__fadeInUp">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h4>Mejora la experiencia de tus clientes con la potencia de la IA</h4>
              <p>Automatiza tareas repetitivas y enfócate en lo que realmente importa: hacer crecer tu negocio</p>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
              <a href="#contact" class="btn btn-light btn-glow">
                Probar ahora
                <i class="fas fa-arrow-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AISection',
  data() {
    return {
      activeFeature: null,
      animatingMetrics: false,
      observerSet: false,
      features: [
        {
          icon: 'fas fa-calendar-check',
          title: 'Agendamiento Inteligente',
          description: 'Optimiza espacios en tu agenda y reduce tiempos muertos con nuestro algoritmo predictivo.',
          metrics: {
            value: '30%',
            label: 'más citas atendidas'
          }
        },
        {
          icon: 'fas fa-robot',
          title: 'Asistente WhatsApp',
          description: 'Respuestas automáticas a preguntas frecuentes y agendamiento sin intervención humana.',
          metrics: {
            value: '24/7',
            label: 'atención al cliente'
          }
        },
        {
          icon: 'fas fa-chart-line',
          title: 'Análisis Predictivo',
          description: 'Anticipa tendencias de demanda y optimiza tu inventario y personal necesario.',
          metrics: {
            value: '20%',
            label: 'reducción de costos'
          }
        },
        {
          icon: 'fas fa-user-check',
          title: 'Matching Cliente-Especialista',
          description: 'Asigna automáticamente el profesional ideal según historial y preferencias del cliente.',
          metrics: {
            value: '95%',
            label: 'satisfacción cliente'
          }
        }
      ]
    }
  },
  mounted() {
    this.setupIntersectionObserver();
  },
  methods: {
    activateFeature(index) {
      this.activeFeature = index;
    },
    deactivateFeature(index) {
      if (this.activeFeature === index) {
        this.activeFeature = null;
      }
    },
    setupIntersectionObserver() {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !this.observerSet) {
          this.observerSet = true;
          this.$refs.featuresContainer.classList.add('animated');
          
          // Iniciar animación secuencial para iconos
          const icons = document.querySelectorAll('.ai-card-icon');
          icons.forEach((icon, index) => {
            setTimeout(() => {
              icon.classList.add('icon-pulse');
            }, index * 300);
          });
        }
      }, { threshold: 0.3 });
      
      observer.observe(this.$refs.featuresContainer);
    }
  }
}
</script>

<style scoped>
.ai-section {
  background-color: #0f172a;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
  perspective: 1000px;
}

.ai-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 35%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(90deg, #38bdf8, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

/* Contenedor principal */
.ai-features-container {
  background: rgba(15, 23, 42, 0.7);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Imagen lateral */
.ai-image-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ai-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8) saturate(1.2);
  transition: transform 0.5s ease;
}

.ai-image-container:hover .ai-image {
  transform: scale(1.05);
}

.ai-pulse {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
}

/* Tarjetas de características */
.ai-cards-container {
  padding: 20px;
  height: 100%;
}

.ai-card {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  border: 1px solid rgba(56, 189, 248, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.ai-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(56, 189, 248, 0.2);
  border-color: rgba(56, 189, 248, 0.3);
  background: rgba(30, 41, 59, 0.95);
}

.ai-card-1:hover { border-color: rgba(56, 189, 248, 0.4); }
.ai-card-2:hover { border-color: rgba(139, 92, 246, 0.4); }
.ai-card-3:hover { border-color: rgba(249, 115, 22, 0.4); }
.ai-card-4:hover { border-color: rgba(74, 222, 128, 0.4); }

.ai-card-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  font-size: 22px;
  position: relative;
  z-index: 2;
}

.ai-card-1 .ai-card-icon { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
.ai-card-2 .ai-card-icon { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.ai-card-3 .ai-card-icon { background: linear-gradient(135deg, #f97316, #ea580c); }
.ai-card-4 .ai-card-icon { background: linear-gradient(135deg, #4ade80, #16a34a); }

.ai-card-content {
  flex-grow: 1;
}

.ai-card-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #f1f5f9;
}

.ai-card-content p {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 10px;
  line-height: 1.5;
}

/* Métricas */
.ai-metrics {
  display: flex;
  margin-top: 10px;
}

.metric {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1;
}

.metric-label {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 4px;
}

/* Banner CTA */
.ai-cta-banner {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 0 0 16px 16px;
  padding: 20px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.ai-cta-banner h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 6px;
}

.ai-cta-banner p {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 0;
}

.btn-light.btn-glow {
  background: #f1f5f9;
  color: #0f172a;
  border: none;
  font-weight: 600;
  padding: 10px 25px;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-light.btn-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  z-index: -1;
}

.btn-light.btn-glow:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-light.btn-glow:hover::before {
  animation: shine 1.5s infinite;
}

@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}

/* Estilos responsive */
@media (max-width: 991.98px) {
  .section-title {
    font-size: 2rem;
  }
  
  .ai-card {
    padding: 15px;
  }
  
  .ai-card-icon {
    width: 45px;
    height: 45px;
    min-width: 45px;
    font-size: 18px;
  }
  
  .ai-card-content h3 {
    font-size: 1.1rem;
  }
  
  .ai-cta-banner {
    padding: 20px;
  }
}

@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .ai-card {
    margin-bottom: 15px;
  }
  
  .ai-metrics {
    flex-direction: column;
  }
  
  .ai-cta-banner h4 {
    font-size: 1.1rem;
  }
  
  .ai-cta-banner p {
    font-size: 0.9rem;
  }
  
  .btn-light.btn-glow {
    padding: 8px 20px;
    font-size: 0.95rem;
  }
  
  .metric-value {
    font-size: 1.3rem;
  }
}

/* Mejoras de animaciones */
.ai-section {
  perspective: 1000px;
}

/* Animación de entrada para tarjetas */
.staggered-fade > * {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.staggered-fade.animated > *:nth-child(1) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.1s;
}

.staggered-fade.animated > *:nth-child(2) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.25s;
}

.staggered-fade.animated > *:nth-child(3) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.4s;
}

.staggered-fade.animated > *:nth-child(4) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.55s;
}

/* Partículas para efecto hover en tarjetas */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  pointer-events: none;
  animation: particleAnimation 1.5s linear infinite;
}

.particle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { top: 80%; left: 30%; animation-delay: 0.2s; }
.particle:nth-child(3) { top: 40%; left: 80%; animation-delay: 0.3s; }
.particle:nth-child(4) { top: 10%; left: 70%; animation-delay: 0.5s; }
.particle:nth-child(5) { top: 50%; left: 50%; animation-delay: 0.6s; }
.particle:nth-child(6) { top: 30%; left: 20%; animation-delay: 0.8s; }
.particle:nth-child(7) { top: 70%; left: 60%; animation-delay: 1s; }
.particle:nth-child(8) { top: 90%; left: 90%; animation-delay: 1.2s; }
.particle:nth-child(9) { top: 60%; left: 40%; animation-delay: 1.4s; }
.particle:nth-child(10) { top: 75%; left: 15%; animation-delay: 1.6s; }

@keyframes particleAnimation {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(20px);
    opacity: 0;
  }
}

/* Animación de pulso para iconos */
.icon-pulse {
  animation: iconPulse 2s;
}

@keyframes iconPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Elementos flotantes alrededor de la imagen */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
}

.e1 {
  width: 40px;
  height: 40px;
  background: #38bdf8;
  top: 20%;
  left: 20%;
  animation: floatingAnimation 3s ease-in-out infinite;
}

.e2 {
  width: 25px;
  height: 25px;
  background: #a78bfa;
  top: 50%;
  right: 15%;
  animation: floatingAnimation 4s ease-in-out infinite 1s;
}

.e3 {
  width: 35px;
  height: 35px;
  background: #f472b6;
  bottom: 25%;
  left: 30%;
  animation: floatingAnimation 5s ease-in-out infinite 0.5s;
}

/* Transición para métricas */
.count-enter-active,
.count-leave-active {
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.count-enter-from,
.count-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Animación del botón */
.btn-glow {
  animation: btnPulse 2s infinite;
}

@keyframes btnPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(241, 245, 249, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(241, 245, 249, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(241, 245, 249, 0);
  }
}
</style>