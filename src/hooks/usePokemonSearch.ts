import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchPokemon } from '@/api/pokemon';
import { queryKeys } from '@/api/queryClient';
import { transformPokemonListResponse } from '@/types/transformers';
import type { Pokemon, SearchState } from '@/types';
import type { ApiError } from '@/api';

interface UsePokemonSearchParams {
  query: string;
  enabled?: boolean;
  limit?: number;
}

interface UsePokemonSearchResult extends SearchState {
  // Acciones
  refetch: () => void;
  clearSearch: () => void;
}

/**
 * Hook para buscar Pokémon por nombre
 * 
 * @param params - Parámetros de búsqueda
 * @returns Estado y funciones para manejar la búsqueda
 */
export const usePokemonSearch = (params: UsePokemonSearchParams): UsePokemonSearchResult => {
  const { query, enabled = true, limit = 20 } = params;
  
  // Solo buscar si la query tiene al menos 2 caracteres
  const shouldSearch = query.trim().length >= 2;
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.pokemon.search(query.trim()),
    
    queryFn: async () => {
      const response = await searchPokemon({
        query: query.trim(),
        limit,
      });
      
      // Transformar la respuesta de la API a tipos de dominio
      return transformPokemonListResponse(response);
    },
    
    enabled: enabled && shouldSearch,
    
    // Configuración específica para búsquedas
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos en caché
    
    // No reintentar búsquedas automáticamente para evitar spam
    retry: false,
    
    // Meta información para debugging
    meta: {
      errorMessage: `Error al buscar Pokémon con query: "${query}"`,
    },
  });

  // Extraer los resultados de búsqueda
  const results = React.useMemo(() => {
    return data?.pokemon || [];
  }, [data?.pokemon]);

  // Función para limpiar la búsqueda
  const clearSearch = React.useCallback(() => {
    // Esta función será implementada por el componente padre
    // que maneje el estado de la query
  }, []);

  return {
    // Estado de búsqueda
    query,
    results,
    hasSearched: shouldSearch,
    
    // Estados de carga
    isLoading: shouldSearch ? isLoading : false,
    error: shouldSearch && error ? (error as unknown as ApiError).message : null,
    
    // Acciones
    refetch,
    clearSearch,
  };
};

export default usePokemonSearch;