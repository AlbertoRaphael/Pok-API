import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPokemonList } from '@/api/pokemon';
import { queryKeys } from '@/api/queryClient';
import { transformPokemonListResponse } from '@/types/transformers';
import type { Pokemon, PokemonListParams } from '@/types';
import type { ApiError } from '@/api';

// Configuración por defecto para la paginación
const DEFAULT_LIMIT = 20;

interface UsePokemonsParams {
  limit?: number;
  enabled?: boolean;
}

interface UsePokemonsResult {
  // Datos
  pokemon: Pokemon[];
  
  // Estados de carga
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  
  // Error
  error: ApiError | null;
  
  // Paginación
  hasNextPage: boolean;
  fetchNextPage: () => void;
  
  // Acciones
  refetch: () => void;
  refresh: () => void;
}

/**
 * Hook para obtener la lista paginada de Pokémon con scroll infinito
 * 
 * @param params - Parámetros de configuración
 * @returns Datos y funciones para manejar la lista de Pokémon
 */
export const usePokemons = (params: UsePokemonsParams = {}): UsePokemonsResult => {
  const { limit = DEFAULT_LIMIT, enabled = true } = params;

  const {
    data,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.pokemon.list({ limit }),
    
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
      const response = await getPokemonList({
        offset: pageParam,
        limit,
      });
      
      // Transformar la respuesta de la API a tipos de dominio
      return transformPokemonListResponse(response);
    },
    
    initialPageParam: 0,
    
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextOffset : undefined;
    },
    
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPreviousPage ? firstPage.previousOffset : undefined;
    },
    
    enabled,
    
    // Configuración específica para listas de Pokémon
    staleTime: 10 * 60 * 1000, // 10 minutos - los datos de Pokémon no cambian frecuentemente
    gcTime: 15 * 60 * 1000, // 15 minutos en caché
    
    // Configuración de reintentos
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;
      return apiError.retryable && failureCount < 3;
    },
    
    // Meta información para debugging
    meta: {
      errorMessage: 'Error al cargar la lista de Pokémon',
    },
  });

  // Aplanar todas las páginas en una sola lista
  const pokemon = React.useMemo(() => {
    if (!data?.pages) return [];
    
    return data.pages.reduce<Pokemon[]>((acc, page) => {
      return [...acc, ...page.pokemon];
    }, []);
  }, [data?.pages]);

  // Función para refrescar completamente la lista (pull-to-refresh)
  const refresh = React.useCallback(() => {
    return refetch();
  }, [refetch]);

  // Función para cargar la siguiente página
  const handleFetchNextPage = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    // Datos
    pokemon,
    
    // Estados de carga
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    
    // Error
    error: error ? (error as unknown as ApiError) : null,
    
    // Paginación
    hasNextPage: hasNextPage ?? false,
    fetchNextPage: handleFetchNextPage,
    
    // Acciones
    refetch,
    refresh,
  };
};

export default usePokemons;