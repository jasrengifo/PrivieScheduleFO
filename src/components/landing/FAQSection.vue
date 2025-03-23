<template>
  <section class="faq-section" id="faq" ref="faqSection">
    <!-- Contenido actual -->
    <div class="accordion" id="faqAccordion">
      <div v-for="(faq, index) in faqs" :key="index" class="accordion-item">
        <h2 class="accordion-header" :id="'faq-heading-' + index">
          <button 
            class="accordion-button" 
            :class="{ collapsed: activeIndex !== index }"
            @click="toggleFaq(index)"
          >
            {{ faq.question }}
          </button>
        </h2>
        <div :id="'faq-collapse-' + index" class="accordion-collapse collapse" :class="{ show: activeIndex === index }">
          <div class="accordion-body">{{ faq.answer }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'FAQSection',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  data() {
    return {
      activeIndex: -1
    }
  },
  // tus computed properties actuales...
  
  methods: {
    toggleFaq(index) {
      const wasActive = this.activeIndex === index;
      this.activeIndex = wasActive ? -1 : index;
      
      if (!wasActive) {
        // Solo registrar cuando se abre una pregunta
        this.$analytics.event('faq_open', {
          question_index: index,
          question_text: this.faqs[index].question,
          language: this.locale
        });
      }
    }
  },
  mounted() {
    // Crear un observer para detectar cuándo el usuario ve la sección de FAQ
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.$analytics.event('section_view', {
            section_name: 'faq',
            language: this.locale
          });
          // Desconectar el observer después de registrar una vez
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.$refs.faqSection);
  }
}
</script> 