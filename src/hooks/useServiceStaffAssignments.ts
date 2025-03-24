
import { useState, useEffect } from 'react';
import { useServiceStaffQueries } from './useServiceStaffQueries';
import { useServiceStaffMutations } from './useServiceStaffMutations';

export const useServiceStaffAssignments = (serviceId: string) => {
  const { staffAssignments, isLoading, error } = useServiceStaffQueries(serviceId);
  const { assignStaffToService, staffAssignmentMutation } = useServiceStaffMutations();
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [initialAssignmentsDone, setInitialAssignmentsDone] = useState(false);
  
  // Set initial assignments when data is loaded
  useEffect(() => {
    if (staffAssignments && !isLoading && !initialAssignmentsDone) {
      setSelectedStaffIds(staffAssignments.map(staff => staff.id));
      setInitialAssignmentsDone(true);
    }
  }, [staffAssignments, isLoading, initialAssignmentsDone]);

  const handleStaffChange = (staffIds: string[]) => {
    setSelectedStaffIds(staffIds);
  };
  
  const handleSave = async () => {
    await assignStaffToService(serviceId, selectedStaffIds);
  };
  
  const handleCancel = () => {
    if (staffAssignments) {
      setSelectedStaffIds(staffAssignments.map(staff => staff.id));
    }
  };

  return {
    staffAssignments,
    selectedStaffIds,
    isLoading,
    error,
    handleStaffChange,
    handleSave,
    handleCancel,
    isPending: staffAssignmentMutation.isPending,
    initialAssignmentsDone
  };
};
