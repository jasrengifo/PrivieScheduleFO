import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import i18n from './i18n'

import './style.css'

// Importar estilos globales (puedes crear este archivo)
import './assets/css/main.css'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')

