
import { useState, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
}

export const useServiceQueries = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        // Mock data
        setServices([
          {
            id: '1',
            name: 'Basic Consultation',
            description: 'Initial consultation for new clients',
            price: 50,
            duration: 60,
            status: 'active'
          },
          {
            id: '2',
            name: 'Premium Service',
            description: 'Complete premium service package',
            price: 150,
            duration: 120,
            status: 'active'
          }
        ]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    try {
      // Mock refetch
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    services,
    isLoading,
    error,
    refetch
  };
};
