<template>
  <form @submit.prevent="submitForm">
    <!-- Campos del formulario... -->
    <button type="submit">{{ submitButtonText }}</button>
  </form>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';

// Inyectar el servicio de analytics
const analytics = inject('analytics');
const { locale } = useI18n();

const formData = ref({
  name: '',
  email: '',
  message: ''
});

const submitForm = () => {
  // Lógica para enviar el formulario...
  
  // Enviar evento de envío de formulario a Google Analytics
  analytics.event('form_submit', {
    form_id: 'contact_form',
    language: locale.value,
    page: window.location.pathname
  });
  
  // Restablecer formulario...
  formData.value = { name: '', email: '', message: '' };
};

const submitButtonText = computed(() => {
  const texts = {
    'pt': 'Enviar Mensagem',
    'es': 'Enviar Mensaje',
    'en': 'Send Message'
  };
  return texts[locale.value] || texts.pt;
});
</script> 