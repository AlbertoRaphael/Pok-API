import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de React Query para la aplicación
 * Envuelve la aplicación con el cliente de queries configurado
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;