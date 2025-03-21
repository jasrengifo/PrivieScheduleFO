<template>
  <section class="benefits-section py-5" ref="benefitsSection">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <h2 class="section-title">Beneficios que Transforman tu Negocio</h2>
          <p class="section-subtitle">Descubre cómo nuestra plataforma resuelve los mayores desafíos de tu salón de belleza</p>
        </div>
      </div>

      <div class="benefits-grid">
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="(benefit, index) in benefits" :key="index">
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
            <h4 class="benefits-cta-title">¿Listo para impulsar tu negocio?</h4>
            <p class="benefits-cta-text">Únete a los cientos de salones que ya están experimentando estos beneficios</p>
            <button class="btn btn-gradient btn-lg">Comenzar Ahora</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BenefitsSection',
  data() {
    return {
      benefitInView: [],
      benefitObservers: [],
      benefits: [
        {
          icon: 'fas fa-clock',
          title: 'Ahorra Tiempo Valioso',
          description: 'Reduce hasta un 80% el tiempo dedicado a gestionar citas. Automatiza recordatorios, confirmaciones y reagendamientos para enfocarte en lo que realmente importa: tus clientes.',
          stat: {
            value: '15h',
            label: 'ahorradas por semana'
          }
        },
        {
          icon: 'fas fa-ban',
          title: 'Reduce Cancelaciones',
          description: 'El sistema de confirmación inteligente y los recordatorios automáticos por WhatsApp disminuyen drásticamente las cancelaciones de última hora y los clientes que no asisten.',
          stat: {
            value: '-68%',
            label: 'en cancelaciones'
          }
        },
        {
          icon: 'fas fa-mobile-alt',
          title: 'Accesibilidad 24/7',
          description: 'Tus clientes pueden agendar citas en cualquier momento, incluso fuera del horario laboral. Sin llamadas perdidas, sin esperas y sin complicaciones.',
          stat: {
            value: '30%',
            label: 'más reservas'
          }
        },
        {
          icon: 'fas fa-user-friends',
          title: 'Fideliza a tus Clientes',
          description: 'La experiencia fluida de reserva y el seguimiento personalizado aumentan la satisfacción y lealtad de tus clientes, generando más recomendaciones y visitas recurrentes.',
          stat: {
            value: '+45%',
            label: 'en retención'
          }
        },
        {
          icon: 'fas fa-chart-pie',
          title: 'Insights Reveladores',
          description: 'Analiza tendencias, horas pico y servicios más solicitados. Toma decisiones estratégicas basadas en datos reales que impactan directamente en tu rentabilidad.',
          stat: {
            value: '22%',
            label: 'aumento en ventas'
          }
        },
        {
          icon: 'fas fa-cogs',
          title: 'Integración Perfecta',
          description: 'Se adapta a tu flujo de trabajo actual sin interrupciones. Compatible con tus herramientas y sistemas existentes, permitiendo una transición suave y sin complicaciones.',
          stat: {
            value: '3',
            label: 'días para implementar'
          }
        }
      ]
    }
  },
  mounted() {
    // Inicializar array de beneficios visibles
    this.benefitInView = new Array(this.benefits.length).fill(false);
    
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
  },
  beforeUnmount() {
    // Limpiar observers cuando el componente se desmonte
    this.benefitObservers.forEach(observer => {
      observer.disconnect();
    });
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