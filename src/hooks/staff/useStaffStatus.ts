
// Staff status hook - functionality removed
export const useStaffStatus = () => {
  return {
    isClocked: false,
    isLoading: false,
    activeSessionId: null,
    clockIn: async () => ({ success: false, error: "Staff functionality has been removed" }),
    clockOut: async () => ({ success: false, error: "Staff functionality has been removed" })
  };
};
