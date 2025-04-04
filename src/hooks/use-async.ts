
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  retry: () => Promise<void>;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  toastOnError = true
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to execute the async function
  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      
      if (toastOnError) {
        toast.error('Error', {
          description: error.message,
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction, toastOnError]);

  // Execute the async function immediately if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  // Retry function
  const retry = useCallback(async () => {
    await execute();
  }, [execute]);

  return { data, isLoading, error, retry };
}
