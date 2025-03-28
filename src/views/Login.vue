<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <img src="/img/logo.svg" alt="Logo" class="auth-logo">
        <h2>{{ $t('login.welcome_back') }}</h2>
      </div>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">{{ $t('login.email') }}</label>
          <input 
            type="email" 
            id="email"
            v-model="email"
            :placeholder="$t('login.email_placeholder')"
            required
            class="form-control"
          >
        </div>
        
        <div class="form-group">
          <label for="password">{{ $t('login.password') }}</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              :placeholder="$t('login.password_placeholder')"
              required
              class="form-control"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            {{ $t('login.remember_me') }}
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            {{ $t('login.forgot_password') }}
          </router-link>
        </div>
        
        <button type="submit" class="btn-primary btn-block" :disabled="loading">
          <span v-if="!loading">{{ $t('login.sign_in') }}</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
      
      <div class="auth-footer">
        <p>{{ $t('login.no_account') }} 
          <router-link to="/register">{{ $t('login.sign_up') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Login',
  setup() {
    const { locale } = useI18n()
    const router = useRouter()
    const store = useStore()

    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const showPassword = ref(false)
    const loading = ref(false)

    const handleLogin = async () => {
      try {
        loading.value = true
        await store.dispatch('auth/login', {
          email: email.value,
          password: password.value,
          rememberMe: rememberMe.value
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Error en login:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      rememberMe,
      showPassword,
      loading,
      handleLogin,
      locale
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, rgb(10 89 122 / 14%), rgb(10 89 122 / 5%));
  backdrop-filter: blur(10px);
}

.auth-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.auth-logo {
  width: 80px;
  height: auto;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

.auth-header h2 {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.form-group label {
  display: block;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-control:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: rgba(255, 255, 255, 0.8);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.forgot-password {
  color: #ffffff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: rgba(255, 255, 255, 0.8);
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
}

.btn-primary:disabled {
  background: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.auth-footer p {
  color: #ffffff;
  font-size: 0.95rem;
  margin: 0;
}

.auth-footer a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-footer a:hover {
  color: #357abd;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 