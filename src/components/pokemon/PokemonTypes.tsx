import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import type { PokemonType } from '@/types';

interface PokemonTypesProps {
  types: PokemonType[];
}

/**
 * Componente para mostrar los tipos de un Pokémon
 * con badges coloridos
 */
const PokemonTypes: React.FC<PokemonTypesProps> = ({ types }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipos</Text>
      <View style={styles.typesContainer}>
        {types.map((type, index) => (
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default PokemonTypes;