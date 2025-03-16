
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { fetchTasks, createTask as createTaskService, shareTask as shareTaskService, assignTask as assignTaskService } from "@/services/taskService";
import { filterTasks } from "@/utils/taskUtils";
import { Task, TaskTab, TaskFormData } from "@/types/task.types";

export type { Task, TaskTab, TaskFormData } from "@/types/task.types";

export const useTasks = (tab: TaskTab = "my-tasks") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Fetch tasks with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['tasks', tab],
    queryFn: () => fetchTasks(tab),
    refetchOnWindowFocus: false,
  });

  // Create a new task
  const createTask = async (taskData: Partial<TaskFormData>) => {
    try {
      const result = await createTaskService(taskData as TaskFormData);
      
      toast({
        title: "Task Created",
        description: "New task has been created successfully",
      });

      // Refetch tasks to update the list
      refetch();
      
      return result;
    } catch (error: any) {
      toast({
        title: "Failed to create task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Filter tasks based on search and filters
  const getFilteredTasks = () => {
    const taskList = data?.tasks || [];
    return filterTasks(taskList, searchQuery, filterStatus, filterPriority);
  };

  // Share a task with another user
  const shareTask = async (taskId: string, userId: string) => {
    try {
      await shareTaskService(taskId, userId);

      toast({
        title: "Task Shared",
        description: "Task has been shared successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Failed to share task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Assign a task to a staff member (for business accounts)
  const assignTask = async (taskId: string, staffId: string) => {
    try {
      await assignTaskService(taskId, staffId);

      toast({
        title: "Task Assigned",
        description: "Task has been assigned successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Failed to assign task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    tasks: data?.tasks || [],
    userRole: data?.userRole || "free",
    filteredTasks: getFilteredTasks(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    createTask,
    shareTask,
    assignTask,
    refetch
  };
};
