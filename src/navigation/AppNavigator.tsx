import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';

// Importar pantallas
import { PokemonListScreen, PokemonDetailScreen } from '@/screens';

// Crear el stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Configuración del Stack Navigator principal
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PokemonList"
        screenOptions={{
          // Configuración global de headers
          headerStyle: {
            backgroundColor: '#3B82F6', // Azul
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerBackVisible: true,
          
          // Configuración de animaciones
          animation: 'slide_from_right',
          
          // Configuración de gestos
          gestureEnabled: true,
        }}
      >
        {/* Pantalla de Lista de Pokémon */}
        <Stack.Screen
          name="PokemonList"
          component={PokemonListScreen}
          options={{
            title: 'Pokédex',
            headerLargeTitle: false,
          }}
        />
        
        {/* Pantalla de Detalle de Pokémon */}
        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={({ route }) => ({
            title: route.params.pokemonName
              ? route.params.pokemonName.charAt(0).toUpperCase() + 
                route.params.pokemonName.slice(1)
              : 'Pokémon',
            headerBackTitle: 'Lista',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default AppNavigator;