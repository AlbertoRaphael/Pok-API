import React, { useState, useEffect } from 'react';

/**
 * Hook para hacer debounce de un valor
 * Útil para búsquedas en tiempo real para evitar demasiadas llamadas a la API
 * 
 * @param value - Valor a hacer debounce
 * @param delay - Delay en milisegundos (por defecto 300ms)
 * @returns Valor con debounce aplicado
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Crear un timer que actualizará el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia antes de que se ejecute
    // Esto previene que se ejecute el debounce si el usuario sigue escribiendo
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para hacer debounce de una función callback
 * Útil cuando necesitas ejecutar una función después de un delay
 * 
 * @param callback - Función a ejecutar
 * @param delay - Delay en milisegundos
 * @param deps - Dependencias del callback
 * @returns Función con debounce aplicado
 */
export const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number = 300,
  deps: React.DependencyList = []
) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = React.useCallback(
    (...args: any[]) => {
      // Limpiar el timer anterior si existe
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Crear un nuevo timer
      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(newTimer);
    },
    [callback, delay, ...deps]
  );

  // Limpiar el timer cuando el componente se desmonte
  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
};

export default useDebounce;