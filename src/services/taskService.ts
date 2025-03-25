
import { Task } from "@/types/task.types";

// Function to get upcoming tasks
export const getUpcomingTasks = async (): Promise<Task[]> => {
  // Mock implementation
  // In real app, this would fetch from API
  return [
    {
      id: "task-1",
      title: "Client meeting",
      description: "Discuss project timeline",
      status: "pending",
      priority: "high",
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      due_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "user-1",
      assignee_id: null
    },
    {
      id: "task-2",
      title: "Prepare presentation",
      description: "Create slides for team update",
      status: "in-progress",
      priority: "medium",
      due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      due_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "user-1",
      assignee_id: null
    }
  ];
};

// Function to get task by ID
export const getTaskById = async (id: string): Promise<Task | null> => {
  // Mock implementation
  const mockTasks: Record<string, Task> = {
    "task-1": {
      id: "task-1",
      title: "Client meeting",
      description: "Discuss project timeline",
      status: "pending",
      priority: "high",
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      due_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "user-1",
      assignee_id: null
    },
    "task-2": {
      id: "task-2",
      title: "Prepare presentation",
      description: "Create slides for team update",
      status: "in-progress",
      priority: "medium",
      due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      due_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "user-1",
      assignee_id: null
    }
  };
  
  return mockTasks[id] || null;
};
