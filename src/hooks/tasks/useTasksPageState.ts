
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth";
import { Task, TaskFormData, TaskTab } from "@/types/task.types";
import { toast } from "@/components/ui/use-toast";
import { useTasksQuery } from "@/features/tasks/hooks/useTasksQuery";

export const useTasksPageState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<TaskTab>("my-tasks");
  
  const { effectiveRole } = useAuth();
  
  // Determine if user has a paid account (business or superadmin)
  const isPaidAccount = effectiveRole === 'business' || effectiveRole === 'superadmin';
  
  // Use the tasks query hook
  const {
    tasks,
    isLoading,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask
  } = useTasksQuery();
  
  // Filter tasks based on search query, status, priority
  const filteredTasks = useCallback(() => {
    let taskList = tasks || [];
    
    // Only show tasks based on active filters
    return taskList.filter(task => {
      // Filter by search query
      const matchesSearch = 
        !searchQuery || 
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = 
        filterStatus === "all" || 
        task.status === filterStatus;
      
      // Filter by priority
      const matchesPriority = 
        filterPriority === "all" || 
        task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority]);
  
  // Handler for creating a task
  const handleCreateTask = async (taskData: TaskFormData): Promise<Task> => {
    try {
      const result = await createTask.mutateAsync(taskData);
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully."
      });
      
      return result.data;
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Failed to create task",
        description: "There was an error creating your task. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Handler for updating a task
  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>): Promise<void> => {
    try {
      await updateTask.mutateAsync({ id: taskId, data: taskData });
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Failed to update task",
        description: "There was an error updating your task. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    userRole: effectiveRole,
    createTaskDialogOpen,
    setCreateTaskDialogOpen,
    editTaskDialogOpen,
    setEditTaskDialogOpen,
    currentEditTask,
    setCurrentEditTask,
    handleCreateTask,
    handleUpdateTask,
    refetchTasks: refetch,
    filteredTasks: filteredTasks(),
    isLoading,
    error,
    deleteTask,
    isPaidAccount,
    activeTab,
    setActiveTab
  };
};
