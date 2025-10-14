import axios, { AxiosError, AxiosResponse } from 'axios';

// Configuración base del cliente API
const API_BASE_URL = 'https://pokeapi.co/api/v2';
const API_TIMEOUT = 10000; // 10 segundos

// Crear instancia de Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos para manejo de errores
export interface ApiError {
  message: string;
  code: string;
  retryable: boolean;
  originalError?: AxiosError;
}

// Función para transformar errores de Axios a errores de dominio
const transformError = (error: AxiosError): ApiError => {
  if (error.code === 'ECONNABORTED') {
    return {
      message: 'La solicitud tardó demasiado tiempo. Verifica tu conexión a internet.',
      code: 'TIMEOUT_ERROR',
      retryable: true,
      originalError: error,
    };
  }

  if (error.code === 'ERR_NETWORK') {
    return {
      message: 'Error de conexión. Verifica tu conexión a internet.',
      code: 'NETWORK_ERROR',
      retryable: true,
      originalError: error,
    };
  }

  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    const status = error.response.status;
    
    switch (status) {
      case 404:
        return {
          message: 'El recurso solicitado no fue encontrado.',
          code: 'NOT_FOUND',
          retryable: false,
          originalError: error,
        };
      case 429:
        return {
          message: 'Demasiadas solicitudes. Intenta de nuevo en unos momentos.',
          code: 'RATE_LIMIT',
          retryable: true,
          originalError: error,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          message: 'Error del servidor. Intenta de nuevo más tarde.',
          code: 'SERVER_ERROR',
          retryable: true,
          originalError: error,
        };
      default:
        return {
          message: `Error del servidor (${status}). Intenta de nuevo.`,
          code: 'HTTP_ERROR',
          retryable: false,
          originalError: error,
        };
    }
  }

  // Error sin respuesta del servidor
  return {
    message: 'Error inesperado. Intenta de nuevo.',
    code: 'UNKNOWN_ERROR',
    retryable: true,
    originalError: error,
  };
};

// Interceptor de request para logging (desarrollo)
apiClient.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Interceptor de response para manejo de errores y logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError = transformError(error);
    
    if (__DEV__) {
      console.error('❌ API Response Error:', {
        message: apiError.message,
        code: apiError.code,
        retryable: apiError.retryable,
        url: error.config?.url,
        method: error.config?.method,
      });
    }
    
    return Promise.reject(apiError);
  }
);

// Función helper para reintentos automáticos
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: ApiError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as ApiError;
      
      // No reintentar si el error no es reintentable
      if (!lastError.retryable) {
        throw lastError;
      }
      
      // No reintentar en el último intento
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Esperar antes del siguiente intento (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      if (__DEV__) {
        console.log(`🔄 Reintentando API call (intento ${attempt + 1}/${maxRetries}) en ${waitTime}ms`);
      }
    }
  }
  
  throw lastError!;
};

export default apiClient;