
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { fetchTasksByTab } from "@/services/task/fetchService";
import { createTaskWithSubtasks } from "@/services/task/createService";
import { Task, TaskFormData, TaskTab } from "@/types/task.types";
import { deleteTask } from "@/services/task/operations/taskDeleteOperations";
import { RecurringFormData } from "@/types/recurring.types";
import { updateTaskStatus } from "@/services/task/operations/taskStatusOperations";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function useTasks() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<TaskTab>("my-tasks");
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<"free" | "individual" | "business">("free");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchTasks = async () => {
    if (!user) {
      setTasks(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await fetchTasksByTab(
        user.id,
        currentTab,
        filterStatus,
        filterPriority,
        searchQuery
      );
      
      setTasks(result.tasks);
      setUserRole(result.userRole);
      setError(result.error || null);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      setError(err);
      setTasks(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch tasks whenever dependencies change
  useEffect(() => {
    fetchTasks();
  }, [user, currentTab, filterStatus, filterPriority, searchQuery]);
  
  // Function to create a new task
  const createTask = async (taskData: TaskFormData, recurringData?: RecurringFormData) => {
    if (!user) {
      throw new Error("You must be logged in to create a task");
    }
    
    try {
      const newTask = await createTaskWithSubtasks(taskData, user.id);
      
      // Refresh tasks after creating a new one
      fetchTasks();
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
      
      return newTask;
    } catch (err: any) {
      console.error("Error creating task:", err);
      toast({
        title: "Error",
        description: `Failed to create task: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Function to delete a task
  const removeTask = async (taskId: string) => {
    if (!user) {
      throw new Error("You must be logged in to delete a task");
    }
    
    try {
      await deleteTask(taskId);
      
      // Update local state
      setTasks((prevTasks) => 
        prevTasks ? prevTasks.filter((task) => task.id !== taskId) : null
      );
      
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (err: any) {
      console.error("Error deleting task:", err);
      toast({
        title: "Error",
        description: `Failed to delete task: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Function to update a task's status
  const updateStatus = async (taskId: string, status: string) => {
    if (!user) {
      throw new Error("You must be logged in to update a task");
    }
    
    try {
      await updateTaskStatus(taskId, status);
      
      // Update local state
      setTasks((prevTasks) => 
        prevTasks
          ? prevTasks.map((task) => 
              task.id === taskId 
                ? { ...task, status } 
                : task
            )
          : null
      );
      
      toast({
        title: "Task updated",
        description: `Task status has been updated to ${status}.`,
      });
    } catch (err: any) {
      console.error("Error updating task status:", err);
      toast({
        title: "Error",
        description: `Failed to update task: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };
  
  return {
    tasks,
    isLoading,
    error,
    currentTab,
    setCurrentTab,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery,
    createTask,
    removeTask,
    updateStatus,
    fetchTasks,
    userRole,
  };
}
