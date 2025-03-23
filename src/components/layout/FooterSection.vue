<template>
  <footer class="site-footer">
    <!-- Contenido actual -->
    <div class="footer-links">
      <div class="link-group">
        <h5>{{ footerLinksTitle }}</h5>
        <ul>
          <li v-for="(link, index) in links" :key="index">
            <a :href="link.url" @click="trackFooterLinkClick(link.title)">{{ link.title }}</a>
          </li>
        </ul>
      </div>
      <!-- Otros grupos de enlaces -->
    </div>
    
    <div class="newsletter-form">
      <h5>{{ newsletterTitle }}</h5>
      <form @submit.prevent="subscribeNewsletter">
        <div class="input-group">
          <input type="email" v-model="email" :placeholder="newsletterPlaceholder" required>
          <button type="submit" class="btn btn-primary">{{ newsletterButtonText }}</button>
        </div>
      </form>
    </div>
    
    <div class="social-links">
      <a v-for="(social, index) in socialLinks" :key="index" :href="social.url" :aria-label="social.name" @click="trackSocialClick(social.name)">
        <i :class="social.icon"></i>
      </a>
    </div>
  </footer>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'FooterSection',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  data() {
    return {
      email: ''
    }
  },
  // tus computed properties actuales...
  
  methods: {
    subscribeNewsletter() {
      // Tu lógica de suscripción...
      
      // Registrar el evento de suscripción al boletín
      this.$analytics.event('newsletter_subscribe', {
        source: 'footer',
        language: this.locale
      });
      
      this.email = ''; // Limpiar el campo
    },
    
    trackFooterLinkClick(linkTitle) {
      this.$analytics.event('footer_link_click', {
        link_title: linkTitle,
        language: this.locale
      });
    },
    
    trackSocialClick(socialName) {
      this.$analytics.event('social_link_click', {
        social_platform: socialName,
        source: 'footer',
        language: this.locale
      });
    }
  },
  mounted() {
    // Registrar visualización del footer (siempre se muestra al final)
    this.$analytics.event('section_view', {
      section_name: 'footer',
      language: this.locale
    });
  }
}
</script> 