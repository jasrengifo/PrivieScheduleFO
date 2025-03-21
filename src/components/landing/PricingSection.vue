<template>
  <section class="pricing-section py-5" ref="pricingSection">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h2 class="section-title">Planes Diseñados para tu Negocio</h2>
          <p class="section-subtitle">Elige el plan que mejor se adapte a las necesidades de tu salón</p>
          
          <div class="pricing-toggle mt-4">
            <span :class="{ 'active': !isAnnual }">Mensual</span>
            <label class="switch mx-3">
              <input type="checkbox" v-model="isAnnual">
              <span class="slider round"></span>
            </label>
            <span :class="{ 'active': isAnnual }">Anual <span class="save-badge">Ahorra 20%</span></span>
          </div>
        </div>
      </div>

      <div class="row pricing-cards g-4 justify-content-center">
        <div class="col-md-6 col-lg-4" v-for="(plan, index) in plans" :key="index">
          <div class="pricing-card" 
               :class="{ 
                 'popular': plan.popular, 
                 'pricing-visible': planInView[index],
                 'highlight-pulse': plan.popular && highlightPopular
               }" 
               ref="pricingCards">
            <div class="popular-badge" v-if="plan.popular">Más Popular</div>
            <div class="pricing-card-header">
              <h3 class="pricing-name">{{ plan.name }}</h3>
              <p class="pricing-description">{{ plan.description }}</p>
              <div class="pricing-price">
                <span class="currency">€</span>
                <span class="amount">{{ isAnnual ? plan.annualPrice : plan.monthlyPrice }}</span>
                <span class="period">/mes</span>
              </div>
              <p class="pricing-billing" v-if="isAnnual">Facturado anualmente</p>
            </div>
            
            <div class="pricing-features">
              <ul>
                <li v-for="(feature, fIndex) in plan.features" :key="fIndex">
                  <i :class="feature.included ? 'fas fa-check included' : 'fas fa-times excluded'"></i>
                  {{ feature.text }}
                  <span class="feature-tooltip" v-if="feature.tooltip">
                    <i class="fas fa-info-circle"></i>
                    <span class="tooltip-text">{{ feature.tooltip }}</span>
                  </span>
                </li>
              </ul>
            </div>
            
            <div class="pricing-action">
              <button class="btn" :class="plan.popular ? 'btn-primary' : 'btn-outline'">
                {{ plan.buttonText }}
              </button>
            </div>
            
            <div class="pricing-footer" v-if="plan.footerText">
              {{ plan.footerText }}
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12 text-center">
          <div class="pricing-guarantee">
            <i class="fas fa-shield-alt guarantee-icon"></i>
            <h4>Garantía de Satisfacción 100%</h4>
            <p>Si no estás completamente satisfecho, te devolvemos tu dinero en los primeros 30 días. Sin preguntas.</p>
          </div>
          
          <div class="pricing-faq mt-5">
            <h3 class="faq-title">Preguntas Frecuentes</h3>
            <div class="accordion" id="pricingFaq">
              <div class="accordion-item" v-for="(faq, faqIndex) in faqs" :key="faqIndex">
                <h2 class="accordion-header" :id="`faqHeading${faqIndex}`">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#faqCollapse${faqIndex}`" aria-expanded="false" :aria-controls="`faqCollapse${faqIndex}`">
                    {{ faq.question }}
                  </button>
                </h2>
                <div :id="`faqCollapse${faqIndex}`" class="accordion-collapse collapse" :aria-labelledby="`faqHeading${faqIndex}`" data-bs-parent="#pricingFaq">
                  <div class="accordion-body">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PricingSection',
  data() {
    return {
      isAnnual: false,
      planInView: [],
      pricingObservers: [],
      highlightPopular: false,
      highlightInterval: null,
      plans: [
        {
          name: 'Básico',
          description: 'Ideal para profesionales independientes',
          monthlyPrice: 19,
          annualPrice: 15,
          popular: false,
          buttonText: 'Comenzar Prueba Gratuita',
          footerText: '7 días de prueba gratuita, sin tarjeta de crédito',
          features: [
            { text: '1 Especialista', included: true },
            { text: 'Hasta 50 citas mensuales', included: true },
            { text: 'Agendamiento por WhatsApp', included: true },
            { text: 'Recordatorios automáticos', included: true },
            { text: 'Página web básica', included: true },
            { text: 'Estadísticas básicas', included: true },
            { text: 'Asistente IA para citas', included: false, tooltip: 'Respuestas automáticas con IA' },
            { text: 'Integración con pagos', included: false },
            { text: 'Soporte prioritario', included: false }
          ]
        },
        {
          name: 'Profesional',
          description: 'Perfecto para pequeños salones',
          monthlyPrice: 49,
          annualPrice: 39,
          popular: true,
          buttonText: 'Comenzar Ahora',
          footerText: '30 días de garantía de devolución',
          features: [
            { text: 'Hasta 5 Especialistas', included: true },
            { text: 'Citas ilimitadas', included: true },
            { text: 'Agendamiento por WhatsApp', included: true },
            { text: 'Recordatorios automáticos', included: true },
            { text: 'Página web personalizable', included: true },
            { text: 'Estadísticas avanzadas', included: true },
            { text: 'Asistente IA para citas', included: true, tooltip: 'Respuestas automáticas con IA' },
            { text: 'Integración con pagos', included: true },
            { text: 'Soporte prioritario', included: false }
          ]
        },
        {
          name: 'Premium',
          description: 'Para salones de belleza establecidos',
          monthlyPrice: 99,
          annualPrice: 79,
          popular: false,
          buttonText: 'Contactar Ventas',
          features: [
            { text: 'Especialistas ilimitados', included: true },
            { text: 'Citas ilimitadas', included: true },
            { text: 'Agendamiento por WhatsApp', included: true },
            { text: 'Recordatorios automáticos', included: true },
            { text: 'Página web premium', included: true },
            { text: 'Estadísticas avanzadas + IA', included: true },
            { text: 'Asistente IA para citas', included: true, tooltip: 'Respuestas automáticas con IA' },
            { text: 'Integración con pagos', included: true },
            { text: 'Soporte prioritario 24/7', included: true }
          ]
        }
      ],
      faqs: [
        {
          question: '¿Puedo cambiar de plan en cualquier momento?',
          answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Si actualizas, el cambio es inmediato. Si bajas de categoría, el cambio se aplicará en tu próximo ciclo de facturación.'
        },
        {
          question: '¿Qué métodos de pago aceptan?',
          answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal y transferencia bancaria para planes anuales.'
        },
        {
          question: '¿Qué incluye la prueba gratuita?',
          answer: 'La prueba gratuita incluye todas las características del plan seleccionado durante 7 días. No necesitas una tarjeta de crédito para comenzar y recibirás un recordatorio antes de que finalice.'
        },
        {
          question: '¿Necesito instalar algún software?',
          answer: 'No, nuestra plataforma funciona completamente en la nube. Solo necesitas un dispositivo con conexión a internet y un navegador web actualizado.'
        },
        {
          question: '¿Cómo funciona la integración con WhatsApp?',
          answer: 'Conectamos tu número de WhatsApp Business a nuestra plataforma. Tus clientes pueden agendar, confirmar o cancelar citas mediante mensajes normales que son procesados por nuestro sistema de IA.'
        }
      ]
    }
  },
  mounted() {
    // Inicializar array de planes visibles
    this.planInView = new Array(this.plans.length).fill(false);
    
    // Configurar observers para animación al entrar en viewport
    this.$nextTick(() => {
      if (this.$refs.pricingCards) {
        this.$refs.pricingCards.forEach((card, index) => {
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              // Retraso escalonado para animación de entrada
              setTimeout(() => {
                this.planInView[index] = true;
              }, index * 150);
            }
          }, { threshold: 0.1 });
          
          observer.observe(card);
          this.pricingObservers.push(observer);
        });
      }
    });
    
    // Activar animación pulsante en el plan popular
    this.initPopularHighlight();
  },
  beforeUnmount() {
    // Limpiar observers cuando el componente se desmonte
    this.pricingObservers.forEach(observer => {
      observer.disconnect();
    });
    
    // Limpiar intervalo de animación
    if (this.highlightInterval) {
      clearInterval(this.highlightInterval);
    }
  },
  methods: {
    initPopularHighlight() {
      // Animación pulsante para el plan popular cada 5 segundos
      this.highlightInterval = setInterval(() => {
        this.highlightPopular = true;
        setTimeout(() => {
          this.highlightPopular = false;
        }, 1000);
      }, 5000);
    }
  }
}
</script>

<style scoped>
.pricing-section {
  background-image: linear-gradient(135deg, #f5f7fa 0%, #e4edf8 100%);
  color: #333;
  position: relative;
  overflow: hidden;
}

.pricing-section::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.05) 0%, transparent 60%),
    radial-gradient(circle at 90% 90%, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
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
  background: linear-gradient(90deg, #6d28d9, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  max-width: 700px;
  margin: 0 auto;
}

/* Toggle switch */
.pricing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.pricing-toggle span {
  color: #6b7280;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pricing-toggle span.active {
  color: #6d28d9;
  font-weight: 600;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #8b5cf6;
}

input:focus + .slider {
  box-shadow: 0 0 1px #8b5cf6;
}

input:checked + .slider:before {
  transform: translateX(30px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.save-badge {
  display: inline-block;
  background-color: #10b981;
  color: white;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 8px;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* Pricing cards */
.pricing-cards {
  padding: 20px 0;
}

.pricing-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.5s ease;
  border: 1px solid #e5e7eb;
  transform: translateY(50px);
  opacity: 0;
}

.pricing-card.pricing-visible {
  transform: translateY(0);
  opacity: 1;
}

.pricing-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.pricing-card.popular {
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.2);
  border: 2px solid #8b5cf6;
  z-index: 2;
}

.highlight-pulse {
  animation: highlightPulse 1s ease-out;
}

@keyframes highlightPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(139, 92, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
  }
}

.popular-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #8b5cf6;
  color: white;
  padding: 5px 15px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.pricing-card-header {
  padding: 30px;
  text-align: center;
  border-bottom: 1px solid #f3f4f6;
}

.pricing-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #1f2937;
}

.pricing-description {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 20px;
}

.pricing-price {
  font-size: 3rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 5px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.pricing-price .currency {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 8px;
  margin-right: 4px;
}

.pricing-price .period {
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  margin-top: 8px;
  margin-left: 4px;
}

.pricing-billing {
  font-size: 0.85rem;
  color: #6b7280;
}

.pricing-features {
  padding: 20px 30px;
  flex-grow: 1;
}

.pricing-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pricing-features li {
  padding: 10px 0;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #4b5563;
}

.pricing-features li i {
  margin-right: 10px;
  font-size: 16px;
}

.pricing-features li i.included {
  color: #10b981;
}

.pricing-features li i.excluded {
  color: #ef4444;
}

.feature-tooltip {
  position: relative;
  display: inline-block;
  margin-left: 5px;
}

.feature-tooltip i {
  color: #8b5cf6;
  font-size: 14px;
  cursor: help;
}

.tooltip-text {
  visibility: hidden;
  width: 200px;
  background-color: #1f2937;
  color: white;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.8rem;
  font-weight: normal;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #1f2937 transparent transparent transparent;
}

.feature-tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.pricing-action {
  padding: 20px 30px;
  text-align: center;
}

.pricing-footer {
  text-align: center;
  padding: 0 30px 30px;
  font-size: 0.85rem;
  color: #6b7280;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(45deg, #6d28d9, #8b5cf6);
  color: white;
  border: none;
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
}

.btn-outline {
  background: transparent;
  color: #6d28d9;
  border: 2px solid #8b5cf6;
}

.btn-outline:hover {
  background: rgba(139, 92, 246, 0.1);
  transform: translateY(-3px);
}

/* Guarantee section */
.pricing-guarantee {
  background: linear-gradient(45deg, #f9fafb, #f3f4f6);
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
  border: 1px solid #e5e7eb;
  max-width: 800px;
  margin: 0 auto;
}

.guarantee-icon {
  font-size: 2.5rem;
  color: #10b981;
  margin-bottom: 15px;
}

.pricing-guarantee h4 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #1f2937;
}

.pricing-guarantee p {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0;
}

/* FAQ section */
.pricing-faq {
  max-width: 800px;
  margin: 0 auto;
}

.faq-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #1f2937;
}

.accordion-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px !important;
  margin-bottom: 10px;
  overflow: hidden;
}

.accordion-button {
  padding: 16px 20px;
  font-weight: 600;
  font-size: 1.05rem;
  color: #1f2937;
  background-color: #f9fafb;
}

.accordion-button:not(.collapsed) {
  color: #6d28d9;
  background-color: #f5f3ff;
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: #e5e7eb;
}

.accordion-body {
  padding: 16px 20px;
  font-size: 0.95rem;
  color: #4b5563;
  background-color: white;
}

/* Responsive Styles */
@media (max-width: 991.98px) {
  .section-title {
    font-size: 2.2rem;
  }
  
  .pricing-price {
    font-size: 2.5rem;
  }
  
  .pricing-name {
    font-size: 1.3rem;
  }
  
  .pricing-card-header {
    padding: 25px 20px;
  }
  
  .pricing-features, .pricing-action {
    padding: 20px;
  }
  
  .pricing-footer {
    padding: 0 20px 20px;
  }
}

@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .pricing-toggle {
    flex-wrap: wrap;
  }
  
  .pricing-card {
    margin-bottom: 20px;
  }
  
  .pricing-guarantee {
    padding: 25px 20px;
  }
  
  .guarantee-icon {
    font-size: 2rem;
  }
  
  .pricing-guarantee h4 {
    font-size: 1.2rem;
  }
  
  .faq-title {
    font-size: 1.5rem;
  }
  
  .accordion-button {
    font-size: 1rem;
    padding: 15px;
  }
}
</style>