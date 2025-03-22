
// Service staff mutations hook - simplified after staff management removal
export const useServiceStaffMutations = () => {
  return {
    selectedStaff: [],
    setSelectedStaff: () => {},
    assignStaffToService: () => {},
    staffAssignmentMutation: {
      isPending: false
    }
  };
};
