export default {
  data() {
    return {
      scrollDepths: [25, 50, 75, 90],
      trackedScrollDepths: [],
      scrollHandler: null
    }
  },
  mounted() {
    // Establecer un oyente para el seguimiento de desplazamiento
    this.scrollHandler = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.scrollHandler);
  },
  beforeUnmount() {
    // Limpiar el oyente
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  },
  methods: {
    handleScroll() {
      // Calcular la profundidad de desplazamiento en porcentaje
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight, 
        document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight;
      const scrollPercent = Math.floor((scrollTop / (docHeight - windowHeight)) * 100);
      
      // Verificar si se ha alcanzado algún punto de seguimiento no registrado
      this.scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !this.trackedScrollDepths.includes(depth)) {
          this.trackedScrollDepths.push(depth);
          
          // Registrar el evento de profundidad de desplazamiento
          this.$analytics.event('scroll_depth', {
            scroll_percent: depth,
            page_title: document.title,
            url: window.location.pathname,
            language: this.$i18n ? this.$i18n.locale : 'unknown'
          });
        }
      });
    }
  }
} 