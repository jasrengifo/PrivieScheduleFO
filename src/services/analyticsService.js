import analyticsConfig from '@/config/analytics';

class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.measurementId = analyticsConfig.measurementId;
    this.options = analyticsConfig.options;
  }

  // Inicializar Google Analytics
  init() {
    if (this.isInitialized) {
      return;
    }
    
    // Cargar el script de Google Analytics (gtag.js)
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);
    
    // Configurar la función gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    }
    
    // Inicializar gtag con tu ID y opciones
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, this.options);
    
    this.isInitialized = true;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Google Analytics inicializado con ID:', this.measurementId);
    }
  }

  // Enviar un evento de página vista
  pageView(path, title) {
    if (!this.isInitialized) {
      this.init();
    }
    
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Página registrada:', path);
      }
    }
  }

  // Enviar un evento personalizado
  event(eventName, eventParams = {}) {
    if (!this.isInitialized) {
      this.init();
    }
    
    if (window.gtag) {
      window.gtag('event', eventName, eventParams);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Evento registrado:', eventName, eventParams);
      }
    }
  }

  // Establecer un ID de usuario para el seguimiento entre dispositivos
  setUserId(userId) {
    if (!this.isInitialized) {
      this.init();
    }
    
    if (window.gtag && userId) {
      window.gtag('set', { user_id: userId });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('User ID establecido:', userId);
      }
    }
  }
}

// Exportar una única instancia para toda la aplicación
export default new AnalyticsService(); 