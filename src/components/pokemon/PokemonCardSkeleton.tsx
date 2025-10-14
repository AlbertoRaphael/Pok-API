import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

/**
 * Componente skeleton para mostrar mientras cargan las tarjetas de Pokémon
 */
const PokemonCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <View style={styles.idSkeleton} />
        <View style={styles.favoriteSkeleton} />
      </View>

      {/* Image skeleton */}
      <View style={styles.imageSkeleton} />

      {/* Name skeleton */}
      <View style={styles.nameSkeleton} />

      {/* Types skeleton */}
      <View style={styles.typesContainer}>
        <View style={styles.typeSkeleton} />
        <View style={[styles.typeSkeleton, styles.typeSkeletonSmall]} />
      </View>
    </View>
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
  idSkeleton: {
    width: 40,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
  },
  favoriteSkeleton: {
    width: 16,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  imageSkeleton: {
    width: 70,
    height: 70,
    backgroundColor: '#E5E7EB',
    borderRadius: 35,
    alignSelf: 'center',
    marginBottom: 12,
  },
  nameSkeleton: {
    width: '80%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  typeSkeleton: {
    width: 50,
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },
  typeSkeletonSmall: {
    width: 40,
  },
});

export default PokemonCardSkeleton;