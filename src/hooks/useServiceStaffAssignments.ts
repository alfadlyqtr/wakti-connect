
// Service staff assignments hook - functionality removed
export const useServiceStaffAssignments = () => {
  return {
    staffAssignments: [],
    isLoading: false,
    error: null,
    assignStaffToService: () => Promise.resolve(),
    isPending: false
  };
};
