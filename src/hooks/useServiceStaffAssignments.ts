
import { useServiceStaffQueries } from './useServiceStaffQueries';
import { useServiceStaffMutations } from './useServiceStaffMutations';

export const useServiceStaffAssignments = (serviceId: string) => {
  const { staffAssignments, isLoading, error } = useServiceStaffQueries(serviceId);
  const { assignStaffToService, staffAssignmentMutation } = useServiceStaffMutations();

  return {
    staffAssignments,
    isLoading,
    error,
    assignStaffToService: (staffIds: string[]) => assignStaffToService(serviceId, staffIds),
    isPending: staffAssignmentMutation.isPending
  };
};
