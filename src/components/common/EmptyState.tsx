import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface EmptyStateProps {
  message: string;
  icon?: string;
  subtitle?: string;
}

/**
 * Componente para mostrar estados vacíos
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon = '🔍',
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;