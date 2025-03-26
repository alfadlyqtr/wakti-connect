
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";

// Mock tasks used when database is not available
export const getMockTasks = (): Task[] => {
  return [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Write up project proposal for client review",
      status: "pending" as TaskStatus,
      priority: "high" as TaskPriority,
      due_date: new Date().toISOString(),
      due_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "user-1",
      completed_at: null,
      is_recurring_instance: false,
      parent_recurring_id: null,
      snooze_count: 0,
      snoozed_until: null
    },
    {
      id: "2",
      title: "Review team updates",
      description: "Check weekly updates from the team and provide feedback",
      status: "in-progress" as TaskStatus,
      priority: "medium" as TaskPriority,
      due_date: new Date(Date.now() + 86400000).toISOString(),
      due_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "user-1",
      completed_at: null,
      is_recurring_instance: false,
      parent_recurring_id: null,
      snooze_count: 0,
      snoozed_until: null
    },
    {
      id: "3",
      title: "Prepare client meeting",
      description: "Create slides and agenda for the upcoming client meeting",
      status: "completed" as TaskStatus,
      priority: "high" as TaskPriority,
      due_date: new Date(Date.now() - 86400000).toISOString(),
      due_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "user-1",
      completed_at: new Date().toISOString(),
      is_recurring_instance: false,
      parent_recurring_id: null,
      snooze_count: 0,
      snoozed_until: null
    }
  ];
};
