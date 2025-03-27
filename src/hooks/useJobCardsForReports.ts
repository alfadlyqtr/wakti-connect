
import { useQuery } from '@tanstack/react-query';
import { fetchJobCardsWithDetails } from '@/services/jobs';
import { JobCard } from '@/types/jobs.types';
import { subDays, startOfMonth, startOfWeek } from 'date-fns';

/**
 * Hook to fetch job cards for reporting
 */
export const useJobCardsForReports = (staffRelationId: string, timeRange: string = 'month') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobCardsReport', staffRelationId, timeRange],
    queryFn: async () => {
      // Calculate date range based on timeRange
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case 'week':
          startDate = startOfWeek(now);
          break;
        case 'month':
          startDate = startOfMonth(now);
          break;
        case 'quarter':
          startDate = subDays(now, 90);
          break;
        case 'year':
          startDate = subDays(now, 365);
          break;
        default:
          startDate = startOfMonth(now);
      }
      
      const formattedStartDate = startDate.toISOString();
      
      try {
        // Fetch job cards with detailed information for reporting
        return await fetchJobCardsWithDetails(staffRelationId, formattedStartDate);
      } catch (err) {
        console.error("Error fetching job cards for reports:", err);
        throw err;
      }
    }
  });
  
  return {
    jobCards: data as JobCard[] || [],
    isLoading,
    error: error as Error | null
  };
};
