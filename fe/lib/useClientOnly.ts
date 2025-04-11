import { useState, useEffect } from 'react';

/**
 * Hook to ensure functionality only runs on client-side
 * Prevents hydration errors from accessing browser APIs during server rendering
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
} 