// Configuración de Google Analytics
export default {
  // ID de medición de Google Analytics
  measurementId: 'G-3ZFHEG22P8', // Reemplaza esto con tu ID real de GA4
  
  // Opciones adicionales de configuración
  options: {
    debug_mode: process.env.NODE_ENV === 'development',
    send_page_view: true,
    anonymize_ip: true,
    // Puedes agregar más opciones según necesites
  }
}; 