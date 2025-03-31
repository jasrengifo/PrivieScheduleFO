<template>
  <div class="register-container">
    <div class="auth-card">
      <div class="register-header">
        <h1 class="register-title">{{ $t('register.create_account') }}</h1>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">{{ $t('register.first_name') }}</label>
            <input
              type="text"
              id="firstName"
              v-model="firstName"
              class="form-input"
              :placeholder="$t('register.first_name_placeholder')"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">{{ $t('register.last_name') }}</label>
            <input
              type="text"
              id="lastName"
              v-model="lastName"
              class="form-input"
              :placeholder="$t('register.last_name_placeholder')"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">{{ $t('register.email') }}</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-input"
            :placeholder="$t('register.email_placeholder')"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">{{ $t('register.phone') }}</label>
          <input
            type="tel"
            id="phone"
            v-model="phone"
            class="form-input"
            :placeholder="$t('register.phone_placeholder')"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">{{ $t('register.password') }}</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="form-input"
              :placeholder="$t('register.password_placeholder')"
              required
            />
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
          <label for="confirmPassword" class="form-label">{{ $t('register.confirm_password') }}</label>
          <div class="password-input">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              class="form-input"
              :class="{'error': !passwordsMatch && confirmPassword}"
              :placeholder="$t('register.confirm_password_placeholder')"
              required
            />
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

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="btn-register"
          :disabled="loading || !isFormValid"
        >
          <span v-if="!loading">
            <i class="fas fa-user-plus"></i>
            {{ $t('register.create_account') }}
          </span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <div class="register-footer">
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
  name: 'RegisterForm',
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
    const error = ref(null)

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

    const handleSubmit = async () => {
      if (!isFormValid.value) return;
      
      loading.value = true;
      error.value = null;
      
      try {
        // Aquí iría la llamada a la API para registrar al usuario
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
        
        // Redirigir a la configuración inicial
        router.push('/initial-setup');
      } catch (err) {
        error.value = err.message || 'Error al crear la cuenta';
      } finally {
        loading.value = false;
      }
    };

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
      error,
      passwordsMatch,
      passwordStrengthText,
      strengthBarStyle,
      isFormValid,
      handleSubmit,
      locale
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #673ab7 0%, #7e57c2 50%, #9575ff 100%);
  position: relative;
  overflow: hidden;
}

.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/img/pattern.png') repeat;
  opacity: 0.1;
  pointer-events: none;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-title {
  font-size: 2rem;
  color: #673ab7;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: #673ab7;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
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
  color: #7e57c2;
  cursor: pointer;
  padding: 0;
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #673ab7;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #b39dfb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  color: #673ab7;
}

.form-input:focus {
  outline: none;
  border-color: #7e57c2;
  box-shadow: 0 0 0 3px rgba(126, 87, 194, 0.1);
}

.form-input::placeholder {
  color: #b39dfb;
}

.form-input.error {
  border-color: #d32f2f;
  background: #ffebee;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin-bottom: 0.25rem;
  transition: all 0.3s;
  overflow: hidden;
}

.strength-text {
  font-size: 0.8rem;
  color: #6c757d;
}

.terms {
  margin: 1.5rem 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #673ab7;
  font-size: 0.9rem;
  line-height: 1.4;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border: 2px solid #b39dfb;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px;
  accent-color: #673ab7;
}

.checkbox-label a {
  color: #7e57c2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.checkbox-label a:hover {
  color: #673ab7;
  text-decoration: underline;
}

.btn-register {
  width: 100%;
  padding: 0.875rem;
  background: #673ab7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-register:hover:not(:disabled) {
  background: #7e57c2;
  transform: translateY(-1px);
}

.btn-register:active:not(:disabled) {
  transform: translateY(0);
}

.btn-register:disabled {
  background: #b39dfb;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  background: #ffebee;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ffcdd2;
}

.register-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #673ab7;
}

.register-footer a {
  color: #7e57c2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.register-footer a:hover {
  color: #673ab7;
  text-decoration: underline;
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .register-container {
    padding: 1rem;
  }

  .auth-card {
    padding: 2rem;
  }

  .register-title {
    font-size: 1.75rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style> 