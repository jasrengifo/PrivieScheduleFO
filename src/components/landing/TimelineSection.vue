<template>
  <section class="timeline-section py-5" id="timeline" ref="timelineSection">
    <div class="container">
      <div class="row text-center mb-5">
        <div class="col-lg-8 mx-auto">
          <h2 class="fw-bold text-white mb-3">{{ timelineTitle }}</h2>
          <p class="text-white-50 lead">{{ timelineSubtitle }}</p>
        </div>
      </div>

      <div class="timeline">
        <div class="timeline-container" v-for="(step, index) in timelineSteps" :key="index" :class="{ 'right': index % 2 !== 0 }" @click="trackTimelineItemClick(index, step.title)">
          <div class="timeline-card">
            <div class="timeline-icon">
              <i :class="step.icon"></i>
            </div>
            <div class="timeline-content">
              <h3 class="timeline-title">{{ step.title }}</h3>
              <p class="timeline-text">{{ step.description }}</p>
              <div class="timeline-feature" v-if="step.highlight">
                <span class="badge bg-primary">{{ step.highlight }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12 text-center">
          <div class="timeline-cta card mx-auto">
            <div class="card-body p-4">
              <h4 class="card-title mb-3">{{ timelineCTA.title }}</h4>
              <p class="card-text mb-4">{{ timelineCTA.description }}</p>
              <button class="btn btn-gradient btn-lg">{{ timelineCTA.button }}</button>
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
  name: 'TimeLineSection',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  computed: {
    timelineTitle() {
      const titles = {
        'pt': 'Transforme seu Negócio em 4 Passos',
        'es': 'Transforma tu Negocio en 4 Pasos',
        'en': 'Transform Your Business in 4 Steps'
      };
      return titles[this.locale] || titles.pt;
    },
    timelineSubtitle() {
      const subtitles = {
        'pt': 'Implementação rápida e descomplicada para começar a ver resultados imediatamente',
        'es': 'Implementación rápida y sin complicaciones para empezar a ver resultados de inmediato',
        'en': 'Quick and straightforward implementation to start seeing results immediately'
      };
      return subtitles[this.locale] || subtitles.pt;
    },
    timelineSteps() {
      const steps = {
        'pt': [
          {
            title: "Configure sua Conta",
            description: "Registre-se e personalize seu espaço com os serviços e especialistas do seu salão em menos de 30 minutos. Nosso assistente guiará você em cada etapa.",
            icon: "fas fa-user-plus",
            highlight: "Sem conhecimentos técnicos"
          },
          {
            title: "Personalize sua Agenda",
            description: "Defina horários, bloqueie datas especiais e estabeleça regras de agendamento. A IA otimizará automaticamente seus compromissos com base nessas preferências.",
            icon: "fas fa-sliders-h",
            highlight: "Adaptado ao seu negócio"
          },
          {
            title: "Integre o WhatsApp",
            description: "Conecte seu número do WhatsApp Business e configure o assistente virtual. Seus clientes poderão agendar compromissos por mensagens sem a necessidade de aplicativos adicionais.",
            icon: "fab fa-whatsapp",
            highlight: "Ativação instantânea"
          },
          {
            title: "Comece a Receber Reservas",
            description: "Convide seus clientes para agendar pelo WhatsApp ou compartilhe seu link personalizado. Comece a ver resultados desde o primeiro dia e esqueça as agendas em papel.",
            icon: "fas fa-calendar-check",
            highlight: "Resultados imediatos"
          }
        ],
        'es': [
          {
            title: "Configura tu Cuenta",
            description: "Regístrate y personaliza tu espacio con los servicios y especialistas de tu salón en menos de 30 minutos. Nuestro asistente te guía en cada paso.",
            icon: "fas fa-user-plus",
            highlight: "Sin conocimientos técnicos"
          },
          {
            title: "Personaliza tu Agenda",
            description: "Define horarios, bloquea fechas especiales y establece reglas de agendamiento. La IA optimizará automáticamente tus citas basándose en estas preferencias.",
            icon: "fas fa-sliders-h",
            highlight: "Adaptado a tu negocio"
          },
          {
            title: "Integra WhatsApp",
            description: "Conecta tu número de WhatsApp Business y configura el asistente virtual. Tus clientes podrán agendar citas mediante mensajes sin necesidad de aplicaciones adicionales.",
            icon: "fab fa-whatsapp",
            highlight: "Activación instantánea"
          },
          {
            title: "Empieza a Recibir Reservas",
            description: "Invita a tus clientes a agendar por WhatsApp o comparte tu link personalizado. Comienza a ver resultados desde el primer día y olvídate de las agendas en papel.",
            icon: "fas fa-calendar-check",
            highlight: "Resultados inmediatos"
          }
        ],
        'en': [
          {
            title: "Set Up Your Account",
            description: "Register and customize your space with your salon's services and specialists in less than 30 minutes. Our assistant guides you through each step.",
            icon: "fas fa-user-plus",
            highlight: "No technical knowledge"
          },
          {
            title: "Customize Your Schedule",
            description: "Define hours, block special dates, and establish scheduling rules. The AI will automatically optimize your appointments based on these preferences.",
            icon: "fas fa-sliders-h",
            highlight: "Tailored to your business"
          },
          {
            title: "Integrate WhatsApp",
            description: "Connect your WhatsApp Business number and configure the virtual assistant. Your clients will be able to schedule appointments via messages without additional apps.",
            icon: "fab fa-whatsapp",
            highlight: "Instant activation"
          },
          {
            title: "Start Receiving Bookings",
            description: "Invite your clients to book via WhatsApp or share your personalized link. Start seeing results from day one and forget about paper agendas.",
            icon: "fas fa-calendar-check",
            highlight: "Immediate results"
          }
        ]
      };
      
      return steps[this.locale] || steps.pt;
    },
    timelineCTA() {
      const ctas = {
        'pt': {
          title: 'Pronto para começar?',
          description: 'Junte-se às centenas de salões que já melhoraram seus negócios com nossa plataforma',
          button: 'Iniciar meu Teste Gratuito'
        },
        'es': {
          title: '¿Listo para empezar?',
          description: 'Únete a los cientos de salones que ya mejoraron su negocio con nuestra plataforma',
          button: 'Comenzar mi Prueba Gratuita'
        },
        'en': {
          title: 'Ready to get started?',
          description: 'Join hundreds of salons that have already improved their business with our platform',
          button: 'Start My Free Trial'
        }
      };
      
      return ctas[this.locale] || ctas.pt;
    }
  },
  methods: {
    trackTimelineItemClick(index, title) {
      this.$analytics.event('timeline_item_click', {
        item_index: index,
        item_title: title,
        language: this.locale
      });
    }
  },
  mounted() {
    // Crear un observer para detectar cuándo el usuario ve la sección de timeline
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.$analytics.event('section_view', {
            section_name: 'timeline',
            language: this.locale
          });
          // Desconectar el observer después de registrar una vez
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.$refs.timelineSection);
  }
}
</script>

<style scoped>
.timeline-section {
  background: linear-gradient(135deg, #673ab7 0%, #512da8 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.timeline-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(149, 117, 205, 0.3) 0%, transparent 100%),
    radial-gradient(circle at 90% 80%, rgba(149, 117, 205, 0.3) 0%, transparent 100%);
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
}

/* Timeline Styles */
.timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  background: rgba(255, 255, 255, 0.2);
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -3px;
  border-radius: 10px;
}

.timeline-container {
  position: relative;
  width: 50%;
  padding: 20px 40px;
}

.timeline-container.right {
  left: 50%;
}

.timeline-container::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  right: -12px;
  background-color: white;
  border: 4px solid #ff4081;
  top: 35px;
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 0 0 5px rgba(255, 64, 129, 0.2);
}

.timeline-container.right::after {
  left: -12px;
}

.timeline-card {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.timeline-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #ff4081, #e040fb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.timeline-icon i {
  font-size: 24px;
  color: white;
}

.timeline-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
}

.timeline-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 10px;
}

.timeline-feature {
  margin-top: 15px;
}

.timeline-feature .badge {
  font-size: 0.8rem;
  padding: 6px 12px;
  background: #ff4081;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.timeline-cta {
  max-width: 600px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  color: white;
}

.btn-gradient {
  background: linear-gradient(45deg, #ff4081, #e040fb);
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-gradient:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #e040fb, #ff4081);
}

@media (max-width: 991.98px) {
  .timeline::after {
    left: 31px;
  }
  
  .timeline-container {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
    left: 0;
  }
  
  .timeline-container.right {
    left: 0;
  }
  
  .timeline-container::after {
    left: 19px;
    right: auto;
  }
  
  .timeline-container.right::after {
    left: 19px;
  }
}

@media (max-width: 767.98px) {
  .timeline-card {
    padding: 20px;
  }
  
  .timeline-icon {
    width: 50px;
    height: 50px;
  }
  
  .timeline-icon i {
    font-size: 20px;
  }
  
  .timeline-title {
    font-size: 1.1rem;
  }
  
  .timeline-text {
    font-size: 0.9rem;
  }
}
</style>