<template>
  <section class="pricing-section py-5" ref="pricingSection">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h2 class="section-title">{{ pricingTitle }}</h2>
          <p class="section-subtitle">{{ pricingSubtitle }}</p>
          
          <div class="pricing-toggle mt-4">
            <span :class="{ 'active': !isYearly }">{{ pricingLabels.monthly }}</span>
            <label class="switch mx-3">
              <input type="checkbox" v-model="isYearly">
              <span class="slider round"></span>
            </label>
            <span :class="{ 'active': isYearly }">
              {{ pricingLabels.yearly }}
              <span class="discount-badge">{{ pricingLabels.discount }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="row pricing-cards g-4 justify-content-center">
        <div class="col-md-6 col-lg-4" v-for="(plan, index) in translatedPlans" :key="index">
          <div class="pricing-card" 
               :class="{ 
                 'popular': plan.popular, 
                 'pricing-visible': planInView[index],
                 'highlight-pulse': plan.popular && highlightPopular
               }" 
               ref="pricingCards">
            <div class="popular-badge" v-if="plan.popular">{{ pricingLabels.popular }}</div>
            <div class="pricing-card-header">
              <h3 class="pricing-name">{{ plan.name }}</h3>
              <p class="pricing-description">{{ plan.description }}</p>
              <div class="pricing-price">
                <span class="currency">{{ plan.currency }}</span>
                <span class="amount">{{ isYearly ? plan.yearlyPrice : plan.monthlyPrice }}</span>
                <span class="period">/ {{ isYearly ? pricingLabels.year : pricingLabels.month }}</span>
              </div>
              <p class="pricing-billing" v-if="isYearly">Facturado anualmente</p>
            </div>
            
            <div class="pricing-features">
              <ul>
                <li v-for="(feature, fIndex) in plan.features" :key="fIndex">
                  <i :class="feature.included ? 'fas fa-check included' : 'fas fa-times excluded'"></i>
                  {{ feature }}
                  <span class="feature-tooltip" v-if="feature.tooltip">
                    <i class="fas fa-info-circle"></i>
                    <span class="tooltip-text">{{ feature.tooltip }}</span>
                  </span>
                </li>
              </ul>
            </div>
            
            <div class="pricing-action">
              <button class="btn" :class="plan.buttonClass" @click="trackPlanSelection(plan.name, isYearly ? 'annual' : 'monthly')">{{ plan.buttonText }}</button>
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
            <h4>{{ guaranteeTitle }}</h4>
            <p>{{ guaranteeText }}</p>
          </div>
          
          <div class="pricing-faq mt-5">
            <h3 class="faq-title">{{ faqTitle }}</h3>
            <div class="accordion" id="pricingFAQ">
              <div class="accordion-item" v-for="(item, index) in translatedFaq" :key="index">
                <h2 class="accordion-header" :id="'heading' + index">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                          :data-bs-target="'#collapse' + index" aria-expanded="false" 
                          :aria-controls="'collapse' + index">
                    {{ item.question }}
                  </button>
                </h2>
                <div :id="'collapse' + index" class="accordion-collapse collapse" 
                     :aria-labelledby="'heading' + index" data-bs-parent="#pricingFAQ">
                  <div class="accordion-body" v-html="item.answer"></div>
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
import { useI18n } from 'vue-i18n'

export default {
  name: 'PricingSection',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  data() {
    return {
      isYearly: false,
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
  computed: {
    pricingTitle() {
      const titles = {
        'pt': 'Planos Simples e Transparentes',
        'es': 'Planes Simples y Transparentes',
        'en': 'Simple and Transparent Plans'
      };
      return titles[this.locale] || titles.pt;
    },
    pricingSubtitle() {
      const subtitles = {
        'pt': 'Escolha o plano ideal para o seu negócio sem surpresas ou taxas ocultas',
        'es': 'Elige el plan ideal para tu negocio sin sorpresas ni tarifas ocultas',
        'en': 'Choose the ideal plan for your business with no surprises or hidden fees'
      };
      return subtitles[this.locale] || subtitles.pt;
    },
    pricingLabels() {
      const labels = {
        'pt': {
          monthly: 'Mensal',
          yearly: 'Anual',
          discount: 'Economize 20%',
          popular: 'Mais Popular',
          month: 'mês',
          year: 'ano'
        },
        'es': {
          monthly: 'Mensual',
          yearly: 'Anual',
          discount: 'Ahorra 20%',
          popular: 'Más Popular',
          month: 'mes',
          year: 'año'
        },
        'en': {
          monthly: 'Monthly',
          yearly: 'Yearly',
          discount: 'Save 20%',
          popular: 'Most Popular',
          month: 'month',
          year: 'year'
        }
      };
      return labels[this.locale] || labels.pt;
    },
    translatedPlans() {
      const plans = {
        'pt': [
          {
            name: 'Iniciante',
            description: 'Ideal para salões pequenos e profissionais autônomos',
            currency: '€',
            monthlyPrice: '99',
            yearlyPrice: '79',
            features: [
              'Até 2 profissionais',
              'Número ilimitado de clientes',
              'Agendamento por WhatsApp',
              'Recordatórios automáticos',
              'Painel básico de relatórios'
            ],
            buttonText: 'Começar grátis',
            buttonClass: 'btn-outline-primary',
            popular: false
          },
          {
            name: 'Profissional',
            description: 'Perfeito para salões em crescimento com várias estações',
            currency: '€',
            monthlyPrice: '189',
            yearlyPrice: '151',
            features: [
              'Até 5 profissionais',
              'Tudo do plano Iniciante',
              'Gestão de estoque',
              'Integração com redes sociais',
              'Assistente IA avançado',
              'Suporte prioritário'
            ],
            buttonText: 'Experimentar agora',
            buttonClass: 'btn-primary',
            popular: true
          },
          {
            name: 'Empresarial',
            description: 'Solução completa para redes de salões',
            currency: '€',
            monthlyPrice: '299',
            yearlyPrice: '239',
            features: [
              'Equipe ilimitada',
              'Tudo do plano Profissional',
              'Múltiplas localizações',
              'Personalização completa',
              'API para desenvolvedores',
              'Gerente de conta dedicado'
            ],
            buttonText: 'Fale conosco',
            buttonClass: 'btn-outline-primary',
            popular: false
          }
        ],
        'es': [
          {
            name: 'Iniciante',
            description: 'Ideal para salones pequeños y profesionales autónomos',
            currency: '€',
            monthlyPrice: '99',
            yearlyPrice: '79',
            features: [
              'Hasta 2 profesionales',
              'Número ilimitado de clientes',
              'Agendamiento por WhatsApp',
              'Recordatorios automáticos',
              'Panel básico de informes'
            ],
            buttonText: 'Empezar gratis',
            buttonClass: 'btn-outline-primary',
            popular: false
          },
          {
            name: 'Profesional',
            description: 'Perfecto para salones en crecimiento con varias estaciones',
            currency: '€',
            monthlyPrice: '189',
            yearlyPrice: '151',
            features: [
              'Hasta 5 profesionales',
              'Todo del plan Iniciante',
              'Gestión de inventario',
              'Integración con redes sociales',
              'Asistente IA avanzado',
              'Soporte prioritario'
            ],
            buttonText: 'Probar ahora',
            buttonClass: 'btn-primary',
            popular: true
          },
          {
            name: 'Empresarial',
            description: 'Solución completa para redes de salones',
            currency: '€',
            monthlyPrice: '299',
            yearlyPrice: '239',
            features: [
              'Equipo ilimitado',
              'Todo del plan Profesional',
              'Múltiples ubicaciones',
              'Personalización completa',
              'API para desarrolladores',
              'Gerente de cuenta dedicado'
            ],
            buttonText: 'Contáctanos',
            buttonClass: 'btn-outline-primary',
            popular: false
          }
        ],
        'en': [
          {
            name: 'Starter',
            description: 'Ideal for small salons and independent professionals',
            currency: '€',
            monthlyPrice: '99',
            yearlyPrice: '79',
            features: [
              'Up to 2 professionals',
              'Unlimited clients',
              'WhatsApp scheduling',
              'Automatic reminders',
              'Basic reporting dashboard'
            ],
            buttonText: 'Start for free',
            buttonClass: 'btn-outline-primary',
            popular: false
          },
          {
            name: 'Professional',
            description: 'Perfect for growing salons with multiple stations',
            currency: '€',
            monthlyPrice: '189',
            yearlyPrice: '151',
            features: [
              'Up to 5 professionals',
              'Everything in Starter',
              'Inventory management',
              'Social media integration',
              'Advanced AI assistant',
              'Priority support'
            ],
            buttonText: 'Try now',
            buttonClass: 'btn-primary',
            popular: true
          },
          {
            name: 'Enterprise',
            description: 'Complete solution for salon chains',
            currency: '€',
            monthlyPrice: '299',
            yearlyPrice: '239',
            features: [
              'Unlimited team',
              'Everything in Professional',
              'Multiple locations',
              'Full customization',
              'Developer API',
              'Dedicated account manager'
            ],
            buttonText: 'Contact us',
            buttonClass: 'btn-outline-primary',
            popular: false
          }
        ]
      };
      return plans[this.locale] || plans.pt;
    },
    faqTitle() {
      const titles = {
        'pt': 'Perguntas Frequentes',
        'es': 'Preguntas Frecuentes',
        'en': 'Frequently Asked Questions'
      };
      return titles[this.locale] || titles.pt;
    },
    translatedFaq() {
      const faqs = {
        'pt': [
          {
            question: 'O que está incluído no teste gratuito?',
            answer: 'O teste gratuito de 14 dias inclui todas as funcionalidades do plano Profissional, permitindo que você experimente a plataforma por completo antes de decidir qual plano é o ideal para o seu negócio.'
          },
          {
            question: 'Preciso fornecer dados de cartão de crédito para o teste?',
            answer: 'Não, não solicitamos dados de cartão de crédito para iniciar seu período de teste gratuito. Você só precisará fornecer informações de pagamento quando decidir assinar um de nossos planos após o período de teste.'
          },
          {
            question: 'Posso mudar de plano depois?',
            answer: 'Sim, você pode fazer upgrade ou downgrade de seu plano a qualquer momento. Se você fizer upgrade, o valor será ajustado proporcionalmente ao tempo restante do seu ciclo de faturamento. Em caso de downgrade, o novo valor será aplicado no próximo ciclo.'
          },
          {
            question: 'Como funciona a integração com WhatsApp?',
            answer: 'Nossa plataforma se integra ao WhatsApp Business API, permitindo que seus clientes agendem, confirmem e cancelem compromissos diretamente pelo WhatsApp. O processo de configuração é simples e orientado, e oferecemos suporte completo durante a integração.'
          }
        ],
        'es': [
          {
            question: '¿Qué incluye la prueba gratuita?',
            answer: 'La prueba gratuita de 14 días incluye todas las funcionalidades del plan Profesional, permitiéndote experimentar la plataforma por completo antes de decidir qué plan es el ideal para tu negocio.'
          },
          {
            question: '¿Necesito proporcionar datos de tarjeta de crédito para la prueba?',
            answer: 'No, no solicitamos datos de tarjeta de crédito para iniciar tu período de prueba gratuita. Solo necesitarás proporcionar información de pago cuando decidas suscribirte a uno de nuestros planes después del período de prueba.'
          },
          {
            question: '¿Puedo cambiar de plan después?',
            answer: 'Sí, puedes hacer upgrade o downgrade de tu plan en cualquier momento. Si haces upgrade, el valor será ajustado proporcionalmente al tiempo restante de tu ciclo de facturación. En caso de downgrade, el nuevo valor se aplicará en el próximo ciclo.'
          },
          {
            question: '¿Cómo funciona la integración con WhatsApp?',
            answer: 'Nuestra plataforma se integra con WhatsApp Business API, permitiendo que tus clientes agenden, confirmen y cancelen citas directamente por WhatsApp. El proceso de configuración es simple y guiado, y ofrecemos soporte completo durante la integración.'
          }
        ],
        'en': [
          {
            question: 'What is included in the free trial?',
            answer: 'The 14-day free trial includes all features of the Professional plan, allowing you to fully experience the platform before deciding which plan is ideal for your business.'
          },
          {
            question: 'Do I need to provide credit card data for the trial?',
            answer: 'No, we don\'t request credit card data to start your free trial period. You will only need to provide payment information when you decide to subscribe to one of our plans after the trial period.'
          },
          {
            question: 'Can I change plans later?',
            answer: 'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the value will be adjusted proportionally to the remaining time in your billing cycle. In case of downgrade, the new value will be applied in the next cycle.'
          },
          {
            question: 'How does the WhatsApp integration work?',
            answer: 'Our platform integrates with WhatsApp Business API, allowing your clients to schedule, confirm and cancel appointments directly through WhatsApp. The setup process is simple and guided, and we offer full support during integration.'
          }
        ]
      };
      return faqs[this.locale] || faqs.pt;
    },
    guaranteeTitle() {
      const titles = {
        'pt': 'Garantia de Satisfação de 30 Dias',
        'es': 'Garantía de Satisfacción de 30 Días',
        'en': '30-Day Satisfaction Guarantee'
      };
      return titles[this.locale] || titles.pt;
    },
    guaranteeText() {
      const texts = {
        'pt': 'Se você não estiver completamente satisfeito com nossa plataforma nos primeiros 30 dias, oferecemos reembolso integral, sem perguntas.',
        'es': 'Si no estás completamente satisfecho con nuestra plataforma en los primeros 30 días, ofrecemos reembolso completo, sin preguntas.',
        'en': 'If you\'re not completely satisfied with our platform in the first 30 days, we offer a full refund, no questions asked.'
      };
      return texts[this.locale] || texts.pt;
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

    // Crear un observer para detectar cuándo el usuario ve la sección de precios
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.$analytics.event('section_view', {
            section_name: 'pricing',
            language: this.locale
          });
          // Desconectar el observer después de registrar una vez
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.$refs.pricingSection);
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
    },
    togglePricing() {
      this.isYearly = !this.isYearly;
      
      // Registrar cambio de plan de precio
      this.$analytics.event('pricing_toggle', {
        plan_type: this.isYearly ? 'annual' : 'monthly',
        language: this.locale
      });
    },
    trackPlanSelection(planName, planType) {
      this.$analytics.event('plan_selection', {
        plan_name: planName,
        plan_type: planType,
        language: this.locale
      });
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

/* Nuevo estilo para la sección de garantía */
.pricing-guarantee {
  background: linear-gradient(135deg, #1f0064 0%, #6a11cb 50%, #2575fc 100%);
  padding: 35px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(106, 17, 203, 0.3);
  border: none;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  color: white;
}

.pricing-guarantee::before {
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

.pricing-guarantee > * {
  position: relative;
  z-index: 2;
}

.guarantee-icon {
  font-size: 2.8rem;
  color: white;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.pricing-guarantee h4 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.pricing-guarantee p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
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
    font-size: 2.2rem;
  }
  
  .pricing-guarantee h4 {
    font-size: 1.3rem;
  }
  
  .pricing-guarantee p {
    font-size: 1rem;
  }
  
  .faq-title {
    font-size: 1.5rem;
  }
  
  .accordion-button {
    font-size: 1rem;
    padding: 15px;
  }
}

.discount-badge {
  display: inline-block;
  background-color: #10b981;
  color: white!important;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 8px;
  font-weight: 600;
  animation: pulse 2s infinite;
}
</style>