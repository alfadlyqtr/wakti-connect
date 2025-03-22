
// Service staff queries hook - simplified after staff management removal
export const useServiceStaffQueries = (serviceId?: string) => {
  return {
    staffAssignments: [],
    isLoading: false,
    error: null
  };
};
