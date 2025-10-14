import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';

interface PokemonImageProps {
  imageUrl: string;
  pokemonName: string;
  size?: number;
}

/**
 * Componente para mostrar la imagen de un Pokémon
 * con estados de carga y error
 */
const PokemonImage: React.FC<PokemonImageProps> = ({
  imageUrl,
  pokemonName,
  size = 200,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {!hasError ? (
        <>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high,
            }}
            style={[styles.image, { width: size, height: size }]}
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          )}
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🖼️</Text>
          <Text style={styles.errorText}>
            No se pudo cargar la imagen de {pokemonName}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 20,
  },
  image: {
    borderRadius: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    borderRadius: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default PokemonImage;