<template>
  <div class="login-container">
    <div class="auth-card">
      <div class="login-header">
        <h1 class="login-title">{{ $t('login.title') }}</h1>
        <p class="login-subtitle">{{ $t('login.welcome_back') }}</p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email" class="form-label">{{ $t('login.email') }}</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-input"
            :placeholder="$t('login.email_placeholder')"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">{{ $t('login.password') }}</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="form-input"
              :placeholder="$t('login.password_placeholder')"
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
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn-login">
          <i class="fas fa-sign-in-alt"></i>
          {{ $t('login.sign_in') }}
        </button>

        <div class="forgot-password">
          <a href="#" @click.prevent="forgotPassword">{{ $t('login.forgot_password') }}</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'LoginForm',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  data() {
    return {
      email: '',
      password: '',
      error: null,
      showPassword: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.error = null
        // Aquí iría la lógica de autenticación
        await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        })
        this.$router.push('/')
      } catch (err) {
        this.error = err.message || this.$t('login.error')
      }
    },
    forgotPassword() {
      // Implementar recuperación de contraseña
      console.log('Recuperar contraseña')
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #673ab7 0%, #7e57c2 50%, #9575ff 100%);
  position: relative;
  overflow: hidden;
}

.login-container::before {
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
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  color: #673ab7;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.login-subtitle {
  color: #7e57c2;
  font-size: 1.1rem;
  margin: 0;
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

.btn-login {
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

.btn-login:hover {
  background: #7e57c2;
  transform: translateY(-1px);
}

.btn-login:active {
  transform: translateY(0);
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

.forgot-password {
  text-align: center;
  margin-top: 1.5rem;
}

.forgot-password a {
  color: #7e57c2;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.forgot-password a:hover {
  color: #673ab7;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .auth-card {
    padding: 2rem;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .login-subtitle {
    font-size: 1rem;
  }
}
</style> 