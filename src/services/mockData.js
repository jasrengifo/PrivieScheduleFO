

// Helper para generar URLs de imágenes temporales
const getRandomImage = (type, id) => {
  // Opciones de APIs para imágenes temporales:
  
  // 1. Picsum Photos (fotos aleatorias de alta calidad)
  // return `https://picsum.photos/seed/${type}${id}/300/200`;
  
  // 2. PlaceHolder.com (marcadores simples con dimensiones)
  // return `https://via.placeholder.com/300x200/e0e0e0/888888?text=${type}+${id}`;
  
  // 3. Lorem Flickr (imágenes de Flickr)
  // return `https://loremflickr.com/300/200/${type}?lock=${id}`;
  
  // 4. Unsplash API (fotos de alta calidad con categorías)
  return `https://source.unsplash.com/300x200/?${type}`;
};

// URLs específicas para esteticistas - imágenes de retratos profesionales
const getAestheticianImage = (id) => {
  // Usando Unsplash para fotos de personas profesionales

  if(id==1){
      return new URL('@/assets/images/example/profile-img.jpg', import.meta.url).href;
  }

  return `https://source.unsplash.com/300x300/?portrait,professional,woman`;
  
  // Alternativa: Usar ThisPersonDoesNotExist para rostros generados por IA
  // Nota: Añadimos un parámetro aleatorio para evitar caché
  // return `https://thispersondoesnotexist.com/?v=${id}-${Date.now()}`;
};

export const aestheticians = [
  {
    id: 1,
    name: 'Emily Hernandez',
    photo: getAestheticianImage(1),
    specialties: ['Manicura', 'Pestanas'],
    businessId: 1,
    serviceIds: [1, 2, 3] // Manicura
  },
  {
    id: 2,
    name: 'María López',
    photo: getAestheticianImage(2),
    specialties: ['Pedicura', 'Masajes'],
    businessId: 1,
    serviceIds: [3] // Pedicura
  },
  {
    id: 3,
    name: 'Laura Sánchez',
    photo: getAestheticianImage(3),
    specialties: ['Maquillaje', 'Depilación'],
    businessId: 1,
    serviceIds: [2] // Facial
  }
];

export const services = [
  {
    id: 1,
    name: 'Manicura',
    description: 'Manicura completa con esmaltado',
    photo: new URL('@/assets/images/example/services/1.jpg', import.meta.url).href,
    price: 25,
    duration: 45, // minutos
    businessId: 1,
    extras: [
      {
        id: 101,
        name: 'Diseño de uñas',
        description: 'Diseños personalizados',
        photo: getRandomImage('nailart', 101),
        price: 10,
        duration: 15
      },
      {
        id: 102,
        name: 'Esmaltado permanente',
        description: 'Duración extendida',
        photo: getRandomImage('nailpolish', 102),
        price: 15,
        duration: 20
      }
    ]
  },
  {
    id: 2,
    name: 'Facial',
    description: 'Tratamiento facial completo',
    photo: new URL('@/assets/images/example/services/2.jpg', import.meta.url).href,
    price: 40,
    duration: 60,
    businessId: 1,
    extras: [
      {
        id: 201,
        name: 'Mascarilla premium',
        description: 'Mascarilla antienvejecimiento',
        photo: getRandomImage('facemask', 201),
        price: 20,
        duration: 15
      }
    ]
  },
  {
    id: 3,
    name: 'Pedicura',
    description: 'Pedicura spa con exfoliación',
    photo: new URL('@/assets/images/example/services/3.jpg', import.meta.url).href,
    price: 30,
    duration: 50,
    businessId: 1,
    extras: [
      {
        id: 301,
        name: 'Masaje de pies',
        description: 'Masaje relajante de 10 minutos',
        photo: getRandomImage('footmassage', 301),
        price: 15,
        duration: 10
      }
    ]
  }
];

export const availability = {
  business: {
    id: 1,
    name: 'Bella Estética',
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: null
    }
  },
  // Citas ya agendadas para la semana actual (simulación)
  bookedSlots: [
    // Lunes
    {
      date: new Date().toISOString().split('T')[0].replace(/\d{1,2}$/, '01'), // Primer día de la semana actual
      slots: [
        { start: '09:00', end: '09:45', aestheticianId: 1, serviceId: 1, clientName: 'Ana García', clientPhone: '+56912345678' },
        { start: '10:30', end: '11:30', aestheticianId: 1, serviceId: 2, clientName: 'Carmen Rodríguez', clientPhone: '+56923456789' },
        { start: '13:00', end: '14:00', aestheticianId: 2, serviceId: 3, clientName: 'Daniela Pérez', clientPhone: '+56934567890' },
        { start: '16:00', end: '17:00', aestheticianId: 3, serviceId: 2, clientName: 'Elena Martínez', clientPhone: '+56945678901' }
      ]
    },
    // Martes
    {
      date: new Date().toISOString().split('T')[0].replace(/\d{1,2}$/, '02'), // Segundo día de la semana actual
      slots: [
        { start: '09:30', end: '10:15', aestheticianId: 1, serviceId: 1, clientName: 'Fernanda López', clientPhone: '+56956789012' },
        { start: '11:00', end: '12:00', aestheticianId: 2, serviceId: 2, clientName: 'Gabriela Soto', clientPhone: '+56967890123' },
        { start: '14:30', end: '15:30', aestheticianId: 3, serviceId: 2, clientName: 'Helena Díaz', clientPhone: '+56978901234' },
        { start: '16:30', end: '17:20', aestheticianId: 1, serviceId: 3, clientName: 'Isabel Vargas', clientPhone: '+56989012345' }
      ]
    },
    // Miércoles
    {
      date: new Date().toISOString().split('T')[0].replace(/\d{1,2}$/, '03'), // Tercer día de la semana actual
      slots: [
        { start: '10:00', end: '10:45', aestheticianId: 2, serviceId: 1, clientName: 'Julia Morales', clientPhone: '+56990123456' },
        { start: '11:30', end: '12:30', aestheticianId: 3, serviceId: 2, clientName: 'Karla Navarro', clientPhone: '+56901234567' },
        { start: '14:00', end: '14:50', aestheticianId: 1, serviceId: 3, clientName: 'Laura Rojas', clientPhone: '+56912345678' },
        { start: '16:00', end: '17:00', aestheticianId: 2, serviceId: 2, clientName: 'Mónica Castro', clientPhone: '+56923456789' }
      ]
    },
    // Jueves
    {
      date: new Date().toISOString().split('T')[0].replace(/\d{1,2}$/, '04'), // Cuarto día de la semana actual
      slots: [
        { start: '09:15', end: '10:00', aestheticianId: 3, serviceId: 1, clientName: 'Natalia Pinto', clientPhone: '+56934567890' },
        { start: '10:30', end: '11:30', aestheticianId: 1, serviceId: 2, clientName: 'Olivia Fuentes', clientPhone: '+56945678901' },
        { start: '13:30', end: '14:20', aestheticianId: 2, serviceId: 3, clientName: 'Patricia Gómez', clientPhone: '+56956789012' },
        { start: '15:00', end: '16:00', aestheticianId: 3, serviceId: 2, clientName: 'Raquel Torres', clientPhone: '+56967890123' },
        // Citas solapadas para probar conflictos
        { start: '16:30', end: '17:30', aestheticianId: 1, serviceId: 2, clientName: 'Sofía Vega', clientPhone: '+56978901234' },
        { start: '17:00', end: '17:45', aestheticianId: 1, serviceId: 1, clientName: 'Teresa Muñoz', clientPhone: '+56989012345' } // Conflicto intencional
      ]
    },
    // Viernes
    {
      date: new Date().toISOString().split('T')[0].replace(/\d{1,2}$/, '05'), // Quinto día de la semana actual
      slots: [
        { start: '09:00', end: '09:45', aestheticianId: 1, serviceId: 1, clientName: 'Úrsula Rivas', clientPhone: '+56990123456' },
        { start: '10:00', end: '11:00', aestheticianId: 2, serviceId: 2, clientName: 'Valentina Ortiz', clientPhone: '+56901234567' },
        { start: '11:30', end: '12:20', aestheticianId: 3, serviceId: 3, clientName: 'Ximena Paredes', clientPhone: '+56912345678' },
        // Múltiples citas para la misma esteticista
        { start: '14:00', end: '14:45', aestheticianId: 1, serviceId: 1, clientName: 'Yolanda Silva', clientPhone: '+56923456789' },
        { start: '15:00', end: '16:00', aestheticianId: 1, serviceId: 2, clientName: 'Zoe Mendoza', clientPhone: '+56934567890' },
        { start: '16:30', end: '17:20', aestheticianId: 1, serviceId: 3, clientName: 'Adriana Cortés', clientPhone: '+56945678901' }
      ]
    },
    // Sábado
    {
      date: new Date().toISOString().split('T')[0].replace(/\d{1,2}$/, '06'), // Sexto día de la semana actual
      slots: [
        { start: '10:00', end: '10:45', aestheticianId: 1, serviceId: 1, clientName: 'Beatriz Herrera', clientPhone: '+56956789012' },
        { start: '11:00', end: '12:00', aestheticianId: 2, serviceId: 2, clientName: 'Cecilia Flores', clientPhone: '+56967890123' },
        { start: '12:30', end: '13:20', aestheticianId: 3, serviceId: 3, clientName: 'Diana Espinoza', clientPhone: '+56978901234' }
      ]
    }
  ]
};

// Función para simular delay de API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simular la obtención de datos desde la API
export const api = {
  // Obtener esteticistas por negocio
  async getAestheticians(businessId = 1) {
    await delay(300); // Simular latencia de red
    return aestheticians.filter(a => a.businessId === businessId);
  },
  
  // Obtener servicios por negocio
  async getServices(businessId = 1) {
    await delay(500);
    return services.filter(s => s.businessId === businessId);
  },
  
  // Obtener disponibilidad
  async getAvailability(businessId = 1, dateRange) {
    await delay(700);
    return availability;
  },
  
  // Guardar una reserva
  async saveBooking(bookingData) {
    await delay(1000);
    console.log('Booking saved:', bookingData);
    return {
      success: true,
      bookingId: Math.floor(Math.random() * 10000),
      message: 'Reserva completada con éxito'
    };
  }
};