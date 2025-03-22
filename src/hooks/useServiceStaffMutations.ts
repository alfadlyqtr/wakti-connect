
// Service staff mutations hook - functionality removed
export const useServiceStaffMutations = () => {
  return {
    selectedStaff: [],
    setSelectedStaff: () => {},
    assignStaffToService: () => Promise.resolve(),
    staffAssignmentMutation: {
      isPending: false
    }
  };
};
