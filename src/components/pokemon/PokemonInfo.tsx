import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { formatPokemonHeight, formatPokemonWeight, formatPokemonName } from '@/types';

interface PokemonInfoProps {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
}

/**
 * Componente para mostrar información básica de un Pokémon
 */
const PokemonInfo: React.FC<PokemonInfoProps> = ({
  id,
  name,
  height,
  weight,
  baseExperience,
}) => {
  const formatPokemonId = (pokemonId: number): string => {
    return `#${pokemonId.toString().padStart(3, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header con ID y nombre */}
      <View style={styles.header}>
        <Text style={styles.pokemonId}>{formatPokemonId(id)}</Text>
        <Text style={styles.pokemonName}>{formatPokemonName(name)}</Text>
      </View>

      {/* Información física */}
      <View style={styles.physicalInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Altura</Text>
          <Text style={styles.infoValue}>{formatPokemonHeight(height)}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Peso</Text>
          <Text style={styles.infoValue}>{formatPokemonWeight(weight)}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Experiencia</Text>
          <Text style={styles.infoValue}>{baseExperience}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pokemonId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  physicalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
});

export default PokemonInfo;