export const API_CONFIG = {
  baseURL: process.env.VUE_APP_API_URL,
  apiKey: process.env.VUE_APP_API_KEY,
  version: process.env.VUE_APP_API_VERSION,
  timeout: parseInt(process.env.VUE_APP_TIMEOUT)
} 