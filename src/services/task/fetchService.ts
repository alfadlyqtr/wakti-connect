import { supabase } from "@/integrations/supabase/client";
import { TasksResult, TaskTab } from "@/types/task.types";
import { getAssignedTasks } from "./fetchers/assignedTasks";
import { getSharedTasks } from "./fetchers/sharedTasks";
import { getMyTasks } from "./fetchers/myTasks";
import { safeQueryExecution } from "@/utils/databaseUtils";

/**
 * Fetch tasks based on the selected tab
 */
export async function fetchTasksByTab(
  userId: string, 
  tab: TaskTab, 
  filterStatus: string = "all", 
  filterPriority: string = "all", 
  searchQuery: string = ""
): Promise<TasksResult> {
  try {
    // First, verify the user's account type
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return { 
        tasks: null, 
        userRole: "free", 
        error: new Error(profileError.message),
        isLoading: false
      };
    }

    const userRole = userProfile?.account_type as "free" | "individual" | "business";

    // Use a safe execution to handle cases where tables might not exist yet
    const result = await safeQueryExecution<TasksResult>(
      "tasks",
      async () => {
        if (tab === "my-tasks") {
          const myTasks = await getMyTasks(userId, filterStatus, filterPriority, searchQuery);
          return {
            tasks: myTasks,
            userRole
          };
        } else if (tab === "shared-tasks") {
          const sharedTasks = await getSharedTasks(userId, filterStatus, filterPriority, searchQuery);
          return {
            tasks: sharedTasks,
            userRole
          };
        } else if (tab === "assigned-tasks") {
          const assignedTasks = await getAssignedTasks(userId, filterStatus, filterPriority, searchQuery);
          return {
            tasks: assignedTasks,
            userRole
          };
        }
        
        // Fall back to my tasks
        const defaultTasks = await getMyTasks(userId, filterStatus, filterPriority, searchQuery);
        return {
          tasks: defaultTasks,
          userRole
        };
      },
      { tasks: null, userRole, error: null, isLoading: false }
    );

    return result;
  } catch (error: any) {
    console.error("Error in fetchTasksByTab:", error);
    return {
      tasks: null,
      userRole: "free",
      error: new Error(`Failed to fetch tasks: ${error.message}`),
      isLoading: false
    };
  }
}
