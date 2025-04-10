
import { TaskWithSharedInfo } from "@/types/tasks";
import { UserRole } from "@/types/user";

export { TaskWithSharedInfo };

export type TaskTab = "my-tasks" | "shared" | "assigned" | "team" | "archived";

export interface UseTaskQueriesReturn {
  tasks: TaskWithSharedInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  userRole: UserRole | null;
  isStaff: boolean;
}
