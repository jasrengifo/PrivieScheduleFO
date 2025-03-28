<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <img src="/img/logo.svg" alt="Logo" class="auth-logo">
        <h2>{{ $t('register.create_account') }}</h2>
      </div>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">{{ $t('register.first_name') }}</label>
            <input 
              type="text" 
              id="firstName"
              v-model="firstName"
              :placeholder="$t('register.first_name_placeholder')"
              required
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label for="lastName">{{ $t('register.last_name') }}</label>
            <input 
              type="text" 
              id="lastName"
              v-model="lastName"
              :placeholder="$t('register.last_name_placeholder')"
              required
              class="form-control"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">{{ $t('register.email') }}</label>
          <input 
            type="email" 
            id="email"
            v-model="email"
            :placeholder="$t('register.email_placeholder')"
            required
            class="form-control"
          >
        </div>
        
        <div class="form-group">
          <label for="phone">{{ $t('register.phone') }}</label>
          <input 
            type="tel" 
            id="phone"
            v-model="phone"
            :placeholder="$t('register.phone_placeholder')"
            required
            class="form-control"
          >
        </div>
        
        <div class="form-group">
          <label for="password">{{ $t('register.password') }}</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              :placeholder="$t('register.password_placeholder')"
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
          <div class="password-strength" v-if="password">
            <div class="strength-bar" :style="strengthBarStyle"></div>
            <span class="strength-text">{{ passwordStrengthText }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">{{ $t('register.confirm_password') }}</label>
          <div class="password-input">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              :placeholder="$t('register.confirm_password_placeholder')"
              required
              class="form-control"
              :class="{'error': !passwordsMatch && confirmPassword}"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="!passwordsMatch && confirmPassword">
            {{ $t('register.passwords_dont_match') }}
          </span>
        </div>
        
        <div class="form-group terms">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="acceptTerms"
              required
            >
            <span>{{ $t('register.accept_terms_1') }} 
              <a href="/terms" target="_blank">{{ $t('register.terms') }}</a> 
              {{ $t('register.and') }} 
              <a href="/privacy" target="_blank">{{ $t('register.privacy') }}</a>
            </span>
          </label>
        </div>
        
        <button 
          type="submit" 
          class="btn-primary btn-block" 
          :disabled="loading || !isFormValid"
        >
          <span v-if="!loading">{{ $t('register.create_account') }}</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
      
      <div class="auth-footer">
        <p>{{ $t('register.already_have_account') }} 
          <router-link to="/login">{{ $t('register.sign_in') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Register',
  setup() {
    const { locale } = useI18n()
    const router = useRouter()
    const store = useStore()

    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const phone = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const acceptTerms = ref(false)
    const loading = ref(false)

    const passwordsMatch = computed(() => {
      return !confirmPassword.value || password.value === confirmPassword.value
    })

    const passwordStrength = computed(() => {
      let strength = 0
      if (password.value.length >= 8) strength++
      if (/[A-Z]/.test(password.value)) strength++
      if (/[0-9]/.test(password.value)) strength++
      if (/[^A-Za-z0-9]/.test(password.value)) strength++
      return strength
    })

    const passwordStrengthText = computed(() => {
      const strengths = ['Débil', 'Regular', 'Buena', 'Fuerte']
      return strengths[passwordStrength.value - 1] || ''
    })

    const strengthBarStyle = computed(() => {
      const colors = ['#ff4444', '#ffbb33', '#00C851', '#007E33']
      return {
        width: `${(passwordStrength.value / 4) * 100}%`,
        backgroundColor: colors[passwordStrength.value - 1]
      }
    })

    const isFormValid = computed(() => {
      return firstName.value && 
             lastName.value && 
             email.value && 
             phone.value && 
             password.value && 
             confirmPassword.value && 
             passwordsMatch.value && 
             acceptTerms.value
    })

    const handleRegister = async () => {
      if (!isFormValid.value) return
      
      try {
        loading.value = true
        await store.dispatch('auth/register', {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
          password: password.value
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Error en registro:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      acceptTerms,
      loading,
      passwordsMatch,
      passwordStrengthText,
      strengthBarStyle,
      isFormValid,
      handleRegister,
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
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-logo {
  width: 150px;
  margin-bottom: 20px;
}

.auth-header h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8f9fa;
}

.form-control:focus {
  border-color: rgb(10 89 122);
  background: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(10, 89, 122, 0.1);
}

.form-control::placeholder {
  color: #adb5bd;
}

.form-control.error {
  border-color: #dc3545;
  background: #fff5f5;
}

.form-control.error:focus {
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #2c3e50;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin-bottom: 6px;
  transition: all 0.3s;
  overflow: hidden;
}

.strength-text {
  font-size: 0.8rem;
  color: #6c757d;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 4px;
}

.terms {
  margin: 24px 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border: 2px solid #adb5bd;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px;
}

.checkbox-label a {
  color: rgb(10 89 122);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.checkbox-label a:hover {
  color: rgb(8 71 98);
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: rgb(10 89 122);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: rgb(8 71 98);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(10, 89, 122, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: none;
}

.btn-primary:disabled {
  background: #adb5bd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-footer a {
  color: rgb(10 89 122);
  text-decoration: none;
  font-weight: 500;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .auth-card {
    padding: 20px;
  }
  
  .auth-header h2 {
    font-size: 1.5rem;
  }
}
</style> 