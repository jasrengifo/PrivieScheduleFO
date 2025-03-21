<template>
  <section class="testimonials-section py-5 bg-light">
    <div class="container">
      <div class="row text-center mb-5">
        <div class="col-lg-8 mx-auto">
          <h2 class="fw-bold mb-3">Lo que dicen nuestros clientes</h2>
          <p class="lead text-muted">Descubre por qué cientos de salones de belleza ya confían en nuestra plataforma</p>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(testimonial, index) in testimonials" :key="index">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <img :src="testimonial.avatar" class="rounded-circle mb-3" width="80" height="80" :alt="testimonial.name"
                   onerror="this.src='https://via.placeholder.com/80x80?text=Usuario'">
              <h5 class="card-title">{{ testimonial.name }}</h5>
              <p class="text-muted small">{{ testimonial.role }}</p>
              <div class="mb-3">
                <i class="fas fa-star text-warning" v-for="star in 5" :key="star"></i>
              </div>
              <p class="card-text">{{ testimonial.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TestimonialsSection',
  data() {
    return {
      testimonials: [
        {
          name: 'María González',
          role: 'Propietaria, Salón Belleza Divina',
          avatar: 'https://this-person-does-not-exist.com/img/avatar-gen1142a574ad4e0bb6f9233938b47d4dd0.jpg',
          content: 'Desde que implementamos esta aplicación, hemos reducido las cancelaciones en un 60%. Ahora mis especialistas están ocupados todo el día y nuestros ingresos han aumentado significativamente.'
        },
        {
          name: 'Carlos Rodríguez',
          role: 'Manager, Style Studio',
          avatar: 'https://this-person-does-not-exist.com/img/avatar-gen11fa78a1cd29629b0f15bed2811c20d4.jpg',
          content: 'El asistente de WhatsApp es como tener un recepcionista 24/7. Nuestros clientes adoran la facilidad para agendar a cualquier hora, y yo puedo enfocarme en gestionar el negocio.'
        },
        {
          name: 'Laura Sánchez',
          role: 'Estilista Principal, Beauty Pro',
          avatar: 'https://this-person-does-not-exist.com/img/avatar-genf9c6cd7dfe15451be835c48e6f1ece8c.jpg',
          content: 'Las estadísticas en tiempo real me ayudan a entender qué servicios son más populares en diferentes temporadas. Ahora planifico mucho mejor mis inventarios y capacitaciones.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.testimonials-section {
  position: relative;
  overflow: hidden;
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  margin: 1.5rem auto;
  border-radius: var(--border-radius-full);
}

/* Slider Container */
.testimonials-slider-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

/* Slider Controls */
.testimonials-slider-controls {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-right: 15px;
}

.slider-control {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
}

.slider-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Slider Wrapper */
.testimonials-slider-wrapper {
  overflow: hidden;
  padding: 10px 5px;
}

/* Slider */
.testimonials-slider {
  display: flex;
  transition: transform 0.5s ease;
}

/* Testimonial Card */
.testimonial-card {
  flex: 0 0 calc(33.333% - 20px);
  margin: 0 10px;
  background-color: var(--bg-white);
  border-left: 4px solid var(--primary);
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.testimonial-avatar img {
  width: 60px;
  height: 60px;
  border: 3px solid var(--primary-light);
  padding: 2px;
}

.testimonial-text {
  font-style: italic;
  position: relative;
  z-index: 1;
}

.testimonial-text::before {
  content: '"';
  font-size: 4rem;
  position: absolute;
  top: -20px;
  left: -10px;
  color: var(--primary-very-light);
  z-index: -1;
  font-family: serif;
  opacity: 0.5;
}

.testimonial-highlight {
  display: inline-block;
  background-color: var(--primary-transparent);
  color: var(--primary-dark);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 10px;
}

/* Slider Dots */
.testimonials-slider-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.slider-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--border-light);
  cursor: pointer;
  transition: var(--transition-normal);
}

.slider-dot.active {
  background-color: var(--primary);
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 992px) {
  .testimonial-card {
    flex: 0 0 calc(50% - 20px);
  }
}

@media (max-width: 768px) {
  .testimonial-card {
    flex: 0 0 calc(100% - 20px);
  }
  
  .testimonial-avatar img {
    width: 50px;
    height: 50px;
  }
}
</style>