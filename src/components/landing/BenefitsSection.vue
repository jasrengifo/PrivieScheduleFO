<template>
  <section class="benefits-section py-5" ref="benefitsSection">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h2 class="section-title" ref="sectionTitle">
            <!-- Usar texto estático temporalmente para diagnóstico -->
            {{ currentLanguageTitle }}
          </h2>
          <p class="section-subtitle">
            {{ currentLanguageSubtitle }}
          </p>
        </div>
      </div>

      <div class="benefits-grid">
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="(benefit, index) in benefitItems" :key="index" :ref="el => { if (el) benefitRefs[index] = el }" @click="trackBenefitClick(benefit.title)">
            <div class="benefit-card" 
                 :class="{'benefit-visible': benefitInView[index]}" 
                 ref="benefitCards">
              <div class="benefit-icon-wrapper">
                <div class="benefit-icon">
                  <i :class="benefit.icon"></i>
                </div>
                <svg class="benefit-shape" viewBox="0 0 200 200">
                  <path d="M45.4,-59.4C58.9,-49.3,69.7,-35.2,76.3,-18.4C82.9,-1.6,85.4,17.9,78.5,32.7C71.6,47.4,55.3,57.5,38.3,65.6C21.3,73.7,3.7,79.8,-15.7,79.1C-35.1,78.3,-56.3,70.7,-67.6,55.4C-78.9,40.2,-80.2,17.4,-77,-3.3C-73.7,-23.9,-65.9,-42.4,-52.7,-52.9C-39.4,-63.4,-20.7,-66,-1.8,-63.7C17.1,-61.5,31.9,-69.4,45.4,-59.4Z" transform="translate(100 100)" />
                </svg>
              </div>
              <h3 class="benefit-title">{{ benefit.title }}</h3>
              <p class="benefit-description">{{ benefit.description }}</p>
              <div class="benefit-stat" v-if="benefit.stat">
                <span class="benefit-stat-value">{{ benefit.stat.value }}</span>
                <span class="benefit-stat-label">{{ benefit.stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12 text-center">
          <div class="benefits-cta">
            <h4 class="benefits-cta-title">
              {{ ctaTitle }}
            </h4>
            <p class="benefits-cta-text">
              {{ ctaDescription }}
            </p>
            <a href="#contact"><button class="btn btn-gradient btn-lg">
              {{ ctaButton }}
            </button></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'BenefitsSection',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  data() {
    return {
      benefitInView: [],
      benefitObservers: [],
      benefitRefs: [],
      observer: null
    }
  },
  computed: {
    // Obtener el título según el idioma actual
    currentLanguageTitle() {
      const titles = {
        'pt': 'Benefícios para o seu Salão',
        'es': 'Beneficios para tu Salón',
        'en': 'Benefits for Your Salon'
      };
      return titles[this.locale] || titles.pt;
    },
    // Obtener el subtítulo según el idioma actual
    currentLanguageSubtitle() {
      const subtitles = {
        'pt': 'Descubra como nossa plataforma transforma seu negócio de beleza',
        'es': 'Descubre cómo nuestra plataforma transforma tu negocio de belleza',
        'en': 'Discover how our platform transforms your beauty business'
      };
      return subtitles[this.locale] || subtitles.pt;
    },
    benefitItems() {
      // Usar textos estáticos para diagnóstico según el idioma actual
      const items = {
        'pt': [
          {
            icon: 'fas fa-clock',
            title: 'Economia de Tempo',
            description: 'Reduza em até 70% o tempo gasto em tarefas administrativas',
            stat: { value: '15h', label: 'horas economizadas por semana' }
          },
          {
            icon: 'fas fa-ban',
            title: 'Redução de Cancelamentos',
            description: 'Minimize cancelamentos de última hora e faltas com lembretes',
            stat: { value: '-68%', label: 'em cancelamentos' }
          },
          {
            icon: 'fas fa-mobile-alt',
            title: 'Conveniência Total',
            description: 'Seus clientes podem marcar compromissos 24/7 pelo WhatsApp',
            stat: { value: '30%', label: 'mais agendamentos' }
          },
          {
            icon: 'fas fa-user-friends',
            title: 'Satisfação Garantida',
            description: 'Melhore a experiência dos clientes com processo simplificado',
            stat: { value: '+45%', label: 'em retenção' }
          },
          {
            icon: 'fas fa-chart-pie',
            title: 'Aumento da produtividade',
            description: 'Aumente sua taxa de ocupação e aproveite melhor sua capacidade',
            stat: { value: '22%', label: 'aumento em vendas' }
          },
          {
            icon: 'fas fa-cogs',
            title: 'Automação Inteligente',
            description: 'IA cuida do agendamento, confirmações e redistribuição',
            stat: { value: '3', label: 'dias para implementar' }
          }
        ],
        'es': [
          {
            icon: 'fas fa-clock',
            title: 'Ahorro de Tiempo',
            description: 'Reduce hasta un 70% el tiempo en tareas administrativas',
            stat: { value: '15h', label: 'ahorradas por semana' }
          },
          {
            icon: 'fas fa-ban',
            title: 'Reducción de Cancelaciones',
            description: 'Minimiza cancelaciones de última hora con recordatorios',
            stat: { value: '-68%', label: 'en cancelaciones' }
          },
          {
            icon: 'fas fa-mobile-alt',
            title: 'Comodidad Total',
            description: 'Tus clientes pueden agendar citas 24/7 por WhatsApp',
            stat: { value: '30%', label: 'más reservas' }
          },
          {
            icon: 'fas fa-user-friends',
            title: 'Satisfacción Garantizada',
            description: 'Mejora la experiencia del cliente con proceso simple',
            stat: { value: '+45%', label: 'en retención' }
          },
          {
            icon: 'fas fa-chart-pie',
            title: 'Aumento de Ingresos',
            description: 'Incrementa tu ocupación y aprovecha mejor tu capacidad',
            stat: { value: '22%', label: 'aumento en ventas' }
          },
          {
            icon: 'fas fa-cogs',
            title: 'Automatización Inteligente',
            description: 'IA se encarga de las citas, confirmaciones y redistribución',
            stat: { value: '3', label: 'días para implementar' }
          }
        ],
        'en': [
          {
            icon: 'fas fa-clock',
            title: 'Time Savings',
            description: 'Reduce time spent on administrative tasks by up to 70%',
            stat: { value: '15h', label: 'hours saved per week' }
          },
          {
            icon: 'fas fa-ban',
            title: 'Reduced Cancellations',
            description: 'Minimize last-minute cancellations with automatic reminders',
            stat: { value: '-68%', label: 'in cancellations' }
          },
          {
            icon: 'fas fa-mobile-alt',
            title: 'Total Convenience',
            description: 'Your clients can book appointments 24/7 through WhatsApp',
            stat: { value: '30%', label: 'more bookings' }
          },
          {
            icon: 'fas fa-user-friends',
            title: 'Guaranteed Satisfaction',
            description: 'Enhance customer experience with simplified process',
            stat: { value: '+45%', label: 'in retention' }
          },
          {
            icon: 'fas fa-chart-pie',
            title: 'Revenue Increase',
            description: 'Boost your occupancy rate and make better use of capacity',
            stat: { value: '22%', label: 'sales increase' }
          },
          {
            icon: 'fas fa-cogs',
            title: 'Smart Automation',
            description: 'AI takes care of scheduling, confirmations and redistribution',
            stat: { value: '3', label: 'days to implement' }
          }
        ]
      };
      
      return items[this.locale] || items.pt;
    },
    ctaTitle() {
      const titles = {
        'pt': 'Pronto para transformar seu salão?',
        'es': '¿Listo para transformar tu salón?',
        'en': 'Ready to transform your salon?'
      };
      return titles[this.locale] || titles.pt;
    },
    ctaDescription() {
      const descriptions = {
        'pt': 'Comece agora com 14 dias gratuitos, sem necessidade de cartão de crédito',
        'es': 'Comienza ahora con 14 días gratuitos, sin necesidad de tarjeta de crédito',
        'en': 'Start now with 14 days free, no credit card required'
      };
      return descriptions[this.locale] || descriptions.pt;
    },
    ctaButton() {
      const buttons = {
        'pt': 'Começar Agora',
        'es': 'Empezar Ahora',
        'en': 'Get Started'
      };
      return buttons[this.locale] || buttons.pt;
    }
  },
  mounted() {
    // Inicializar array de beneficios visibles
    this.benefitInView = new Array(this.benefitItems.length).fill(false);
    
    // Configurar observers para animación al entrar en viewport
    this.$nextTick(() => {
      if (this.$refs.benefitCards) {
        this.$refs.benefitCards.forEach((card, index) => {
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              // Agregar pequeño retraso para efecto escalonado
              setTimeout(() => {
                this.benefitInView[index] = true;
              }, index * 100);
            }
          }, { threshold: 0.2 });
          
          observer.observe(card);
          this.benefitObservers.push(observer);
        });
      }
    });

    this.setupIntersectionObserver();

    // Crear un observer para detectar cuándo el usuario ve la sección
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.$analytics.event('section_view', {
            section_name: 'benefits',
            language: this.locale
          });
          // Desconectar el observer después de registrar una vez
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.$refs.benefitsSection);
  },
  beforeUnmount() {
    // Limpiar observers cuando el componente se desmonte
    this.benefitObservers.forEach(observer => {
      observer.disconnect();
    });

    // Limpiar el observer cuando el componente se desmonta
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    setupIntersectionObserver() {
      // Configurar el observador de intersección para animar los elementos
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              // Una vez animado, dejar de observar
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px'
        }
      );

      // Observar el título
      if (this.$refs.sectionTitle) {
        this.observer.observe(this.$refs.sectionTitle);
      }

      // Observar cada tarjeta de beneficios
      this.benefitRefs.forEach((ref) => {
        if (ref) {
          this.observer.observe(ref);
        }
      });
    },
    trackBenefitClick(benefitTitle) {
      this.$analytics.event('benefit_click', {
        benefit_title: benefitTitle,
        language: this.locale
      });
    }
  }
}
</script>

<style scoped>
.benefits-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.benefits-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 85% 85%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
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
  background: linear-gradient(90deg, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.section-title.animate {
  opacity: 1;
  transform: translateY(0);
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 700px;
  margin: 0 auto;
}

.benefits-grid {
  margin: 30px 0;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
  transform: translateY(40px);
  opacity: 0;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

.benefit-card.benefit-visible {
  transform: translateY(0);
  opacity: 1;
}

.benefit-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

.benefit-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.benefit-icon {
  position: absolute;
  width: 65px;
  height: 65px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.benefit-icon i {
  font-size: 28px;
  color: white;
}

.benefit-shape {
  position: absolute;
  width: 80px;
  height: 80px;
  top: -5px;
  left: -5px;
  z-index: 1;
  fill: rgba(255, 255, 255, 0.1);
  animation: rotate 25s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.benefit-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: white;
}

.benefit-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.benefit-stat {
  background: rgba(255, 255, 255, 0.1);
  display: inline-block;
  padding: 6px 12px;
  border-radius: 30px;
  margin-top: 5px;
}

.benefit-stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f6e05e;
  margin-right: 5px;
}

.benefit-stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
}

.benefits-cta {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 700px;
  margin: 20px auto;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.benefits-cta-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: white;
}

.benefits-cta-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 25px;
}

.btn-gradient {
  background: linear-gradient(45deg, #667eea, #764ba2);
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
  background: linear-gradient(45deg, #764ba2, #667eea);
}

@media (max-width: 991.98px) {
  .section-title {
    font-size: 2.2rem;
  }
  
  .benefit-title {
    font-size: 1.2rem;
  }
  
  .benefit-icon {
    width: 55px;
    height: 55px;
  }
  
  .benefit-icon i {
    font-size: 24px;
  }
  
  .benefit-shape {
    width: 70px;
    height: 70px;
  }
  
  .benefits-cta {
    padding: 30px;
  }
  
  .benefits-cta-title {
    font-size: 1.4rem;
  }
}

@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .benefit-card {
    padding: 25px;
  }
  
  .benefit-title {
    font-size: 1.1rem;
  }
  
  .benefit-description {
    font-size: 0.95rem;
  }
  
  .benefits-cta {
    padding: 25px;
  }
  
  .benefits-cta-title {
    font-size: 1.3rem;
  }
  
  .benefits-cta-text {
    font-size: 1rem;
  }
}
</style>