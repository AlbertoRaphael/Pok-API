import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { usePokemonDetail } from '@/hooks';
import { useFavorites } from '@/store';
import { 
  LoadingSpinner, 
  ErrorMessage, 
  PokemonImage,
  PokemonInfo,
  PokemonTypes,
  PokemonStats,
} from '@/components';
import type { PokemonDetailScreenProps } from '@/types';

/**
 * Pantalla que muestra los detalles completos de un Pokémon
 * Incluye imagen, estadísticas, tipos, información física y botón de favorito
 */
const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { pokemonId, pokemonName } = route.params;

  // Hook para obtener detalles del Pokémon
  const {
    pokemon,
    isLoading,
    isError,
    error,
    refetch,
  } = usePokemonDetail({ pokemonId });

  // Hook para manejar favoritos
  const {
    toggleFavorite,
    isFavorite,
  } = useFavorites();

  // Estado local para el favorito (para animaciones inmediatas)
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  // Sincronizar estado local con el store cuando cambie el Pokémon
  useEffect(() => {
    if (pokemon) {
      setLocalIsFavorite(isFavorite(pokemon.id));
    }
  }, [pokemon, isFavorite]);

  // Manejar toggle de favorito
  const handleFavoritePress = async () => {
    if (!pokemon) return;
    
    // Actualizar estado local inmediatamente para feedback visual
    setLocalIsFavorite(!localIsFavorite);
    
    try {
      await toggleFavorite(pokemon.id, pokemon.name);
    } catch (error) {
      // Revertir estado local si hay error
      setLocalIsFavorite(!localIsFavorite);
      console.error('Error toggling favorite:', error);
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message={`Cargando detalles de ${pokemonName}...`} />
      </SafeAreaView>
    );
  }

  // Estado de error
  if (isError || !pokemon) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage
          message={error?.message || `Error al cargar los detalles de ${pokemonName}`}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Botón de favorito flotante */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.favoriteIcon,
            { color: localIsFavorite ? '#EF4444' : '#D1D5DB' }
          ]}>
            ♥
          </Text>
        </TouchableOpacity>

        {/* Imagen principal */}
        <View style={styles.imageSection}>
          <PokemonImage
            imageUrl={pokemon.sprites.officialArtwork || pokemon.imageUrl}
            pokemonName={pokemon.name}
            size={250}
          />
        </View>

        {/* Información básica */}
        <PokemonInfo
          id={pokemon.id}
          name={pokemon.name}
          height={pokemon.height}
          weight={pokemon.weight}
          baseExperience={pokemon.baseExperience}
        />

        {/* Tipos */}
        <PokemonTypes types={pokemon.types} />

        {/* Estadísticas */}
        <PokemonStats stats={pokemon.stats} />

        {/* Habilidades */}
        {pokemon.abilities.length > 0 && (
          <View style={styles.abilitiesContainer}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.abilitiesGrid}>
              {pokemon.abilities.map((ability, index) => (
                <View
                  key={index}
                  style={[
                    styles.abilityChip,
                    ability.isHidden && styles.hiddenAbility
                  ]}
                >
                  <Text style={[
                    styles.abilityText,
                    ability.isHidden && styles.hiddenAbilityText
                  ]}>
                    {ability.displayName}
                    {ability.isHidden && ' (Oculta)'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Espaciado inferior */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60, // Espacio para el botón de favorito
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  abilitiesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  abilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  abilityChip: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  hiddenAbility: {
    backgroundColor: '#8B5CF6',
  },
  abilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  hiddenAbilityText: {
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default PokemonDetailScreen;