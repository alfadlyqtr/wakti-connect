
import { useState, useEffect } from 'react';
import { useServiceStaffQueries } from './useServiceStaffQueries';
import { useServiceStaffMutations } from './useServiceStaffMutations';
import { toast } from "@/hooks/use-toast";

export const useServiceStaffAssignments = (serviceId: string) => {
  const { staffAssignments, isLoading, error } = useServiceStaffQueries(serviceId);
  const { assignStaffToService, staffAssignmentMutation } = useServiceStaffMutations();
  const [initialAssignmentsDone, setInitialAssignmentsDone] = useState(false);
  
  // Set initial assignments flag once data is loaded
  useEffect(() => {
    if (staffAssignments && !isLoading && !initialAssignmentsDone) {
      setInitialAssignmentsDone(true);
    }
  }, [staffAssignments, isLoading, initialAssignmentsDone]);

  return {
    staffAssignments,
    isLoading,
    error,
    assignStaffToService: (staffIds: string[]) => assignStaffToService(serviceId, staffIds),
    isPending: staffAssignmentMutation.isPending,
    initialAssignmentsDone
  };
};
