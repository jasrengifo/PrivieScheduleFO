import analyticsService from '@/services/analyticsService';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  install: (app, options) => {
    // Hacer que el servicio de analytics esté disponible globalmente en la app
    app.config.globalProperties.$analytics = analyticsService;
    
    // También lo hacemos disponible mediante la inyección
    app.provide('analytics', analyticsService);
    
    // Inicializar Google Analytics
    analyticsService.init();
    
    // Integración automática con vue-router si está disponible
    if (options?.router) {
      options.router.beforeEach((to, from, next) => {
        // No rastrear en desarrollo si así se configura
        if (process.env.NODE_ENV === 'development' && !analyticsService.options.debug_mode) {
          next();
          return;
        }
        
        // Obtener el nuevo título de página basado en la ruta
        const pageTitle = to.meta.title || document.title;
        
        // Enviar evento de cambio de página
        analyticsService.pageView(to.path, pageTitle);
        
        next();
      });
    }
  }
}; 