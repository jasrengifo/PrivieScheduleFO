<template>
  <section class="features-section py-5">
    <div class="container">
      <div class="row text-center mb-5">
        <div class="col-lg-8 mx-auto">
          <h2 class="fw-bold mb-3">{{ featuresTitle }}</h2>
          <p class="lead text-muted">{{ featuresSubtitle }}</p>
        </div>
      </div>
      
      <div class="row align-items-center mb-5">
        <div class="col-md-6 order-md-2">
          <img src="https://picsum.photos/600/400?random=3" 
               alt="Calendario inteligente" 
               class="img-fluid rounded-3 shadow">
        </div>
        <div class="col-md-6 order-md-1 mt-4 mt-md-0">
          <h3>{{ intelligentSchedulingTitle }}</h3>
          <p>{{ intelligentSchedulingText }}</p>
          <ul class="list-unstyled">
            <li class="mb-2" v-for="(item, index) in intelligentSchedulingBenefits" :key="index">
              <i class="fas fa-check-circle text-success me-2"></i>{{ item }}
            </li>
          </ul>
        </div>
      </div>
      
      <div class="row align-items-center mb-5">
        <div class="col-md-6">
          <img src="https://picsum.photos/600/400?random=4" 
               alt="Chat de WhatsApp" 
               class="img-fluid rounded-3 shadow">
        </div>
        <div class="col-md-6 mt-4 mt-md-0">
          <h3>{{ whatsappAssistantTitle }}</h3>
          <p>{{ whatsappAssistantText }}</p>
          <ul class="list-unstyled">
            <li class="mb-2" v-for="(item, index) in whatsappAssistantBenefits" :key="index">
              <i class="fas fa-check-circle text-success me-2"></i>{{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'FeaturesSection',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  computed: {
    featuresTitle() {
      const titles = {
        'pt': 'Funcionalidades Destacadas',
        'es': 'Funcionalidades Destacadas',
        'en': 'Featured Functionalities'
      };
      return titles[this.locale] || titles.pt;
    },
    featuresSubtitle() {
      const subtitles = {
        'pt': 'Tudo o que você precisa para gerenciar seu negócio de estética',
        'es': 'Todo lo que necesitas para gestionar tu negocio de estética',
        'en': 'Everything you need to manage your beauty business'
      };
      return subtitles[this.locale] || subtitles.pt;
    },
    intelligentSchedulingTitle() {
      const titles = {
        'pt': 'Agendamento Inteligente',
        'es': 'Agendamiento Inteligente',
        'en': 'Intelligent Scheduling'
      };
      return titles[this.locale] || titles.pt;
    },
    intelligentSchedulingText() {
      const texts = {
        'pt': 'Nosso sistema aprende os padrões do seu negócio para otimizar automaticamente sua agenda, garantindo a distribuição ideal de compromissos e maximizando a receita.',
        'es': 'Nuestro sistema aprende los patrones de tu negocio para optimizar automáticamente tu calendario, asegurando la distribución ideal de citas y maximizando los ingresos.',
        'en': 'Our system learns your business patterns to automatically optimize your calendar, ensuring ideal appointment distribution and maximizing revenue.'
      };
      return texts[this.locale] || texts.pt;
    },
    intelligentSchedulingBenefits() {
      const benefits = {
        'pt': [
          'Evita lacunas improdutivas',
          'Prioriza serviços mais rentáveis',
          'Redução do tempo ocioso entre compromissos'
        ],
        'es': [
          'Evita huecos improductivos',
          'Prioriza servicios más rentables',
          'Reducción de tiempo muerto entre citas'
        ],
        'en': [
          'Avoids unproductive gaps',
          'Prioritizes more profitable services',
          'Reduces downtime between appointments'
        ]
      };
      return benefits[this.locale] || benefits.pt;
    },
    whatsappAssistantTitle() {
      const titles = {
        'pt': 'Assistente de WhatsApp com IA',
        'es': 'Asistente de WhatsApp con IA',
        'en': 'AI-Powered WhatsApp Assistant'
      };
      return titles[this.locale] || titles.pt;
    },
    whatsappAssistantText() {
      const texts = {
        'pt': 'Automatize a comunicação com seus clientes através de um assistente inteligente que entende linguagem natural e gerencia todo o processo de reservas.',
        'es': 'Automatiza la comunicación con tus clientes a través de un asistente inteligente que entiende lenguaje natural y gestiona todo el proceso de reservas.',
        'en': 'Automate communication with your clients through an intelligent assistant that understands natural language and manages the entire booking process.'
      };
      return texts[this.locale] || texts.pt;
    },
    whatsappAssistantBenefits() {
      const benefits = {
        'pt': [
          'Respostas instantâneas 24/7',
          'Permite agendar, modificar ou cancelar compromissos',
          'Envio automático de lembretes'
        ],
        'es': [
          'Respuestas instantáneas 24/7',
          'Permite agendar, modificar o cancelar citas',
          'Envío automático de recordatorios'
        ],
        'en': [
          'Instant responses 24/7',
          'Allows scheduling, modifying, or canceling appointments',
          'Automatic reminder sending'
        ]
      };
      return benefits[this.locale] || benefits.pt;
    }
  }
};
</script>

<style scoped>
.features-section {
  background-color: var(--bg-white);
  position: relative;
  overflow: hidden;
}

.feature-card {
  background-color: var(--bg-white);
  transition: var(--transition-normal);
  border: 1px solid var(--border-light);
  border-top: 3px solid var(--primary);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  width: 60px;
  height: 60px;
  background-color: var(--primary-transparent);
  border-radius: 50%;
  z-index: -1;
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: var(--border-radius-full);
  background-color: var(--primary-transparent);
  margin: 0 auto;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(156, 39, 176, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(156, 39, 176, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(156, 39, 176, 0);
  }
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  margin: 1.5rem auto;
  border-radius: var(--border-radius-full);
}
</style>