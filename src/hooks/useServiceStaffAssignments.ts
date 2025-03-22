
// Service staff assignments hook - simplified after staff management removal
export const useServiceStaffAssignments = (serviceId: string) => {
  return {
    staffAssignments: [],
    isLoading: false,
    error: null,
    assignStaffToService: () => {},
    isPending: false
  };
};
