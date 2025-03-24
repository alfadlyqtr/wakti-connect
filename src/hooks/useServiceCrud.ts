
import { useServiceQueries } from './useServiceQueries';
import { useServiceMutations } from './useServiceMutations';

// This is a simplified hook that combines data fetching and mutations
export const useServiceCrud = () => {
  const { 
    services, 
    isLoading, 
    error, 
    refetch 
  } = useServiceQueries();

  const {
    editingService,
    setEditingService,
    openAddService,
    setOpenAddService,
    addServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  } = useServiceMutations();

  return {
    services,
    isLoading,
    error,
    refetch,
    openAddService,
    setOpenAddService,
    editingService,
    setEditingService,
    addServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  };
};
