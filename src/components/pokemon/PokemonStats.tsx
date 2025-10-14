import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import type { PokemonStat } from '@/types';

interface PokemonStatsProps {
  stats: PokemonStat[];
}

/**
 * Componente para mostrar las estadísticas de un Pokémon
 * con barras de progreso visuales
 */
const PokemonStats: React.FC<PokemonStatsProps> = ({ stats }) => {
  const renderStatBar = (stat: PokemonStat) => {
    const percentage = (stat.value / stat.maxValue) * 100;
    
    return (
      <View key={stat.name} style={styles.statContainer}>
        <View style={styles.statHeader}>
          <Text style={styles.statName}>{stat.displayName}</Text>
          <Text style={styles.statValue}>{stat.value}</Text>
        </View>
        <View style={styles.statBarContainer}>
          <View 
            style={[
              styles.statBar,
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getStatColor(percentage)
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  const getStatColor = (percentage: number): string => {
    if (percentage >= 80) return '#10B981'; // Verde
    if (percentage >= 60) return '#F59E0B'; // Amarillo
    if (percentage >= 40) return '#F97316'; // Naranja
    return '#EF4444'; // Rojo
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas Base</Text>
      <View style={styles.statsGrid}>
        {stats.map(renderStatBar)}
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
  statsGrid: {
    gap: 12,
  },
  statContainer: {
    marginBottom: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    minWidth: 30,
    textAlign: 'right',
  },
  statBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default PokemonStats;