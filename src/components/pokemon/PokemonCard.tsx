import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import type { Pokemon } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columnas con padding

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
  onFavoritePress?: (pokemon: Pokemon) => void;
}

/**
 * Componente de tarjeta para mostrar un Pokémon en la lista
 * Incluye imagen, nombre, tipos y botón de favorito
 */
const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onPress,
  onFavoritePress,
}) => {
  const handlePress = () => {
    onPress(pokemon);
  };

  const handleFavoritePress = () => {
    onFavoritePress?.(pokemon);
  };

  const formatPokemonId = (id: number): string => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const formatPokemonName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Header con ID y botón de favorito */}
      <View style={styles.header}>
        <Text style={styles.pokemonId}>{formatPokemonId(pokemon.id)}</Text>
        {onFavoritePress && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[
              styles.favoriteIcon,
              { color: pokemon.isFavorite ? '#EF4444' : '#D1D5DB' }
            ]}>
              ♥
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Imagen del Pokémon */}
      <View style={styles.imageContainer}>
        <FastImage
          source={{
            uri: pokemon.imageUrl,
            priority: FastImage.priority.normal,
          }}
          style={styles.pokemonImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>

      {/* Información del Pokémon */}
      <View style={styles.info}>
        <Text style={styles.pokemonName} numberOfLines={1}>
          {formatPokemonName(pokemon.name)}
        </Text>
        
        {/* Tipos */}
        <View style={styles.typesContainer}>
          {pokemon.types.slice(0, 2).map((type, index) => (
            <View
              key={index}
              style={[
                styles.typeChip,
                { backgroundColor: type.color }
              ]}
            >
              <Text style={styles.typeText}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pokemonId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginBottom: 12,
  },
  pokemonImage: {
    width: 70,
    height: 70,
  },
  info: {
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default PokemonCard;