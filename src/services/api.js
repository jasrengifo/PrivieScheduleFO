// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Headers comunes
const commonHeaders = {
  'Accept': 'application/json',
  'X-API-KEY': API_KEY
};

// Mensajes de error traducidos
const errorMessages = {
  'pt': {
    'default': 'Erro na solicitação',
    'validation': 'Erro de validação',
    'server': 'Erro no servidor',
    'network': 'Erro de conexão',
    'unauthorized': 'Não autorizado'
  },
  'es': {
    'default': 'Error en la petición',
    'validation': 'Error de validación',
    'server': 'Error en el servidor',
    'network': 'Error de conexión',
    'unauthorized': 'No autorizado'
  },
  'en': {
    'default': 'Request error',
    'validation': 'Validation error',
    'server': 'Server error',
    'network': 'Connection error',
    'unauthorized': 'Unauthorized'
  }
};

// Función helper para manejar errores
const handleResponse = async (response, locale = 'pt') => {
  if (!response.ok) {
    const error = await response.json();
    
    // Manejo específico de errores de validación (422)
    if (response.status === 422 && error.errors) {
      throw {
        type: 'validation',
        message: errorMessages[locale].validation,
        errors: error.errors
      };
    }
    
    // Manejo de otros errores HTTP
    const errorType = response.status === 401 ? 'unauthorized' :
                     response.status >= 500 ? 'server' : 'default';
    
    throw {
      type: errorType,
      message: error.message || errorMessages[locale][errorType],
      status: response.status
    };
  }
  
  return response.json();
};

// Servicio de contacto
export const contactService = {
  // Obtener intereses
  getInterests: async (locale = 'pt') => {
    try {
      const response = await fetch(`${API_URL}/contact/interests`, {
        headers: commonHeaders
      });
      return handleResponse(response, locale);
    } catch (error) {
      if (error.type === 'network') {
        throw new Error(errorMessages[locale].network);
      }
      throw error;
    }
  },

  // Obtener tipos de negocios
  getBusinessTypes: async (locale = 'pt') => {
    try {
      const response = await fetch(`${API_URL}/contact/business-types`, {
        headers: commonHeaders
      });
      return handleResponse(response, locale);
    } catch (error) {
      if (error.type === 'network') {
        throw new Error(errorMessages[locale].network);
      }
      throw error;
    }
  },

  // Enviar formulario de contacto
  submitForm: async (formData, locale = 'pt') => {
    try {
      const response = await fetch(`${API_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          ...commonHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      return handleResponse(response, locale);
    } catch (error) {
      if (error.type === 'network') {
        throw new Error(errorMessages[locale].network);
      }
      throw error;
    }
  }
}; 