
import { useState, useEffect } from 'react';

export interface JobCard {
  id: string;
  title: string;
  reference: string;
  status: string;
  customerName: string;
  customerId: string;
  createdAt: string;
  deadline: string | null;
  totalAmount: number;
}

export const useJobCards = () => {
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadJobCards = async () => {
      try {
        // Mock data
        const mockJobCards: JobCard[] = [
          {
            id: '1',
            title: 'Website Redesign',
            reference: 'JC-001',
            status: 'in_progress',
            customerName: 'Acme Inc',
            customerId: 'cust-001',
            createdAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            totalAmount: 2500
          },
          {
            id: '2',
            title: 'Logo Design',
            reference: 'JC-002',
            status: 'pending',
            customerName: 'TechStart LLC',
            customerId: 'cust-002',
            createdAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            totalAmount: 750
          }
        ];
        
        setJobCards(mockJobCards);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobCards();
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
    jobCards,
    isLoading,
    error,
    refetch
  };
};
