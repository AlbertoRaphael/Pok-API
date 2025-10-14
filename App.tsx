/**
 * PokemonApp - React Native Application
 * Aplicación que consume la PokéAPI para mostrar información de Pokémon
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { QueryProvider } from '@/api';
import { AppNavigator } from '@/navigation';

/**
 * Componente principal de la aplicación
 * Configura los providers necesarios y la navegación
 */
const App: React.FC = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#3B82F6"
        translucent={false}
      />
      <QueryProvider>
        <AppNavigator />
      </QueryProvider>
    </>
  );
};

export default App;