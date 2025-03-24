
import { useState, useEffect } from 'react';
import { useServiceStaffQueries } from './useServiceStaffQueries';
import { useServiceStaffMutations } from './useServiceStaffMutations';

export const useServiceStaffAssignments = (serviceId: string) => {
  const { staffAssignments, isLoading, error, refetch } = useServiceStaffQueries(serviceId);
  const { assignStaffToService, staffAssignmentMutation } = useServiceStaffMutations();
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [initialAssignmentsDone, setInitialAssignmentsDone] = useState(false);
  
  // Set initial assignments when data is loaded
  useEffect(() => {
    if (staffAssignments && staffAssignments.length > 0 && !isLoading && !initialAssignmentsDone) {
      console.log("Setting initial staff assignments:", staffAssignments.map(s => s.id));
      setSelectedStaffIds(staffAssignments.map(staff => staff.id));
      setInitialAssignmentsDone(true);
    } else if (!isLoading && staffAssignments.length === 0 && !initialAssignmentsDone) {
      // Handle the case where service has no staff assigned yet
      setSelectedStaffIds([]);
      setInitialAssignmentsDone(true);
    }
  }, [staffAssignments, isLoading, initialAssignmentsDone]);

  const handleStaffChange = (staffIds: string[]) => {
    console.log("Staff selection changed:", staffIds);
    setSelectedStaffIds(staffIds);
  };
  
  const handleSave = async () => {
    console.log("Saving staff assignments:", selectedStaffIds);
    await assignStaffToService(serviceId, selectedStaffIds);
  };
  
  const handleCancel = () => {
    console.log("Cancelling staff assignment changes");
    if (staffAssignments) {
      setSelectedStaffIds(staffAssignments.map(staff => staff.id));
    }
  };

  const handleRetry = () => {
    console.log("Retrying staff assignments fetch");
    refetch();
  };

  return {
    staffAssignments,
    selectedStaffIds,
    isLoading,
    error,
    handleStaffChange,
    handleSave,
    handleCancel,
    handleRetry,
    isPending: staffAssignmentMutation.isPending,
    initialAssignmentsDone
  };
};
