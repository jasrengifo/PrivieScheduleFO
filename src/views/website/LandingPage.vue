<template>
  <div class="landing-page">
    <HeroSection />
    <BenefitsSection />
    <TimelineSection />
    <StatsSection />
    <PricingSection />
    <FeaturesSection />
    
    
    <!-- <AISection /> -->
    

    <FutureFeaturesSection />
    
    <ContactSection />
    <!-- <FloatingCTA /> -->
    <!-- <TestimonialsSection /> -->
  </div>
</template>

<script>
import HeroSection from '../../components/landing/HeroSection.vue';
import FeaturesSection from '../../components/landing/FeaturesSection.vue';
import BenefitsSection from '../../components/landing/BenefitsSection.vue';
import TimelineSection from '../../components/landing/TimelineSection.vue';
import StatsSection from '../../components/landing/StatsSection.vue';
import AISection from '../../components/landing/AISection.vue';
import FutureFeaturesSection from '../../components/landing/FutureFeaturesSection.vue';
// import TestimonialsSection from '../../components/landing/TestimonialsSection.vue';
import PricingSection from '../../components/landing/PricingSection.vue';
import ContactSection from '../../components/landing/ContactSection.vue';
// import FloatingCTA from '../../components/landing/FloatingCTA.vue';

export default {
  name: 'LandingPage',
  components: {
    HeroSection,
    FeaturesSection,
    BenefitsSection,
    TimelineSection,
    StatsSection,
    AISection,
    FutureFeaturesSection,
    // TestimonialsSection,
    // FloatingCTA,
    PricingSection,
    ContactSection
  }
};
</script>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
}
</style>