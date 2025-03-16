
import { useStaffData, StaffWithSessions, Staff, WorkSession } from "./useStaffData";
import { useWorkSessions } from "./useWorkSessions";

// Re-export the types for backward compatibility
export type { Staff, WorkSession, StaffWithSessions };

export const useStaffWorkLogs = () => {
  const staffDataQuery = useStaffData();
  const workSessionsMutations = useWorkSessions();

  return {
    ...staffDataQuery,
    ...workSessionsMutations
  };
};
