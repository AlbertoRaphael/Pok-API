import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { usePokemons, usePokemonSearch, useDebounce } from '@/hooks';
import { useFavorites } from '@/store';
import { PokemonCard, LoadingSpinner, ErrorMessage, EmptyState, SearchBar } from '@/components';
import { navigateToPokemonDetail } from '@/navigation';
import type { PokemonListScreenProps, Pokemon } from '@/types';

/**
 * Pantalla principal que muestra la lista de Pokémon
 * Incluye scroll infinito, búsqueda, pull-to-refresh y navegación a detalle
 */
const PokemonListScreen: React.FC<PokemonListScreenProps> = ({ 
  navigation 
}) => {
  // Estado de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Hook para obtener datos de Pokémon con paginación
  const {
    pokemon,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refresh,
  } = usePokemons();

  // Hook para búsqueda de Pokémon
  const {
    results: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    hasSearched,
  } = usePokemonSearch({
    query: debouncedSearchQuery,
    enabled: debouncedSearchQuery.length >= 2,
  });

  // Hook para manejar favoritos
  const {
    favoriteIds,
    toggleFavorite,
    loadFavorites,
    isFavorite,
  } = useFavorites();

  // Cargar favoritos al montar el componente
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Determinar qué datos mostrar (búsqueda o lista normal)
  const isSearching = debouncedSearchQuery.length >= 2;
  const displayData = isSearching ? searchResults : pokemon;
  const displayIsLoading = isSearching ? isSearchLoading : isLoading;
  const displayError = isSearching ? searchError : error;
  const displayIsError = isSearching ? !!searchError : isError;

  // Actualizar estado de favoritos en la lista de Pokémon
  const pokemonWithFavorites = React.useMemo(() => {
    return displayData.map(p => ({
      ...p,
      isFavorite: isFavorite(p.id),
    }));
  }, [displayData, favoriteIds]);

  // Manejar navegación a detalle de Pokémon
  const handlePokemonPress = useCallback((selectedPokemon: Pokemon) => {
    navigateToPokemonDetail(navigation, selectedPokemon.id, selectedPokemon.name);
  }, [navigation]);

  // Manejar favoritos
  const handleFavoritePress = useCallback(async (selectedPokemon: Pokemon) => {
    await toggleFavorite(selectedPokemon.id, selectedPokemon.name);
  }, [toggleFavorite]);

  // Manejar scroll infinito (solo para lista normal, no para búsqueda)
  const handleEndReached = useCallback(() => {
    if (!isSearching && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isSearching, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Manejar cambio en búsqueda
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Manejar limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Renderizar cada item de la lista
  const renderPokemonItem: ListRenderItem<Pokemon> = useCallback(({ item }) => (
    <PokemonCard
      pokemon={item}
      onPress={handlePokemonPress}
      onFavoritePress={handleFavoritePress}
    />
  ), [handlePokemonPress, handleFavoritePress]);

  // Renderizar footer con indicador de carga para paginación (solo lista normal)
  const renderFooter = useCallback(() => {
    if (isSearching || !isFetchingNextPage) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }, [isSearching, isFetchingNextPage]);

  // Renderizar header con búsqueda
  const renderHeader = useCallback(() => (
    <SearchBar
      value={searchQuery}
      onChangeText={handleSearchChange}
      onClear={handleClearSearch}
      isLoading={isSearchLoading && debouncedSearchQuery.length >= 2}
      placeholder="Buscar Pokémon por nombre..."
    />
  ), [searchQuery, handleSearchChange, handleClearSearch, isSearchLoading, debouncedSearchQuery]);

  // Separador entre items
  const ItemSeparator = useCallback(() => (
    <View style={styles.separator} />
  ), []);

  // Key extractor para optimización
  const keyExtractor = useCallback((item: Pokemon) => item.id.toString(), []);

  // Estados de carga inicial (solo para lista normal)
  if (!isSearching && isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Cargando Pokémon..." />
      </SafeAreaView>
    );
  }

  // Estado de error (solo si no hay datos y hay error)
  if (displayIsError && pokemonWithFavorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ErrorMessage
          message={
            typeof displayError === 'string' 
              ? displayError 
              : displayError?.message || 'Error al cargar los Pokémon'
          }
          onRetry={isSearching ? undefined : refresh}
        />
      </SafeAreaView>
    );
  }

  // Estado vacío para búsqueda
  if (isSearching && hasSearched && pokemonWithFavorites.length === 0 && !isSearchLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <EmptyState
          message="No se encontraron Pokémon"
          subtitle={`No hay resultados para "${debouncedSearchQuery}"`}
          icon="🔍"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pokemonWithFavorites}
        renderItem={renderPokemonItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        
        // Configuración de scroll infinito (solo para lista normal)
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        
        // Pull to refresh (solo para lista normal)
        refreshControl={
          !isSearching ? (
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={refresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          ) : undefined
        }
        
        // Optimizaciones de rendimiento
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        
        // Configuración adicional
        showsVerticalScrollIndicator={false}
        bounces={true}
        stickyHeaderIndices={[0]} // Hacer que el header de búsqueda sea sticky
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  separator: {
    height: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default PokemonListScreen;