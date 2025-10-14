import { QueryClient } from '@tanstack/react-query';
import type { ApiError } from './apiClient';

// Configuración del cliente React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo antes de considerar los datos obsoletos (5 minutos)
      staleTime: 5 * 60 * 1000,
      
      // Tiempo para mantener datos en caché cuando no se usan (10 minutos)
      gcTime: 10 * 60 * 1000,
      
      // Reintentar automáticamente en caso de error
      retry: (failureCount, error) => {
        const apiError = error as unknown as ApiError;
        
        // No reintentar errores no reintentables
        if (!apiError.retryable) {
          return false;
        }
        
        // Máximo 3 reintentos
        return failureCount < 3;
      },
      
      // Delay entre reintentos (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch cuando la ventana obtiene foco
      refetchOnWindowFocus: false,
      
      // Refetch cuando se reconecta la red
      refetchOnReconnect: true,
      
      // No refetch automático en mount si los datos no están obsoletos
      refetchOnMount: true,
    },
    mutations: {
      // Reintentar mutaciones fallidas
      retry: (failureCount, error) => {
        const apiError = error as unknown as ApiError;
        return apiError.retryable && failureCount < 2;
      },
      
      // Delay entre reintentos para mutaciones
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Claves de query organizadas
export const queryKeys = {
  // Pokémon queries
  pokemon: {
    all: ['pokemon'] as const,
    lists: () => [...queryKeys.pokemon.all, 'list'] as const,
    list: (params: { offset?: number; limit?: number }) => 
      [...queryKeys.pokemon.lists(), params] as const,
    details: () => [...queryKeys.pokemon.all, 'detail'] as const,
    detail: (id: string | number) => 
      [...queryKeys.pokemon.details(), id] as const,
    search: (query: string) => 
      [...queryKeys.pokemon.all, 'search', query] as const,
    favorites: () => [...queryKeys.pokemon.all, 'favorites'] as const,
  },
  
  // Especies queries (para información adicional)
  species: {
    all: ['species'] as const,
    detail: (id: string | number) => 
      [...queryKeys.species.all, id] as const,
  },
} as const;

// Utilidades para invalidar queries
export const queryUtils = {
  // Invalidar todas las queries de Pokémon
  invalidateAllPokemon: () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.pokemon.all,
    });
  },
  
  // Invalidar listas de Pokémon
  invalidatePokemonLists: () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.pokemon.lists(),
    });
  },
  
  // Invalidar detalle específico de Pokémon
  invalidatePokemonDetail: (id: string | number) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.pokemon.detail(id),
    });
  },
  
  // Invalidar búsquedas
  invalidatePokemonSearch: () => {
    return queryClient.invalidateQueries({
      queryKey: [...queryKeys.pokemon.all, 'search'],
    });
  },
  
  // Limpiar caché completo
  clearCache: () => {
    return queryClient.clear();
  },
  
  // Prefetch de detalle de Pokémon
  prefetchPokemonDetail: (id: string | number) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.pokemon.detail(id),
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  },
};

// Configuración específica para desarrollo
if (__DEV__) {
  // Logging de queries en desarrollo
  queryClient.setQueryDefaults(['pokemon'], {
    meta: {
      errorMessage: 'Error al cargar datos de Pokémon',
    },
  });
}

export default queryClient;