<template>
    <div class="booking-container">
      <!-- Indicador de pasos -->
      <div class="progress-container">
        <div class="progress" style="height: 4px;">
          <div 
            class="progress-bar" 
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
        
        <div class="steps-indicator">
          <div v-for="step in totalSteps" :key="step" class="step-item">
            <div 
              class="step-circle"
              :class="step <= currentStep ? 'step-active' : ''"
            >
              <span v-if="step < currentStep"><i class="fas fa-check"></i></span>
              <span v-else>{{ step }}</span>
            </div>
            <div class="step-label d-none d-md-block">{{ getStepName(step) }}</div>
          </div>
        </div>
      </div>
      
      <!-- Contenido de cada paso -->
      <div class="content-card">
        <!-- Paso 1: Selección de Esteticista -->
        <AestheticianSelection 
          v-if="currentStep === 1"
          :aestheticians="aestheticians"
          :loading="loading"
          :selected-aesthetician="selectedAesthetician"
          @select="selectAesthetician"
          @next="nextStep"
        />
        
        <!-- Paso 2: Selección de Servicios -->
        <ServiceSelection 
          v-if="currentStep === 2"
          :services="filteredServices"
          :loading="loading"
          :selected-services="selectedServices"
          @select="toggleService"
          @next="nextStep"
          @prev="prevStep"
        />
        
        <!-- Paso 3: Configuración de Servicios -->
        <ServiceConfiguration 
          v-if="currentStep === 3"
          :selected-services="selectedServices"
          :loading="loading"
          @update-service="updateService"
          @next="nextStep"
          @prev="prevStep"
        />
        
        <!-- Paso 4: Selección de Horario -->
        <TimeSelection 
          v-if="currentStep === 4"
          :selected-services="selectedServices"
          :availability="availability"
          :loading="loading"
          :selected-slot="selectedSlot"
          @select-slot="selectTimeSlot"
          @next="nextStep"
          @prev="prevStep"
        />
        
        <!-- Paso 5: Datos del Cliente -->
        <CustomerForm 
          v-if="currentStep === 5"
          :customer-data="customerData"
          :loading="loading"
          @update-customer="updateCustomer"
          @submit="submitBooking"
          @prev="prevStep"
        />
        
        <!-- Paso 6: Confirmación -->
        <BookingConfirmation 
          v-if="currentStep === 6"
          :booking-result="bookingResult"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  // Corregida la ruta de importación
  import { api } from '../../services/mockData';
  
  // Corregidas las rutas de importación
  import AestheticianSelection from '../../components/booking/AestheticianSelection.vue';
  import ServiceSelection from '../../components/booking/ServiceSelection.vue';
  import ServiceConfiguration from '../../components/booking/ServiceConfiguration.vue';
  import TimeSelection from '../../components/booking/TimeSelection.vue';
  import CustomerForm from '../../components/booking/CustomerForm.vue';
  import BookingConfirmation from '../../components/booking/BookingConfirmation.vue';
  
  export default {
    name: 'BookingFlow',
    components: {
      AestheticianSelection,
      ServiceSelection,
      ServiceConfiguration,
      TimeSelection,
      CustomerForm,
      BookingConfirmation
    },
    props: {
      businessSlug: {
        type: String,
        default: 'default'
      }
    },
    setup(props) {
      const route = useRoute();
      const totalSteps = 6;
      const currentStep = ref(1);
      const loading = ref(false);
      
      // Datos para el flujo de reserva
      const aestheticians = ref([]);
      const services = ref([]);
      const availability = ref(null);
      
      // Selecciones del usuario
      const selectedAesthetician = ref(null);
      const selectedServices = ref([]);
      const selectedSlot = ref(null);
      const customerData = ref({
        name: '',
        birthdate: '',
        nif: '',
        email: '',
        message: ''
      });
      
      // Resultado de la reserva
      const bookingResult = ref(null);
      
      // Servicios filtrados basados en el esteticista seleccionado
      const filteredServices = ref([]);
      
      // Cargar datos iniciales
      onMounted(async () => {
        try {
          loading.value = true;
          // En una implementación real obtendríamos el businessId basado en el slug
          const businessId = 1;
          
          // Carga paralela de datos
          const [aesth, serv, avail] = await Promise.all([
            api.getAestheticians(businessId),
            api.getServices(businessId),
            api.getAvailability(businessId)
          ]);
          
          aestheticians.value = aesth;
          services.value = serv;
          filteredServices.value = serv; // Inicialmente mostramos todos los servicios
          availability.value = avail;
        } catch (error) {
          console.error('Error cargando datos iniciales:', error);
          // Aquí se manejaría el error en una UI real
        } finally {
          loading.value = false;
        }
      });
      
      // Métodos para la navegación entre pasos
      const nextStep = () => {
        if (currentStep.value < totalSteps) {
          currentStep.value++;
        }
      };
      
      const prevStep = () => {
        if (currentStep.value > 1) {
          currentStep.value--;
        }
      };
      
      // Métodos para manejar selecciones del usuario
      const selectAesthetician = (aesthetician) => {
        selectedAesthetician.value = aesthetician;
        
        // Filtrar servicios basados en el esteticista seleccionado
        if (aesthetician && aesthetician.serviceIds && aesthetician.serviceIds.length > 0) {
          // Filtrar los servicios que corresponden a los IDs del esteticista
          filteredServices.value = services.value.filter(service => 
            aesthetician.serviceIds.includes(service.id)
          );
        } else {
          // Si no hay esteticista seleccionado o no tiene servicios, mostrar todos
          filteredServices.value = services.value;
        }
        
        // Limpiar servicios seleccionados cuando se cambia de esteticista
        selectedServices.value = [];
      };
      
      const toggleService = (service) => {
        const index = selectedServices.value.findIndex(s => s.id === service.id);
        if (index === -1) {
          // Añadir servicio con sus extras vacíos
          selectedServices.value.push({
            ...service,
            selectedExtras: []
          });
        } else {
          // Eliminar servicio
          selectedServices.value.splice(index, 1);
        }
      };
      
      const updateService = (serviceId, updatedService) => {
        const index = selectedServices.value.findIndex(s => s.id === serviceId);
        if (index !== -1) {
          selectedServices.value[index] = {
            ...selectedServices.value[index],
            ...updatedService
          };
        }
      };
      
      const selectTimeSlot = (slot) => {
        selectedSlot.value = slot;
      };
      
      const updateCustomer = (data) => {
        customerData.value = { ...customerData.value, ...data };
      };
      
      const submitBooking = async () => {
        try {
          loading.value = true;
          
          // Preparar datos para enviar
          const bookingData = {
            aestheticianId: selectedAesthetician.value.id,
            services: selectedServices.value,
            timeSlot: selectedSlot.value,
            customer: customerData.value
          };
          
          // Simular envío a API
          const result = await api.saveBooking(bookingData);
          bookingResult.value = result;
          
          // Avanzar al paso de confirmación
          nextStep();
        } catch (error) {
          console.error('Error al guardar la reserva:', error);
          bookingResult.value = {
            success: false,
            message: 'Error al procesar la reserva. Por favor, inténtelo de nuevo.'
          };
        } finally {
          loading.value = false;
        }
      };
      
      // Nombre de cada paso para el indicador
      const getStepName = (step) => {
        const steps = {
          1: 'Especialista',
          2: 'Servicios',
          3: 'Extras',
          4: 'Horario',
          5: 'Tus datos',
          6: 'Confirmación'
        };
        return steps[step] || `Paso ${step}`;
      };
      
      return {
        totalSteps,
        currentStep,
        loading,
        aestheticians,
        services,
        filteredServices,
        availability,
        selectedAesthetician,
        selectedServices,
        selectedSlot,
        customerData,
        bookingResult,
        nextStep,
        prevStep,
        selectAesthetician,
        toggleService,
        updateService,
        selectTimeSlot,
        updateCustomer,
        submitBooking,
        getStepName
      };
    }
  };
  </script>
  
  <style scoped>
  .booking-container {
    width: 100%;
    max-width: 100%;
    padding: 0.5rem;
    margin: 0 auto;
  }
  
  @media (min-width: 768px) {
    .booking-container {
      max-width: 90%;
      padding: 1rem;
    }
  }
  
  @media (min-width: 992px) {
    .booking-container {
      max-width: 85%;
      padding: 1.5rem;
    }
  }
  
  .progress-container {
    margin-bottom: 1.5rem;
  }
  
  .steps-indicator {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
  
  .step-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .step-circle {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: #f0f0f0;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    z-index: 2;
  }
  
  .step-active {
    background-color: #9c27b0;
    color: white;
  }
  
  .step-label {
    font-size: 0.75rem;
    color: #666;
    text-align: center;
  }
  
  .content-card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 1rem;
  }
  
  @media (max-width: 576px) {
    .content-card {
      padding: 0.75rem;
    }
    
    .step-circle {
      width: 24px;
      height: 24px;
      font-size: 0.7rem;
    }
  }

  .progress-bar {
    background-color: #9c27b0;
  }
  </style>