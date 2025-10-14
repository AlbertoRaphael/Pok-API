import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para AsyncStorage
const FAVORITES_STORAGE_KEY = '@pokemon_favorites';

// Interfaz del estado de favoritos
interface FavoritesState {
  // Estado
  favorites: Set<number>;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  toggleFavorite: (pokemonId: number, pokemonName: string) => Promise<void>;
  addFavorite: (pokemonId: number, pokemonName: string) => Promise<void>;
  removeFavorite: (pokemonId: number) => Promise<void>;
  isFavorite: (pokemonId: number) => boolean;
  loadFavorites: () => Promise<void>;
  clearFavorites: () => Promise<void>;
  getFavoriteIds: () => number[];
}

/**
 * Store de Zustand para manejar los Pokémon favoritos
 * Incluye persistencia automática en AsyncStorage
 */
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  // Estado inicial
  favorites: new Set<number>(),
  isLoading: false,
  error: null,

  // Verificar si un Pokémon es favorito
  isFavorite: (pokemonId: number) => {
    return get().favorites.has(pokemonId);
  },

  // Obtener array de IDs de favoritos
  getFavoriteIds: () => {
    return Array.from(get().favorites);
  },

  // Toggle favorito (agregar o quitar)
  toggleFavorite: async (pokemonId: number, pokemonName: string) => {
    const { favorites, isFavorite } = get();
    
    if (isFavorite(pokemonId)) {
      await get().removeFavorite(pokemonId);
    } else {
      await get().addFavorite(pokemonId, pokemonName);
    }
  },

  // Agregar a favoritos
  addFavorite: async (pokemonId: number, pokemonName: string) => {
    try {
      set({ error: null });
      
      const { favorites } = get();
      const newFavorites = new Set(favorites);
      newFavorites.add(pokemonId);
      
      // Actualizar estado
      set({ favorites: newFavorites });
      
      // Persistir en AsyncStorage
      await saveFavoritesToStorage(Array.from(newFavorites));
      
      if (__DEV__) {
        console.log(`✅ Pokémon ${pokemonName} (ID: ${pokemonId}) agregado a favoritos`);
      }
    } catch (error) {
      const errorMessage = `Error al agregar ${pokemonName} a favoritos`;
      set({ error: errorMessage });
      
      if (__DEV__) {
        console.error('❌ Error adding favorite:', error);
      }
    }
  },

  // Remover de favoritos
  removeFavorite: async (pokemonId: number) => {
    try {
      set({ error: null });
      
      const { favorites } = get();
      const newFavorites = new Set(favorites);
      newFavorites.delete(pokemonId);
      
      // Actualizar estado
      set({ favorites: newFavorites });
      
      // Persistir en AsyncStorage
      await saveFavoritesToStorage(Array.from(newFavorites));
      
      if (__DEV__) {
        console.log(`✅ Pokémon ID: ${pokemonId} removido de favoritos`);
      }
    } catch (error) {
      const errorMessage = 'Error al remover de favoritos';
      set({ error: errorMessage });
      
      if (__DEV__) {
        console.error('❌ Error removing favorite:', error);
      }
    }
  },

  // Cargar favoritos desde AsyncStorage
  loadFavorites: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const favoritesData = await loadFavoritesFromStorage();
      const favoritesSet = new Set(favoritesData);
      
      set({ 
        favorites: favoritesSet, 
        isLoading: false 
      });
      
      if (__DEV__) {
        console.log(`✅ Favoritos cargados: ${favoritesData.length} Pokémon`);
      }
    } catch (error) {
      const errorMessage = 'Error al cargar favoritos';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      
      if (__DEV__) {
        console.error('❌ Error loading favorites:', error);
      }
    }
  },

  // Limpiar todos los favoritos
  clearFavorites: async () => {
    try {
      set({ error: null });
      
      // Limpiar estado
      set({ favorites: new Set() });
      
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      
      if (__DEV__) {
        console.log('✅ Favoritos limpiados');
      }
    } catch (error) {
      const errorMessage = 'Error al limpiar favoritos';
      set({ error: errorMessage });
      
      if (__DEV__) {
        console.error('❌ Error clearing favorites:', error);
      }
    }
  },
}));

// Funciones auxiliares para AsyncStorage
const saveFavoritesToStorage = async (favorites: number[]): Promise<void> => {
  try {
    const favoritesJson = JSON.stringify(favorites);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, favoritesJson);
  } catch (error) {
    if (__DEV__) {
      console.error('❌ Error saving favorites to storage:', error);
    }
    throw error;
  }
};

const loadFavoritesFromStorage = async (): Promise<number[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    
    if (favoritesJson === null) {
      return []; // No hay favoritos guardados
    }
    
    const favorites = JSON.parse(favoritesJson);
    
    // Validar que sea un array de números
    if (Array.isArray(favorites) && favorites.every(id => typeof id === 'number')) {
      return favorites;
    }
    
    // Si los datos están corruptos, devolver array vacío
    if (__DEV__) {
      console.warn('⚠️ Datos de favoritos corruptos, iniciando con array vacío');
    }
    return [];
  } catch (error) {
    if (__DEV__) {
      console.error('❌ Error loading favorites from storage:', error);
    }
    return []; // En caso de error, devolver array vacío
  }
};

// Hook personalizado para usar el store de favoritos
export const useFavorites = () => {
  const store = useFavoritesStore();
  
  return {
    // Estado
    favorites: store.favorites,
    favoriteIds: store.getFavoriteIds(),
    isLoading: store.isLoading,
    error: store.error,
    
    // Acciones
    toggleFavorite: store.toggleFavorite,
    addFavorite: store.addFavorite,
    removeFavorite: store.removeFavorite,
    isFavorite: store.isFavorite,
    loadFavorites: store.loadFavorites,
    clearFavorites: store.clearFavorites,
  };
};

export default useFavoritesStore;