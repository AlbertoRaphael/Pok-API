// Tipos comunes utilizados en toda la aplicación

/**
 * Estado base para operaciones asíncronas
 */
export interface AsyncState<T = any> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Resultado de operaciones que pueden fallar
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Configuración de paginación
 */
export interface PaginationConfig {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Metadatos de paginación
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Respuesta paginada genérica
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/**
 * Opciones para operaciones de caché
 */
export interface CacheOptions {
  ttl?: number; // Time to live en milisegundos
  staleTime?: number; // Tiempo antes de considerar datos obsoletos
  cacheTime?: number; // Tiempo para mantener en caché datos no utilizados
}

/**
 * Configuración de reintentos
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
}

/**
 * Tipos de eventos de la aplicación
 */
export type AppEvent = 
  | 'pokemon_favorited'
  | 'pokemon_unfavorited'
  | 'search_performed'
  | 'detail_viewed'
  | 'list_refreshed';

/**
 * Payload de eventos
 */
export interface EventPayload {
  pokemon_favorited: { pokemonId: number; pokemonName: string };
  pokemon_unfavorited: { pokemonId: number; pokemonName: string };
  search_performed: { query: string; resultsCount: number };
  detail_viewed: { pokemonId: number; pokemonName: string };
  list_refreshed: { timestamp: number };
}

/**
 * Configuración de la aplicación
 */
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: RetryConfig;
  };
  cache: CacheOptions;
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
  search: {
    debounceMs: number;
    minQueryLength: number;
  };
}

/**
 * Tema de la aplicación
 */
export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeight: {
      normal: string;
      medium: string;
      bold: string;
    };
  };
}

/**
 * Dimensiones de pantalla
 */
export interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

/**
 * Orientación de pantalla
 */
export type ScreenOrientation = 'portrait' | 'landscape';

/**
 * Plataforma del dispositivo
 */
export type Platform = 'ios' | 'android' | 'web';

/**
 * Estado de conectividad
 */
export interface ConnectivityState {
  isConnected: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown' | 'none';
}

/**
 * Información del dispositivo
 */
export interface DeviceInfo {
  platform: Platform;
  version: string;
  model: string;
  brand: string;
  screenDimensions: ScreenDimensions;
  orientation: ScreenOrientation;
  connectivity: ConnectivityState;
}