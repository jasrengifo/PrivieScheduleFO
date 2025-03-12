import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

import './style.css'

// Importar estilos globales (puedes crear este archivo)
import './assets/css/main.css'

createApp(App).use(router).mount('#app')

