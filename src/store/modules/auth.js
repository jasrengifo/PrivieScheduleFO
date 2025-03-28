// Estado inicial
const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false
}

// Getters
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  currentUser: state => state.user
}

// Acciones
const actions = {
  async login({ commit }, { email, password, rememberMe }) {
    try {
      // TODO: Implementar llamada a API real
      const mockResponse = {
        token: 'mock-token',
        user: {
          id: 1,
          email,
          name: 'Usuario Demo'
        }
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (rememberMe) {
        localStorage.setItem('token', mockResponse.token)
      }

      commit('SET_AUTH_SUCCESS', mockResponse)
      return mockResponse
    } catch (error) {
      commit('SET_AUTH_ERROR')
      throw error
    }
  },

  async register({ commit }, userData) {
    try {
      // TODO: Implementar llamada a API real
      const mockResponse = {
        token: 'mock-token',
        user: {
          id: 1,
          ...userData
        }
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))

      localStorage.setItem('token', mockResponse.token)
      commit('SET_AUTH_SUCCESS', mockResponse)
      return mockResponse
    } catch (error) {
      commit('SET_AUTH_ERROR')
      throw error
    }
  },

  logout({ commit }) {
    localStorage.removeItem('token')
    commit('SET_LOGOUT')
  }
}

// Mutaciones
const mutations = {
  SET_AUTH_SUCCESS(state, { token, user }) {
    state.token = token
    state.user = user
    state.isAuthenticated = true
  },

  SET_AUTH_ERROR(state) {
    state.token = null
    state.user = null
    state.isAuthenticated = false
  },

  SET_LOGOUT(state) {
    state.token = null
    state.user = null
    state.isAuthenticated = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} 