/**
 * Función auxiliar para manejar URLs de fotos
 * - Si la URL ya es absoluta (comienza con http), la usa directamente
 * - Si no, asume que es un ID o ruta relativa y utiliza un placeholder
 */
export const getPhotoUrl = (photo) => {
    // Si la foto es una URL completa, usarla directamente
    if (photo && (photo.startsWith('http://') || photo.startsWith('https://'))) {
      return photo;
    }
    
    // Si no hay foto, usar placeholder genérico
    if (!photo) {
      return 'https://via.placeholder.com/300x200/e0e0e0/888888?text=No+Image';
    }
    
    // Para desarrollo local, generar placeholder basado en el ID o nombre de archivo
    return `https://via.placeholder.com/300x200/e0e0e0/888888?text=${encodeURIComponent(photo)}`;
  };