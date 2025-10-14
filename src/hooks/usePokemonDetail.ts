import { useQuery } from '@tanstack/react-query';
import { getPokemonDetail } from '@/api/pokemon';
import { queryKeys } from '@/api/queryClient';
import { transformPokemonDetail } from '@/types/transformers';
import type { PokemonDetail } from '@/types';
import type { ApiError } from '@/api';

interface UsePokemonDetailParams {
  pokemonId: string | number;
  enabled?: boolean;
}

interface UsePokemonDetailResult {
  // Datos
  pokemon: PokemonDetail | null;
  
  // Estados de carga
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  
  // Error
  error: ApiError | null;
  
  // Acciones
  refetch: () => void;
}

/**
 * Hook para obtener los detalles de un Pokémon específico
 * 
 * @param params - Parámetros de configuración
 * @returns Datos y funciones para manejar el detalle del Pokémon
 */
export const usePokemonDetail = (params: UsePokemonDetailParams): UsePokemonDetailResult => {
  const { pokemonId, enabled = true } = params;

  const {
    data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.pokemon.detail(pokemonId),
    
    queryFn: async () => {
      const response = await getPokemonDetail(pokemonId);
      
      // Transformar la respuesta de la API a tipos de dominio
      // TODO: Obtener estado de favorito desde el store
      return transformPokemonDetail(response, false);
    },
    
    enabled: enabled && (!!pokemonId || pokemonId === 0),
    
    // Configuración específica para detalles de Pokémon
    staleTime: 15 * 60 * 1000, // 15 minutos - los detalles cambian menos frecuentemente
    gcTime: 30 * 60 * 1000, // 30 minutos en caché
    
    // Configuración de reintentos
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;
      return apiError.retryable && failureCount < 3;
    },
    
    // Meta información para debugging
    meta: {
      errorMessage: `Error al cargar los detalles del Pokémon ${pokemonId}`,
    },
  });

  return {
    // Datos
    pokemon: data || null,
    
    // Estados de carga
    isLoading,
    isError,
    isFetching,
    
    // Error
    error: error ? (error as unknown as ApiError) : null,
    
    // Acciones
    refetch,
  };
};

export default usePokemonDetail;