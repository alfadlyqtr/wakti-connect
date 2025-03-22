
import { useServiceQueries } from './useServiceQueries';
import { useServiceMutations } from './useServiceMutations';

export const useServiceCrud = () => {
  const { 
    services, 
    isLoading, 
    error 
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
    openAddService,
    setOpenAddService,
    editingService,
    setEditingService,
    addServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  };
};
