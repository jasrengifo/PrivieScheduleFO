<template>
  <div class="landing-page">
    <FloatingCTA v-if="showFloatingCTA" @close="dismissFloatingCTA" />
    <ExitIntentPopup v-if="showExitPopup" @close="closeExitPopup" />
    <div class="scroll-progress-bar" :style="{width: scrollProgress + '%'}"></div>
    <div class="scroll-to-top" v-show="showScrollTop" @click="scrollToTop">
      <i class="fas fa-chevron-up"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  components: {
    FloatingCTA: () => import('./FloatingCTA.vue'),
    ExitIntentPopup: () => import('./ExitIntentPopup.vue')
  },
  data() {
    return {
      showFloatingCTA: false,
      showExitPopup: false,
      scrollThreshold: 300,
      exitIntent: false,
      scrollProgress: 0,
      showScrollTop: false,
      sessionEngagement: {
        timeOnPage: 0,
        scrollDepth: 0,
        sections: {
          hero: false,
          features: false,
          benefits: false,
          pricing: false
        }
      }
    }
  },
  mounted() {
    this.trackScrollBehavior();
    this.trackTimeOnPage();
    this.detectExitIntent();
    this.applyOptimalColorScheme();
    this.initializeAnimations();
  },
  methods: {
    trackScrollBehavior() {
      window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        this.scrollProgress = Math.round((scrollPosition / scrollHeight) * 100);
        
        this.showScrollTop = scrollPosition > 600;
        
        this.sessionEngagement.scrollDepth = Math.max(
          this.sessionEngagement.scrollDepth,
          Math.round((scrollPosition / scrollHeight) * 100)
        );
        
        if (scrollPosition > this.scrollThreshold && !this.showFloatingCTA) {
          this.showFloatingCTA = true;
        }
        
        this.trackSectionVisibility();
      });
    },
    trackTimeOnPage() {
      const interval = setInterval(() => {
        this.sessionEngagement.timeOnPage += 1;
        
        if (this.sessionEngagement.timeOnPage === 60 && !this.exitIntent) {
          this.showSpecialOffer();
        }
      }, 1000);
      
      this.$once('hook:beforeDestroy', () => {
        clearInterval(interval);
      });
    },
    detectExitIntent() {
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 10 && !this.exitIntent && this.sessionEngagement.timeOnPage > 10) {
          this.exitIntent = true;
          this.showExitPopup = true;
        }
      });
    },
    dismissFloatingCTA() {
      this.showFloatingCTA = false;
      this.scrollThreshold = 1500;
    },
    closeExitPopup() {
      this.showExitPopup = false;
    },
    trackSectionVisibility() {
      // Implementar lógica para detectar qué secciones están visibles
      // Usar Intersection Observer para mejor rendimiento
    },
    applyOptimalColorScheme() {
      const currentHour = new Date().getHours();
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (currentHour > 20 || currentHour < 7 || prefersDark) {
        document.body.classList.add('dark-optimized');
      } else {
        document.body.classList.add('light-optimized');
      }
    },
    showSpecialOffer() {
      // Lógica para mostrar oferta especial basada en tiempo en página
    },
    initializeAnimations() {
      const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', entry.target.dataset.animation);
            animateOnScroll.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      
      document.querySelectorAll('[data-animation]').forEach(element => {
        animateOnScroll.observe(element);
      });
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
</script>

<style>
:root {
  --primary: #7e22ce;
  --primary-light: #a855f7;
  --primary-dark: #581c87;
  --accent: #f59e0b;
  --accent-light: #fbbf24;
  --accent-dark: #d97706;
  --text-dark: #171717;
  --text-light: #f8fafc;
  --text-muted: #64748b;
  --background-light: #ffffff;
  --background-dark: #030712;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 4rem;
  --spacing-xl: 8rem;
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}

.highlight-box {
  position: relative;
  border: 1px solid var(--primary-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, rgba(126, 34, 206, 0.05), rgba(168, 85, 247, 0.1));
  overflow: hidden;
}

.highlight-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.cta-primary {
  background: linear-gradient(90deg, var(--accent), var(--accent-dark));
  color: var(--text-light);
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  border: none;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.cta-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  z-index: -1;
}

.cta-primary:hover::after {
  animation: shine 1.5s infinite;
}

@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 991.98px) {
  :root {
    --spacing-lg: 3rem;
    --spacing-xl: 5rem;
  }
  
  .highlight-box {
    padding: var(--spacing-sm);
  }
}

@media (max-width: 767.98px) {
  :root {
    --spacing-md: 1.5rem;
    --spacing-lg: 2.5rem;
    --spacing-xl: 4rem;
  }
  
  .cta-primary {
    padding: 0.75rem 1.5rem;
    width: 100%;
  }
}

.dark-optimized {
  --text-dark: #f8fafc;
  --text-light: #0f172a;
  --background-light: #1e293b;
  --background-dark: #0f172a;
  --text-muted: #94a3b8;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity var(--transition-normal);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--primary));
  z-index: 9998;
  width: 0%;
  transition: width 0.2s ease;
}

.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 45px;
  height: 45px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 99;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s;
}

.scroll-to-top:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  background: var(--primary-dark);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatingAnimation {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.floating {
  animation: floatingAnimation 3s ease-in-out infinite;
}

.staggered-fade > * {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.staggered-fade.animated > *:nth-child(1) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.1s;
}

.staggered-fade.animated > *:nth-child(2) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.2s;
}

.staggered-fade.animated > *:nth-child(3) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.3s;
}

.staggered-fade.animated > *:nth-child(4) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.4s;
}

.staggered-fade.animated > *:nth-child(5) { 
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.5s;
}

.delay-100 { animation-delay: 0.1s !important; }
.delay-200 { animation-delay: 0.2s !important; }
.delay-300 { animation-delay: 0.3s !important; }
.delay-400 { animation-delay: 0.4s !important; }
.delay-500 { animation-delay: 0.5s !important; }

.duration-500 { animation-duration: 0.5s !important; }
.duration-800 { animation-duration: 0.8s !important; }
.duration-1000 { animation-duration: 1s !important; }
.duration-1500 { animation-duration: 1.5s !important; }
.duration-2000 { animation-duration: 2s !important; }
</style> 