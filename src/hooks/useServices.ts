
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service } from './useServiceCrud';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        // Mock services data
        const mockServices: Service[] = [
          {
            id: 'service-1',
            name: 'Consultation',
            description: 'Initial consultation service',
            price: 99.99,
            duration: 60,
            status: 'active'
          },
          {
            id: 'service-2',
            name: 'Follow-up',
            description: 'Follow-up appointment',
            price: 49.99,
            duration: 30,
            status: 'active'
          }
        ];
        
        setServices(mockServices);
        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  const refresh = async () => {
    setIsLoading(true);
    try {
      // Re-fetch services
      // Same mock data for now
      const mockServices: Service[] = [
        {
          id: 'service-1',
          name: 'Consultation',
          description: 'Initial consultation service',
          price: 99.99,
          duration: 60,
          status: 'active'
        },
        {
          id: 'service-2',
          name: 'Follow-up',
          description: 'Follow-up appointment',
          price: 49.99,
          duration: 30,
          status: 'active'
        }
      ];
      
      setServices(mockServices);
      setIsLoading(false);
    } catch (err: any) {
      setError(err);
      setIsLoading(false);
    }
  };
  
  return {
    services,
    isLoading,
    error,
    refresh
  };
};
