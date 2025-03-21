<template>
  <section class="stats-section py-5" ref="statsSection">
    <div class="container">
      <div class="row justify-content-center mb-4">
        <div class="col-lg-8 text-center">
          <h2 class="stats-title">Cifras que Hablan por Sí Mismas</h2>
          <p class="stats-subtitle">Resultados reales de negocios como el tuyo</p>
        </div>
      </div>
      
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 stats-container">
        <div class="col" v-for="(stat, index) in stats" :key="index">
          <div class="stats-card">
            <div class="stats-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stats-value">
              <span class="counter" :data-target="stat.value">0</span>
              <span v-if="stat.suffix">{{ stat.suffix }}</span>
            </div>
            <h3 class="stats-label">{{ stat.label }}</h3>
            <p class="stats-description">{{ stat.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'StatsSection',
  data() {
    return {
      observer: null,
      animated: false,
      stats: [
        {
          icon: 'fas fa-calendar-alt',
          value: 35000,
          suffix: '+',
          label: 'Citas Mensuales',
          description: 'Agendadas automáticamente a través de nuestra plataforma'
        },
        {
          icon: 'fas fa-business-time',
          value: 68,
          suffix: '%',
          label: 'Menos Cancelaciones',
          description: 'Gracias a recordatorios automáticos y confirmaciones'
        },
        {
          icon: 'fas fa-clock',
          value: 12,
          suffix: 'h',
          label: 'Tiempo Ahorrado',
          description: 'Semanalmente en tareas administrativas por negocio'
        },
        {
          icon: 'fas fa-chart-line',
          value: 42,
          suffix: '%',
          label: 'Aumento de Ingresos',
          description: 'Promedio en negocios con 6 meses de uso'
        }
      ]
    }
  },
  mounted() {
    // Configurar Intersection Observer para detectar cuando la sección está visible
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateCounters();
        }
      });
    }, { threshold: 0.2 }); // Activar cuando al menos el 20% de la sección sea visible
    
    this.observer.observe(this.$refs.statsSection);
  },
  beforeUnmount() {
    // Limpiar el observer cuando el componente se desmonte
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    animateCounters() {
      const counters = document.querySelectorAll('.counter');
      const speed = 200; // Velocidad de la animación (menor = más rápido)
      
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = Math.ceil(target / speed);
        let currentCount = 0;
        
        const updateCount = () => {
          currentCount += increment;
          
          if (currentCount < target) {
            counter.innerText = currentCount.toLocaleString();
            setTimeout(updateCount, 1);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };
        
        updateCount();
      });
    }
  }
}
</script>

<style scoped>
.stats-section {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  position: relative;
  overflow: hidden;
  padding: 80px 0;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 100%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
}

.stats-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  background: linear-gradient(90deg, #ffffff, #e0e0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stats-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

.stats-container {
  position: relative;
}

.stats-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 40px 0 rgba(31, 38, 135, 0.3);
}

.stats-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(45deg, #00c6ff, #0072ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stats-icon i {
  font-size: 30px;
  color: white;
}

.stats-value {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 10px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-label {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: white;
}

.stats-description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0;
}

@media (max-width: 991.98px) {
  .stats-title {
    font-size: 2.2rem;
  }
  
  .stats-icon {
    width: 60px;
    height: 60px;
  }
  
  .stats-icon i {
    font-size: 25px;
  }
  
  .stats-value {
    font-size: 2.8rem;
  }
  
  .stats-label {
    font-size: 1.2rem;
  }
}

@media (max-width: 767.98px) {
  .stats-card {
    padding: 25px 15px;
  }
  
  .stats-title {
    font-size: 1.8rem;
  }
  
  .stats-subtitle {
    font-size: 1.1rem;
  }
  
  .stats-value {
    font-size: 2.5rem;
  }
}
</style>