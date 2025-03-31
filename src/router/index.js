import { createRouter, createWebHistory } from 'vue-router';
import BookingFlow from '../views/booking/BookingFlow.vue';

const routes = [
  {
    path: '/',
    component: () => import('../views/website/LandingPage.vue')
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import('../views/website/LandingPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/initial-setup',
    name: 'initial-setup',
    component: () => import('../views/InitialSetup.vue')
  },
  {
    path: '/business-profile',
    name: 'business-profile',
    component: () => import('../views/BusinessProfile.vue')
  },
  {
    path: '/booking',
    name: 'booking',
    component: BookingFlow
  },
  {
    path: '/booking/:businessSlug',
    name: 'business-booking',
    component: BookingFlow,
    props: true
  },
  // Estas rutas están comentadas hasta que implementemos sus componentes
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   component: () => import('../views/admin/AdminDashboard.vue')
  // },
  // {
  //   path: '/:businessSlug',
  //   name: 'business-site',
  //   component: () => import('../views/website/BusinessSite.vue'),
  //   props: true
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;